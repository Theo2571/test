export interface NewsItem {
    by: string;
    descendants: number;
    id: number;
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
    payload: any;
}


export type Item = {
    id: number;
    deleted: boolean;
    type: string;
    by: string;
    time: number;
    text: string;
    dead: boolean;
    parent: number;
    poll: number;
    kids: number[];
    url: string;
    score: number;
    title: string;
    parts: number[];
    descendants: number;
};

export type Comment = {
    id: number;
    deleted: boolean;
    type: string;
    by: string;
    time: number;
    text: string;
    dead?: boolean;
    parent: number;
    kids: Comment[];
};