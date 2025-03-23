import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StudentMasterService } from '../student-master/student-master.service';
import { Student} from '../models/student';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
  standalone: true,
  imports: [MatTableModule, MatInputModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatDialogModule,CommonModule]
})
export class StudentListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'std', 'mobile', 'fees', 'dateOfJoining','actions'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>([]);
  
  private destroyed$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private studentService: StudentMasterService,public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getStudents();    
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getStudents(): void {
    this.studentService.getStudents().pipe(takeUntil(this.destroyed$)).subscribe({
      next:(response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(error)=>{
        this.showSnackBar('Error in fetching student list', 'Close');

      }
    });
  } 
  openAddStudentDialog() {
    
  }

  applyFilter(event: Event) {
    this.dataSource.filterPredicate = (data: Student, filter: string) => data.name.toLowerCase().includes(filter);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  applyFilterByStd(event: Event) {   
    this.dataSource.filterPredicate = (data: Student, filter: string) => data.std.toLowerCase().includes(filter);
    const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }  

  showSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
```
```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from './student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [
    { name: 'John Doe', std: '1', mobile: '1234567890', fees: 1000, dateOfJoining: new Date() },
    { name: 'Jane Smith', std: '2', mobile: '9876543210', fees: 1200, dateOfJoining: new Date() },
    { name: 'Peter Jones', std: '1', mobile: '1122334455', fees: 1100, dateOfJoining: new Date() },
    { name: 'Alice Brown', std: '3', mobile: '9988776655', fees: 1300, dateOfJoining: new Date() },
    { name: 'Bob Wilson', std: '2', mobile: '5544332211', fees: 1250, dateOfJoining: new Date() },
    { name: 'Carol Davis', std: '4', mobile: '4433221100', fees: 1400, dateOfJoining: new Date() },
    { name: 'David Garcia', std: '3', mobile: '6677889900', fees: 1350, dateOfJoining: new Date() },
    { name: 'Eva Martinez', std: '5', mobile: '3322110099', fees: 1500, dateOfJoining: new Date() },
    { name: 'Frank Rodriguez', std: '4', mobile: '7766554433', fees: 1450, dateOfJoining: new Date() },
    { name: 'Grace Williams', std: '6', mobile: '2233445566', fees: 1600, dateOfJoining: new Date() },
    { name: 'Harry Anderson', std: '5', mobile: '8899001122', fees: 1550, dateOfJoining: new Date() },
    { name: 'Isabella Thomas', std: '7', mobile: '1100998877', fees: 1700, dateOfJoining: new Date() },
    { name: 'Jack Jackson', std: '6', mobile: '9900112233', fees: 1650, dateOfJoining: new Date() },
    { name: 'Katie White', std: '8', mobile: '5566778899', fees: 1800, dateOfJoining: new Date() },
    { name: 'Liam Harris', std: '7', mobile: '3344556677', fees: 1750, dateOfJoining: new Date() }
  ];

  constructor() { }

  getStudents(): Observable<Student[]> {
    return of(this.students);
  }
}
```
```typescript
export interface Student {
    name: string;
    std: string;
    mobile: string;
    fees: number;
    dateOfJoining: Date;
  }
```
```html
<div class="container">
    <mat-form-field>
        <mat-label>Filter</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Mia" #input>
    </mat-form-field>
    <mat-form-field>
        <mat-label>Filter by STD</mat-label>
        <input matInput (keyup)="applyFilterByStd($event)" placeholder="Ex. 10" #inputStd>
    </mat-form-field>
    <div class="mat-elevation-z8">
        <table mat-table [dataSource]="dataSource" matSort>
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
                <td mat-cell *matCellDef="let row"> {{row.name}} </td>
            </ng-container>
            <ng-container matColumnDef="std">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Std </th>
                <td mat-cell *matCellDef="let row"> {{row.std}} </td>
            </ng-container>
            <ng-container matColumnDef="mobile">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Mobile </th>
                <td mat-cell *matCellDef="let row"> {{row.mobile}} </td>
            </ng-container>
            <ng-container matColumnDef="fees">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Fees </th>
                <td mat-cell *matCellDef="let row"> {{row.fees}} </td>
            </ng-container>
            <ng-container matColumnDef="dateOfJoining">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> Date of Joining </th>
                <td mat-cell *matCellDef="let row"> {{row.dateOfJoining | date:'mediumDate'}} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            <tr class="mat-row" *matNoDataRow>
                <td class="mat-cell" colspan="4">No data matching the filter "{{input.value}}"</td>
            </tr>
        </table>
        <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of users"></mat-paginator>
    </div>
</div>
```
```css
.container {
    margin: 20px;
}

table {
    width: 100%;
}

.mat-form-field {
    font-size: 14px;
    width: 30%;
}

td,
th {
    width: 25%;
}