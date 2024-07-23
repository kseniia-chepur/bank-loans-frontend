import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ILoan } from '../../../interfaces/loan.interface';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './loan-list.component.html',
  styleUrl: './loan-list.component.scss',
})
export class LoanListComponent implements OnInit {
  private loanService = inject(LoanService);

  loans: ILoan[] = [];

  displayedColumns: string[] = [
    '_id',
    'loanType',
    'client',
    'amount',
    'dateIssued',
    'dueDate',
    'dateRepaid',
    'parts',
    'fineAmount',
    'details',
  ];
  error: string | null = null;

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans(): void {
    this.loanService.getLoans().subscribe({
      next: (response) => {
        this.loans = response.loans;
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
