import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { TaskService } from '../../services/task.service';
import { TaskInterface } from '../../types/task.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  completedTasks: TaskInterface[] = [];
  incompleteTasks: TaskInterface[] = [];
  tasksSubscription!: Subscription;

  constructor(
    private taskService: TaskService,
    private alertService: AlertService
  ) {
    this.taskService.requestUserTasks();
  }

  ngOnInit(): void {
    this.getAllTasks();
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  drop(event: CdkDragDrop<TaskInterface[]>): void {
    moveItemInArray(
      this.incompleteTasks,
      event.previousIndex,
      event.currentIndex
    );
    this.taskService.reorderTasks(this.incompleteTasks);
  }

  addNewTask(task: TaskInterface): void {
    task.importance = this.incompleteTasks[0]
      ? this.incompleteTasks[0].importance - 1
      : 0;
    this.taskService
      .addNewTask(task)
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
      .deleteTask(task)
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

  callAlert(type: string) {
    this.alertService.alertMessage('Hello from alert service', type);
  }
}
