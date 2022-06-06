import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskInterface } from '../../types/task.interface';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
})
export class EditDialogComponent {
  editTaskForm: FormGroup = new FormGroup({
    text: new FormControl(this.task.title),
  });
  constructor(@Inject(MAT_DIALOG_DATA) public task: TaskInterface) {}
}
