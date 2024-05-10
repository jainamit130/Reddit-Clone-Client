export interface CommentDto {
    commentId: number;
    postId: number;
    username: string;
    comment: string;
    creationDate: Date;
    parentId: number;
    replies: Array<CommentDto>;
    currentVote: string;
    votes: number;
}

export namespace CommentDto {
    export function createDefault(): CommentDto {
        return {
            commentId: 0,
            postId: 0,
            username: '',
            comment: '',
            creationDate: new Date(),
            parentId: 0,
            replies: [],
            currentVote: '',
            votes: 0
        };
    }
}