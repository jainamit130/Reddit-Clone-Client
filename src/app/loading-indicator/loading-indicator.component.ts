import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LoadingService } from '../configuration/loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.css'
})
export class LoadingIndicatorComponent implements OnInit{
  isLoading: Observable<boolean> = of(false);

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.isLoading = this.loadingService.loading$;
  }
}
