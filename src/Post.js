//DRH846
//11280305
//CMPT 353

import './css/Post.css'

import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import CommentForm from "./CommentForm";


const Post = ({ post, comments, getComments, deletePost, addPost, upVote, upVoteCount, activePost, setActivePost, userHasUpVoted }) => {

    const { user } = useContext(UserContext);

    const isActive = activePost && activePost.postID === post.postID;

    return (
        <div className="post">
            <div className="post-info">
                <div className="post-author">{post.postUsername}</div>
                <div className="post-time">{post.postTimestamp.replace("T", " ").replace(".000Z", "")}</div>
            </div>
            <div className="post-text">{post.postData}</div>
            <div className="post-actions">
                <div id="vote-action" onClick={() => { upVote(post.postID) }}>
                    <div className={userHasUpVoted(post.postID) ? "arrow upvoted" : "arrow" }>
                        ⇧
                    </div>
                    <div id="count">
                        {upVoteCount(post.postID) > 0 ? `+${upVoteCount(post.postID)}` : ''}
                    </div>
                    </div>
                <div className="post-action" onClick={() => { setActivePost({ postID: post.postID }) }}>
                    Reply
                </div>
                {((user.username === post.postUsername) || (user.isAdmin === 1)) &&
                    <div className="post-action" onClick={() => deletePost(post.postID)}>
                        Delete
                    </div>}
            </div>
            {isActive && (
                <CommentForm
                    hasCancelButton={true}
                    handleSubmit={(text) => addPost(text, post.postID, post.level)}
                    handleCancel={() => { setActivePost(null); }}
                />
            )}
            {/* recursivly render posts and comments until a post/comments has no comments */}
            {comments.length > 0 && (
                <div className="comment">
                    {comments.map(comment => (
                        <Post
                            key={comment.postID}
                            post={comment}
                            comments={getComments(comment.postID)}
                            getComments={getComments}
                            deletePost={deletePost}
                            addPost={addPost}
                            upVote={upVote}
                            upVoteCount={upVoteCount}
                            userHasUpVoted={userHasUpVoted}
                            activePost={activePost}
                            setActivePost={setActivePost}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Post;