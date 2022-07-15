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
            this.tasks = this.filterTasks(this.tasks, tasks);
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

  filterTasks(
    oldTasks: TaskInterface[],
    newTasks: TaskInterface[]
  ): TaskInterface[] {
    return oldTasks.concat(
      newTasks.filter((t) => {
        let isTaskExist = oldTasks.find((t2) => t2._id === t._id);
        return !isTaskExist;
      })
    );
  }

  setTasks(tasks: TaskInterface[], projectId: string = '', mode: string): void {
    if (mode === 'project') {
      this.tasks = this.filterTasks(this.tasks, tasks);
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

    return this.http
      .post<ResponseInterface>(
        apiUrl + 'tasks' + `?projectId=${projectId}`,
        data
      )
      .pipe(
        tap((res) => {
          this.tasks.unshift({
            ...task,
            _id: res._id,
          });
          this.tasksUpdated.next(this.tasks);
        })
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
      .delete<ResponseInterface>(
        apiUrl + 'tasks/' + task._id + `?projectId=${projectId}`
      )
      .pipe(
        tap((res) => {
          this.tasks = this.tasks.filter((t) => t._id !== res._id);
          this.tasksUpdated.next(this.tasks);
        })
      );
  }
}
