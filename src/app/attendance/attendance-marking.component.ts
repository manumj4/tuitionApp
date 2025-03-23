import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttendanceService } from './attendance.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatSpinnerModule } from '@angular/material/progress-spinner';
import { Attendance, Student } from '../models/attendance';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-attendance-marking', 
  templateUrl: './attendance-marking.component.html',
  styleUrls: ['./attendance-marking.component.css'],
  standalone:true,
  imports:[CommonModule,MatTableModule,MatButtonModule,MatButtonToggleModule,MatSpinnerModule,MatSnackBarModule,MatFormFieldModule,MatDatepickerModule,MatNativeDateModule]
})
export class AttendanceMarkingComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'std','status'];
  dataSource = new MatTableDataSource<Student>([]);
  selectedDate: Date = new Date();
  isLoading = false;
  private subscriptions: Subscription[] = [];
  private attendanceService = inject(AttendanceService);
  private _snackBar=inject(MatSnackBar);

  ngOnInit(): void {
    this.loadAttendance();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
  loadAttendance() {
    this.isLoading = true;
    const sub = this.attendanceService.getStudentsForAttendance().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const students: Student[] = res.map((student) => ({
            studentId: student.studentId, 
            name: student.name, // Assuming 'name' is the student's name
            std: student.std, // Assuming 'standard' is the student's standard
            status: 'absent' // Default status for new students

          }));
          this.dataSource.data = students;
        }
        this.isLoading = false;
        this.loadAttendanceByDate()
      },
      error: (error) => {
        console.error('Error fetching student for attendance:', error);
        this.dataSource.data = [];
      
      },      
      ()=>{
        this.isLoading = false;
      }
    );
    this.subscriptions.push(sub)
  }
  loadAttendanceByDate() {
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    this.isLoading = true;
    const sub = this.attendanceService.getAttendanceByDate(formattedDate).subscribe({
      next: (attendanceRecords) => {
        if (attendanceRecords && attendanceRecords.length > 0) {
          
          this.dataSource.data.forEach(student => {
            student.status = 'absent'
          });
          attendanceRecords.forEach(attendance => {
            const student = this.findStudent(attendance.studentId);
            if (student) {   
              
               console.log(attendance.status)           
               
              student.status = attendance.status;
            }
          });
        } else {
          this.dataSource.data.forEach(student => student.status = 'absent');
        }
        
        this.dataSource.data = [...this.dataSource.data];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching attendance by date:', error);
        // Optionally handle error by showing a message to the user
        this._snackBar.open('Error fetching attendance for selected date', 'Close', { duration: 3000 });
      },
      ()=>{
        this.isLoading = false;
      }
    });
    this.subscriptions.push(sub);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value as Date;
    
    
    this.loadAttendanceByDate();
  }
  
  markAttendance(element: Student, status: 'present' | 'absent' ) {
    const student = this.findStudent(element.studentId,);
    if (student) {
      student.status = status;
    }
  }

  saveAttendance() {
    const formattedDate = this.selectedDate.toISOString().split('T')[0];
    const attendanceData = this.dataSource.data.map(item => ({
      studentId: item.studentId,
      status: item.status,
      date: formattedDate,
    }));
    if(attendanceData.length > 0 ){
      this.isLoading = true;
      console.log(attendanceData)
      const sub = this.attendanceService.saveAttendance(attendanceData).subscribe(
        (res:any) => {
          console.log(res)
          if(res && res.message === 'success'){
            this._snackBar.open('Attendance saved successfully', 'Close', {
              duration: 3000,
            });            
            this.loadAttendance();
          } else {
            this._snackBar.open('Error saving attendance', 'Close', {
              duration: 3000,
            });
          }
          
        },
        (error) => {
          this._snackBar.open('Error saving attendance', 'Close', {
            duration: 3000,
          });
          console.error('Error saving attendance:', error);
        },()=>{
          this.isLoading=false
        }
      );
      this.subscriptions.push(sub)
    }else {
      this._snackBar.open('No data to save', 'Close', {
        duration: 3000,
      });
    }
  }
  private findStudent(studentId: number): Student | undefined {
    const student = this.dataSource.data.find(student => student.studentId === studentId);
    return student

  }
}




```
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Student {
  studentId: number;
  name: string;
  std: string;
}
interface AttendanceRecord{
  studentId: number;
  status: string;
  date: Date;
}
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'YOUR_BACKEND_API_URL'; 

  constructor(private http: HttpClient) { }

  getStudentsForAttendance(date: Date): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/students`);
  }
  saveAttendance(attendanceData:AttendanceRecord[]):Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance`,attendanceData);
  }
}
```
```html
<div class="container">
  <mat-card>
    <mat-card-header>
      <mat-card-title>Attendance Marking</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <div class="date-picker">
        <mat-form-field>
          <mat-label>Choose a date</mat-label>
          <input matInput [matDatepicker]="picker" (dateChange)="onDateChange($event)" [value]="selectedDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <div *ngIf="isLoading" class="loading-spinner">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!isLoading">
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>

          <ng-container matColumnDef="std">
            <th mat-header-cell *matHeaderCellDef> Standard </th>
            <td mat-cell *matCellDef="let element"> {{element.std}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <mat-button-toggle-group #group="matButtonToggleGroup" [value]="element.status">
                <mat-button-toggle value="present" (click)="markAttendance(element, 'present')">Present</mat-button-toggle>
                <mat-button-toggle value="absent" (click)="markAttendance(element, 'absent')">Absent</mat-button-toggle>
              </mat-button-toggle-group>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <button mat-raised-button color="primary" (click)="saveAttendance()">Save Attendance</button>
      </div>
    </mat-card-content>
  </mat-card>
</div>