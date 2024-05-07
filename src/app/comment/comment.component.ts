import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../shared/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authorization/shared/auth.service';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CommentTileComponent],
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
      commentId:0,
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

    this.updateUserCommentsOnPost();
  }

  updateUserCommentsOnPost(){
    this.commentService.getUserCommentsOnPost(this.postId).subscribe(userComments => {
      this.userCommentsOnPost=userComments;
      console.log(userComments);
    });
  }

  updateComments(){
    this.getAllComments();
    this.updateUserCommentsOnPost();
    this.commented.emit();
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
    this.postComment(this.commentRequest);
  }

  postComment(comment:CommentDto){
    this.commentService.comment(comment).subscribe(() => {
      this.getAllComments();
      this.updateUserCommentsOnPost();
      this.commented.emit();
    });
    this.commentForm.reset();
  }

  isUserComment(comment: CommentDto): boolean {
    return this.userCommentsOnPost.some(userCommentOnPost => comment.commentId === userCommentOnPost.commentId);
  }
}
