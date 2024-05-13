import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentDto } from '../dto/commentDto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentService } from '../shared/comment.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VoteComponent } from '../vote/vote.component';
import { CommentReplyFormComponent } from '../comment-reply-form/comment-reply-form.component';
import { CommentParameter } from '../dto/CommentParameter';

@Component({
  selector: 'app-comment-tile',
  standalone: true,
  imports: [CommentReplyFormComponent,CommonModule,DetectOutsideClickDirective,ReactiveFormsModule,VoteComponent],
  templateUrl: './comment-tile.component.html',
  styleUrl: './comment-tile.component.css'
})
export class CommentTileComponent implements OnInit{
    @Input() comment!:CommentDto;
    @Input() userComment:boolean = false;
    @Output() updateComments = new EventEmitter<void>();
    @Output() commentVoted = new EventEmitter<number>();
    @Output() commentEdited = new EventEmitter<CommentDto>();
    @Output() replied = new EventEmitter<CommentParameter>();
    replyInvalid:boolean=false;
    replyMode:boolean=false;
    oldComment:string="";
    editMode:boolean=false;
    replyForm!:FormGroup;
    updatedCommentFrom!:FormGroup;
    commentAction: boolean = false;

    ngOnInit(): void {
      this.updatedCommentFrom = new FormGroup({
        commentDescription: new FormControl('',Validators.required),
      });
    }

    constructor(private router:Router,private commentService:CommentService) {}

    openCommentAction(){
      this.commentAction=true;
    }

    closeCommentAction(){
      this.commentAction=false;
    }

    deleteComment(event:MouseEvent,comment:CommentDto) {
      this.commentService.deleteComment(comment.commentId,comment.postId).subscribe(() => {
          this.updateComments.emit();
      });
      this.closeCommentAction();
      event.stopPropagation();
    }

    editComment(comment:CommentDto) {
      comment.comment=this.updatedCommentFrom.get('commentDescription')?.value;
      if(this.oldComment===comment.comment){
        this.discardEdit();
      } else {
        this.commentEdited.emit(comment);
        this.editMode=false;
      }
    }

    toggleEditMode(comment:CommentDto) {
      this.oldComment=comment.comment;
      this.updatedCommentFrom.setValue({['commentDescription']:comment.comment})
      this.editMode=true;
      this.closeCommentAction();
    }

    discardEdit() {
      this.oldComment="";
      this.updatedCommentFrom.setValue({['commentDescription']:""});
      this.editMode=false;
    }

    updateCommentVote(commentId:number) {
      this.commentVoted.emit(commentId);
    }

    toggleReplyMode() {
      this.replyMode=!this.replyMode;
    }

    createComment(commentParameter: CommentParameter) {
      this.replied.emit(commentParameter);
    }
  }
