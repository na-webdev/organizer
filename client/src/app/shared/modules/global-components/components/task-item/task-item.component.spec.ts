import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';
import { TaskMock } from 'src/app/tasks/services/mocks/task.mock';
import { TaskInterfaceMock } from '../../../../types/mocks/task-interface.mock';

import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [TaskItemComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    component.task = TaskInterfaceMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens edit dialog', () => {
    component.onEdit();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.updateTaskEvent).toBeTruthy();
  });

  it('emits edit event', () => {
    component.emitEditEvent(TaskMock);
    expect(component.updateTaskEvent).toBeTruthy();
  });

  it('opens delete dialog', () => {
    component.onDelete();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.deleteTaskEvent).toBeTruthy();
  });

  it('emits delete event', () => {
    component.emitDeleteEvent(TaskMock);
    expect(component.deleteTaskEvent).toBeTruthy();
  });

  it('emits complete event', () => {
    component.onComplete();
    expect(component.completeTaskEvent).toBeTruthy();
  });
});
