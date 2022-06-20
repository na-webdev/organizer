import { TaskInterface } from 'src/app/shared/types/task.interface';

export interface ProjectInterface {
  _id?: string;
  title: string;
  description: string;
  tasks: TaskInterface[];
}
