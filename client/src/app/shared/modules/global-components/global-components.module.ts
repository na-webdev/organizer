import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './components/edit-task/edit-dialog.component';

const components = [
  AddTaskComponent,
  TaskItemComponent,
  DeleteDialogComponent,
  EditDialogComponent,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  exports: [...components],
})
export class GlobalComponentsModule {}
