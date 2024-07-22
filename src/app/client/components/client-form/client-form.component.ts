import { Component, inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { IClient } from '../../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import { Regex } from '../../../enums/regex.enum';
import { Ownership } from '../../../enums/ownership.enum';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    ownership: this.fb.control('', {
      validators: [Validators.required],
    }),
    address: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    phone: this.fb.control('', {
      validators: [
        Validators.required,
        Validators.pattern(Regex.PHONE_NUMBER),
      ],
    }),
    contactPerson: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  ownership = Ownership;
  error: string | null = null;

  onSubmit(): void {
    if (this.form.valid) {
      const clientData: Partial<IClient> = this.form.value;
      this.clientService.createClient(clientData).subscribe({
        next: () => {
          this.router.navigateByUrl('/clients');
        },
        error: (error) => {
          this.error = error.message;
        },
      });
    }
  }
}
