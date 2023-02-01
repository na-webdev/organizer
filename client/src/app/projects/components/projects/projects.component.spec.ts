import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { AlertServiceMock } from 'src/app/shared/services/alert/mocks/alert-service.mock';
import { ProjectServiceMock } from '../../services/mocks/project-service.mock';
import { ProjectsListMock } from '../../services/mocks/projects-list.mock';
import { ProjectService } from '../../services/project.service';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let dialog: MatDialog;
  let projectService: ProjectService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ProjectsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jasmine
              .createSpy()
              .and.returnValue({ afterClosed: () => EMPTY }),
          },
        },
        { provide: AlertService, useValue: AlertServiceMock },
        { provide: ProjectService, useValue: ProjectServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    projectService = TestBed.inject(ProjectService);
    alertService = TestBed.inject(AlertService);
    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens add project form', () => {
    component.openAddProjectForm();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('calls alert error message', () => {
    component.showErrorAlert({ error: { message: 'error' } });
    expect(alertService.alertMessage).toHaveBeenCalled();
  });

  it('adds new project', () => {
    const newProject = ProjectsListMock[0];
    component.addNewProject({ newProject });
    expect(projectService.addNewProject).toHaveBeenCalledWith(newProject);
  });

  it('updates project', () => {
    const project = ProjectsListMock[0];
    component.updateProject(project);
    expect(projectService.updateProject).toHaveBeenCalledWith(project);
  });

  it('deletes project', () => {
    const project = ProjectsListMock[0];
    component.deleteProject(project);
    expect(projectService.deleteProject).toHaveBeenCalledWith(project);
  });
});
