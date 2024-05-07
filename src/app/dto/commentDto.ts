export interface CommentDto {
    commentId:number;
    postId: number;
    username:string;
    comment: string;
    creationDate: Date;
}