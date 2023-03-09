import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Comment, Item} from "../../types/interface";
import {getItem} from "../../api/api";
import "./News.css"
import {Button} from "@mui/material";

type NewsProps = {};

type RouteParams = {
    id: string;
};

async function getComments(commentIds: number[]): Promise<Comment[]> {
    const comments = await Promise.all(commentIds.map(async (id) => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await response.json();
    }));
    for (const comment of comments) {
        if (comment.kids) {
            comment.kids = await getComments(comment.kids);
        }
    }

    return comments;
}
async function getCommentss(commentIds: Comment[]): Promise<Comment[]> {
    const comments = await Promise.all(commentIds.map(async (id) => {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return await response.json();
    }));
    for (const comment of comments) {
        if (comment.kids) {
            comment.kids = await getComments(comment.kids);
        }
    }

    return comments;
}

const News: React.FC<NewsProps> = () => {
    const { id } = useParams<RouteParams>();
    const [item, setItem] = useState<Item | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const refreshComments = () => {
        if (item) {
            getComments(item.kids).then((data) => setComments(data));
        }
    };
    type CommentListProps = {
        comments: Comment[];
    };
    const CommentList: React.FC<CommentListProps> = ({ comments }) => {
        const [showChildren, setShowChildren] = useState(false);
        const handleRefresh = (comment: Comment) => {
            handleNestedComments(comment);
        };
        return (
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <div>
                            <span>{comment.by}</span> | <span>{comment.time}</span>
                        </div>
                        <div className={'text_comments'} dangerouslySetInnerHTML={{ __html: comment.text }} />
                        {comment.kids && (
                            <>
                                <div className={"flex-button"}>
                                <Button variant="contained" size="small" onClick={() => setShowChildren(!showChildren)}>
                                    {showChildren ? "Скрыть ответы" : "Показать ответы"}
                                </Button>
                                <Button variant="contained" size="small" sx={{ mr: 1 }} onClick={() => handleRefresh(comment)}>
                                    Обновить ответы
                                </Button>
                                </div>
                            </>
                        )}
                        {showChildren && comment.kids && (
                            <CommentList comments={comment.kids} />
                        )}
                    </li>
                ))}
            </ul>
        );
    };
    const renderComments = (comments: Comment[]) => {
        return <CommentList comments={comments} />;
    };


    const handleNestedComments = (comment: Comment) => {
        getCommentss(comment.kids).then((data) => {
            const updatedComment = { ...comment, kids: data };
            setComments((prevComments) =>
                prevComments.map((prevComment) =>
                    prevComment.id === updatedComment.id ? updatedComment : prevComment
                )
            );
        });
    };
    useEffect(() => {
        getItem(id!).then((data) => setItem(data));
    }, [id]);

    useEffect(() => {
        if (item) {
            getComments(item.kids).then((data) => setComments(data));
        }
    }, [item]);
    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div className={"news-item"}>
            <Link className={'dit-news_link'} to={item.url}>{item.title}</Link>
            <div>
                {item.score} points by {item.by} | {item.descendants} comments
            </div>
            <div className={"back-link"}>
                <Button variant="contained" sx={{ mr: 1 }}>
                    <Link className={'link'} to={'/'}>Назад</Link>
                </Button>
            </div>
            <div className={"news_text"} dangerouslySetInnerHTML={{ __html: item.text }} />
            <Button variant="contained" sx={{ mr: 1 }}onClick={refreshComments}>Обновить комментарии</Button>
            <div className={'ul-center'}>
            {comments.length ? renderComments(comments) : <div>Нет комментариев</div>}
            </div>
        </div>
    );
};

export default News;