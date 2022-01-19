import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import './Post.css'

const Post = ({username,caption,imageUrl}) => {

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
        </div>
    )
}

export default Post