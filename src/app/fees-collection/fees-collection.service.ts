import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class FeesCollectionService {
  private apiUrl = 'api/fees'; // API URL for fees

  constructor(private http: HttpClient) { }
  getFeesDataByMonth(month: string): Observable<any[]> {
    const url = `${BASE_URL}/${this.apiUrl}?month=${month}`;
    return this.http.get<any[]>(url);
  }

  markAsPaid(studentId: string, month: string, paid: boolean): Observable<any> {
    const url = `${BASE_URL}/${this.apiUrl}`;
    return this.http.post<any>(url, { studentId, month, paid });
  }

  getAllDefaultStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}/${this.apiUrl}/allStudents`);
  }
}