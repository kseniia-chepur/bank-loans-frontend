import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { LoanService } from '../../services/loan.service';
import { ILoan } from '../../../interfaces/loan.interface';
import { ILoanType } from '../../../interfaces/loantype.interface';
import { IClient } from '../../../interfaces/client.interface';
import { ClientService } from '../../../client/services/client.service';
import { LoantypeService } from '../../../loantype/services/loantype.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss',
})
export class LoanFormComponent implements OnInit {
  private clientService = inject(ClientService);
  private loanTypeService = inject(LoantypeService);
  private loanService = inject(LoanService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    loanType: this.fb.control<string | null | ILoanType>(null, {
      validators: [Validators.required],
    }),
    client: this.fb.control<string | null | IClient>(null, {
      validators: [Validators.required],
    }),
    amount: this.fb.control(0, {
      validators: [
        Validators.required,
        Validators.min(100000),
        Validators.max(10000000),
      ],
    }),
    parts: this.fb.control(1, {
      validators: [Validators.min(1), Validators.max(20)],
    }),
    dateRepaid: this.fb.control(new Date()),
  });

  clients: IClient[] = [];
  loantypes: ILoanType[] = [];
  loanId: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.fetchClients();
    this.fetchLoanTypes();

    this.route.paramMap.subscribe((params) => {
      this.loanId = params.get('id');
      if (this.loanId) {
        this.loanService.getLoanById(this.loanId).subscribe({
          next: (response) => {
            const loan = response.loan;
            this.form.patchValue({
              loanType: loan.loanType?._id,
              client: loan.client?._id,
              amount: loan.amount,
              parts: loan.parts,
              dateRepaid: loan.dateRepaid || null,
            });
            this.form.get('loanType')?.disable();
            this.form.get('client')?.disable();
            this.form.get('amount')?.disable();
            this.form.get('parts')?.disable();
          },
          error: (error) => {
            this.error = error.message;
          },
        });
      } else {
        this.form.get('dateRepaid')?.disable();
      }
    });
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        this.clients = response.clients;
      },
      error: (error) => {
        console.error('Error fetching clients', error);
      },
    });
  }

  fetchLoanTypes(): void {
    this.loanTypeService.getLoantypes().subscribe({
      next: (response) => {
        this.loantypes = response['loan types'];
      },
      error: (error) => {
        console.error('Error fetching loan types', error);
      },
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.loanId) {
        const loanData: Date = this.form.value.dateRepaid!;
        this.loanService.updateLoan(this.loanId, loanData).subscribe({
          next: () => {
            this.router.navigate(['/loans', this.loanId]);
          },
          error: (error) => {
            this.error = error.message;
          },
        });
      } else {
        const formValue = this.form.value;
        const loanData: Partial<ILoan> = {
          loanType: formValue.loanType! as ILoanType,
          client: formValue.client! as IClient,
          amount: formValue.amount!,
          parts: formValue.parts!,
          dateRepaid: formValue.dateRepaid || undefined,
        };
        delete loanData.dateRepaid;
        this.loanService.createLoan(loanData).subscribe({
          next: (data) => {
            this.router.navigate(['/loans', data.loan._id]);
          },
          error: (error) => {
            this.error = error.message;
          },
        });
      }
    }
  }
}
