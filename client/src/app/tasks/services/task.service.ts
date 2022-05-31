import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TaskInterface } from '../types/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: TaskInterface[] = [];
  private tasksUpdated = new Subject<TaskInterface[]>();

  getAllTasks(): Observable<TaskInterface[]> {
    return this.tasksUpdated.asObservable();
  }

  addNewTask(task: TaskInterface): void {
    this.tasks.unshift({ ...task, id: this.tasks.length });
    this.tasksUpdated.next(this.tasks);
  }

  deleteTask(task: TaskInterface): void {
    this.tasks = this.tasks.filter((t) => t.text !== task.text);
    this.tasksUpdated.next(this.tasks);
  }

  updateTask(task: TaskInterface): void {
    this.tasks = this.tasks.map((t) => (t.id === task.id ? task : t));
    this.tasksUpdated.next(this.tasks);
  }

  completeTask(task: TaskInterface): void {
    this.tasks = this.tasks.map((t) =>
      t.text === task.text ? { ...t, completed: !t.completed } : t
    );
    this.tasksUpdated.next(this.tasks);
  }

  constructor() {}
}
