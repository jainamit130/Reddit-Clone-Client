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
  @Output() voteCompleted = new EventEmitter<void>();
  @Input() voteCount!:number;
  @Input() postId!:number;
  @Input() commentId!:number;
  @Input() currentVote!:string;
  @Input() isLoggedIn!:boolean;
  voteDto!: VoteDto;

  constructor(private authService:AuthService,private postService:PostService,private voteService: VoteService,private router:Router){
  }

  ngOnInit(): void {
    this.voteDto={
      voteType:this.currentVote,
      postId: this.postId,
      commentId: this.commentId,
    };
    this.authService.loggedInStatus.subscribe(isLogin=>{
      this.isLoggedIn=isLogin;
    })
  }

  private updateVoteDetails() {
    this.postService.getPost(this.voteDto.postId).subscribe(post => {
      this.voteCount = post.votes;
      this.currentVote=post.currentVote;
    });
  }

  vote(type:string){
    if(this.isLoggedIn) {
      this.voteDto.voteType=type;
      this.voteService.vote(this.voteDto).subscribe(
        () => {
          this.updateVoteDetails();
          this.voteCompleted.emit();
        },
        (error) => {
        }
      );
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
