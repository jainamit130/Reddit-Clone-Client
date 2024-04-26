export interface PostDto {
    postId: number;
    postName: string;
    userName:string;
    description: string;
    votes:number;
    comments:number;
    creationDate: string;
    communityName: string;
    currentVote:string;
}