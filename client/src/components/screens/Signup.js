import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [image, setImage] = useState("")
  const [imgurl, setImgurl] = useState(undefined)


  const PostDetails = () => {
    if (! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({ html: "Invalid Email Format", classes: "font-black #ff8a80 red accent-1" })
    }
    // console.log(imgurl)
    fetch('http://localhost:5000/signup', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: imgurl
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "font-black #ff8a80 red accent-1" })
        } else {
          M.toast({ html: data.message, classes: "font-black #64ffda teal accent-2" })
          history.push('/signin')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (image) {
      PostDetails()
    }
  }, [imgurl])

  const postImage = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "insta-clone")
    data.append("cloud_name", "imagecloude")

    // Fetch image cloud storage
    fetch("https://api.cloudinary.com/v1_1/imagecloude/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setImgurl(data.url)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const PostData = () => {
    if (image) {
      postImage()
    } else {
      PostDetails()
    }
  }


  return (
    < div className="my-card" >
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type='text'
          placeholder='name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="file-field input-field">
          <div className="btn  #1565c0 blue darken-3">
            <span>Upload Pic</span>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        {/* <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => PostData()}> */}
        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => PostData()}>
          Sign Up</button>
        <h6>
          <Link to="/signin">Already have an account?</Link>
        </h6>
      </div>
    </div >
  )
}

export default Signup