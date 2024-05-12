export interface CommentRequestDto {
    postId: number;
    username: string;
    comment: string;
    creationDate: Date;
    parentId: number | null;
}

export namespace CommentRequestDto {
    export function createDefault(): CommentRequestDto {
        return {
            postId: 0,
            username: '',
            comment: '',
            creationDate: new Date(),
            parentId: null,
        };
    }
}