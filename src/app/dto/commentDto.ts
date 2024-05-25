import { PostDto } from "./postDto";

export interface CommentDto {
    commentId: number;
    postId: number;
    username: string;
    comment: string;
    creationDate: number;
    parentId: number;
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
            comment: '',
            creationDate: new Date().getTime(),
            parentId: 0,
            replies:[],
            repliesMap: new Map<number, CommentDto>(),
            post:null,
            repliesCount: 0,
            currentVote: '',
            votes: 0,
            isDeleted: false,
            isCollapsed: false,
        };
    }
}