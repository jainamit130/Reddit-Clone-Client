import { Component, Input } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-no-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-search-result.component.html',
  styleUrl: './no-search-result.component.css'
})
export class NoSearchResultComponent {
  @Input() atleast1ResultFound:boolean = false;
  @Input() searchQuery: string = "";

  constructor(private userService:UserService) {}

  useInput(){
    this.userService.emitInputFocusEvent();
  }
}
