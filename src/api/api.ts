// @ts-nocheck
import {Item} from "../types/interface";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export const getItem = async (id: string): Promise<Item> => {
    const response = await fetch(`${BASE_URL}/item/${id}.json`);
    return await response.json();
};

export const getComments = async (ids: number[]): Promise<Comment[]> => {
    const promises = ids.map((id) => getItem(id.toString()));
    const items = await Promise.all(promises);
    const comments = items.filter((item) => item.type === "comment");
    return mapComments(comments);
};

const mapComments = (comments: Item[]): Comment[] => {
    const commentMap: { [id: number]: Comment } = {};
    const result: Comment[] = [];
    comments.forEach((comment) => {
        const commentObj: Comment = {
            id: comment.id,
            by: comment.by,
            time: comment.time,
            text: comment.text,
            kids: [],
            parent: comment.parent,
        };
        commentMap[comment.id] = commentObj;
        if (comment.parent in commentMap) {
            commentMap[comment.parent].kids.push(commentObj);
        } else {
            result.push(commentObj);
        }
    });
    return result;
};