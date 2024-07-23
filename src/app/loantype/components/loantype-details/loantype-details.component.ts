import { Component, inject, OnInit } from '@angular/core';
import { LoantypeService } from '../../services/loantype.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ILoanType } from '../../../interfaces/loantype.interface';

@Component({
  selector: 'app-loantype-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './loantype-details.component.html',
  styleUrl: './loantype-details.component.scss',
})
export class LoantypeDetailsComponent implements OnInit {
  private loantypeService = inject(LoantypeService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loantype: ILoanType | null = null;
  id: string = '';
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.getLoantypeById();
      }
    });
  }

  getLoantypeById(): void {
    this.loantypeService.getLoantypeById(this.id).subscribe({
      next: (data) => (this.loantype = data['loan type']),
      error: (error) => (this.error = error.message),
    });
  }

  updateLoantype(loantypeData: Partial<ILoanType>): void {
    this.loantypeService.updateLoantype(this.id, loantypeData).subscribe({
      next: (data) => (this.loantype = data['loan type']),
      error: (error) => (this.error = error.message),
    });
  }

  editLoantype(): void {
    if (this.loantype) {
      this.router.navigate([`/loantypes/edit/${this.loantype._id}`]);
    }
  }

  deleteLoantype(): void {
    this.loantypeService.deleteLoantype(this.id).subscribe({
      next: () => {
        this.loantype = null;
        this.router.navigateByUrl('/loantypes');
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
