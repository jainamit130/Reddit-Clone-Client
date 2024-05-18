import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../shared/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { AuthService } from '../authorization/shared/auth.service';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentRequestDto } from '../dto/RequestPayload/commentRequestDto';
import { CommentReplyFormComponent } from '../comment-reply-form/comment-reply-form.component';
import { CommentParameter } from '../dto/CommentParameter';
import { CommentPostId } from '../dto/CommentPostId';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommentReplyFormComponent,CommonModule,CommentTileComponent,DetectOutsideClickDirective],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit{
  @Input() postId!:number;

  @Output() commented = new EventEmitter<void>();

  commentRequest:CommentRequestDto;
  userCommentsOnPost:Array<CommentDto> = [];
  comments$: Array<CommentDto> = [];

  constructor(private commentService:CommentService,private authService:AuthService,private activatedRoute:ActivatedRoute){
    this.commentRequest=CommentRequestDto.createDefault();
  }

  ngOnInit(): void {
    this.getAllComments();
    this.updateUserCommentsOnPost();
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
        this.commented.emit();
      })
    } 
    
    else {
      this.commentService.comment(this.commentRequest).subscribe((createdComment) => {
        this.updateReplies([createdComment],createdComment.parentId);
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
      this.updateReplies(replies,commentPostId.commentId);
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

  updateReplies(updatedReply: Array<CommentDto>, parentId: number) {
    let flag = 0;

    const updateHelper = (comment: CommentDto) => {
        if (comment.commentId === parentId) {
            for (const reply of updatedReply) {
                if (!comment.repliesMap) {
                    comment.repliesMap = new Map<number, CommentDto>();
                }
                comment.repliesMap.set(reply.commentId, reply);
            }
            flag = 1;
            return comment;
        }

        for (const [key, reply] of comment.replies.entries()) {
            updateHelper(reply);
            if (flag) {
                break;
            }
        }
        return comment;
    }

    for (const topComment of this.comments$) {
        updateHelper(topComment);
        if (flag) {
            break;
        }
    }
}

}
