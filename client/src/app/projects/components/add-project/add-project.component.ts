import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent {
  addProjectForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.minLength(3)]),
    description: new FormControl('', [
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

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
}
