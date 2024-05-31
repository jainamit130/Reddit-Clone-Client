import { PostDto } from "./postDto";

export interface CommentDto {
    commentId: number;
    postId: number;
    username: string;
    userId:number;
    comment: string;
    creationDate: number;
    parentId: number|null;
    replies: Array<CommentDto>;
    post:PostDto|null;
    repliesMap: Map<number, CommentDto>;
    repliesCount: number;
    currentVote: string;
    votes: number;
    isDeleted: boolean;
    isCollapsed: boolean;
}

export namespace CommentDto {
    export function createDefault(): CommentDto {
        return {
            commentId: 0,
            postId: 0,
            username: '',
            userId:0,
            comment: '',
            creationDate: new Date().getTime(),
            parentId: null,
            replies:[],
            repliesMap: new Map<number, CommentDto>(),
            post:null,
            repliesCount: 0,
            currentVote: 'UPVOTE',
            votes: 1,
            isDeleted: false,
            isCollapsed: false,
        };
    }
}