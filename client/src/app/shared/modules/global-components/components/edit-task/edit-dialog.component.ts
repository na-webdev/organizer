import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskInterface } from '../../../../types/task.interface';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent {
  selectedFromDate!: boolean;
  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(this.task.title, [
      Validators.minLength(3),
      Validators.required,
    ]),
    plannedDate: new FormControl(this.task.plannedDate),
    period: new FormControl(this.task.period),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public task: TaskInterface) {
    this.setInputListeners();
  }

  setInputListeners() {
    this.editTaskForm.get('title')!.valueChanges.subscribe((value) => {
      if (value && value.length > 2) {
        this.editTaskForm.get('plannedDate')!.enable();
      } else {
        this.editTaskForm.get('plannedDate')!.disable();
      }
    });
    this.editTaskForm.get('plannedDate')!.valueChanges.subscribe((date) => {
      if (date && new Date(date) < new Date()) {
        this.editTaskForm.get('plannedDate')!.setErrors({
          invalidDate: true,
        });
      }
      this.setPeriodValue(date);
    });
    this.editTaskForm.get('period')!.valueChanges.subscribe((value) => {
      this.setPlannedDate(value);
    });
  }

  getTitleError(): string {
    const errorObj = this.editTaskForm.get('title')!.errors;
    if (errorObj) {
      if (errorObj['required']) {
        return 'Title is required';
      }
      if (errorObj['minlength']) {
        return `Title must be at least ${errorObj['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  getPlannedDateError(): string {
    const errorObj = this.editTaskForm.get('plannedDate')!.errors;
    if (errorObj) {
      if (errorObj?.['invalidDate']) {
        return 'Date must be in the future';
      }
    }
    return '';
  }

  setPeriodValue(date: Date): void {
    this.selectedFromDate = true;
    const selectedTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    const currentTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();
    if (selectedTime - currentTime === 7 * 24 * 60 * 60 * 1000) {
      this.editTaskForm.get('period')!.setValue('1 week');
    } else if (selectedTime - currentTime === 14 * 24 * 60 * 60 * 1000) {
      this.editTaskForm.get('period')!.setValue('2 weeks');
    } else if (selectedTime - currentTime === 30 * 24 * 60 * 60 * 1000) {
      this.editTaskForm.get('period')!.setValue('1 month');
    } else if (selectedTime - currentTime === 24 * 60 * 60 * 1000) {
      this.editTaskForm.get('period')!.setValue('tomorrow');
    } else {
      this.editTaskForm.get('period')!.reset();
    }
  }

  setPlannedDate(value: string): void {
    if (value && !this.selectedFromDate) {
      if (value === '1 week') {
        this.editTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
      } else if (value === '2 weeks') {
        this.editTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000));
      } else if (value === '1 month') {
        this.editTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000));
      }
    }
    this.selectedFromDate = false;
  }
}
