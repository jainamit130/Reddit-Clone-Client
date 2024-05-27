import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/user.service';
import { userSearch } from '../../dto/userSearch';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../../pipe/time-ago.pipe';
import { NoSearchResultComponent } from '../no-search-result/no-search-result.component';

@Component({
  selector: 'app-people-search-result',
  standalone: true,
  imports: [CommonModule,TimeAgoPipe,NoSearchResultComponent],
  templateUrl: './people-search-result.component.html',
  styleUrl: './people-search-result.component.css'
})
export class PeopleSearchResultComponent {
  searchQuery:string=""; 
  searchedUsers:Array<userSearch>=[];
  atleast1ResultFound:boolean = true;

  constructor(private router:Router,private activatedRoute:ActivatedRoute,private userService:UserService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.userService.searchPeople(this.searchQuery).subscribe(users => {
        this.searchedUsers = users.map(user => ({
          userName:user.userName,
          userId: user.userId,
          joinDate: user.joinDate,
        }));
        if(this.searchedUsers.length===0)
          this.atleast1ResultFound=false;
      });
    });
  }

  openProfile(userId:number) {
    this.router.navigate(["/profile"],{queryParams:{id:userId}});
  }
}
