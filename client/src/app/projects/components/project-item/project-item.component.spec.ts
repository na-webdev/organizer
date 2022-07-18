import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY } from 'rxjs';
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
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jasmine
              .createSpy()
              .and.returnValue({ afterClosed: () => EMPTY }),
          },
        },
      ],
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
    expect(component.completed).toBe(0);
    expect(component.incomplete).toBe(4);
  });

  it('opens dialog', () => {
    component.deleteProject();
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
