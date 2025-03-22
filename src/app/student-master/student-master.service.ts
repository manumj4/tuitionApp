import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BASE_URL } from '../app.config';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root',
})
export class StudentMasterService {
  private apiUrl = '/api/student'; // API URL for student operations
  private baseUrl = BASE_URL;
  constructor(private http: HttpClient) { }
  getStudents(): Observable<{ data: Student[] }> {
    const url = `${this.baseUrl}${this.apiUrl}`;
    return this.http.get<{ data: Student[] }>(url); // Gets all students
  }

  filterStudents(students: Student[], name: string, std: string): Observable<Student[]> {
    if (!name && !std) {
      return of(students);
    }
    return of(students.filter(student => {
      const nameMatch = name ? student.name.toLowerCase().includes(name.toLowerCase()) : true;
      const stdMatch = std ? student.std === Number(std) : true;
      return nameMatch && stdMatch;
    }));
  }

  addStudent(studentDetails: { name: string, std: number, subject: string, mobile: string, fees: number }): Observable<{ status: string }> {    
    const url = `${this.baseUrl}${this.apiUrl}`;
    return this.http.post<{ status: string }>(url, studentDetails); // Adds a new student
  }
}







@Injectable({
    providedIn: 'root',
})
export class StudentMasterService {
    private apiUrl = '/api/student'; // API URL for student operations

    constructor(private http: HttpClient) { }

    setApiUrl(url: string) {
        this.apiUrl = url;
    }
    getStudents(): Observable<{ data: Student[] }> {
        if (!this.apiUrl.includes("api/student")) {
            return throwError(() => new Error("Api Url not set Properly"));
        }
        return this.http.get<{ data: Student[] }>(this.apiUrl); // Gets all students
  }

  filterStudents(students: Student[], name: string, std: string): Observable<Student[]> {
    if (!name && !std) {
      return of(students);
    }

    return of(students.filter(student => {
      const nameMatch = name ? student.name.toLowerCase().includes(name.toLowerCase()) : true;
      const stdMatch = std ? student.std.toLowerCase().includes(std.toLowerCase()) : true;
      return nameMatch && stdMatch;
    }));
  }

  addStudent(studentDetails: { name: string, std: number, subject: string, mobile: string, fees: number }): Observable<{ status: string }> {
    if (!this.apiUrl.includes("api/student")) {
        return throwError(() => new Error("Api Url not set Properly"));
    }
    return this.http.post<{ status: string }>(this.apiUrl, studentDetails); // Adds a new student
  }
}*/