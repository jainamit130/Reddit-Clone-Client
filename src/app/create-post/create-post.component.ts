import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PostService } from '../shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePostRequestPayload } from '../dto/RequestPayload/create-post-request-payload';
import { CommunityService } from '../shared/community.service';
import { CommunitySearchComponent } from '../community-search/community-search.component';
import { CommunitySearchDto } from '../dto/communitySearchDto';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommunitySearchComponent,EditorModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit{
  createNewPost!:FormGroup;
  createPostRequest:CreatePostRequestPayload;
  yourCommunities:Array<CommunitySearchDto> = [];
  searchQuery: string = '';
  currentCommunity!:string;

  constructor(private router:Router,private postService:PostService,private communityService:CommunityService,private activatedRoute:ActivatedRoute){
    this.createPostRequest = {
      communityName:"",
      description:"",
      postName:"",
    }
  }  

  ngOnInit(): void {
    this.communityService.currentUserCommunities.subscribe(usercommunities => {
        usercommunities.map(community => {
          this.yourCommunities.push({
            communityName:community.communityName,
            numberOfMembers:community.numberOfMembers
          });
        }
      );
    });
    this.updateSelectedCommunity();
    this.createNewPost = new FormGroup({
      communityName: new FormControl('',Validators.required),
      postName: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
    });
  }

  updateSelectedCommunity(){
    this.communityService.currentCommunityData.subscribe(community => {
      if(community)
        this.currentCommunity=community;
    });
  }
  
  createPost(){
    this.updateSelectedCommunity();
    this.createPostRequest.communityName=this.currentCommunity;
    this.createPostRequest.postName=this.createNewPost.get('postName')?.value;
    this.createPostRequest.description=this.createNewPost.get('description')?.value;
    this.postService.createPost(this.createPostRequest).subscribe(post=>{
      const postJson = JSON.stringify(post);
      this.router.navigate(['/post'],{queryParams:{post:postJson}});
    });
  }
}
