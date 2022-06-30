import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  panelOpenState: boolean = false;
  selectedFromDate!: boolean;

  @Output() addTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();

  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3)]),
    plannedDate: new FormControl({
      value: '',
      disabled: true,
    }),
    period: new FormControl({ value: '', disabled: true }),
  });

  ngOnInit(): void {
    this.setInputListeners();
  }

  onSubmit(): void {
    if (this.addTaskForm.get('title')?.value) {
      const { title, plannedDate, period } = this.addTaskForm.value;
      const taskObj: TaskInterface = {
        importance: 0,
        title: title,
        completed: false,
        period: period ? period : 'today',
        plannedDate: plannedDate ? plannedDate : new Date(),
      };

      this.addTaskEvent.emit(taskObj);
      this.addTaskForm.reset();
    }
  }

  getTaskError(): string {
    return this.addTaskForm.get('title')!.errors?.['minlength']
      ? 'Task must be at least 3 characters long'
      : '';
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
        if (new Date(date) < new Date()) {
          this.addTaskForm.get('plannedDate')!.setErrors({
            invalidDate: true,
          });
        }
        this.setPeriodValue(date);
      }
    });
    this.addTaskForm.get('period')!.valueChanges.subscribe((value) => {
      this.setPlannedDate(value);
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
      this.addTaskForm.get('period')!.setValue('1 week');
    } else if (selectedTime - currentTime === 14 * 24 * 60 * 60 * 1000) {
      this.addTaskForm.get('period')!.setValue('2 weeks');
    } else if (selectedTime - currentTime === 30 * 24 * 60 * 60 * 1000) {
      this.addTaskForm.get('period')!.setValue('1 month');
    } else if (selectedTime - currentTime === 24 * 60 * 60 * 1000) {
      this.addTaskForm.get('period')!.setValue('tomorrow');
    } else {
      this.addTaskForm.get('period')!.reset();
    }
  }

  setPlannedDate(value: string): void {
    if (value && !this.selectedFromDate) {
      if (value === '1 week') {
        this.addTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000));
      } else if (value === '2 weeks') {
        this.addTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000));
      } else if (value === '1 month') {
        this.addTaskForm
          .get('plannedDate')!
          .setValue(new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000));
      }
    }
    this.selectedFromDate = false;
  }
}
