import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from './CircularProgress';
import ErrorPage from './../pages/ErrorPage';
import Post from './Post';

const useStyles = makeStyles({
  root: {
    margin: "5em",
    textAlign: "center",
  },
});

const Posts = ({ action, postsType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { posts, loading, fetched, error } = useSelector(
    (state) => state.posts[postsType]
  );

  useEffect(() => {
     dispatch(action());
   }, []);

  return (
    <div className={classes.root}>
      {loading && (<CircularProgress/>)}
      {fetched && posts.map((post) => <Post postData={post} key={post._id} />)}
      {error && <ErrorPage />}
    </div>
  );
};

export default Posts;