import { Component, inject, OnInit } from '@angular/core';
import { LoantypeService } from '../../services/loantype.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ILoanType } from '../../../interfaces/loantype.interface';

@Component({
  selector: 'app-loantype-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterLink],
  templateUrl: './loantype-list.component.html',
  styleUrl: './loantype-list.component.scss',
})
export class LoantypeListComponent implements OnInit {
  private loantypeService = inject(LoantypeService);

  loantypes: ILoanType[] = [];
  displayedColumns: string[] = [
    '_id',
    'name',
    'conditions',
    'rate',
    'term',
    'details',
  ];
  error: string | null = null;

  ngOnInit(): void {
    this.fetchLoantypes();
  }

  fetchLoantypes(): void {
    this.loantypeService.getLoantypes().subscribe({
      next: (response) => {
        this.loantypes = response['loan types'];
      },
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
