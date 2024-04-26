import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CommunityDto } from '../dto/CommunityDto';
import { PostService } from '../shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateCommunityRequestPayload } from '../dto/RequestPayload/create-community-request-payload';
import { CreatePostRequestPayload } from '../dto/RequestPayload/create-post-request-payload';
import { CommunityService } from '../shared/community.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [EditorModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  createNewPost!:FormGroup;
  createPostRequest:CreatePostRequestPayload;
  communities$:Array<CommunityDto> = [];

  constructor(private router:Router,private postService:PostService,private communityService:CommunityService,private activatedRoute:ActivatedRoute){
    this.createPostRequest = {
      communityName:"",
      description:"",
      postName:"",
    }
  }  

  ngOnInit(): void {
    this.communityService.currentCommunityData.subscribe(communities => {
      console.log(communities);
      if(Array.isArray(communities))
        this.communities$ =  communities;
      else if(communities instanceof Object)
        this.communities$=[communities];
    });
    this.createNewPost = new FormGroup({
      communityName: new FormControl('',Validators.required),
      postName: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
    });
  }

  createPost(){
    this.createPostRequest.communityName=this.createNewPost.get('communityName')?.value;
    this.createPostRequest.postName=this.createNewPost.get('postName')?.value;
    this.createPostRequest.description=this.createNewPost.get('description')?.value;
    this.postService.createPost(this.createPostRequest).subscribe(post=>{
      const postJson = JSON.stringify(post);
      this.router.navigate(['/post'],{queryParams:{post:postJson}});
    });
  }
}
