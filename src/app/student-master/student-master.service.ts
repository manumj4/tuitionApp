import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { BASE_URL } from '../app.config';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root',
})
export class StudentMasterService {  
  private apiUrl = `${BASE_URL}/api/student`;

  constructor(private http: HttpClient) {}

  getStudents(): Observable<{ data: Student[] }> {    
    return this.http.get<{ data: Student[] }>(this.apiUrl).pipe(
      map(response => response)
    );
  }

  filterStudents(students: { data: Student[] }, name: string, std: number): Observable<{ data: Student[] }> {
    if (!name && !std) {
      return of(students)
    }
    const filteredStudents = students.data.filter(student => {
      const nameMatch = name ? student.name.toLowerCase().includes(name.toLowerCase()) : true
      const stdMatch = std ? student.std === std : true
      return nameMatch && stdMatch
    })
    return of({data:filteredStudents})
  }

  addStudent(studentDetails: Student): Observable<{ data: Student[] }> {   
    return this.http.post<{ data: Student[] }>(this.apiUrl, studentDetails).pipe(
      map(response => response)
    );
  }

}