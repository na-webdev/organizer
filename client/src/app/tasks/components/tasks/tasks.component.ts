import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getAllTasks();
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }

  addNewTask(task: TaskInterface): void {
    this.taskService.addNewTask(task);
  }

  deleteTask(task: TaskInterface): void {
    this.taskService.deleteTask(task);
  }

  editTask(task: TaskInterface): void {
    this.taskService.updateTask(task);
  }

  completeTask(task: TaskInterface): void {
    this.taskService.completeTask(task);
  }

  getAllTasks(): void {
    this.tasksSubscription = this.taskService
      .getAllTasks()
      .subscribe((tasks) => {
        this.completedTasks = tasks.filter((task) => task.completed);
        this.incompleteTasks = tasks.filter((task) => !task.completed);
      });
  }
}
