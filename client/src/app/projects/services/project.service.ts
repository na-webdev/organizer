import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { ResponseInterface } from 'src/app/shared/types/response.interface';
import { environment } from 'src/environments/environment';
import { ProjectInterface } from '../types/project.interface';
import { RequestService } from '../../shared/services/request-handler/request.service';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<ProjectInterface[]>([]);
  private projects = this.projectsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private requestService: RequestService
  ) {}

  requestUserProjects(): void {}

  getAllProjects(): Observable<ProjectInterface[]> {
    if (this.projectsSubject.value && this.projectsSubject.value.length) {
      return this.projectsSubject.asObservable();
    }

    const observable = this.http
      .get<ProjectInterface[]>(apiUrl + 'projects')
      .pipe(
        switchMap((projects) => {
          this.projectsSubject.next(projects);
          return this.projectsSubject.asObservable();
        })
      );

    return this.requestService.handleLoadingAndErrors(observable);
  }

  getProjectById(
    projectId: string | null,
    pageNumber: number,
    limit: number
  ): Observable<ProjectInterface> {
    return this.requestService.handleLoadingAndErrors(
      this.http.get<ProjectInterface>(
        apiUrl + 'projects/' + projectId + `?page=${pageNumber}&limit=${limit}`
      )
    );
  }

  addNewProject(project: ProjectInterface): Observable<ResponseInterface> {
    const observable = this.http
      .post<ResponseInterface>(apiUrl + 'projects', project)
      .pipe(
        tap((res) => {
          const newProjects = [
            ...this.projectsSubject.value,
            { ...project, _id: res._id },
          ];
          this.projectsSubject.next(newProjects);
        })
      );
    return this.requestService.handleLoadingAndErrors(observable);
  }

  updateProject(project: ProjectInterface): Observable<ResponseInterface> {
    const observable = this.http
      .patch<ResponseInterface>(apiUrl + 'projects/' + project._id, {
        title: project.title,
        description: project.description,
      })
      .pipe(
        tap((res) => {
          const updatedProjects = this.projectsSubject.value.map((p) =>
            p._id === project._id ? { ...p, ...project } : p
          );
          this.projectsSubject.next(updatedProjects);
        })
      );

    return this.requestService.handleLoadingAndErrors(observable);
  }

  deleteProject(id: string): Observable<ResponseInterface> {
    const observable = this.http
      .delete<ResponseInterface>(apiUrl + 'projects/' + id)
      .pipe(
        tap((res) => {
          const updateProjects = this.projectsSubject.value.filter(
            (p) => p._id !== id
          );
          this.projectsSubject.next(updateProjects);
        })
      );
    return this.requestService.handleLoadingAndErrors(observable);
  }
}
