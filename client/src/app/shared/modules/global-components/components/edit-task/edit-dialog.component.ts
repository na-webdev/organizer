import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskInterface } from '../../../../types/task.interface';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialogComponent {
  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(this.task.title, [
      Validators.minLength(3),
      Validators.required,
    ]),
    plannedDate: new FormControl(this.task.plannedDate),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public task: TaskInterface) {
    this.setInputListeners();
  }

  setInputListeners() {
    this.editTaskForm
      .get('title')!
      .valueChanges.subscribe(this.togglePlannedDate.bind(this));
    this.editTaskForm
      .get('plannedDate')!
      .valueChanges.subscribe(this.isDateValid.bind(this));
  }

  togglePlannedDate(value: string): void {
    if (value && value.length > 2) {
      this.editTaskForm.get('plannedDate')!.enable();
    } else {
      this.editTaskForm.get('plannedDate')!.disable();
    }
  }

  isDateValid(date: Date): void {
    if (date) {
      let now = new Date();
      if (
        new Date(date) <
        new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ) {
        this.editTaskForm.get('plannedDate')!.setErrors({
          invalidDate: true,
        });
      }
    }
  }

  getTitleError(errorObj: ValidationErrors | null): string {
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

  getPlannedDateError(errorObj: ValidationErrors | null): string {
    if (errorObj) {
      if (errorObj?.['invalidDate']) {
        return 'Date must be in the future';
      }
    }
    return '';
  }
}
