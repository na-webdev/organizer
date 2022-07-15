import { of } from 'rxjs';
import { TaskMock } from './task.mock';

export const TaskServiceMock = {
  getAllTasks: jasmine.createSpy().and.returnValue(of([])),
  requestUserTasks: jasmine.createSpy().and.returnValue(undefined),
  addNewTask: jasmine.createSpy().and.returnValue({ _id: TaskMock._id }),
  updateTask: jasmine.createSpy(),
  deleteTask: jasmine.createSpy(),
  getLoadingState: jasmine.createSpy(),
};
