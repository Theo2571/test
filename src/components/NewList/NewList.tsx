// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Button, Card} from '@mui/material';
import {NewsItem} from "../../types/interface";
import {useDispatch} from "react-redux";
import {fetchNewsList} from "../../store/NewsSlice";
import "./NewList.css"


function NewsList() {
    const dispatch = useDispatch()
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        dispatch(fetchNewsList()).then((items: []) => {
            setNews(items);
            setLoading(false);
        });
    }, []);

    const handleRefreshClick = () => {
        setLoading(true);
        dispatch(fetchNewsList()).then((items: []) => {
            setNews(items);
            setLoading(false);
        });
    };
  setInterval(() => {
      dispatch(fetchNewsList()).then((items: []) => {
          setNews(items);
          setLoading(false);
      });
  },100000)
    return (
        <div className="home">
            <div className="toolbar">
                <Button variant="contained" onClick={handleRefreshClick} sx={{ mr: 1 }}>
                    Обновить
                </Button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul>

                    {news.payload.map((item) => (
                        <li key={item.id}>
                            <Card>

                            <Link className={'news_link'} to={`/item/${item.id}`}>{item.title}</Link>
                            <div className="meta">
                                {item.score} points by {item.by} | {new Date(item.time * 1000).toLocaleString()}
                            </div>
                            <div className="comments">{item.descendants} comments</div>
                            </Card>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default NewsList;