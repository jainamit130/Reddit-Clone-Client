export interface PostDto {
    postId: number;
    postName: string;
    userName:string;
    description: string;
    votes:number;
    comments:number;
    creationDate: Date;
    communityName: string;
    communityId: number;
    currentVote:string;
}