import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'

const Home = () => {
  const [data, setData] = useState([])
  const { state, dispatch } = useContext(UserContext)

  useEffect(() => {
    fetch("http://localhost:5000/allsubpost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json()) //.then(res => console.log(res)) //
      .then(result => {
        setData(result.posts)
        // console.log(result)
      })
  }, [])

  const likePost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
        // console.log(result)
      })
      .catch(err => console.log(err))
  }

  const unlikePost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      })
  }

  const makeComment = (text, postId) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({ text, postId })
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
        // console.log()
      })
      .catch(err => console.log(err))
  }

  const deleteComment = (postId, commentId) => {
    fetch("http://localhost:5000/deletecomment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({ postId, commentId })
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
        // console.log()
      })
      .catch(err => console.log(err))
  }

  return (
    // <h5>Home page</h5>
    <div className="home">
      {
        data.map(item => {
          return (
            <div className="card home-card" key={item._id}>
              <h5 style={{ marginLeft: "10px" }}>
                <Link to={"/profile/" + (item.postedBy._id != state._id ? item.postedBy._id : "")}>{item.postedBy.name}</Link></h5>
              <div className="card-img">
                <img style={{ width: "100%" }} src={item.photo} />
              </div>
              <div className="card-content">
                {item.likes.includes(state._id) ?
                  <i className="material-icons" onClick={() => unlikePost(item._id)} style={{ color: "red", cursor: "pointer" }}>favorite</i> :
                  <i className="material-icons" onClick={() => likePost(item._id)} style={{ "cursor": "pointer" }}>favorite_border</i>
                }
                <p>{item.likes.length} likes</p>
                <p>{item.title}</p>
                <p style={{ margin: "10px" }}><span style={{ "fontWeight": "bold" }}>Caption</span> : {item.body}</p>
                {
                  item.comments.map(commentItem => {
                    return (
                      // console.log(item),
                      <div style={{ display: "block" }}>
                        {commentItem.postedBy._id === state._id &&
                          <i className="material-icons delete-logo" onClick={() => deleteComment(item._id, commentItem._id)} style={{ "cursor": "pointer", display: 'block', width: "30px", height: "30px", float: 'right' }}>delete</i>}

                        <p key={commentItem._id} style={{ display: 'block', width: "95%", height: "30px" }}><span style={{ "fontWeight": "bold" }}>{(commentItem.postedBy.name)}</span> : {(commentItem.text)}</p>
                      </div>
                    )
                  })
                }

                <form onSubmit={(e) => {
                  e.preventDefault()
                  // console.log(e.target[0])
                  makeComment(e.target[0].value, item._id)
                  e.target[0].value = ''
                }}>
                  <input type="text" placeholder="Add a comment" />
                </form>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home
