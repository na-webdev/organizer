import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskInterface } from '../../types/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  @Output() addTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();

  addTaskForm: FormGroup = new FormGroup({
    task: new FormControl('', [Validators.minLength(3)]),
  });

  constructor() {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.addTaskForm.get('task')?.value) {
      const { task } = this.addTaskForm.value;
      this.addTaskEvent.emit({ id: 0, text: task, completed: false });
      this.addTaskForm.reset();
    }
  }

  getTaskError(): string {
    return this.addTaskForm.get('task')!.errors?.['minlength']
      ? 'Task must be at least 3 characters long'
      : '';
  }
}
