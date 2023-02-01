import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  fromEvent,
  Subscription,
  take,
  tap,
  throttleTime,
} from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { TaskService } from 'src/app/tasks/services/task.service';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/projects/services/project.service';
import { ProjectInterface } from 'src/app/projects/types/project.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  projectMode: string = 'pending';
  completedTasks: TaskInterface[] = [];
  incompleteTasks: TaskInterface[] = [];
  tasksSubscription!: Subscription;
  projectId!: string | null;
  project!: ProjectInterface;
  pageSections: [string, { date: number; tasks: TaskInterface[] }][] = [];
  sections: {
    [key: string]: {
      date: number;
      tasks: TaskInterface[];
    };
  } = {};
  commonTasks: TaskInterface[] = [];
  page: number = 0;
  oldTasksAmount: number = 0;
  loading$ = this.taskService.getLoadingState();
  eventSub!: Subscription;

  constructor(
    public taskService: TaskService,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {
    this.getAllTasks();
    this.setCurrentProject = this.setCurrentProject.bind(this);
    this.showErrorAlert = this.showErrorAlert.bind(this);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.page = 0;
      this.getProjectData();
    } else {
      this.page = 0;
      this.taskService.requestUserTasks(this.page, 10, this.projectMode);
      this.projectMode = 'task';
      this.page++;
    }
    this.eventSub = fromEvent(window, 'scroll')
      .pipe(tap(this.detectScroll), throttleTime(300))
      .subscribe();
  }

  detectScroll = () => {
    let pos =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (Math.floor(pos) == max) {
      //Do your action here
      this.loadMoreTasks();
    }
  };

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
    this.eventSub.unsubscribe();
  }

  getProjectData(): void {
    this.projectService
      .getProjectById(this.projectId, this.page, 10)
      .pipe(take(1))
      .subscribe(this.setCurrentProject);
  }

  setCurrentProject(project: ProjectInterface): void {
    this.project = project;
    this.taskService.setTasks(
      this.project.tasks,
      this.projectId || '',
      this.projectMode
    );

    this.projectMode = 'project';
    this.page++;
  }

  getAllTasks(): void {
    this.tasksSubscription = this.taskService
      .getAllTasks()
      .subscribe((tasks) => {
        this.completedTasks = this.filterTasks(tasks, 'completed');
        this.incompleteTasks = this.filterTasks(tasks, 'incomplete');
        this.commonTasks = this.filterTasks(tasks, 'common');

        this.sections = {};

        this.incompleteTasks.forEach(this.addTaskToSection);

        this.pageSections = Object.entries(this.sections).sort(
          (a, b) => a[1].date - b[1].date
        );
      }, this.showErrorAlert);
  }

  filterTasks(tasks: TaskInterface[], type: string): TaskInterface[] {
    if (type === 'completed') {
      return tasks.filter(this.isTaskCompleted);
    }
    if (type === 'incomplete') {
      return tasks.filter(this.isTaskIncomplete);
    }
    if (type === 'common') {
      return tasks.filter(this.isTaskCommon);
    }
    return tasks;
  }

  isTaskCompleted = (task: TaskInterface) => task.completed;
  isTaskIncomplete = (task: TaskInterface) =>
    !task.completed && !task.commonTask;
  isTaskCommon = (task: TaskInterface) => task.commonTask && !task.completed;

  addTaskToSection = (task: TaskInterface) => {
    let now = new Date();
    let today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();

    let taskDate = new Date(task.plannedDate);
    let taskDay = new Date(
      taskDate.getFullYear(),
      taskDate.getMonth(),
      taskDate.getDate()
    ).getTime();
    if (taskDay === today) {
      this.sections['Today'] = {
        date: taskDay,
        tasks: [...(this.sections['Today']?.tasks || []), task],
      };
    } else if (taskDay === today + 86400000) {
      this.sections['Tomorrow'] = {
        date: taskDay,
        tasks: [...(this.sections['Tomorrow']?.tasks || []), task],
      };
    } else {
      let sectionName = new Date(taskDay).toLocaleDateString();
      this.sections[sectionName] = {
        date: taskDay,
        tasks: [...(this.sections[sectionName]?.tasks || []), task],
      };
    }
  };

  drop(event: CdkDragDrop<TaskInterface[]>, title: string): void {
    let arr =
      this.pageSections.find((section) => section[0] === title)?.[1].tasks ||
      [];
    let otherTasks = this.pageSections
      .filter((section) => section[0] !== title)
      .map((section) => section[1].tasks)
      .flat(1);
    if (title === 'common') {
      arr = this.commonTasks;
    } else {
      otherTasks = [...otherTasks, ...this.commonTasks];
    }
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.taskService.reorderTasks(arr, otherTasks, this.completedTasks);
  }

  addNewTask(task: TaskInterface): void {
    if (this.projectId) {
      task.projectRef = this.project;
    }
    task.importance = this.incompleteTasks[0]
      ? this.incompleteTasks[0].importance - 1
      : 0;
    for (let i = 0; i < (task.repeat || 1); i++) {
      let newTask = { ...task };
      let newDate = new Date(task.plannedDate);
      newTask.plannedDate = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate() + i * parseInt(task.period ? task.period : '1')
      );
      this.taskService
        .addNewTask(newTask, this.projectId || '')
        .pipe(take(1))
        .subscribe(() => {}, this.showErrorAlert);
    }
  }

  deleteTask(task: TaskInterface): void {
    let taskProjectId = this.projectId
      ? this.projectId
      : task.projectRef
      ? task.projectRef._id
      : '';
    this.taskService
      .deleteTask(task, taskProjectId)
      .pipe(take(1))
      .subscribe(() => {}, this.showErrorAlert);
  }

  updateTask(task: TaskInterface): void {
    this.taskService
      .updateTask(task)
      .pipe(take(1))
      .subscribe(() => {}, this.showErrorAlert);
  }

  completeTask(task: TaskInterface): void {
    task.completed = !task.completed;
    this.taskService
      .updateTask(task)
      .pipe(take(1))
      .subscribe(() => {}, this.showErrorAlert);
  }

  loadMoreTasks() {
    this.taskService.setLoadingState(true);
    if (this.projectId) {
      this.getProjectData();
    } else {
      this.taskService.requestUserTasks(this.page, 10, this.projectMode);
      this.projectMode = 'task';
      this.page++;
    }
  }

  showErrorAlert(error: any): void {
    this.alertService.alertMessage(error.error.message, 'danger');
  }
}
