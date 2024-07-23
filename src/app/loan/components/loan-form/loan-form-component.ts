import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ErrorMsg } from '../../../enums/errorMsg.enum';
import { LoanService } from '../../services/loan.service';
import { ILoan } from '../../../interfaces/loan.interface';
import { ILoanType } from '../../../interfaces/loantype.interface';
import { IClient } from '../../../interfaces/client.interface';
import { ClientService } from '../../../client/services/client.service';
import { LoantypeService } from '../../../loantype/services/loantype.service';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
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
    loanType: this.fb.control('', {
      validators: [Validators.required],
    }),
    client: this.fb.control('', {
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
    dateRepaid: this.fb.control(''),
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
            this.form.patchValue(response.loan);
            // this.form.get('name')?.disable();
          },
          error: (error) => {
            console.error(ErrorMsg.FAILED_TO_FETCH, error);
          },
        });
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
      const loanData: Partial<ILoan> = this.cleanFormData(this.form.value);

      if (this.loanId) {
        this.loanService.updateLoan(this.loanId, loanData).subscribe({
          next: () => {
            this.router.navigate(['/loans', this.loanId]);
          },
          error: (error) => {
            this.error = error.message;
            console.error('Error updating loan', error);
          },
        });
      } else {
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

  private cleanFormData(formData: any): Partial<ILoan> {
    const cleanedData: Partial<ILoan> = { ...formData };
    if (cleanedData.dateRepaid === '') {
      delete cleanedData.dateRepaid;
    }
    return cleanedData;
  }
}

// ngOnInit(): void {
//   this.route.paramMap.subscribe((params) => {
//     this.loanId = params.get('id');
//     if (this.loanId) {
//       this.loanService.getLoanById(this.loanId).subscribe({
//         next: (response) => {
//           this.form.patchValue(response.loan);
//           // this.form.get('name')?.disable();
//         },
//         error: (error) => {
//           console.error(ErrorMsg.FAILED_TO_FETCH, error);
//         },
//       });
//     }
//   });
// }

// onSubmit(): void {
//   const loanData: Partial<ILoan> = this.form.getRawValue();
//   if (this.loanId) {
//     // delete loantypeData.name;
//     this.loanService.updateLoan(this.loanId, loanData).subscribe({
//       next: () => {
//         this.router.navigate(['/loans', this.loanId]);
//       },
//       error: (error) => {
//         this.error = error.message;
//       },
//     });
//   } else {
//     this.loanService.createLoan(loanData).subscribe({
//       next: (data) => {
//         this.router.navigate(['/loans', data.loan._id]);
//       },
//       error: (error) => {
//         this.error = error.message;
//       },
//     });
//   }
// }

//   onSubmit(): void {
//     let loantypeData: Partial<ILoanyType> = this.form.getRawValue();
//     if (this.loantypeId) {
//       delete loantypeData.name;
//         this.loantypeService.updateLoantype(this.loantypeId, loantypeData).subscribe({
//         next: () => {
//           this.router.navigate(['/loantypes', this.loantypeId]);
//         },
//         error: (error) => {
//           this.error = error.message;
//         },
//       });
//     } else {
//       this.loantypeService.createLoantype(loantypeData).subscribe({
//         next: (data) => {
//           this.router.navigate(['/loantyes', this.loantypeId]);
//         },
//         error: (error) => {
//           this.error = error.message;
//         },
//       });
//     }
//   }
// }
