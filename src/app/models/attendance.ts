export type Status = 'present' | 'absent';

export interface Student {
    studentId: number;
    name: string;
    std: string;
    
    status: Status;
}

export interface AttendanceRecord{
    studentId: number;
    date: string;
    status:Status;
}
