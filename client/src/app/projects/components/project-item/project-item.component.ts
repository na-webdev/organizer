import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/shared/modules/global-components/components/delete-dialog/delete-dialog.component';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../types/project.interface';
import { EditProjectComponent } from '../edit-project/edit-project.component';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {
  @Output() deleteProjectEvent: EventEmitter<ProjectInterface> =
    new EventEmitter();
  @Output() updateProjectEvent: EventEmitter<ProjectInterface> =
    new EventEmitter();
  @Input() project!: ProjectInterface;
  completed: number = 0;
  incomplete: number = 0;
  completionPercentage: number = 0;

  constructor(
    private _router: Router,
    public dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.project!.tasks?.forEach((task: TaskInterface) => {
      if (task.completed) {
        this.completed++;
      } else {
        this.incomplete++;
      }
      this.completionPercentage = Math.round(
        (this.completed / (this.completed + this.incomplete)) * 100
      );
    });
  }

  openProject(project: ProjectInterface): void {
    this._router.navigate(['/projects', project._id]);
  }

  deleteProject(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Delete project',
        message: 'Are you sure you want to delete this project?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      result && this.deleteProjectEvent.emit(this.project);
    });
  }

  editProject(): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '400px',
      data: this.project,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProjectEvent.emit({
          ...this.project,
          ...result.updatedProject,
        });
      }
    });
  }
}
