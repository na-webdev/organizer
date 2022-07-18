import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

import { AddTaskComponent } from './add-task.component';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [AddTaskComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows task error', () => {
    expect(component.getTaskError({ minlength: true })).toBe(
      'Title must be at least 3 characters'
    );
    expect(component.getTaskError(null)).toBe('');
  });

  it('shows planned date error', () => {
    expect(component.getPlannedDateError({ invalidDate: true })).toBe(
      'Date must be in the future'
    );
    expect(component.getPlannedDateError(null)).toBe('');
  });

  it('shows repeat error', () => {
    expect(component.getRepeatError({ min: true })).toBe(
      'Repeat must be at least 1'
    );
    expect(component.getRepeatError({ max: true })).toBe(
      'Repeat must be at most 60'
    );
    expect(component.getRepeatError({ required: true })).toBe(
      'Repeat must be set'
    );
    expect(component.getRepeatError(null)).toBe('');
  });

  it('adds task', () => {
    component.addTaskForm.setValue({
      title: 'test',
      plannedDate: new Date(),
      period: '1',
      repeat: '1',
    });
    component.onSubmit();
    spyOn(component.addTaskEvent, 'emit')();
    expect(component.addTaskEvent.emit).toHaveBeenCalled();
  });
});
