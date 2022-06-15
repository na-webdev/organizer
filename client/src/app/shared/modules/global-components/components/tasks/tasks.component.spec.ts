import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskService } from '../../../../../tasks/services/task.service';
import { AlertService } from 'src/app/shared/services/alert.service';

import { TasksComponent } from './tasks.component';
import { TaskServiceMock } from '../../../../../tasks/services/mocks/task-service.mock';
import { AlertServiceMock } from 'src/app/shared/services/mocks/alert-service.mock';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TasksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TaskService, useValue: TaskServiceMock },
        { provide: AlertService, useValue: AlertServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
