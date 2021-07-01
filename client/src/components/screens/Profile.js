import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'


const Profile = () => {
  const { state, dispatch } = useContext(UserContext)
  const [mypics, setpics] = useState(null)
  // const [image, setImage] = useState("")
  const [imgurl, setImgurl] = useState("")
  const UserName = JSON.parse(localStorage.getItem('user')).name

  useEffect(() => {
    fetch("http://localhost:5000/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result)
        setpics(result)
      })
    // console.log(state);
  }, [])

  const deletePost = (postId) => {
    fetch(`http://localhost:5000/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })//.then(res => res.json())
      .then(result => {
        // console.log(result.message)
        const newData = mypics.filter(pic => pic._id !== postId)
        setpics(newData)
      })
  }

  const postImage = (pic) => {
    const data = new FormData()
    data.append("file", pic)
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

  const updatePic = (pic) => {
    postImage(pic)
  }

  useEffect(() => {
    if (!imgurl) return;

    fetch('http://localhost:5000/updatepic', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({ pic: imgurl })
    }).then(res => res.json())
      .then(data => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "font-black #ff8a80 red accent-1" })
        } else {
          M.toast({ html: "Pic updated successfully.", classes: "font-black #64ffda teal accent-2" })
          localStorage.setItem("user", JSON.stringify({ ...state, pic: data.pic }))
          dispatch({ type: "UPDATEPIC", payload: imgurl })
          // console.log(state);
          console.log(document.querySelector('#pic-file-name'))
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [imgurl])

  return (
    <>
      {!mypics ? <h3>Loading...</h3> :
        <div style={{ maxWidth: "650px", margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 5px",
            padding: "20px",
            borderBottom: "2px solid black"
          }}>
            <div>
              <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                src={state.pic} />

              <div className="file-field input-field">
                <div className="btn  #1565c0 blue darken-3" style={{ fontSize: "10px", padding: "0 5px", borderRadius: "20px" }}>
                  <span style={{ fontSize: "10px", margin: "0" }}>Update Pic</span>
                  <input type="file" onChange={e => updatePic(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                  <input id="pic-file-name" className="file-path validate" type="text" />
                </div>
              </div>

            </div>
            <div>
              <h4>{UserName}</h4>
              {state &&
                <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
                  <h6>{mypics.length} posts</h6>
                  <h6>{state.followers.length} followers</h6>
                  <h6>{state.following.length} following</h6>
                </div>}
            </div>
          </div>

          <div className="gallery">
            {
              mypics.map(item => {
                return (
                  <div key={item._id} className="img-item">
                    <div style={{ height: "30px" }}>
                      <i className="material-icons delete-logo" onClick={() => deletePost(item._id)} style={{ "cursor": "pointer" }}>delete</i>
                    </div>
                    <div style={{ display: "flex", height: "250px", alignItems: "center" }}>
                      <div>
                        <img src={item.photo} alt={item.title} />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>}
    </>
  )
}

export default Profile