import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take, tap } from 'rxjs';
import { ResponseInterface } from 'src/app/shared/types/response.interface';
import { environment } from 'src/environments/environment';
import { ProjectInterface } from '../types/project.interface';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<ProjectInterface[]>([]);
  private projects = this.projectsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<ProjectInterface[]> {
    if (this.projectsSubject.value && this.projectsSubject.value.length) {
      return this.projectsSubject.asObservable();
    }

    return this.http.get<ProjectInterface[]>(apiUrl + 'projects').pipe(
      switchMap((projects) => {
        this.projectsSubject.next(projects);
        return this.projectsSubject.asObservable();
      })
    );
  }

  getProjectById(
    projectId: string | null,
    pageNumber: number,
    limit: number
  ): Observable<ProjectInterface> {
    return this.http.get<ProjectInterface>(
      apiUrl + 'projects/' + projectId + `?page=${pageNumber}&limit=${limit}`
    );
  }

  addNewProject(project: ProjectInterface): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(apiUrl + 'projects', project).pipe(
      tap((res) => {
        const newProjects = [
          ...this.projectsSubject.value,
          { ...project, _id: res._id },
        ];
        this.projectsSubject.next(newProjects);
      }),
      take(1)
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
          const updatedProjects = this.projectsSubject.value.map((p) =>
            p._id === project._id ? { ...p, ...project } : p
          );
          this.projectsSubject.next(updatedProjects);
        }),
        take(1)
      );
  }

  deleteProject(id: string): Observable<ResponseInterface> {
    return this.http.delete<ResponseInterface>(apiUrl + 'projects/' + id).pipe(
      tap((res) => {
        const updateProjects = this.projectsSubject.value.filter(
          (p) => p._id !== id
        );
        this.projectsSubject.next(updateProjects);
      }),
      take(1)
    );
  }
}
