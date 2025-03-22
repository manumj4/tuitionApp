import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService } from './attendance.service';
import { Attendance } from '../models/attendance';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

interface StudentAttendance {
  studentId: string;
  name: string;
  
  status: 'present' | 'absent' | '';
  date: string;
}

@Component({
  selector: 'app-attendance-marking',
  templateUrl: './attendance-marking.component.html',
  styleUrls: ['./attendance-marking.component.css']
})
export class AttendanceMarkingComponent implements OnInit,OnDestroy {
  displayedColumns: string[] = ['name', 'status'];
  dataSource = new MatTableDataSource<StudentAttendance>([]);
  selectedDate: Date = new Date();
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  constructor(private attendanceService: AttendanceService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadAttendance();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>sub.unsubscribe())
  }
  loadAttendance() {
    this.isLoading = true;
    const sub= this.attendanceService.getAttendanceByDate(this.selectedDate.toISOString().split('T')[0]).subscribe(
      (res) => {
       if(res && res.data){
        this.dataSource.data = res.data.map(student => ({
          studentId: student.studentId,
          name: student.studentName,
          status: student.status,
          date: student.date
        }));
       } else {
        this.dataSource.data=[]
       }
        
      },
      (error) => {
        this._snackBar.open('Error fetching students for attendance', 'Close', {
          duration: 3000,
        });
        console.error('Error fetching student for attendance:', error);
      },
      ()=>{
        this.isLoading = false;
      }
    );
    this.subscriptions.push(sub)
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value || new Date();
    this.loadAttendance();
  }
  findStudent(studentId:string){
    return this.dataSource.data.find(e=>e.studentId===studentId)
  }
  markAttendance(element: StudentAttendance, status: 'present' | 'absent') {
    const student=this.findStudent(element.studentId);
    if(student){
      student.status = status;
    }
    
  }

  saveAttendance() {
    const attendanceData = this.dataSource.data.map(item => ({
      studentId: item.studentId,
      status: item.status,
      date: this.selectedDate.toISOString().split('T')[0],
    })).filter(item => item.status !== '');
    if(attendanceData.length > 0 ){
      this.isLoading = true;
      const sub= this.attendanceService.saveAttendance(attendanceData).subscribe(
        (res) => {
          if(res && res.status === 'success'){
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
  presentAbsent(status:any){
    if(status === 'present'){
      return true
    } else if (status === 'absent'){
      return false
    } else {
      return null
    }
    
    
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