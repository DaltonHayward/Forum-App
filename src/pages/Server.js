//DRH846
//11280305
//CMPT 353

import "../css/Server.css";

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { UserContext } from '../UserContext';
import Post from '../Post';
import CommentForm from '../CommentForm';
import NavBar from '../NavBar';
import { isEqual } from 'lodash';

export const Server = () => {
    const { serverID, serverName } = useParams();
    const { user } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [votes, setVotes] = useState([]);
    const [activePost, setActivePost] = useState(null);

    // fetch all posts and sort by date
    const fetchPosts = useCallback(() => {
        fetch(`http://localhost:81/server/${serverID}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => setPosts(data.sort((a, b) => (a.postTimestamp < b.postTimestamp) ? 1 : -1)));
    }, [serverID]);

    const fetchVotes = useCallback(() => {
        fetch(`http://localhost:81/server/${serverID}/votes`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => setVotes(data));
    }, [serverID]);

    // get all posts on first load and votes
    useEffect(() => {
        fetchPosts();
        fetchVotes();
    }, [fetchPosts, fetchVotes]);

    const getComments = (postID) => {
        // get an array of all replies to post with postID, sort them in acending order
        return posts.filter(post => post.parentID === postID).sort((a, b) => (a.postTimestamp > b.postTimestamp) ? 1 : -1)
    }

    // add post, refresh page
    const addPost = (text, parentID, level) => {
        if (level == null) { level = 0 };
        fetch(`http://localhost:81/server/${serverID}`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                postUsername: user.username,
                postData: text,
                level: level,
                parentID: parentID
            })
        }).then(() => { alert("Post created!"); fetchPosts(); setActivePost({ postID: null }) });
    }

    // delete post, refresh page
    const deletePost = (postID) => {
        if (window.confirm("Are you sure you want to remove this post?")) {
            // call deletePost on any post the is a child of the post to be deleted
            const postsToDelete = findPostsToDelete(postID);
            postsToDelete.forEach(post => {
                fetch(`http://localhost:81/server/${serverID}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        postID: post
                    })
                }).then(() => {fetchPosts();})
                fetch(`http://localhost:81/server/${serverID}/votes`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        postID: post,
                        userID: user.userID
                    })
                })
            })
            fetchVotes();
        }
    }

    const findPostsToDelete = (postID, postsToDelete_array) => {
        if (postsToDelete_array === undefined) postsToDelete_array = [];

        // Get all the replies to the post
        const children = posts.filter(post => post.parentID === postID);

        // Recursively delete all the replies

        children.forEach(post => postsToDelete_array = postsToDelete_array.concat(findPostsToDelete(post.postID)));


        // Delete the original post
        postsToDelete_array.push(postID);

        return postsToDelete_array;
    }

    // user up vote
    const upVote = (postID) => {
        const newVote = { votePostID: postID, voteUserID: user.userID }
        // if there is a vote matching the vote trying to be made, unvote, else vote
        if (votes.some(vote => isEqual(vote, newVote))) {
            fetch(`http://localhost:81/server/${serverID}/votes`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    postID: postID,
                    userID: user.userID
                })
            }).then(() => { fetchVotes(); })
        }
        else {
            fetch(`http://localhost:81/server/${serverID}/votes`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    postID: postID,
                    userID: user.userID
                })
            }).then(() => { fetchVotes(); })
        }
    }


    // check if the current user has voted on post with postID
    const userHasUpVoted = (postID) => {
        const potentialVote = { votePostID: postID, voteUserID: user.userID };
        return votes.some(vote => isEqual(vote, potentialVote));
    }

    // count votes on post with PostID
    const upVoteCount = (postID) => {
        return [...votes].filter(vote => vote.votePostID === postID).length;
    }


    return (
        <>
            <NavBar canSearch={false} />
            <h1>{serverName}</h1>

            <div id='posts'>
                <div id='post-form-title'>
                    <div>Write Post</div>
                </div>

                <CommentForm
                    className="post-form"
                    hasCancelButton={false}
                    handleSubmit={addPost}
                />
                <div id='posts-container'>
                    {posts.map(post => (
                        post.parentID === null && (
                            <Post
                                key={post.postID}
                                post={post}
                                comments={getComments(post.postID)}
                                getComments={getComments}
                                deletePost={deletePost}
                                addPost={addPost}
                                upVote={upVote}
                                upVoteCount={upVoteCount}
                                userHasUpVoted={userHasUpVoted}
                                activePost={activePost}
                                setActivePost={setActivePost}
                            />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}