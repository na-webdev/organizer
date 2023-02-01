import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DialogProvider } from 'src/app/shared/helpers/dialog-provider';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';
import { ProjectMock } from '../../services/mocks/project.mock';

import { ProjectItemComponent } from './project-item.component';

describe('ProjectItemComponent', () => {
  let component: ProjectItemComponent;
  let fixture: ComponentFixture<ProjectItemComponent>;
  let dialog: MatDialog;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProjectItemComponent, TruncatePipe],
      providers: [DialogProvider],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    dialog = TestBed.inject(MatDialog);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProjectItemComponent);
    component = fixture.componentInstance;
    component.project = ProjectMock;
    component.dialog = dialog;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters project tasks', () => {
    component.ngOnInit();
    expect(component.completedTaskCount).toBe(0);
    expect(component.incompleteTasksCount).toBe(4);
  });

  it('opens dialog', () => {
    component.onDeleteProject();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.deleteProjectEvent).toBeTruthy();
  });

  it('opens edit dialog', () => {
    component.editProject();
    expect(component.dialog.open).toHaveBeenCalled();
    expect(component.updateProjectEvent).toBeTruthy();
  });

  it('emits delete project event', () => {
    component.emitDeleteProjectEvent(true);
    expect(component.deleteProjectEvent).toBeTruthy();
  });

  it('emits update project event', () => {
    component.emitUpdateProjectEvent({ updatedProject: ProjectMock });
    expect(component.updateProjectEvent).toBeTruthy();
  });
});
