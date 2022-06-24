import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/modules/material/material.module';
import { GlobalComponentsModule } from '../shared/modules/global-components/global-components.module';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, GlobalComponentsModule],
  exports: [RouterModule],
})
export class TasksModule {}
