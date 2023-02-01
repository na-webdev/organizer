import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { EditDialogComponent } from './components/edit-task/edit-dialog.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingComponent } from './components/loading/loading.component';

const components = [
  AddTaskComponent,
  TaskItemComponent,
  ConfirmationDialogComponent,
  EditDialogComponent,
  TasksComponent,
  TruncatePipe,
  LoadingComponent,
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatNativeDateModule,
  ],
  exports: [...components],
})
export class GlobalComponentsModule {}
