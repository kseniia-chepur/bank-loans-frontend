import { Component, inject, OnInit } from '@angular/core';
import { IClient } from '../../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss',
})
export class ClientDetailsComponent implements OnInit {
  private clientService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  client: IClient | null = null;
  id: string = '';
  error: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.getClientById();
      }
    });
  }

  getClientById(): void {
    this.clientService.getClientById(this.id).subscribe({
      next: (data) => (this.client = data.client),
      error: (error) => (this.error = error.message),
    });
  }

  updateClient(clientData: Partial<IClient>): void {
    this.clientService.updateClient(this.id, clientData).subscribe({
      next: (data) => (this.client = data.client),
      error: (error) => (this.error = error.message),
    });
  }

  deleteClient(): void {
    this.clientService.deleteClient(this.id).subscribe({
      next: () => {
        this.client = null;
        this.router.navigateByUrl('/clients');
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
