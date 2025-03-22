export interface DashboardData {
  totalStudents: number;
  totalFees: number;
  studentsAddedLast5Months: { month: string; count: number }[];
  studentRemovedLast5Months: { month: string; count: number }[];
  feesCollected: number;
  salaryGiven: number;
}