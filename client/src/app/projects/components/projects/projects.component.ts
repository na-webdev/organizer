import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, take } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../types/project.interface';
import { AddProjectComponent } from '../add-project/add-project.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: ProjectInterface[] = [];
  projectsSubscription!: Subscription;
  showSpinner: boolean = true;

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private alertService: AlertService
  ) {
    this.projectService.requestUserProjects();
    this.addNewProject = this.addNewProject.bind(this);
    this.showErrorAlert = this.showErrorAlert.bind(this);
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.projectsSubscription?.unsubscribe();
  }

  openAddProjectForm(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(this.addNewProject);
  }

  addNewProject(result: { newProject: ProjectInterface }): void {
    if (result) {
      this.projectService
        .addNewProject({ ...result.newProject })
        .pipe(take(1))
        .subscribe((res) => {}, this.showErrorAlert);
    }
  }

  updateProject(project: ProjectInterface): void {
    this.projectService
      .updateProject(project)
      .pipe(take(1))
      .subscribe((res) => {}, this.showErrorAlert);
  }

  deleteProject(project: ProjectInterface): void {
    this.projectService
      .deleteProject(project)
      .pipe(take(1))
      .subscribe((res) => {}, this.showErrorAlert);
  }

  getAllProjects(): void {
    this.projectsSubscription = this.projectService
      .getAllProjects()
      .subscribe((projects) => {
        this.projects = projects;
        this.showSpinner = false;
      }, this.showErrorAlert);
  }

  showErrorAlert(error: any): void {
    this.alertService.alertMessage(error.error.message, 'danger');
  }
}
