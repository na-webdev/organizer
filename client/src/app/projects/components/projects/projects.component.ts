import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert/alert.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../types/project.interface';
import { AddProjectComponent } from '../add-project/add-project.component';
import { DialogService } from '../../../shared/services/dialog/dialog.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects$: Observable<ProjectInterface[]>;

  constructor(
    private dialog: MatDialog,
    public projectService: ProjectService,
    private alertService: AlertService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.projectService.getAllProjects();
  }

  openAddProjectForm(): void {
    this.dialogService
      .openCustomDialog(AddProjectComponent, {}, { width: '400px' })
      .subscribe((val) => val && this.addNewProject(val));
  }

  addNewProject(project: ProjectInterface): void {
    this.projectService.addNewProject(project).subscribe();
  }

  updateProject(project: ProjectInterface): void {
    this.projectService.updateProject(project).subscribe();
  }

  deleteProject(projectId: string): void {
    this.projectService.deleteProject(projectId).subscribe();
  }
}
