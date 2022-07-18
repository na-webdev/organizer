import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { EditDialogComponent } from './edit-dialog.component';
import { TaskMock } from 'src/app/tasks/services/mocks/task.mock';

describe('EditDialogComponent', () => {
  let component: EditDialogComponent;
  let fixture: ComponentFixture<EditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [EditDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: TaskMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggles planned date', () => {
    component.togglePlannedDate('planned');
    expect(component.editTaskForm.controls['plannedDate'].enabled).toBeTruthy();
    component.togglePlannedDate('pl');
    expect(component.editTaskForm.controls['plannedDate'].enabled).toBeFalsy();
  });

  it('checks date validity', () => {
    component.isDateValid(new Date('2020-01-01'));
    expect(component.editTaskForm.controls['plannedDate'].valid).toBeFalsy();
  });

  it('shows title error', () => {
    expect(component.getTitleError({ required: true })).toBe(
      'Title is required'
    );
    expect(
      component.getTitleError({
        minlength: {
          requiredLength: 3,
          actualLength: 2,
        },
      })
    ).toBe('Title must be at least 3 characters long');
    expect(component.getTitleError(null)).toBe('');
  });

  it('shows planned date error', () => {
    expect(component.getPlannedDateError({ invalidDate: true })).toBe(
      'Date must be in the future'
    );
    expect(component.getPlannedDateError(null)).toBe('');
  });
});
