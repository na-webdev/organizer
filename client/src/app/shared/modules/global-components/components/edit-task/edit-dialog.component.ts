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
  allSelected: boolean = this.task.weekDays?.length === 7;
  isDaysValid: boolean = true;
  weekDays: { name: string; selected: boolean }[] = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
    { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false },
  ];
  weekDaysUpdated: string[] = [];

  editTaskForm: FormGroup = new FormGroup({
    title: new FormControl(this.task.title, [
      Validators.minLength(3),
      Validators.required,
    ]),
    plannedDate: new FormControl(this.task.plannedDate),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public task: TaskInterface) {
    this.weekDays.forEach((day) => {
      if (this.task.weekDays?.includes(day.name)) {
        day.selected = true;
      }
    });
    this.setInputListeners();
    this.weekDaysUpdated = this.weekDays
      .filter((day) => day.selected)
      .map((day) => day.name);
  }

  watchAllDays() {
    if (this.weekDays.every((day) => day.selected)) {
      this.allSelected = true;
    }
    if (this.weekDays.some((day) => !day.selected)) {
      this.allSelected = false;
    }
    this.weekDaysUpdated = this.weekDays
      .filter((day) => day.selected)
      .map((day) => day.name);
  }

  setAll(selected: boolean): void {
    this.allSelected = selected;
    this.weekDays.forEach((day) => (day.selected = selected));
    this.weekDaysUpdated = this.weekDays
      .filter((day) => day.selected)
      .map((day) => day.name);
  }

  setInputListeners() {
    this.editTaskForm.get('title')!.valueChanges.subscribe((value) => {
      if (value && value.length > 2) {
        this.editTaskForm.get('plannedDate')!.enable();
        this.isDaysValid = true;
      } else {
        this.editTaskForm.get('plannedDate')!.disable();
        this.isDaysValid = false;
      }
    });
    this.editTaskForm.get('plannedDate')!.valueChanges.subscribe((date) => {
      if (date && new Date(date) < new Date()) {
        this.editTaskForm.get('plannedDate')!.setErrors({
          invalidDate: true,
        });
      }
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
}
