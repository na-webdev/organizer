import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskInterface } from '../../../../types/task.interface';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../edit-task/edit-dialog.component';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
  @Input() mode!: boolean;
  @Input() task!: TaskInterface;
  @Output() updateTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  @Output() deleteTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  @Output() completeTaskEvent: EventEmitter<TaskInterface> = new EventEmitter();
  isEditMode: boolean = false;
  projectTitle!: string | undefined;

  constructor(public dialog: MatDialog, private _router: Router) {}

  onEdit(): void {
    let dialogRef = this.dialog.open(EditDialogComponent, {
      width: '300px',
      data: this.task,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTaskEvent.emit(result);
      }
    });
  }

  onDelete(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Delete task',
        message: 'Are you sure you want to delete this task?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      result && this.deleteTaskEvent.emit(this.task);
    });
  }

  onComplete(): void {
    this.completeTaskEvent.emit(this.task);
  }

  openProject(): void {
    this._router.navigate(['/home/projects', this.task.projectRef?._id]);
  }
}
