import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { environment } from 'src/environments/environment';
import { TasksListMock } from './mocks/tasks-list.mock';
import { TaskMock } from './mocks/task.mock';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { ResponseInterface } from 'src/app/shared/types/response.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';

const apiUrl = environment.apiUrl;

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDatepickerModule],
      providers: [TaskService],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets user tasks and return undefined on task mode', () => {
    let tasks: TaskInterface[] | undefined;
    let loading: boolean | undefined;

    service.getLoadingState().subscribe((l) => (loading = l));

    service.getAllTasks().subscribe((t) => (tasks = t));

    const limit = 10;
    const pageNumber = 0;
    const mode = 'task';

    expect(service.requestUserTasks(pageNumber, limit, mode)).toBeUndefined();

    const req = httpMock.expectOne(
      apiUrl + 'tasks' + `?page=${pageNumber}&limit=${limit}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(TasksListMock);

    expect(tasks).toEqual(TasksListMock);
    expect(loading).toBeFalsy();
  });

  it('sets user tasks and return undefined on project mode', () => {
    let tasks: TaskInterface[] | undefined;
    let loading: boolean | undefined;

    service.getLoadingState().subscribe((l) => (loading = l));

    service.getAllTasks().subscribe((t) => (tasks = t));

    const limit = 10;
    const pageNumber = 0;
    const mode = 'project';

    expect(service.requestUserTasks(pageNumber, limit, mode)).toBeUndefined();

    const req = httpMock.expectOne(
      apiUrl + 'tasks' + `?page=${pageNumber}&limit=${limit}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(TasksListMock);

    expect(tasks).toEqual(TasksListMock);
    expect(loading).toBeFalsy();
  });

  it('filters new tasks depending on old tasks', () => {
    let oldTasks = TasksListMock;
    let newTasks = [TaskMock];

    expect(service.filterTasks(oldTasks, newTasks)).toEqual([
      ...oldTasks,
      ...newTasks,
    ]);
  });

  it('sets new tasks and gets all tasks on task mode', () => {
    let tasks: TaskInterface[] | undefined;
    service.getAllTasks().subscribe((t) => (tasks = t));

    service.setTasks(TasksListMock, '', 'task');
    expect(tasks).toEqual(TasksListMock);
  });

  it('sets new tasks and gets all tasks on project mode', () => {
    let tasks: TaskInterface[] | undefined;
    let projectId = 'randomId';
    service.getAllTasks().subscribe((t) => (tasks = t));

    service.setTasks(TasksListMock, projectId, 'project');
    expect(tasks).toEqual(TasksListMock);
  });

  it('gets loading state', () => {
    let loading: boolean | undefined;
    service.getLoadingState().subscribe((l) => (loading = l));
    expect(loading).toBeTruthy();
  });

  it('sets loading state', () => {
    let loading: boolean | undefined;
    service.getLoadingState().subscribe((l) => (loading = l));
    service.setLoadingState(false);
    expect(loading).toBeFalsy();
  });

  it('adds new task', () => {
    let addTaskResponse: ResponseInterface | undefined;
    let tasks: TaskInterface[] | undefined;
    let projectId: string = '';

    service.addNewTask(TaskMock).subscribe((res) => {
      addTaskResponse = res;
    });
    service.getAllTasks().subscribe((t) => (tasks = t));

    const req = httpMock.expectOne(
      apiUrl + 'tasks' + `?projectId=${projectId}`
    );
    expect(req.request.method).toBe('POST');
    req.flush({ _id: TaskMock._id });

    expect(addTaskResponse).toEqual({ _id: TaskMock._id });
    expect(tasks).toContain(TaskMock);
  });

  it('adds new task to project', () => {
    let addTaskResponse: ResponseInterface | undefined;
    let tasks: TaskInterface[] | undefined;
    let projectId: string = 'randomId';

    service.addNewTask(TaskMock, projectId).subscribe((res) => {
      addTaskResponse = res;
    });
    service.getAllTasks().subscribe((t) => (tasks = t));

    const req1 = httpMock.expectOne(
      apiUrl + 'tasks' + `?projectId=${projectId}`
    );
    expect(req1.request.method).toBe('POST');
    req1.flush({ _id: TaskMock._id });

    expect(addTaskResponse).toEqual({ _id: TaskMock._id });
    expect(tasks).toContain(TaskMock);
  });

  it('updates task', () => {
    let updateTaskResponse: ResponseInterface | undefined;
    let tasks: TaskInterface[] | undefined;

    service.setTasks([TaskMock], '', 'task');

    let updatedTask = { ...TaskMock };
    updatedTask.title = 'new title';

    service.updateTask(updatedTask).subscribe((res) => {
      updateTaskResponse = res;
    });
    service.getAllTasks().subscribe((t) => (tasks = t));

    const req = httpMock.expectOne(apiUrl + 'tasks/' + TaskMock._id);
    expect(req.request.method).toBe('PATCH');
    req.flush({ _id: TaskMock._id });

    expect(updateTaskResponse).toEqual({ _id: updatedTask._id });
    expect(tasks).toContain(updatedTask);
  });

  it('reorders tasks', () => {
    let tasks: TaskInterface[] | undefined;
    let tasksToReorder: TaskInterface[] = TasksListMock;
    let otherTasks: TaskInterface[] = [TaskMock];
    let completedTasks: TaskInterface[] = [];

    service.getAllTasks().subscribe((t) => (tasks = t));
    service.reorderTasks(tasksToReorder, otherTasks, completedTasks);

    const req = httpMock.expectOne(apiUrl + 'tasks/reorder');
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Tasks reordered' });

    expect(tasks).toEqual([
      ...tasksToReorder,
      ...otherTasks,
      ...completedTasks,
    ]);
  });

  it('deletes task', () => {
    let tasks: TaskInterface[] | undefined;
    let deleteTaskResponse: ResponseInterface | undefined;
    let projectId: string = '';
    service.setTasks([TaskMock], '', 'task');
    service.getAllTasks().subscribe((t) => (tasks = t));
    service.deleteTask(TaskMock).subscribe((res) => {
      deleteTaskResponse = res;
    });

    const req = httpMock.expectOne(
      apiUrl + 'tasks/' + TaskMock._id + `?projectId=${projectId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({ _id: TaskMock._id });

    expect(deleteTaskResponse).toEqual({ _id: TaskMock._id });
    expect(tasks).not.toContain(TaskMock);
  });

  it('deletes task from project', () => {
    let tasks: TaskInterface[] | undefined;
    let deleteTaskResponse: ResponseInterface | undefined;
    let projectId: string = 'randomId';

    service.setTasks([TaskMock], '', 'task');
    service.getAllTasks().subscribe((t) => (tasks = t));
    service.deleteTask(TaskMock, projectId).subscribe((res) => {
      deleteTaskResponse = res;
    });

    const req = httpMock.expectOne(
      apiUrl + 'tasks/' + TaskMock._id + `?projectId=${projectId}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({ _id: TaskMock._id });

    expect(deleteTaskResponse).toEqual({ _id: TaskMock._id });
    expect(tasks).not.toContain(TaskMock);
  });
});
