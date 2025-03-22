import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../app.config';
import { DashboardData } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'api/dashboard'; // API URL will be updated later
  private baseUrl = BASE_URL;
  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<DashboardData> {
    const url = `${this.baseUrl}/${this.apiUrl}`
    return this.http.get<DashboardData>(url);
  }
  // getTotalStudents(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/total-students`); 
  // }

  // getTotalFees(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/total-fees`); 
  // }

  // getStudentAddRemoveLast5Months(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/student-add-remove-last-5-months`); 
  // }

  // getFeesCollectedLast5Months(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/fees-collected-last-5-months`); 
  // }

}