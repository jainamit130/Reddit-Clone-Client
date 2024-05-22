import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentDto } from '../dto/commentDto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentService } from '../shared/comment.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoteComponent } from '../vote/vote.component';
import { CommentReplyFormComponent } from '../comment-reply-form/comment-reply-form.component';
import { CommentParameter } from '../dto/CommentParameter';
import { CommentPostId } from '../dto/CommentPostId';
import { CommentRequestDto } from '../dto/RequestPayload/commentRequestDto';
import { AuthService } from '../authorization/shared/auth.service';
import { TimeAgoPipe } from '../pipe/time-ago.pipe';

@Component({
  selector: 'app-comment-tile',
  standalone: true,
  imports: [TimeAgoPipe,CommentReplyFormComponent,CommonModule,DetectOutsideClickDirective,ReactiveFormsModule,VoteComponent],
  templateUrl: './comment-tile.component.html',
  styleUrl: './comment-tile.component.css'
})
export class CommentTileComponent implements OnInit{
    @Input() comment!:CommentDto;
    @Input() userComment:boolean = false;
    @Input() currentExposedReplies : number = 0;

    @Output() collapseToggled = new EventEmitter<void>();
    @Output() updateComments = new EventEmitter<void>();
    @Output() commentEdited = new EventEmitter<CommentDto>();
    @Output() replied = new EventEmitter<CommentParameter>();
    @Output() showMoreReplies = new EventEmitter<CommentPostId>();

    commentRequest:CommentRequestDto;
    replyInvalid:boolean=false;
    replyMode:boolean=false;
    oldComment:string="";
    editMode:boolean=false;
    replyForm!:FormGroup;
    updatedCommentForm!:FormGroup;
    commentAction: boolean = false;

    ngOnInit(): void {
      this.updatedCommentForm = new FormGroup({
        commentDescription: new FormControl('',Validators.required),
      });
    }

    constructor(private router:Router,private commentService:CommentService,private authService:AuthService) {
      this.commentRequest=CommentRequestDto.createDefault();
    }

    openCommentAction(){
      this.commentAction=!this.commentAction;
    }

    closeCommentAction(){
      this.commentAction=false;
    }

    deleteComment(event:MouseEvent,comment:CommentDto) {
      this.commentService.deleteComment(comment.commentId,comment.postId).subscribe(() => {
        this.comment.comment="deleted";
        this.comment.isDeleted=true;  
        this.updateComments.emit();
      });
      this.closeCommentAction();
      event.stopPropagation();
    }

    editComment(comment:CommentDto) {
      comment.comment=this.updatedCommentForm.get('commentDescription')?.value;
      if(this.oldComment===comment.comment){
        this.discardEdit();
      } else {
          this.commentService.editComment(comment).subscribe((updatedComment) => {
            this.comment.comment=updatedComment.comment;
            this.editMode=false;
          });
        
      }
    }

    toggleEditMode(comment:CommentDto) {
      this.oldComment=comment.comment;
      this.updatedCommentForm.setValue({['commentDescription']:comment.comment})
      this.editMode=true;
      this.closeCommentAction();
    }

    discardEdit() {
      this.oldComment="";
      this.updatedCommentForm.setValue({['commentDescription']:""});
      this.editMode=false;
    }

    updateCommentVote(commentId: number,postId:number) {
      this.commentService.getComment(commentId,postId).subscribe(updatedReply => {
        this.comment.currentVote=updatedReply.currentVote;
          this.comment.votes=updatedReply.votes;
      });
  }

    toggleReplyMode() {
      this.replyMode=!this.replyMode;
    }

    createComment(commentParameter: CommentParameter) {
      this.replied.emit(commentParameter);
      this.toggleCollapse();
      this.replyMode=false;
    }

    showReplies(commentId:number,postId:number) {
      this.showMoreReplies.emit({commentId,postId});
    }

    toggleCollapse() {
      this.collapseToggled.emit();
    }
  }
