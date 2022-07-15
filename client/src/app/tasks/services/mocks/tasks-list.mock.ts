import { TaskInterface } from 'src/app/shared/types/task.interface';

export const TasksListMock: TaskInterface[] = [
  {
    _id: '5e9f8f8f8f8f8f8f8f8f8f8f',
    title: 'Task 1',
    completed: false,
    importance: 1,
    commonTask: false,
    repeat: 1,
    period: '0',
    plannedDate: new Date(),
  },
  {
    _id: '5e9f8f8f8f8f8f8f8f8f8f8f',
    title: 'Task 2',
    completed: false,
    importance: 1,
    commonTask: false,
    repeat: 1,
    period: '0',
    plannedDate: new Date(),
  },
];
