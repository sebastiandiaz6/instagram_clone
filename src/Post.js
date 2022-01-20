import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import './Post.css'
import { db } from './firebasedb';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { serverTimestamp } from "firebase/firestore";

const Post = ({ username, caption, imageUrl, postId, user }) => {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [random, setRandom] = useState(0)

    useEffect(() => {
        if (postId) {
            const getComments = async () => {
                const result = []
                const querySnapshot = await getDocs(collection(db, "posts", postId, "comments"))
                querySnapshot.forEach((doc) => {
                    result.push({ id: doc.id, post: doc.data() })
                });
                setComments(result)
            }
            getComments()
        }
    }, [postId, random])

    console.log(comments)

    const refresh = () => {
        setRandom(prevValue => prevValue + 1)
    }

    const postComment = async (event) => {
        event.preventDefault();

        const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), {
            text: comment,
            username: user.displayName,
            timestamp: serverTimestamp()
        })
        setComment('')
        refresh()
    }
    return (
        <div className='post'>
            <div className='post_header'>
                <Avatar
                    className='post_avatar'
                    alt="Remy Sharp"
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="post_image" src={imageUrl} />
            <h4 className='post_text'><strong>{username}</strong> {caption}</h4>

            <div className='post_comments'>
                {
                    comments.map((comment, index) => (
                        <p key={index} className='comment' >
                            <strong className='comment_user'>{comment.post.username}</strong>{comment.post.text}
                        </p>
                    ))
                }
            </div>
            {user ? (<form className='post_commentBox'>
                <input
                    className='post_input'
                    type='text'
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)} />
                <button disabled={!comment}
                    className='post_button'
                    type='submit'
                    onClick={postComment}>Post</button>
            </form>) : (
                <p className='post_noLogin'>You must be logged in to comment</p>
            )}
        </div>
    )
}

export default Post