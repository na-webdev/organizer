import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DeleteDialogComponent } from 'src/app/shared/modules/global-components/components/delete-dialog/delete-dialog.component';
import { TaskInterface } from 'src/app/shared/types/task.interface';
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
    private route: ActivatedRoute
  ) {
    this.emitDeleteProjectEvent = this.emitDeleteProjectEvent.bind(this);
    this.emitUpdateProjectEvent = this.emitUpdateProjectEvent.bind(this);
  }

  ngOnInit(): void {
    this.filterTasks();
    this.calculateCompletion();
  }

  filterTasks(): void {
    this.project!.tasks?.forEach((task: TaskInterface) => {
      if (task.completed) {
        this.completed++;
      } else {
        this.incomplete++;
      }
    });
  }

  calculateCompletion(): void {
    this.completionPercentage = Math.round(
      (this.completed / (this.completed + this.incomplete)) * 100
    );
  }

  openProject(project: ProjectInterface): void {
    this._router.navigate(['./', project._id], {
      relativeTo: this.route,
    });
  }

  deleteProject(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: 'Delete project',
        message:
          'Are you sure you want to delete this project?' +
          (this.project!.tasks?.length
            ? ' It will also delete all tasks associated with this project.'
            : ''),
      },
    });

    dialogRef.afterClosed().subscribe(this.emitDeleteProjectEvent);
  }

  emitDeleteProjectEvent(result: boolean): void {
    result && this.deleteProjectEvent.emit(this.project);
  }

  editProject(): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '400px',
      data: this.project,
    });

    dialogRef.afterClosed().subscribe(this.emitUpdateProjectEvent);
  }

  emitUpdateProjectEvent(result: { updatedProject: ProjectInterface }): void {
    if (result) {
      this.updateProjectEvent.emit({
        ...this.project,
        ...result.updatedProject,
      });
    }
  }
}
