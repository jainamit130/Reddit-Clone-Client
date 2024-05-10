import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommentService } from '../shared/comment.service';
import { ActivatedRoute } from '@angular/router';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authorization/shared/auth.service';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,CommentTileComponent,DetectOutsideClickDirective],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit{
  commentInvalid:boolean=false;
  @Input() postId!:number;
  @Output() commented = new EventEmitter<void>();
  commentForm!:FormGroup;
  commentRequest:CommentDto;
  userCommentsOnPost:Array<CommentDto> = [];
  comments$: Array<CommentDto> = [];
  constructor(private commentService:CommentService,private authService:AuthService,private activatedRoute:ActivatedRoute){
    this.commentRequest=CommentDto.createDefault();
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
    });
  }

  updateComments(){
    this.getAllComments();
    this.updateUserCommentsOnPost();
    this.commented.emit();
  }

  getAllComments(){
    this.commentService.getAllComments(this.postId,2).subscribe(comment => {
      this.comments$=comment;
    });
  }

  createComment(){
    if(this.commentForm.get('commentDescription')?.invalid)
      this.commentInvalid=true;
    else {
      this.commentRequest.comment= this.commentForm.get('commentDescription')?.value;
      this.commentRequest.username=this.authService.getUserName();
      this.commentRequest.postId=this.postId;
      this.commentService.comment(this.commentRequest).subscribe(() => {
        this.getAllComments();
        this.updateUserCommentsOnPost();
        this.commented.emit();
      });
      this.commentForm.reset();
      this.commentInvalid=false;
    }
  }

  isUserComment(comment: CommentDto): boolean {
    return this.userCommentsOnPost.some(userCommentOnPost => comment.commentId === userCommentOnPost.commentId);
  }

  checkCommentInvalid() {
    if(this.commentInvalid){
      this.commentForm.markAsUntouched();
      this.commentInvalid=false;
    }
  }

  editComment(editedComment: CommentDto) {
    this.commentService.editComment(editedComment).subscribe(() => {
      this.getAllComments();
      this.updateUserCommentsOnPost();
    });
  }
}
