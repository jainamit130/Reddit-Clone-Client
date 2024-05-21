import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { VoteService } from '../shared/vote.service';
import { VoteDto } from '../dto/VoteDto';
import { PostService } from '../shared/post.service';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../authorization/shared/auth.service';

@Component({
  selector: 'app-vote',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './vote.component.html',
  styleUrl: './vote.component.css'
})
export class VoteComponent implements OnInit {
  @Input() isForComment : boolean = false;
  @Input() voteCount!:number;
  @Input() postId!:number;
  @Input() commentId!:number;
  @Input() currentVote!:string;
  @Input() isLoggedIn!:boolean;

  @Output() voteCompleted = new EventEmitter<boolean>();

  commentOrPost:string="Post";
  voteDto!: VoteDto;
  hoverStateUpvote: boolean = false;
  hoverStateDownvote: boolean = false;

  constructor(private authService:AuthService,private voteService: VoteService,private router:Router){}

  ngOnInit(): void {
    this.voteDto={
      voteType:this.currentVote,
      postId: this.postId,
      commentId: this.commentId,
    };
    this.authService.loggedInStatus.subscribe(isLogin=>{
      this.isLoggedIn=isLogin;
    })
    this.commentOrPost=this.isForComment?"Comment":"Post";
  }

  changeImageOnHoverOverUpvote(isHovered: boolean) {
    this.hoverStateUpvote = isHovered;
  }

  changeImageOnHoverOverDownvote(isHovered: boolean) {
    this.hoverStateDownvote = isHovered;
  }

  vote(type:string){
    if(this.isLoggedIn) {
      this.voteDto.voteType=type;
      this.voteService.vote(this.voteDto).subscribe(
        () => {
          this.voteCompleted.emit(this.isForComment);
        },
        (error) => {
        }
      );
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
