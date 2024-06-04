import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDto } from '../dto/postDto';
import { CommentComponent } from '../comment/comment.component';
import { VoteComponent } from '../vote/vote.component';
import { CommunitiesComponent } from '../communities/communities.component';
import { PostService } from '../shared/post.service';
import { CommunityService } from '../shared/community.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../pipe/time-ago.pipe';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../authorization/shared/auth.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [DetectOutsideClickDirective,EditorModule,ReactiveFormsModule,TimeAgoPipe,CommonModule,CommunitiesComponent,CommentComponent,VoteComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{

  userPost:boolean=false;
  singleThreadCommentId:number|null=null;
  post!:PostDto;
  postId!:number;
  sanitizedDescription!: SafeHtml;
  openComments:boolean=false;
  editMode:boolean=false;
  updatedPostForm!:FormGroup;
  oldDescription:string="";
  isLoggedIn:boolean=false;
  postAction: boolean = false;

  @ViewChild('comments') myElementRef!: ElementRef;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.postId=Number(params['postId']);
      this.singleThreadCommentId=params['commentId'];
      this.postService.loadUserPosts().subscribe(userPosts => {
        if(userPosts.some(userPost => userPost.postId===this.postId)){
          this.userPost=true;
        }
      });

      this.postService.getPost(this.postId).subscribe(post => {
        this.post=post;
        this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.post.description);
        this.activatedRoute.queryParams.subscribe(params => {
          if(params['openedInEditMode']==="true"){
            this.toggleEditMode(this.post);
          }
        });
      });
      
      this.authService.loggedInStatus.subscribe(isLogin=>{
        this.isLoggedIn=isLogin;
      });
      
      if(params['openComments'])
        this.openComments=true;
      this.communityService.getCommunityOfPost(this.postId)
      .subscribe((community) => {this.communityService.updateCommunityData(community.communityName);});      
    }
    );

    this.updatedPostForm = new FormGroup({
      postDescription: new FormControl('',Validators.required),
    });
  }

  constructor(private authService:AuthService,private router: Router,private sanitizer: DomSanitizer,private communityService:CommunityService,private postService:PostService,private activatedRoute:ActivatedRoute){}

  checkScrollToComments(){
      if (this.openComments && this.myElementRef) {
        this.scrollToComments(this.myElementRef.nativeElement);
      }
  }

  updatePost(isForComment:boolean){
    if(!isForComment){
      this.postService.getPost(this.post.postId).subscribe(updatedPost=> {
          this.post = updatedPost;
      });
    }
  }
  
  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

  scrollToComments(el: HTMLElement) {
    el.scrollIntoView();
  }

  openProfile(userId:number) {
    this.router.navigate(["/profile"],{queryParams:{id:userId}});
  }

  editPost(post: PostDto) {
    if(!this.isLoggedIn){
      this.router.navigateByUrl('/login');
    } else {
      this.post.description=this.updatedPostForm.get('postDescription')?.value;
    if(this.oldDescription===this.post.description){
      this.discardEdit();
    } else {
        this.postService.editPost(post).subscribe((updatedPost) => {
          this.post.description=updatedPost.description;
          this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(updatedPost.description);
          this.editMode=false;
        });
      
    }
  }
  }

  toggleEditMode(post:PostDto) {
    this.postAction=false;
    this.oldDescription=post.description;
    this.updatedPostForm.setValue({['postDescription']:post.description})
    this.editMode=true;
  }

  discardEdit(){
    this.postAction=false;
    this.oldDescription="";
    this.updatedPostForm.setValue({['postDescription']:""});
    this.editMode=false;
  }

  deletePost(event:MouseEvent,post:PostDto) {
    this.postAction=false;
    if(!this.isLoggedIn){
      this.router.navigateByUrl('/login');
    } else {
    this.postService.deletePost(post.postId).subscribe(() => {
      this.post.postName="deleted";
      this.post.description="deleted";
      this.sanitizedDescription="deleted";
      this.post.isDeleted=true;  
    });
    this.closeCommentAction();
    event.stopPropagation();
  }
  }

  openCommentAction(){
    this.postAction=!this.postAction;
  }

  closeCommentAction(){
    this.postAction=false;
  }  
}
