import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../shared/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { AuthService } from '../authorization/shared/auth.service';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentRequestDto } from '../dto/RequestPayload/commentRequestDto';
import { CommentReplyFormComponent } from '../comment-reply-form/comment-reply-form.component';
import { CommentParameter } from '../dto/CommentParameter';
import { CommentPostId } from '../dto/CommentPostId';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { PostService } from '../shared/post.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [LoadingIndicatorComponent,CommentReplyFormComponent,CommonModule,CommentTileComponent,DetectOutsideClickDirective],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit,AfterViewInit{
  singleThread:boolean=false;
  loading:boolean=true;
  
  @Input() singleThreadCommentId: number|null = null;
  @Input() postId!:number;
  
  @Output() commented = new EventEmitter<void>();
  @Output() commentsRendered = new EventEmitter<void>();
  
  commentRequest:CommentRequestDto;
  userCommentsOnPost:Array<CommentDto> = [];
  comments$: Array<CommentDto> = [];
  
  constructor(private router:Router,private cdr:ChangeDetectorRef,private postService:PostService,private commentService:CommentService,private authService:AuthService,private activatedRoute:ActivatedRoute){
    this.commentRequest=CommentRequestDto.createDefault();
  }
  
  ngOnInit(): void {
    if(this.singleThreadCommentId) {
      this.singleThread=true;
      this.getSingleThread();
      this.updateUserCommentsOnPost();  
    } else {
      this.singleThread=false;
      this.getAllComments();
      this.updateUserCommentsOnPost();
    }
  }
  
  getSingleThread() {
    if(this.singleThreadCommentId) {
      this.commentService.getSingleThread(this.postId,this.singleThreadCommentId).subscribe(comment => {
        this.comments$.push(this.replyArrayToMap(comment));
        this.checkIfAllDataLoaded();
      });
    } else {
      throw new Error("No such thread found!");
    }
  }
  
  ngAfterViewInit(): void {
    this.commentsRendered.emit();
  }
  
  updateUserCommentsOnPost(){
    this.commentService.getUserCommentsOnPost(this.postId).subscribe(userComments => {
      this.userCommentsOnPost=userComments;
    });
  }

  updateComments(){
    this.commented.emit();
  }

  getAllComments(){
    this.commentService.getAllComments(this.postId,2).subscribe(comment => {
      for(let commentItem of comment){
        this.comments$.push(this.replyArrayToMap(commentItem));
      }
      this.checkIfAllDataLoaded();
      if(this.comments$.length===0){
        this.closeLoading();
      }
    });
  }

  replyArrayToMap(comment: CommentDto): CommentDto {
    if (comment.replies.length === 0) {
      return comment;
    }
  
    if (!comment.repliesMap) {
      comment.repliesMap = new Map<number, CommentDto>();
    }
    
    for (let reply of comment.replies) {
      const convertedReply = this.replyArrayToMap(reply);
      comment.repliesMap.set(reply.commentId, convertedReply);
    }
  
    return comment;
  }
  
  createComment(commentParameter:CommentParameter) {  
    this.commentRequest.comment= commentParameter.commentDescription;
    this.commentRequest.username=this.authService.getUserName();
    this.commentRequest.parentId=commentParameter.parentId;
    if(commentParameter.postId){
      this.commentRequest.postId=commentParameter.postId;
    } else {
      throw new Error("The Post no longer exists!");
    }

    if(!commentParameter.parentId){    
      this.commentService.comment(this.commentRequest).subscribe((comment) => {
        this.comments$.push(comment);
        this.userCommentsOnPost.push(comment);
        this.commented.emit();
      });
    } 
    
    else {
      this.commentService.comment(this.commentRequest).subscribe((createdComment) => {
        this.updateReplies([createdComment],createdComment.parentId,false);
        this.userCommentsOnPost.push(createdComment);
        this.commented.emit();
      });
    }
  }

  isUserComment(comment: CommentDto): boolean {
    for(let userCommentOnPost of this.userCommentsOnPost){
      if(userCommentOnPost.commentId===comment.commentId)
        return true;
    }
    return false;
  }

  showMoreReplies(commentPostId:CommentPostId){
    this.commentService.showMoreReplies(commentPostId.commentId,commentPostId.postId).subscribe((replies) => {
      this.updateReplies(replies,commentPostId.commentId,true);
    });
  }
  
  updateCollapseBool(commentId: number) {
    const updateHelper = (comments: CommentDto[]): boolean => {
      for (const comment of comments) {
        if (comment.commentId === commentId) {
          comment.isCollapsed = !comment.isCollapsed; 
          return true; 
        }
        
        if (comment.repliesMap && comment.repliesMap.size > 0) {
          if (updateHelper(Array.from(comment.repliesMap.values()))) {
            return true; 
          }
        }
      }
  
      return false; 
    };
    
    return updateHelper(this.comments$);
  }
  
  updateReplies(updatedReply: Array<CommentDto>, parentId: number|null, showRepliesFlow:boolean) {
    let flag = 0;
    
    const updateHelper = (comments: CommentDto[]) => {
      for (const comment of comments) {
        if (comment.commentId === parentId) {
                for (const reply of updatedReply) {
                  if (!comment.repliesMap) {
                        comment.repliesMap = new Map<number, CommentDto>();
                      }
                      comment.replies.push(reply);
                      if(!showRepliesFlow)
                        comment.repliesCount+=1
                      comment.isCollapsed=false;
                    comment.repliesMap.set(reply.commentId, reply);
                }
                flag = 1;
                
                return;
            }

            if (comment.repliesMap && comment.repliesMap.size > 0) {
                updateHelper(Array.from(comment.repliesMap.values()));
            }

            if (flag) {
                return;
            }
        }
    };

    updateHelper(this.comments$);
}

checkIfAllDataLoaded() {
  if (this.comments$.length > 0) {
    this.cdr.detectChanges();
    this.commentsRendered.emit();
  }
}

  navigateToPost(postId:number) {
    this.router.navigate(['/post'],{queryParams:{postId}});
  }
  closeLoading() {
    this.loading=false;
  }
}
