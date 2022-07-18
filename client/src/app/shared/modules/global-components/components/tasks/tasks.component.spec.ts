import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskService } from '../../../../../tasks/services/task.service';
import { AlertService } from 'src/app/shared/services/alert.service';

import { TasksComponent } from './tasks.component';
import { TaskServiceMock } from '../../../../../tasks/services/mocks/task-service.mock';
import { AlertServiceMock } from 'src/app/shared/services/mocks/alert-service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectService } from 'src/app/projects/services/project.service';
import { ProjectServiceMock } from 'src/app/projects/services/mocks/project-service.mock';
import { TaskMock } from 'src/app/tasks/services/mocks/task.mock';
import { ProjectMock } from 'src/app/projects/services/mocks/project.mock';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskService: TaskService;
  let alertService: AlertService;
  let projectService: ProjectService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [TasksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TaskService, useValue: TaskServiceMock },
        { provide: AlertService, useValue: AlertServiceMock },
        { provide: ProjectService, useValue: ProjectServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    taskService = TestBed.inject(TaskService);
    alertService = TestBed.inject(AlertService);
    projectService = TestBed.inject(ProjectService);
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds new task', () => {
    let addTaskResponse: { _id: string };
    component.addNewTask(TaskMock);
    expect(taskService.addNewTask).toHaveBeenCalled();
  });

  it('adds new task with project reference', () => {
    component.projectId = '5e9f8f8f8f8f8f8f8f8f8f8';
    let now = new Date();
    TaskMock.plannedDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    component.addNewTask(TaskMock);
    expect(taskService.addNewTask).toHaveBeenCalledWith(
      TaskMock,
      '5e9f8f8f8f8f8f8f8f8f8f8'
    );
  });

  it('updates task', () => {
    component.updateTask(TaskMock);
    expect(taskService.updateTask).toHaveBeenCalled();
  });

  it('deletes task', () => {
    component.deleteTask(TaskMock);
    expect(taskService.deleteTask).toHaveBeenCalled();
  });

  it('completes task', () => {
    component.completeTask(TaskMock);
    expect(taskService.updateTask).toHaveBeenCalled();
  });

  it('sets current project', () => {
    component.setCurrentProject(ProjectMock);
    expect(taskService.setTasks).toHaveBeenCalled();
  });

  it('shows error alert', () => {
    component.showErrorAlert({ error: { message: 'error' } });
    expect(alertService.alertMessage).toHaveBeenCalled();
  });

  it('loads more tasks on task mode', () => {
    component.loadMoreTasks();
    component.projectId = '';
    component.projectMode = 'task';
    expect(taskService.requestUserTasks).toHaveBeenCalledWith(1, 10, 'task');
  });

  it('loads more tasks on project mode', () => {
    component.loadMoreTasks();
    component.projectId = '5e9f8f8f8f8f8f8f8f8f8f8';
    component.projectMode = 'project';
    expect(taskService.requestUserTasks).toHaveBeenCalledWith(1, 10, 'task');
  });

  it('gets project data', () => {
    component.getProjectData();
    expect(projectService.getProjectById).toHaveBeenCalled();
  });

  it('detects scroll', () => {
    component.detectScroll();
    expect(taskService.requestUserTasks).toHaveBeenCalled();
  });

  it('filters tasks by completed', () => {
    // spy on component filter tasks method
    spyOn(component, 'filterTasks');
    component.filterTasks([TaskMock], 'completed');
    expect(component.filterTasks).toHaveBeenCalled();
  });

  it('filters tasks by not completed', () => {
    spyOn(component, 'filterTasks');
    component.filterTasks([TaskMock], 'incomplete');
    expect(component.filterTasks).toHaveBeenCalled();
  });

  it('filters tasks by common', () => {
    spyOn(component, 'filterTasks');
    component.filterTasks([TaskMock], 'common');
    expect(component.filterTasks).toHaveBeenCalled();
  });

  it('checks task not common and not completed', () => {
    expect(component.isTaskIncomplete(TaskMock)).toBe(true);
  });

  it('checks task is common', () => {
    expect(component.isTaskCommon(TaskMock)).toBe(false);
  });
});
