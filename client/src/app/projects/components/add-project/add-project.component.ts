import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent {
  addProjectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

  constructor(private dialogRef: MatDialogRef<AddProjectComponent>) {}

  getTitleError(): string {
    return this.addProjectForm.get('title')!.errors?.['minlength']
      ? 'Project must be at least 3 characters long'
      : '';
  }

  getDescriptionError(): string {
    return this.addProjectForm.get('description')!.errors?.['minlength']
      ? 'Description must be at least 3 characters long'
      : this.addProjectForm.get('description')!.errors?.['maxlength']
      ? 'Description must be at most 100 characters long'
      : '';
  }

  close() {
    this.dialogRef.close(false);
  }

  save() {
    this.dialogRef.close(this.addProjectForm.value);
  }
}
