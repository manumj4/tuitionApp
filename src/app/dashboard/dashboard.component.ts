import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DashboardData } from '../models/dashboard';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatGridTile } from '@angular/material/grid-list';
import { MatCardContent } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  imports: [MatGridListModule, MatCardModule, MatGridTile, MatCardContent, CommonModule],
  selector: 'app-dashboard',
  
  standalone: true,
  template: `
    <mat-grid-list cols="2" rowHeight="2:1">
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Students</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ dashboardData?.totalStudents }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Fees</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ dashboardData?.totalFees }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile colspan="2">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Student Changes (Last 5 Months)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="dashboardData">
              <div *ngFor="let change of dashboardData.studentsAddedLast5Months">
                Added: {{ change.month }} - {{ change.count }}
              </div>
              <div *ngFor="let change of dashboardData.studentRemovedLast5Months">
                Removed: {{ change.month }} - {{ change.count }}
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Fees Collected</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ dashboardData?.feesCollected }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Salary Given</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ dashboardData?.salaryGiven }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  `,
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;

  constructor(
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.snackBar.open('Error loading dashboard data.', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}