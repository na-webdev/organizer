import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskInterface } from '../../../../types/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  @Output() addTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();

  addTaskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3)]),
  });

  constructor() {}

  onSubmit(): void {
    if (this.addTaskForm.get('title')?.value) {
      const { title } = this.addTaskForm.value;
      this.addTaskEvent.emit({ importance: 0, title: title, completed: false });
      this.addTaskForm.reset();
    }
  }

  getTaskError(): string {
    return this.addTaskForm.get('title')!.errors?.['minlength']
      ? 'Task must be at least 3 characters long'
      : '';
  }
}
