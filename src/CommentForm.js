//DRH846
//11280305
//CMPT 353

import './css/CommentForm.css'
import React, { useState } from "react";

const CommentForm = ( { hasCancelButton, handleSubmit, handleCancel } ) => {
    const [text, setText] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const disableTextarea = text.length === 0;

    const onSubmit = (event) => {
        event.preventDefault();
        handleSubmit(text);
        setWordCount(0);
        setText("");
    };

    return (
        <form onSubmit={onSubmit}>
            <div id="word-count">{wordCount}/250</div>
            <textarea 
                className="comment-form-textarea" 
                placeholder="Text" 
                maxLength={250}
                cols={250}
                value={text} 
                onChange={(e) => {setText(e.target.value); setWordCount(e.target.value.length)} }/>
            <button className="comment-form-button" disabled={disableTextarea}>
                Post
            </button>
            { hasCancelButton &&
            <button className="comment-form-button comment-form-cancel-button" onClick={handleCancel} >
                Cancel
            </button>}
        </form>
    );
};

export default CommentForm;