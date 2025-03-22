// src/app/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { DashboardService } from './dashboard.service';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: DashboardComponent },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatGridListModule,
    HttpClientModule,
  ],
  providers: [DashboardService],
  exports: [DashboardComponent],
})
export class DashboardModule {}

// src/app/student-master/student-master.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentMasterComponent } from './student-master.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { StudentMasterService } from './student-master.service';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: StudentMasterComponent },
];

@NgModule({
  declarations: [StudentMasterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [StudentMasterService],
  exports: [StudentMasterComponent],
})
export class StudentMasterModule {}

// src/app/fees-collection/fees-collection.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeesCollectionComponent } from './fees-collection.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeesCollectionService } from './fees-collection.service';
import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  { path: '', component: FeesCollectionComponent },
];

@NgModule({
  declarations: [FeesCollectionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    HttpClientModule
  ],
  providers: [FeesCollectionService],
  exports: [FeesCollectionComponent],
})
export class FeesCollectionModule {}

// src/app/attendance/attendance.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceComponent } from './attendance.component';
import { RouterModule, Routes } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { AttendanceService } from './attendance.service';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: AttendanceComponent },
];

@NgModule({
  declarations: [AttendanceComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatRadioModule,
    HttpClientModule
  ],
  providers: [AttendanceService],
  exports: [AttendanceComponent],
})
export class AttendanceModule {}