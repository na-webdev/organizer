import { from, of } from 'rxjs';
import { ProjectsListMock } from './projects-list.mock';

export const ProjectServiceMock = {
  requestUserProjects: jasmine.createSpy('requestUserProjects'),
  getAllProjects: jasmine
    .createSpy('getAllProjects')
    .and.returnValue(of(ProjectsListMock)),
  getProjectById: jasmine
    .createSpy('getProjectById')
    .and.returnValue(of(ProjectsListMock[0])),
  addNewProject: jasmine
    .createSpy('addNewProject')
    .and.returnValue(of({ _id: '123' })),
  updateProject: jasmine
    .createSpy('updateProject')
    .and.returnValue(of({ _id: '123' })),
  deleteProject: jasmine
    .createSpy('deleteProject')
    .and.returnValue(of({ _id: '123' })),
};
