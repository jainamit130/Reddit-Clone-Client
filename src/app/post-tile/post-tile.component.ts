import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PostDto } from '../dto/postDto';
import { PostService } from '../shared/post.service';
import { VoteComponent } from '../vote/vote.component';
import { TruncateHtmlTextPipe } from '../pipe/transform/truncate-html-text.pipe';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimeAgoPipe } from '../pipe/time-ago.pipe';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';

@Component({
  selector: 'app-post-tile',
  standalone: true,
  imports: [DetectOutsideClickDirective,VoteComponent,CommonModule,TimeAgoPipe],
  templateUrl: './post-tile.component.html',
  styleUrl: './post-tile.component.css'
})
export class PostTileComponent implements OnInit {
  @Input() isUserPost: boolean = false;
  @Input() isJoined: boolean|null=null;
  @Input() post!:PostDto;
  @Input() showCommunityName: boolean=true;

  @Output() postEditOpened = new EventEmitter<void>();
  @Output() leaveCommunity = new EventEmitter<number>();
  @Output() joinCommunity = new EventEmitter<number>();
  @Output() showComments = new EventEmitter<boolean>(false);
  
  trucatedDescription!:string;
  postAction: boolean = false;
  
  constructor(private router:Router,private postService: PostService,private truncateHtmlPipe:TruncateHtmlTextPipe) {}
  
  ngOnInit(): void {
    this.trucatedDescription=this.truncateHtmlPipe.transform(this.post.description,200);   
  }
  
  updatePost(currentPost:PostDto,isForComment:boolean){
    if(!isForComment) {
      this.postService.getPost(currentPost.postId).subscribe(post=> {  
        this.post.votes = post.votes;
        this.post.currentVote = post.currentVote;
      })
    }
  }
  
  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }
  
  openComments(){
    this.showComments.emit(true);
  }
  
  openProfile(userId:number) {
    this.router.navigate(["/profile"],{queryParams:{id:userId}});
  }

  communityJoined(communityId:number,event: MouseEvent) {
    this.isJoined=true;
    this.joinCommunity.emit(communityId);
    event.stopPropagation();
  }

  communityLeft(communityId:number,event: MouseEvent) {
    this.isJoined=false;
    this.leaveCommunity.emit(communityId);
    event.stopPropagation();
  }

  openCommentAction(){
    this.postAction=!this.postAction;
  }

  closeCommentAction(){
    this.postAction=false;
  } 

  postOpenedInEditMode(event:MouseEvent){
    this.postEditOpened.emit();
    event.stopPropagation();
  }
}
