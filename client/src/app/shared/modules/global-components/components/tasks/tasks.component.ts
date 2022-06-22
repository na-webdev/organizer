import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TaskService } from '../../../../../tasks/services/task.service';
import { TaskInterface } from '../../../../types/task.interface';
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

  constructor(
    public taskService: TaskService,
    public alertService: AlertService,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id')) {
      this.getProjectData();
    } else {
      this.projectMode = 'task';
      this.taskService.requestUserTasks();
    }
    this.getAllTasks();
  }

  ngOnDestroy(): void {
    this.tasksSubscription?.unsubscribe();
  }

  getProjectData(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.projectService
      .getProjectById(this.projectId)
      .pipe(take(1))
      .subscribe((project) => {
        this.project = project;
        this.taskService.setTasks(this.project.tasks);
        this.projectMode = 'project';
      });
  }

  getAllTasks(): void {
    this.tasksSubscription = this.taskService.getAllTasks().subscribe(
      (tasks) => {
        this.completedTasks = tasks.filter((task) => task.completed);
        this.incompleteTasks = tasks.filter((task) => !task.completed);
      },
      (err) => {
        this.alertService.alertMessage(err.error.message, 'danger');
      }
    );
  }

  drop(event: CdkDragDrop<TaskInterface[]>): void {
    moveItemInArray(
      this.incompleteTasks,
      event.previousIndex,
      event.currentIndex
    );
    this.taskService.reorderTasks(this.incompleteTasks, this.completedTasks);
  }

  addNewTask(task: TaskInterface): void {
    if (this.projectId) {
      task.projectRef = this.project;
    }
    task.importance = this.incompleteTasks[0]
      ? this.incompleteTasks[0].importance - 1
      : 0;
    this.taskService
      .addNewTask(task, this.projectId ? this.projectId : '')
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (err) => {
          this.alertService.alertMessage(err.error.message, 'danger');
        }
      );
  }

  deleteTask(task: TaskInterface): void {
    this.taskService
      .deleteTask(task, this.projectId ? this.projectId : '')
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (err) => {
          this.alertService.alertMessage(err.error.message, 'danger');
        }
      );
  }

  updateTask(task: TaskInterface): void {
    this.taskService
      .updateTask(task)
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (err) => {
          this.alertService.alertMessage(err.error.message, 'danger');
        }
      );
  }

  completeTask(task: TaskInterface): void {
    task.completed = !task.completed;
    this.taskService
      .updateTask(task)
      .pipe(take(1))
      .subscribe(
        (res) => {},
        (err) => {
          this.alertService.alertMessage(err.error.message, 'danger');
        }
      );
  }
}
