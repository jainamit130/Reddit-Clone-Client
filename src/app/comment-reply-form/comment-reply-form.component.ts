import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentParameter } from '../dto/CommentParameter';

@Component({
  selector: 'app-comment-reply-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './comment-reply-form.component.html',
  styleUrl: './comment-reply-form.component.css'
})

export class CommentReplyFormComponent implements OnInit{
  @Output() commented = new EventEmitter<CommentParameter>();
  
  @Input() parentCommentId!:number|null;
  @Input() postId!:number|null;

  commentForm!:FormGroup;
  commentInvalid:boolean=false;
  commentParameter:CommentParameter = {
    commentDescription:"",
    parentId:null,
    postId:null,
  }

  ngOnInit(): void {
    this.commentForm = new FormGroup({
      commentDescription: new FormControl('',Validators.required),
    });
  }

  checkCommentInvalid() {
    if(this.commentInvalid){
      this.commentForm.markAsUntouched();
      this.commentInvalid=false;
    }
  }

  createComment() {
    this.commentParameter.commentDescription = this.commentForm.get('commentDescription')?.value;
    this.commentParameter.parentId = this.parentCommentId;
    this.commentParameter.postId = this.postId;
    if(this.commentForm.get('commentDescription')?.invalid){
      this.commentInvalid=true;
    } else {
      this.commented.emit(this.commentParameter);
      this.commentForm.reset();
      this.commentInvalid=false;
    }
  }
}
