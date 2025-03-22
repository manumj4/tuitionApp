import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSelectChange} from '@angular/material/select';
import {FeesService} from '../fees-collection/fees-collection.service';
import {Fee} from "../models/fee";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-fees-collection',
  templateUrl: './fees-collection.component.html',
  styleUrls: ['./fees-collection.component.css']
})
export class FeesCollectionComponent implements OnInit{
  displayedColumns: string[] = ['studentName', 'fees', 'paid'];
  dataSource: MatTableDataSource<Fee>;
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  selectedMonth: string;

  constructor(private feesService: FeesService) {
    this.dataSource = new MatTableDataSource<Fee>([]);
    this.selectedMonth = this.getCurrentMonth();
  }

  ngOnInit():void {
    this.loadStudentFees(this.selectedMonth);
  }

  loadStudentFees(month:string):void {
    this.feesService.getFeesByMonth(month).subscribe(
      (response) => {
        this.dataSource.data = response.data;
      },
      (error) => {console.error('Error loading student fees', error);
        this.showErrorMessage("Error loading fees data")
      }
    );
  }

  onMonthChange(event:MatSelectChange):void {
    this.selectedMonth = event.value;
    this.loadStudentFees(this.selectedMonth);
  }

  markAsPaid(student:Fee):void {
    this.feesService.markFeeAsPaid(student.studentId, this.selectedMonth, !student.paid).subscribe(
      (response) => {
        if (response.status === "success") {
          this.loadStudentFees(this.selectedMonth)
          this.showSuccessMessage("fees Updated Success")
        } else {
          this.showErrorMessage("Failed to update");
          this.loadStudentFees(this.selectedMonth);
        }

      },
      (error) => {console.error('Error updating student fee', error);
        this.showErrorMessage("Failed to update the fees status")
        this.loadStudentFees(this.selectedMonth);
      }
    );
  }

  getCurrentMonth():string {
    const today = new Date();
    const monthIndex = today.getMonth();
    return this.months[monthIndex];
  }
  showSuccessMessage(message: string): void {
    alert(message);
  }
  showErrorMessage(message: string): void {
    alert(message)
  }
}