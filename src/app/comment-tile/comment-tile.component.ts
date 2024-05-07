import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentDto } from '../dto/commentDto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentService } from '../shared/comment.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-tile',
  standalone: true,
  imports: [CommonModule,DetectOutsideClickDirective,ReactiveFormsModule],
  templateUrl: './comment-tile.component.html',
  styleUrl: './comment-tile.component.css'
})
export class CommentTileComponent implements OnInit{
    @Input() comment!:CommentDto;
    @Input() userComment:boolean = false;
    @Output() updateComments = new EventEmitter<void>();
    @Output() commentEdited = new EventEmitter<CommentDto>();
    editMode:boolean=false;
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
      this.commentService.comment(comment).subscribe(() => {
        this.commentEdited.emit(comment);
        this.editMode=false;
      }, (error) => {
        console.log("Sorry could not edit comment!")
      });
    }

    toggleEditMode(comment:CommentDto) {
      this.updatedCommentFrom.setValue({['commentDescription']:comment.comment})
      this.editMode=true;
      this.closeCommentAction();
    }

    discardEdit() {
      this.updatedCommentFrom.setValue({['commentDescription']:""});
      this.editMode=false;
    }
  }
