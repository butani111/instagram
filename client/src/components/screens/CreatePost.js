import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'


const CreatePost = () => {
  const history = useHistory()
  const [title, setTitle]  = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [imgurl, setImgurl] = useState("")

  useEffect(() => {
    if (!imgurl) return

    fetch('http://localhost:5000/createpost', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        title,
        body,
        pic: imgurl
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "font-black #ff8a80 red accent-1" })
        } else {
          M.toast({ html: "Post created successfully.", classes: "font-black #64ffda teal accent-2" })
          // console.log(data)
          history.push('/')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [imgurl])

  const postDetails = () => {
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

  return (
    <div className="card input-filed"
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        textAlign: "center"
      }}>
      <input
        type="text"
        placeholder="Enter title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />
      {/* <input type="text" placeholder="Body" /> */}

      <div className="file-field input-field">
        <div className="btn  #1565c0 blue darken-3">
          <span>Select Image</span>
          <input type="file" onChange={e => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>

      </div>
      <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => postDetails()}>
        Submit post</button>

    </div>
  )
}

export default CreatePost