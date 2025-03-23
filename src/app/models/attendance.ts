export type Status = 'present' | 'absent';

export interface Student {
    studentId: number;
    name: string;
    std: string;
    date?:Date;
    status: Status;
}

// export interface StudentAttendance {
//     studentId: string;
//     status: Status;
// }

export interface Attendance {
    studentId: number;
    
    date: Date;
    status: Status;
}