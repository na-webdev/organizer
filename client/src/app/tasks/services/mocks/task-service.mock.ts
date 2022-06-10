import { of } from 'rxjs';

export const TaskServiceMock = {
  getAllTasks: jasmine.createSpy().and.returnValue(of([])),
  requestUserTasks: jasmine.createSpy(),
  addNewTask: jasmine.createSpy(),
  updateTask: jasmine.createSpy(),
  deleteTask: jasmine.createSpy(),
};
