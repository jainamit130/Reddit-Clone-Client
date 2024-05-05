import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../shared/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authorization/shared/auth.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit{
  @Input() postId!:number;
  @Output() commented = new EventEmitter<void>();
  commentForm!:FormGroup;
  commentRequest:CommentDto;
  userCommentsOnPost:Array<CommentDto> = [];
  comments$: Array<CommentDto> = [];
  constructor(private commentService:CommentService,private authService:AuthService,private activatedRoute:ActivatedRoute){
    this.commentRequest = {
      postId: 0, 
      username: '', 
      comment: '',
      creationDate: new Date,
    };
  }

  ngOnInit(): void {
    this.getAllComments();
    this.commentForm = new FormGroup({
      commentDescription: new FormControl('',Validators.required),
    });

    this.commentService.getUserCommentsOnPost(this.postId).subscribe(userComments => {
      this.userCommentsOnPost=userComments;
    });
  }

  getAllComments(){
    this.commentService.getAllComments(this.postId).subscribe(comment => {
      this.comments$=comment;
    });
  }

  createComment(){
    this.commentRequest.comment= this.commentForm.get('commentDescription')?.value;
    this.commentRequest.username=this.authService.getUserName();
    this.commentRequest.postId=this.postId;
    this.commentService.comment(this.commentRequest).subscribe(() => {
      this.getAllComments();
      this.commented.emit();
    });
    this.commentForm.reset();
  }
}
