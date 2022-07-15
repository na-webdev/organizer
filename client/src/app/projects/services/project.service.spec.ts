import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProjectInterface } from '../types/project.interface';
import { ProjectService } from './project.service';
import { environment } from 'src/environments/environment';
import { ProjectsListMock } from './mocks/projects-list.mock';
import { ProjectMock } from './mocks/project.mock';
import { ResponseInterface } from 'src/app/shared/types/response.interface';

const apiUrl = environment.apiUrl;

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService],
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sets user projects and return undefined on project mode', () => {
    // no loading state
    let projects: ProjectInterface[] | undefined;

    service.getAllProjects().subscribe((p) => (projects = p));

    expect(service.requestUserProjects()).toBeUndefined();

    const req = httpMock.expectOne(apiUrl + 'projects');
    expect(req.request.method).toBe('GET');
    req.flush(ProjectsListMock);

    expect(projects).toEqual(ProjectsListMock);
  });

  it('gets all projects', () => {
    let projects: ProjectInterface[] | undefined;

    service.getAllProjects().subscribe((p) => (projects = p));

    expect(projects).toEqual([]);
  });

  it('gets project by id', () => {
    let project: ProjectInterface | undefined;
    let pageNumber = 0;
    let limit = 10;

    service
      .getProjectById(ProjectMock._id, pageNumber, limit)
      .subscribe((p) => (project = p));

    const req = httpMock.expectOne(
      apiUrl +
        'projects/' +
        ProjectMock._id +
        `?page=${pageNumber}&limit=${limit}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(ProjectMock);

    expect(project).toEqual(ProjectMock);
  });

  it('adds new project', () => {
    let addProjectResponse: ResponseInterface | undefined;
    let projects: ProjectInterface[] | undefined;

    service.getAllProjects().subscribe((p) => (projects = p));

    service
      .addNewProject(ProjectMock)
      .subscribe((p) => (addProjectResponse = p));

    const req = httpMock.expectOne(apiUrl + 'projects');
    expect(req.request.method).toBe('POST');
    req.flush({ _id: ProjectMock._id });

    expect(addProjectResponse).toEqual({ _id: ProjectMock._id });
    expect(projects).toContain(ProjectMock);
  });

  it('updates project', () => {
    let updateProjectResponse: ResponseInterface | undefined;
    let projects: ProjectInterface[] | undefined;
    service.getAllProjects().subscribe((p) => (projects = p));

    service.addNewProject(ProjectMock).subscribe();

    console.log(projects);
    service
      .updateProject(ProjectMock)
      .subscribe((p) => (updateProjectResponse = p));

    const req1 = httpMock.expectOne(apiUrl + 'projects');
    expect(req1.request.method).toBe('POST');
    req1.flush({ _id: ProjectMock._id });

    const req2 = httpMock.expectOne(apiUrl + 'projects/' + ProjectMock._id);
    expect(req2.request.method).toBe('PATCH');
    req2.flush({ _id: ProjectMock._id });

    expect(updateProjectResponse).toEqual({ _id: ProjectMock._id });
    expect(projects).toContain(ProjectMock);
  });

  it('deletes project', () => {
    let deleteProjectResponse: ResponseInterface | undefined;
    let projects: ProjectInterface[] | undefined;
    service.getAllProjects().subscribe((p) => (projects = p));

    service.addNewProject(ProjectMock).subscribe();

    service
      .deleteProject(ProjectMock)
      .subscribe((p) => (deleteProjectResponse = p));

    const req1 = httpMock.expectOne(apiUrl + 'projects');
    expect(req1.request.method).toBe('POST');
    req1.flush({ _id: ProjectMock._id });

    const req2 = httpMock.expectOne(apiUrl + 'projects/' + ProjectMock._id);
    expect(req2.request.method).toBe('DELETE');
    req2.flush({ _id: ProjectMock._id });

    expect(deleteProjectResponse).toEqual({ _id: ProjectMock._id });
    expect(projects).not.toContain(ProjectMock);
  });
});
