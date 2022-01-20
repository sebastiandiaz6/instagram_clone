import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebasedb';
import { collection, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import ImageUpload from './ImageUpload';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const App = () => {

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)
  const [openLogIn, setOpenLogIn] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    const getPosts = async () => {

      const querySnapshot = await getDocs(collection(db, "posts"))
      querySnapshot.forEach((doc) => {
        setPosts(prevPost => [{ id: doc.id, post: doc.data() }, ...prevPost])
      });
    }
    getPosts();
  }, [])

  const signUp = async (event) => {
    event.preventDefault()
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
        .then((authUser) => {
          return updateProfile(authUser.user, {
            displayName: username
          })
        })
    } catch (error) {
      console.log(error.message)
    }
    setOpen(false)
  }

  const signIn = async (event) => {
    event.preventDefault()
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.log(error.message)
    }
    setOpenLogIn(false)
  }

  return (
    <div className="app">


      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={(event) => signUp(event)}>Sign Up</Button>
          </form>
        </Box>
      </Modal>

      <Modal
        open={openLogIn}
        onClose={() => setOpenLogIn(false)}
      >
        <Box sx={style}>
          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={(event) => signIn(event)}>Log In</Button>
          </form>
        </Box>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className='app_login'>
            <Button onClick={() => setOpenLogIn(true)}>Log in</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )
        }
      </div>

      <div className='app_posts'>
        {
          posts.map(({ post, id }) => (
            <Post username={post.username} postId={id} user={user} caption={post.caption} imageUrl={post.imageUrl} key={id} />
          ))
        }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />) : (
        <h3>You need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
