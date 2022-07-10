import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
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
  private loading = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  requestUserTasks(pageNumber: number, limit: number, mode: string): void {
    this.http
      .get<TaskInterface[]>(
        apiUrl + 'tasks' + `?page=${pageNumber}&limit=${limit}`
      )
      .pipe(
        tap((tasks: TaskInterface[]) => {
          if (mode === 'task') {
            this.tasks = this.tasks.concat(tasks);
          } else {
            this.tasks = tasks;
          }
          this.tasksUpdated.next(this.tasks);
          this.setLoadingState(false);
        }),
        take(1)
      )
      .subscribe();
  }

  setTasks(tasks: TaskInterface[], projectId: string = '', mode: string): void {
    if (mode === 'project') {
      this.tasks = this.tasks.concat(tasks);
    } else {
      this.tasks = tasks;
    }
    this.tasksUpdated.next(this.tasks);
    this.setLoadingState(false);
  }

  getAllTasks(): Observable<TaskInterface[]> {
    return this.tasksUpdated.asObservable();
  }

  getLoadingState(): Observable<boolean> {
    return this.loading.asObservable();
  }

  setLoadingState(state: boolean): void {
    this.loading.next(state);
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
      plannedDate?: Date;
      period?: string;
      commonTask?: boolean;
      repeat?: number;
    } = {
      title: task.title,
      completed: task.completed,
      importance: task.importance,
      period: task.period,
      plannedDate: task.plannedDate,
      commonTask: task.commonTask,
      repeat: task.repeat,
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
              this.tasks.unshift({
                ...task,
                _id: res._id,
              });
              this.tasksUpdated.next(this.tasks);
            });
        } else {
          this.tasks.unshift({
            ...task,
            _id: res._id,
          });
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
    const taskObj: TaskInterface = {
      title: task.title,
      completed: task.completed,
      importance: task.importance,
      period: task.period ? task.period : '0',
      plannedDate: task.plannedDate ? task.plannedDate : new Date(),
    };

    return this.http
      .patch<ResponseInterface>(apiUrl + 'tasks/' + task._id, taskObj)
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
    otherTasks: TaskInterface[],
    completedTasks: TaskInterface[]
  ): void {
    const listOfIds = tasksToReorder.map((t) => t._id);
    this.http
      .put<{ message: string }>(apiUrl + 'tasks/reorder', { listOfIds })
      .pipe(
        tap((res) => {
          this.tasks = [...tasksToReorder, ...otherTasks, ...completedTasks];
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
