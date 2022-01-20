import { Button } from '@mui/material'
import React, { useState } from 'react'
import { db, storage } from './firebasedb'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import './ImageUpload.css'

const ImageUpload = ({ username }) => {

    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const storageRef = ref(storage, `images/${image.name}`)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on("state_changed",
            (snapshot) => {
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setProgress(prog)
            }, (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        const docRef = addDoc(collection(db, "posts"), {
                            timestamp: serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                        setProgress(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className='imageUpload'>
            <progress className='imageUpload_progress' value={progress} max="100" />
            <input type="text" placeholder='Enter a caption...' onChange={(event) => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload