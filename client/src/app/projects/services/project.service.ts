import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take, tap } from 'rxjs';
import { ResponseInterface } from 'src/app/shared/types/response.interface';
import { environment } from 'src/environments/environment';
import { ProjectInterface } from '../types/project.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: ProjectInterface[] = [];
  private projectsUpdated = new BehaviorSubject<ProjectInterface[]>(
    this.projects
  );

  constructor(private http: HttpClient) {}

  requestUserProjects(): void {
    this.http
      .get<ProjectInterface[]>(apiUrl + 'projects')
      .pipe(
        tap((projects: ProjectInterface[]) => {
          this.projects = projects;
          this.projectsUpdated.next(this.projects);
        }),
        take(1)
      )
      .subscribe();
  }

  getAllProjects(): Observable<ProjectInterface[]> {
    return this.projectsUpdated.asObservable();
  }

  getProjectById(projectId: string | null): Observable<ProjectInterface> {
    return this.http.get<ProjectInterface>(apiUrl + 'projects/' + projectId);
  }

  addNewProject(project: ProjectInterface): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(apiUrl + 'projects', project).pipe(
      tap((res) => {
        this.projects.unshift({ ...project, _id: res._id });
        this.projectsUpdated.next(this.projects);
      })
    );
  }

  updateProject(project: ProjectInterface): Observable<ResponseInterface> {
    return this.http
      .patch<ResponseInterface>(apiUrl + 'projects/' + project._id, {
        title: project.title,
        description: project.description,
      })
      .pipe(
        tap((res) => {
          this.projects = this.projects.map((p) =>
            p._id === project._id ? { ...p, ...project } : p
          );
          this.projectsUpdated.next(this.projects);
        })
      );
  }

  deleteProject(project: ProjectInterface): Observable<ResponseInterface> {
    return this.http
      .delete<ResponseInterface>(apiUrl + 'projects/' + project._id)
      .pipe(
        tap((res) => {
          this.projects = this.projects.filter((p) => p._id !== project._id);
          this.projectsUpdated.next(this.projects);
        })
      );
  }
}
