import { PostDto } from "./postDto";
import { CommentDto } from "./commentDto";

export interface UserProfileDto { 
    userName:string;
    numberOfPosts:number;
    numberOfComments:number;
    joinDate:number;
    posts: Array<PostDto>;
    comments: Array<CommentDto>;
}
