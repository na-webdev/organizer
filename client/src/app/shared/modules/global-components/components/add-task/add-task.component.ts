import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  allSelected: boolean = false;
  panelOpenState: boolean = false;
  isDaysValid: boolean = false;
  weekDays: { name: string; selected: boolean }[] = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
    { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false },
  ];
  @Output() addTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();

  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3)]),
    plannedDate: new FormControl({
      value: '',
      disabled: true,
    }),
  });

  ngOnInit(): void {
    this.setInputListeners();
  }

  onSubmit(): void {
    if (this.addTaskForm.get('title')?.value) {
      const { title, plannedDate } = this.addTaskForm.value;
      const taskObj: TaskInterface = {
        importance: 0,
        title: title,
        completed: false,
        weekDays: this.weekDays
          .filter((day) => day.selected)
          .map((day) => day.name),
      };
      if (plannedDate) {
        taskObj.plannedDate = plannedDate;
      }

      console.log(taskObj);
      this.addTaskEvent.emit(taskObj);
      this.addTaskForm.reset();
      this.weekDays.forEach((day) => (day.selected = false));
      this.allSelected = false;
    }
  }

  getTaskError(): string {
    return this.addTaskForm.get('title')!.errors?.['minlength']
      ? 'Task must be at least 3 characters long'
      : '';
  }

  setAll(selected: boolean): void {
    this.allSelected = selected;
    this.weekDays.forEach((day) => (day.selected = selected));
  }

  watchAllDays() {
    if (this.weekDays.every((day) => day.selected)) {
      this.allSelected = true;
    }
    if (this.weekDays.some((day) => !day.selected)) {
      this.allSelected = false;
    }
  }

  setInputListeners() {
    this.addTaskForm.get('title')!.valueChanges.subscribe((value) => {
      if (value && value.length > 2) {
        this.addTaskForm.get('plannedDate')!.enable();
        this.isDaysValid = true;
      } else {
        this.addTaskForm.get('plannedDate')!.disable();
        this.isDaysValid = false;
      }
    });
    this.addTaskForm.get('plannedDate')!.valueChanges.subscribe((date) => {
      if (date && new Date(date) < new Date()) {
        this.addTaskForm.get('plannedDate')!.setErrors({
          invalidDate: true,
        });
      }
    });
  }

  getPlannedDateError(): string {
    const errorObj = this.addTaskForm.get('plannedDate')!.errors;
    if (errorObj) {
      if (errorObj?.['invalidDate']) {
        return 'Date must be in the future';
      }
    }
    return '';
  }
}
