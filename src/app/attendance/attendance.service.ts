import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance';
import { BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'api/attendance'; // Replace with actual API URL later

  constructor(private http: HttpClient) { }

  /**
   * Fetches attendance data for a specific date.
   * @param date The date for which to retrieve attendance.
   * @returns Observable containing attendance data.
   */
  getAttendanceByDate(date: string): Observable<{ data: Attendance[] }> {    
    return this.http.get<{ data: Attendance[] }>(`${BASE_URL}/api/attendance?date=${date}`);
  }

  /**
   * Marks attendance for a list of students.
   */
  markAttendance(attendanceData: Attendance[]): Observable<{ status: string }> {

    return this.http.post<{ status: string }>(`${BASE_URL}/api/attendance`, attendanceData);
  }
}