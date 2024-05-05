import { Component, Input, OnInit } from '@angular/core';
import { CommentDto } from '../dto/commentDto';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { CommentService } from '../shared/comment.service';

@Component({
  selector: 'app-comment-tile',
  standalone: true,
  imports: [CommonModule,DetectOutsideClickDirective],
  templateUrl: './comment-tile.component.html',
  styleUrl: './comment-tile.component.css'
})
export class CommentTileComponent implements OnInit{
    @Input() comment!:CommentDto;
    commentAction: boolean = false;

    ngOnInit(): void {
    }

    constructor(private router:Router,private commentService:CommentService) {}

    openCommentAction(){
      this.commentAction=true;
    }

    closeCommentAction(){
      this.commentAction=false;
    }

    deleteComment(event:MouseEvent) {
      console.log("Delete Comment");
      this.closeCommentAction();
      event.stopPropagation();
    }

    editComment(event: MouseEvent) {
      console.log("Edit Comment");
      this.closeCommentAction();
      event.stopPropagation();
    }
  }
