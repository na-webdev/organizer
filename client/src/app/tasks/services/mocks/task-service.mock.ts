import { of } from 'rxjs';
import { TaskMock } from './task.mock';

export const TaskServiceMock = {
  getAllTasks: jasmine.createSpy().and.returnValue(of([])),
  requestUserTasks: jasmine.createSpy().and.returnValue(undefined),
  addNewTask: jasmine.createSpy().and.returnValue(of({ _id: TaskMock._id })),
  updateTask: jasmine.createSpy().and.returnValue(of({ _id: TaskMock._id })),
  deleteTask: jasmine.createSpy().and.returnValue(of({ _id: TaskMock._id })),
  getLoadingState: jasmine.createSpy(),
  setTasks: jasmine.createSpy(),
  setLoadingState: jasmine.createSpy(),
};
