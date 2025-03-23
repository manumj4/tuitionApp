import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Attendance } from '../models/attendance';
import { BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches attendance data for a specific date.
   * @param date The date for which to retrieve attendance.
   * @returns Observable containing attendance data.
   **/
  getAttendanceByDate(date: string): Observable<Attendance[]> {
    return this.http.get<any[]>(`${BASE_URL}/api/attendance?date=${date}`).pipe(
      map(attendances => attendances.map(attendance => ({
        ...attendance, date: attendance.date
      })))
    );
  }
  /**
   * Fetches student data.
   * @returns Observable containing student data.
   **/
  getStudentsForAttendance(): Observable<any> {
    return this.http.get(`${BASE_URL}/api/students`);
  }

  /**
   * Saves attendance for a list of students.
   */
  saveAttendance(attendanceData: { studentId: number, status: 'present' | 'absent' , date:string}): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${BASE_URL}/api/attendance`, attendanceData);
  }


}