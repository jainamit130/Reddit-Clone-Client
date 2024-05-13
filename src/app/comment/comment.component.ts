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
    this.getAllComments();
    this.updateUserCommentsOnPost();
    this.commented.emit();
  }

  updateComment(commentId:number){
    this.commentService.getComment(commentId,this.postId).subscribe(comment => {
      const index = this.comments$.findIndex(commentItem => commentItem.commentId===comment.commentId);
      this.comments$[index]=comment;
    });
  }

  getAllComments(){
    this.commentService.getAllComments(this.postId,2).subscribe(comment => {
      this.comments$=comment;
    });
  }

  createComment(commentParameter:CommentParameter) {
      this.commentRequest.comment= commentParameter.commentDescription;
      this.commentRequest.username=this.authService.getUserName();
      this.commentRequest.postId=this.postId;
      this.commentRequest.parentId= commentParameter.parentId;
      this.commentService.comment(this.commentRequest).subscribe(() => {
        this.getAllComments();
        this.updateUserCommentsOnPost();
        this.commented.emit();
      });
  }

  isUserComment(comment: CommentDto): boolean {
    return this.userCommentsOnPost.some(userCommentOnPost => comment.commentId === userCommentOnPost.commentId);
  }

  editComment(editedComment: CommentDto) {
    this.commentService.editComment(editedComment).subscribe(() => {
      this.getAllComments();
      this.updateUserCommentsOnPost();
    });
  }
}
