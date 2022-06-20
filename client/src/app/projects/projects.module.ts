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
import { TasksComponent } from '../shared/modules/global-components/components/tasks/tasks.component';

const routes = [
  {
    path: 'projects',
    children: [
      {
        path: '',
        component: ProjectsComponent,
      },
      {
        path: ':id',
        component: TasksComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectItemComponent,
    AddProjectComponent,
    EditProjectComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    GlobalComponentsModule,
    ReactiveFormsModule,
  ],
})
export class ProjectsModule {}
