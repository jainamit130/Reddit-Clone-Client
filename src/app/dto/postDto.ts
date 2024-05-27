export interface PostDto {
    postId: number;
    postName: string;
    userName:string;
    userId:number;
    description: string;
    votes:number;
    comments:number;
    creationDate: number;
    communityName: string;
    communityId: number;
    currentVote:string;
}