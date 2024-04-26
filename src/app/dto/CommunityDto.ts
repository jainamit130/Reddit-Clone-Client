import { PostDto } from "./postDto";

export interface CommunityDto { 
    communityId: number;
    communityName: string;
    description:string;
    numberOfPosts: number;
    numberOfMembers: number;
    posts: Array<PostDto>;
}
