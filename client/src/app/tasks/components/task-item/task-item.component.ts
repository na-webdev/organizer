import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskInterface } from '../../types/task.interface';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() task!: TaskInterface;
  @Output() updateTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  @Output() deleteTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  @Output() completeTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  isEditMode: boolean = false;

  constructor(public dialog: MatDialog) {}

  onEdit(): void {
    let dialogRef = this.dialog.open(EditDialogComponent, {
      width: '300px',
      data: this.task,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.updateTaskEvent.emit(result);
    });
  }

  onDelete(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      result && this.deleteTaskEvent.emit(this.task);
    });
  }

  onComplete(): void {
    this.completeTaskEvent.emit(this.task);
  }
}
