import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  panelOpenState: boolean = false;
  periods = [
    { value: '1', viewValue: 'Daily' },
    { value: '7', viewValue: 'Weekly' },
    { value: '30', viewValue: 'Monthly' },
    { value: '365', viewValue: 'Yearly' },
  ];

  @Output() addTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();

  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3)]),
    plannedDate: new FormControl({
      value: '',
      disabled: true,
    }),
    period: new FormControl({ value: '', disabled: true }),
    repeat: new FormControl({ value: '', disabled: true }, [
      Validators.min(1),
      Validators.max(60),
    ]),
  });

  ngOnInit(): void {
    this.setInputListeners();
  }

  onSubmit(): void {
    if (this.addTaskForm.get('title')?.value) {
      const { title, plannedDate, period, repeat } = this.addTaskForm.value;
      const taskObj: TaskInterface = {
        importance: 0,
        title: title,
        completed: false,
        period: period && repeat ? period : '0',
        plannedDate: plannedDate ? plannedDate : new Date(),
        commonTask: !period && !plannedDate,
        repeat: repeat ? repeat : 0,
      };
      this.addTaskEvent.emit(taskObj);
      this.addTaskForm.reset();
    }
  }

  getTaskError(errorObj: ValidationErrors | null): string {
    return errorObj?.['minlength'] ? 'Title must be at least 3 characters' : '';
  }

  setInputListeners() {
    this.addTaskForm.get('title')!.valueChanges.subscribe((value) => {
      if (value && value.length > 2) {
        this.addTaskForm.get('plannedDate')!.enable();
        this.addTaskForm.get('period')!.enable();
      } else {
        this.addTaskForm.get('plannedDate')!.disable();
        this.addTaskForm.get('period')!.disable();
      }
    });
    this.addTaskForm.get('plannedDate')!.valueChanges.subscribe((date) => {
      if (date) {
        let now = new Date();
        if (
          new Date(date) <
          new Date(now.getFullYear(), now.getMonth(), now.getDate())
        ) {
          this.addTaskForm.get('plannedDate')!.setErrors({
            invalidDate: true,
          });
        }
      }
    });
    this.addTaskForm.get('period')!.valueChanges.subscribe((value) => {
      if (value) {
        this.addTaskForm.get('repeat')!.enable();
      } else {
        this.addTaskForm.get('repeat')!.disable();
      }
    });
  }

  getPlannedDateError(errorObj: ValidationErrors | null): string {
    if (errorObj) {
      if (errorObj?.['invalidDate']) {
        return 'Date must be in the future';
      }
    }
    return '';
  }

  getRepeatError(errorObj: ValidationErrors | null): string {
    if (errorObj) {
      if (errorObj?.['min']) {
        return 'Repeat must be at least 1';
      }
      if (errorObj?.['max']) {
        return 'Repeat must be at most 60';
      }
      if (errorObj?.['required']) {
        return 'Repeat must be set';
      }
    }
    return '';
  }
}
