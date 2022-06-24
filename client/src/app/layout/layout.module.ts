import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layout/layout.component';
import { MaterialModule } from '../shared/modules/material/material.module';
import { RouterModule } from '@angular/router';
import { TasksComponent } from '../shared/modules/global-components/components/tasks/tasks.component';
import { ProjectsComponent } from '../projects/components/projects/projects.component';
import { ProjectItemComponent } from '../projects/components/project-item/project-item.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes = [
  {
    path: '',
    redirectTo: 'home/tasks',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tasks',
        component: TasksComponent,
      },
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
    ],
  },
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)],
  exports: [LayoutComponent],
})
export class LayoutModule {}
