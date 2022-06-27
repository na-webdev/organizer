import { ProjectInterface } from 'src/app/projects/types/project.interface';

export interface TaskInterface {
  _id?: string;
  title: string;
  completed: boolean;
  importance: number;
  plannedDate?: Date;
  projectRef?: ProjectInterface;
  weekDays?: string[];
}
