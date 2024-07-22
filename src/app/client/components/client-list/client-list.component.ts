import { Component, inject, OnInit } from '@angular/core';
import { IClient } from '../../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ClientDetailsComponent } from "../client-details/client-details.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, ClientDetailsComponent, RouterLink],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.scss',
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);

  clients: IClient[] = [];
  displayedColumns: string[] = ['_id', 'name', 'ownership', 'address', 'phone', 'contactPerson', 'Details'];
  error: string | null = null;

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService
      .getClients()
      .subscribe({
        next: (response) => {
          this.clients = response.clients;
        },
        error: (error) => {
          this.error = error.message;
        },
      });
  }
}
