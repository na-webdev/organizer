import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { TaskInterface } from '../../shared/types/task.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseInterface } from '../../shared/types/response.interface';

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
          this.tasks = tasks;
          this.tasksUpdated.next(this.tasks);
        }),
        take(1)
      )
      .subscribe();
  }

  setTasks(tasks: TaskInterface[]): void {
    this.tasks = tasks;
    this.tasksUpdated.next(this.tasks);
  }

  getAllTasks(): Observable<TaskInterface[]> {
    return this.tasksUpdated.asObservable();
  }

  addNewTask(
    task: TaskInterface,
    projectId: string = ''
  ): Observable<ResponseInterface> {
    let data: {
      title: string;
      completed: boolean;
      importance: number;
      projectRef?: string;
    } = {
      title: task.title,
      completed: task.completed,
      importance: task.importance,
    };

    if (projectId) {
      data['projectRef'] = projectId;
    }

    return this.http.post<ResponseInterface>(apiUrl + 'tasks', data).pipe(
      tap((res) => {
        if (projectId) {
          this.addTaskToProject(res._id, projectId)
            .pipe(take(1))
            .subscribe((projectRes) => {
              this.tasks.unshift({ ...task, _id: res._id });
              this.tasksUpdated.next(this.tasks);
            });
        } else {
          this.tasks.unshift({ ...task, _id: res._id });
          this.tasksUpdated.next(this.tasks);
        }
      })
    );
  }

  addTaskToProject(
    taskId: string,
    projectId: string
  ): Observable<ResponseInterface> {
    return this.http.patch<ResponseInterface>(
      apiUrl + 'projects/' + projectId + '/new-task',
      {
        taskId,
      }
    );
  }

  deleteTaskFromProject(
    taskId: string,
    projectId: string
  ): Observable<ResponseInterface> {
    return this.http.patch<ResponseInterface>(
      apiUrl + 'projects/' + projectId + '/delete-task',
      {
        taskId,
      }
    );
  }

  updateTask(task: TaskInterface): Observable<ResponseInterface> {
    return this.http
      .patch<ResponseInterface>(apiUrl + 'tasks/' + task._id, {
        title: task.title,
        completed: task.completed,
        importance: task.importance,
      })
      .pipe(
        tap((res) => {
          this.tasks = this.tasks.map((t) =>
            t._id === task._id ? { ...t, ...task } : t
          );
          this.tasksUpdated.next(this.tasks);
        })
      );
  }

  reorderTasks(
    tasksToReorder: TaskInterface[],
    completedTasks: TaskInterface[]
  ): void {
    const listOfIds = tasksToReorder.map((t) => t._id);
    this.http
      .put<{ message: string }>(apiUrl + 'tasks/reorder', { listOfIds })
      .pipe(
        tap((res) => {
          this.tasks = [...tasksToReorder, ...completedTasks];
          this.tasksUpdated.next(this.tasks);
        }),
        take(1)
      )
      .subscribe();
  }

  deleteTask(
    task: TaskInterface,
    projectId: string = ''
  ): Observable<ResponseInterface> {
    return this.http
      .delete<ResponseInterface>(apiUrl + 'tasks/' + task._id)
      .pipe(
        tap((res) => {
          if (projectId) {
            this.deleteTaskFromProject(res._id, projectId)
              .pipe(take(1))
              .subscribe((projectRes) => {
                this.tasks = this.tasks.filter((t) => t._id !== task._id);
                this.tasksUpdated.next(this.tasks);
              });
          } else {
            this.tasks = this.tasks.filter((t) => t._id !== task._id);
            this.tasksUpdated.next(this.tasks);
          }
        })
      );
  }
}
