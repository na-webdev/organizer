import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/modules/material/material.module';
import { GlobalComponentsModule } from '../shared/modules/global-components/global-components.module';
import { TasksComponent } from '../shared/modules/global-components/components/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: TasksComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    GlobalComponentsModule,
  ],
  exports: [RouterModule],
})
export class TasksModule {}
