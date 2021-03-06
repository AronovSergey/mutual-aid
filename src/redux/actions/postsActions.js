import axios from 'axios';
import { convertingTagsToAnArray } from './../../utils/dataManipulation/postQueries';
import {
    CREATE_POST,
    IS_POST_CREATE_LOADING,
    CREATE_POST_ERROR,
    FETCH_ALL_POSTS,
    IS_ALL_POSTS_LOADING,
    FETCH_ALL_POSTS_ERROR,
    LIKE_POST,
    UNLIKE_POST,
    DELETE_POST,
    IS_COMMENTS_LOADING,
    FETCH_POSTS_COMMENTS,
    SUBMIT_COMMENT,
    DELETE_COMMENT,
} from "./types";
import { showNotification } from './../../UI/notificationToast';
import { SUCCESS, ERROR } from '../../utils/consts/notificationTypes';

export const createPost = (user_name, postTitle, postContent, tagsValue, postImage, token) => (dispatch) => {
    dispatch({ type: IS_POST_CREATE_LOADING }); 

    const formData = new FormData();
    formData.append("image", postImage);

    axios.post('https://www.mutual-aid.me/api/v1.0/images', formData)
    .then(function (response) {
        const imageURL = response.data;
        axios.post('https://www.mutual-aid.me/api/v1.0/posts', {
            "author": user_name,
            "title" : postTitle,
            "content" : postContent,
            "tags": convertingTagsToAnArray(tagsValue),
            "imageURL" : imageURL,
        },
        {
            headers: {
                "auth-token": token,
            }
        })
        .then(response => {
            dispatch({ type: CREATE_POST, payload: { post: response.data.post } });
            showNotification("Post submission has succeeded!", SUCCESS);
        })
        .catch(error => {
            if(error.response) showNotification(error.response.data, ERROR);
            dispatch({ type: CREATE_POST_ERROR });
        });
    })
    .catch(error => {
        if (error.response) showNotification(error.response.data, ERROR);
        dispatch({ type: CREATE_POST_ERROR });
    });
}

export const fetchAllPosts = (token) => (dispatch) => {
    dispatch({ type: IS_ALL_POSTS_LOADING });
    axios.get('https://www.mutual-aid.me/api/v1.0/posts')
    .then((response) => {
        dispatch({ type: FETCH_ALL_POSTS, payload: response.data.posts });
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
        dispatch({ type: FETCH_ALL_POSTS_ERROR });   
    });
}

export const fetchRecommended = (token) => (dispatch) => {
    dispatch({ type: IS_ALL_POSTS_LOADING });
    axios.get('https://www.mutual-aid.me/api/v1.0/posts/recommended' ,{
        headers: {
            "auth-token": token,
        }
    })
    .then((response) => {
        dispatch({ type: FETCH_ALL_POSTS, payload: response.data.posts });
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
        dispatch({ type: FETCH_ALL_POSTS_ERROR });   
    });
} 

export const fetchSearch = (search_expression ,token) => (dispatch) => {
    dispatch({ type: IS_ALL_POSTS_LOADING });
    axios.get(`https://www.mutual-aid.me/api/v1.0/posts/search/${search_expression}`, {
        headers: {
            "auth-token": token,
        }
    })
    .then((response) => {
        dispatch({ type: FETCH_ALL_POSTS, payload: response.data.posts });
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
        dispatch({ type: FETCH_ALL_POSTS_ERROR });   
    });
}

export const likePost = (postID, token) => (dispatch) => {
    axios.get(`https://www.mutual-aid.me/api/v1.0/posts/${postID}/like` ,{
        headers: {
            "auth-token": token,
        }
    })
    .then(res => {
        dispatch({ type: LIKE_POST, payload: { post: res.data } })
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
    });
}

export const unlikePost = (postID, token) => (dispatch) => {
    axios.get(`https://www.mutual-aid.me/api/v1.0/posts/${postID}/unlike` ,{
        headers: {
            "auth-token": token,
        }
    })
    .then(res => {
        dispatch({ type: UNLIKE_POST, payload: { post: res.data } })
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
    });
    
}

export const deletePost = (postID, token) => (dispatch) => {
    axios.delete(`https://www.mutual-aid.me/api/v1.0/posts/${postID}`, {
        headers: {
            "auth-token": token,
        }
    })
    .then(res => {
        showNotification(res.data, SUCCESS);
        dispatch({ type: DELETE_POST, payload: { postID }})
    })
    .catch(error => {
        if (error.response) showNotification(error.response.data, ERROR);
    });
}

export const fetchAllComments = (postID, token) => (dispatch) => {
    dispatch({ type: IS_COMMENTS_LOADING });
    axios.get(`https://www.mutual-aid.me/api/v1.0/posts/comments/${postID}`)
    .then((response) => {
        dispatch({ type: FETCH_POSTS_COMMENTS, payload: response.data });
    })
    .catch((error) => {
        if(error.response) showNotification(error.response.data, ERROR);
    });
}

export const submitComment = (postID, userHandle, userImage, body, token) => (dispatch) => {
    dispatch({ type: IS_COMMENTS_LOADING });
    axios.post('https://www.mutual-aid.me/api/v1.0/posts/comments', {
            userHandle,
            postID,
            body,
            userImage,
        },
        {
            headers: {
                "auth-token": token,
            }
        })
        .then(response => {
            dispatch({ type: SUBMIT_COMMENT, payload: { comment: response.data.comment } });
            showNotification("Comment submission has succeeded!", SUCCESS);
        })
        .catch(error => {
            if(error.response) showNotification(error.response.data, ERROR);
        });
}

export const deleteComment = (commentID, token) => (dispatch) => {
    dispatch({ type: IS_COMMENTS_LOADING });
    axios.delete(`https://www.mutual-aid.me/api/v1.0/posts/comments/${commentID}`, 
        {
            headers: {
                "auth-token": token,
            }
        })
        .then(response => {
            dispatch({ type: DELETE_COMMENT, payload: { comment: response.data } });
        })
        .catch(error => {
            if(error.response) showNotification(error.response.data, ERROR);
        });
}