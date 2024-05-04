import { PostDto } from "./postDto";
import { CommentDto } from "./commentDto";

export interface UserProfileDto { 
    posts: Array<PostDto>;
    comments: Array<CommentDto>;
}
