import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { pipe, Subscription, take } from 'rxjs';
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

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {
    this.projectService.requestUserProjects();
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.projectsSubscription.unsubscribe();
  }

  openAddProjectForm(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projectService
          .addNewProject({ ...result.newProject })
          .pipe(take(1))
          .subscribe();
      }
    });
  }

  updateProject(project: ProjectInterface): void {
    this.projectService.updateProject(project).pipe(take(1)).subscribe();
  }

  deleteProject(project: ProjectInterface): void {
    this.projectService.deleteProject(project).pipe(take(1)).subscribe();
  }

  getAllProjects(): void {
    this.projectsSubscription = this.projectService.getAllProjects().subscribe(
      (projects) => {
        this.projects = projects;
      },
      (error) => {}
    );
  }
}
