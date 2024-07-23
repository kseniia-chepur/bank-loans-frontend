import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { IClient } from '../../../interfaces/client.interface';
import { CommonModule } from '@angular/common';
import { Regex } from '../../../enums/regex.enum';
import { Ownership } from '../../../enums/ownership.enum';
import { ErrorMsg } from '../../../enums/errorMsg.enum';

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
export class ClientFormComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
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
      validators: [Validators.required, Validators.pattern(Regex.PHONE_NUMBER)],
    }),
    contactPerson: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  ownership = Ownership;
  clientId: string | null = null;
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.clientId = params.get('id');
      if (this.clientId) {
        this.clientService.getClientById(this.clientId).subscribe({
          next: (response) => {
            this.form.patchValue(response.client);
            this.form.get('name')?.disable();
            this.form.get('ownership')?.disable();
          },
          error: (error) => {
            console.error(ErrorMsg.FAILED_TO_FETCH, error);
          },
        });
      }
    });
  }

  onSubmit(): void {
    let clientData: Partial<IClient> = { ...this.form.getRawValue() };
    if (this.clientId) {
      delete clientData.name;
      delete clientData.ownership;
      this.clientService.updateClient(this.clientId, clientData).subscribe({
        next: () => {
          this.router.navigate(['/clients', this.clientId]);
        },
        error: (error) => {
          this.error = error.message;
        },
      });
    } else {
      this.clientService.createClient(clientData).subscribe({
        next: (data) => {
          this.router.navigate(['/clients', data.client._id]);
        },
        error: (error) => {
          this.error = error.message;
        },
      });
    }
  }
}
