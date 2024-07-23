import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { ILoan } from '../../../interfaces/loan.interface';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.scss',
})
export class LoanDetailsComponent implements OnInit {
  private loanService = inject(LoanService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loan: ILoan | null = null;
  id: string = '';
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.getLoanById();
      }
    });
  }

  getLoanById(): void {
    this.loanService.getLoanById(this.id).subscribe({
      next: (data) => (this.loan = data.loan),
      error: (error) => (this.error = error.message),
    });
  }

  updateLoan(loanData: Partial<ILoan>): void {
    this.loanService.updateLoan(this.id, loanData).subscribe({
      next: (data) => (this.loan = data.loan),
      error: (error) => (this.error = error.message),
    });
  }

  editLoan(): void {
    if (this.loan) {
      this.router.navigate([`/loantypes/edit/${this.loan._id}`]);
    }
  }

  deleteLoan(): void {
    this.loanService.deleteLoan(this.id).subscribe({
      next: () => {
        this.loan = null;
        this.router.navigateByUrl('/loans');
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
