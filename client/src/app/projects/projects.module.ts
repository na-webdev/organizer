import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './components/projects/projects.component';
import { RouterModule } from '@angular/router';
import { GlobalComponentsModule } from '../shared/modules/global-components/global-components.module';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { MaterialModule } from '../shared/modules/material/material.module';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProjectComponent } from './components/edit-project/edit-project.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectItemComponent,
    AddProjectComponent,
    EditProjectComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    GlobalComponentsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectsModule {}
