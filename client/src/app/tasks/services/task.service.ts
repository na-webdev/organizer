import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { TaskInterface } from '../types/task.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from '../types/response.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: TaskInterface[] = [];
  private tasksUpdated = new BehaviorSubject<TaskInterface[]>(this.tasks);

  constructor(private http: HttpClient) {}

  requestUserTasks(): void {
    this.http
      .get<TaskInterface[]>(apiUrl + 'tasks')
      .pipe(
        tap((tasks: TaskInterface[]) => {
          this.tasks = tasks.sort((a, b) => a.importance - b.importance);
          this.tasksUpdated.next(this.tasks);
        }),
        take(1)
      )
      .subscribe();
  }

  getAllTasks(): Observable<TaskInterface[]> {
    return this.tasksUpdated.asObservable();
  }

  addNewTask(task: TaskInterface): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(apiUrl + 'tasks', task).pipe(
      tap((res) => {
        this.tasks.unshift({ ...task, _id: res._id });
        this.tasksUpdated.next(this.tasks);
      })
    );
  }

  updateTask(task: TaskInterface): Observable<ResponseInterface> {
    return this.http
      .patch<ResponseInterface>(apiUrl + 'tasks/' + task._id, task)
      .pipe(
        tap((res) => {
          this.tasks = this.tasks.map((t) =>
            t._id === task._id ? { ...t, ...task } : t
          );
          this.tasksUpdated.next(this.tasks);
        })
      );
  }

  deleteTask(task: TaskInterface): Observable<ResponseInterface> {
    return this.http
      .delete<ResponseInterface>(apiUrl + 'tasks/' + task._id)
      .pipe(
        tap((res) => {
          this.tasks = this.tasks.filter((t) => t._id !== task._id);
          this.tasksUpdated.next(this.tasks);
        })
      );
  }
}
