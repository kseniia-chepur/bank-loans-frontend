import { Component, inject, OnInit } from '@angular/core';
import { LoantypeService } from '../../services/loantype.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ErrorMsg } from '../../../enums/errorMsg.enum';
import { LoanTypes } from '../../../enums/loanTypes.enum';
import { ILoanType } from '../../../interfaces/loantype.interface';

@Component({
  selector: 'app-loantype-form',
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
  templateUrl: './loantype-form.component.html',
  styleUrl: './loantype-form.component.scss',
})
export class LoantypeFormComponent implements OnInit {
  private loantypeService = inject(LoantypeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: this.fb.control('', {
      validators: [Validators.required],
    }),
    conditions: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    rate: this.fb.control(3, {
      validators: [Validators.required, Validators.min(3), Validators.max(40)],
    }),
    term: this.fb.control(6, {
      validators: [Validators.required, Validators.min(6), Validators.max(60)],
    }),
  });

  loantypes = LoanTypes;
  loantypeId: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.loantypeId = params.get('id');
      if (this.loantypeId) {
        this.loantypeService.getLoantypeById(this.loantypeId).subscribe({
          next: (response) => {
            this.form.patchValue(response['loan type']);
            this.form.get('name')?.disable();
          },
          error: (error) => {
            console.error(ErrorMsg.FAILED_TO_FETCH, error);
          },
        });
      }
    });
  }

  onSubmit(): void {
    const loantypeData: Partial<ILoanType> = this.form.getRawValue();
    if (this.loantypeId) {
      delete loantypeData.name;
      this.loantypeService
        .updateLoantype(this.loantypeId, loantypeData)
        .subscribe({
          next: () => {
            this.router.navigate(['/loantypes', this.loantypeId]);
          },
          error: (error) => {
            this.error = error.message;
          },
        });
    } else {
      this.loantypeService.createLoantype(loantypeData).subscribe({
        next: (data) => {
          this.router.navigate(['/loantypes', data['loan type']._id]);
        },
        error: (error) => {
          this.error = error.message;
        },
      });
    }
  }
}

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
