import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../app.config';
import { DashboardData } from '../models/dashboard';

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${BASE_URL}/api/dashboard`);
  }
}