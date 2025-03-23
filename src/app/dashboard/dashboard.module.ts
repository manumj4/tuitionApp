import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from './dashboard.service';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    DashboardComponent,
    MatDividerModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
  exports: [DashboardComponent],
  providers: [DashboardService],
})
export class DashboardModule {}