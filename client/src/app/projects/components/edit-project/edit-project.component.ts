import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectInterface } from '../../types/project.interface';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
export class EditProjectComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private project: ProjectInterface) {}

  editProjectForm: FormGroup = new FormGroup({
    title: new FormControl(this.project.title, [Validators.minLength(3)]),
    description: new FormControl(this.project.description, [
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

  getTitleError(): string {
    return this.editProjectForm.get('title')!.errors?.['minlength']
      ? 'Project must be at least 3 characters long'
      : '';
  }

  getDescriptionError(): string {
    return this.editProjectForm.get('description')!.errors?.['minlength']
      ? 'Description must be at least 3 characters long'
      : this.editProjectForm.get('description')!.errors?.['maxlength']
      ? 'Description must be at most 100 characters long'
      : '';
  }
}
