// dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardService } from './dashboard.service'; // Ensure this import exists
import {MatSnackBarModule} from '@angular/material/snack-bar'
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, MatCardModule, MatGridListModule, MatDividerModule, MatSnackBarModule,HttpClientModule],
  exports: [DashboardComponent],
  providers: [DashboardService],
})
export class DashboardModule {}

// dashboard.service.ts
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.config';
import { DashboardData } from '../models/dashboard';


@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${BASE_URL}/api/dashboard`);
    // const data: DashboardData = {
    //   totalStudents: 500,
    //   totalFees: 500000,
    //   studentsAddedLast5Months: [
    //     { month: 'Jan', count: 50 },
    //     { month: 'Feb', count: 40 },
    //     { month: 'Mar', count: 60 },
    //     { month: 'Apr', count: 30 },
    //     { month: 'May', count: 70 },
    //   ],
    //   studentRemovedLast5Months: [
    //     { month: 'Jan', count: 10 },
    //     { month: 'Feb', count: 15 },
    //     { month: 'Mar', count: 5 },
    //     { month: 'Apr', count: 20 },
    //     { month: 'May', count: 8 },
    //   ],
    //   feesCollected: 500,
    //   salaryGiven: 500

    // };
    // return of(data);
  }
}

// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { DashboardData, MonthCount } from '../models/dashboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
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
                {{ change.month }}: Added {{ change.count }}
              </div>
              <div *ngFor="let change of dashboardData.studentRemovedLast5Months">
                {{ change.month }}: Removed {{ change.count }}
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

  constructor(private dashboardService: DashboardService, private snackBar: MatSnackBar) {}

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

// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <mat-grid-list cols="2" rowHeight="2:1">
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Students</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ totalStudents }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Total Fees</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            {{ totalFees }}
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile colspan="2">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Student Changes (Last 5 Months)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngFor="let change of monthlyStudentChanges">
              {{ change.month }}: Added {{ change.added }}, Removed {{ change.removed }}
            </div>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Fees Collected (Last 5 Months)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngFor="let fee of monthlyFeesCollected">
              {{ fee.month }}: {{ fee.amount }}
            </div>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
      <mat-grid-tile>
        <mat-card>
          <mat-card-header>
            <mat-card-title>Salary Given (Last 5 Months)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngFor="let salary of monthlySalaryGiven">
              {{ salary.month }}: {{ salary.amount }}
            </div>
          </mat-card-content>
        </mat-card>
      </mat-grid-tile>
    </mat-grid-list>
  `,
})
export class DashboardComponent implements OnInit {
  totalStudents: number = 0;
  totalFees: number = 0;
  monthlyStudentChanges: { month: string; added: number; removed: number }[] = [];
  monthlyFeesCollected: { month: string; amount: number }[] = [];
  monthlySalaryGiven: { month: string; amount: number }[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.totalStudents = data.totalStudents;
      this.totalFees = data.totalFees;
      this.monthlyStudentChanges = data.monthlyStudentChanges;
      this.monthlyFeesCollected = data.monthlyFeesCollected;
      this.monthlySalaryGiven = data.monthlySalaryGiven;
    });
  }
}