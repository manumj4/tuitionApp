export interface Attendance {
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent';
}