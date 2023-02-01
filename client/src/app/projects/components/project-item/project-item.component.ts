import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { ProjectInterface } from '../../types/project.interface';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { DialogService } from '../../../shared/services/dialog/dialog.service';
import { DIALOG_TEXT } from '../../constants/dialog.constant';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent implements OnInit {
  @Output() deleteProjectEvent = new EventEmitter<string>();
  @Output() updateProjectEvent = new EventEmitter<ProjectInterface>();
  @Input() project: ProjectInterface;
  completedTaskCount: number;
  incompleteTasksCount: number;
  completionPercentage: number;

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {
    this.completedTaskCount = 0;
    this.incompleteTasksCount = 0;
    this.filterTasks();
    this.calculateCompletion();
  }

  filterTasks(): void {
    this.project.tasks?.forEach((task: TaskInterface) => {
      if (task.completed) {
        this.completedTaskCount++;
      } else {
        this.incompleteTasksCount++;
      }
    });
  }

  calculateCompletion(): void {
    this.completionPercentage = Math.round(
      (this.completedTaskCount /
        (this.completedTaskCount + this.incompleteTasksCount)) *
        100
    );
  }

  onDeleteProject() {
    this.dialogService
      .openConfirmation(
        DIALOG_TEXT.DELETE_TITLE,
        DIALOG_TEXT.DELETE_PROJECT_MESSAGE,
        DIALOG_TEXT.DELETE_ACTION,
        { width: '300px' }
      )
      .subscribe(
        (val) => val && this.deleteProjectEvent.emit(this.project._id)
      );
  }

  onUpdateProject() {
    this.dialogService
      .openCustomDialog(EditProjectComponent, this.project, {
        width: '400px',
      })
      .subscribe((val) => val && this.updateProjectEvent.emit(val));
  }
}
