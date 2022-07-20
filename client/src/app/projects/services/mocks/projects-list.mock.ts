import { TasksListMock } from 'src/app/tasks/services/mocks/tasks-list.mock';
import { ProjectInterface } from '../../types/project.interface';

export const ProjectsListMock: ProjectInterface[] = [
  {
    _id: '5e9f8f8f8f8f8f8f8f8f8f8f',
    title: 'Project 1',
    description: 'Project 1 description',
    tasks: TasksListMock,
  },
  {
    _id: '5e9f8f8f8f8f8f8f8f8f8f8f233',
    title: 'Project 2',
    description: 'Project 2 description',
    tasks: TasksListMock.slice(0, 1),
  },
];
