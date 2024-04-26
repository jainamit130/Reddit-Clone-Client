import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { CommunityService } from '../shared/community.service';
import { CreateCommunityRequestPayload } from '../dto/RequestPayload/create-community-request-payload';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-community',
  standalone: true,
  imports: [EditorModule,ReactiveFormsModule,CommonModule],
  templateUrl: './create-community.component.html',
  styleUrl: './create-community.component.css'
})
export class CreateCommunityComponent implements OnInit{
  communityForm!:FormGroup;
  createCommunityRequest:CreateCommunityRequestPayload;

  constructor(private communityService: CommunityService,private router:Router) {
    this.createCommunityRequest={
      communityName:'',
      description:''
    }
  }

  ngOnInit(): void {
    this.communityForm = new FormGroup({
      communityName: new FormControl('',Validators.required),
      description: new FormControl('',Validators.required),
    });
  }

  createCommunity(){
    this.createCommunityRequest.communityName= this.communityForm.get('communityName')?.value;
    this.createCommunityRequest.description= this.communityForm.get('description')?.value;
    this.communityService.createCommunity(this.createCommunityRequest).subscribe(community => {
      this.router.navigate(['community'],{queryParams:{id:community.communityId}})
    });
  }
}
