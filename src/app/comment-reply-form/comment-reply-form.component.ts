import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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

  @ViewChild('commentTextarea') commentTextarea!: ElementRef<HTMLTextAreaElement>; 
  adjustTextareaHeight() {
    const textarea = this.commentTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight+5}px`;
  }

  @Output() commented = new EventEmitter<CommentParameter>();
  @Output() replyModeClosed = new EventEmitter<void>();
  
  @Input() parentCommentId!:number|null;
  @Input() postId!:number|null;
  @Input() commentMode: boolean=false;

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
    this.toggleCommentMode();
    if(this.commentInvalid){
      this.commentForm.markAsUntouched();
      this.commentInvalid=false;
    }
  }

  toggleCommentMode(){
    this.commentForm.reset();
    this.commentMode=!this.commentMode;
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

  activateCommentMode() {
    this.commentMode=true;
  }

  deactivateCommentMode(){
    this.commentMode=false;
    this.commentForm.reset();
    this.commentInvalid=false;
    this.replyModeClosed.emit();
  }
}
