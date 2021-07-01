import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'


const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext)
  const [userProfile, setUserProfile] = useState(null)
  const [showFollowBtn, setShowFollowBtn] = useState(null)
  // const [user, setUser] = useState(null)
  // const [posts, setPosts] = useState(null)

  const { userId } = useParams()
  var currentUserId = localStorage.getItem("user")

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result.user)
        setUserProfile(result)

        // while (!state) { }
        // if (result.user.followers.includes(state._id)) {
        //   console.log('yes');
        //   setShowFollowBtn(false)
        // } else {
        //   console.log('no');
        // }
      })
      .catch(err => console.log(err))
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
        const newData = userProfile.posts.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        // setPosts(newData)
        setUserProfile(newData)
        // console.log(newData)
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
        const newData = userProfile.posts.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setUserProfile(newData)
        // setPosts(newData)
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
        const newData = userProfile.posts.map(item => {
          if (item._id === result._id) {
            return result
          } else {
            return item
          }
        })
        setUserProfile(newData)
        // setPosts(newData)
        // console.log()
      })
      .catch(err => console.log(err))
  }

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userId
      })
    })
      .then(res => res.json())
      .then(result => {
        // console.log(result)
        // setUserProfile(userProfile)
        dispatch({ type: "UPDATE", payload: { followers: result.followers, following: result.following } })
        localStorage.setItem("user", JSON.stringify(result))
        setUserProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, result._id]
            }
          }
        })
        setShowFollowBtn(false)
      })
  }

  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userId
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        // setUserProfile(userProfile)
        dispatch({ type: "UPDATE", payload: { followers: result.followers, following: result.following } })
        localStorage.setItem("user", JSON.stringify(result))
        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(item => item != state._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          }
        })
        setShowFollowBtn(true)
      })
  }

  return (
    // console.log(mypics),
    <>
      {!userProfile ? <h3>Loading...</h3> :
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
                src={userProfile.user.pic}
              />
            </div>
            <div>
              {/* <h4>{user ? user.name : "Loading..."}</h4> */}
              <h4>{userProfile.user.name}</h4>
              <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.following.length} following</h6>
              </div>
              <>
                {(showFollowBtn === false || (showFollowBtn === null && userProfile.user.followers.includes(state._id))) ?
                  // {(!showFollowBtn || userProfile.user.followers.includes(state._id)) ?
                  <button className="btn waves-effect waves-light #1565c0 blue darken-3" style={{ marginTop: "10px", borderRadius: "10px" }} onClick={() => unfollowUser()}>Unfollow</button> :
                  <button className="btn waves-effect waves-light #1565c0 blue darken-3" style={{ marginTop: "10px", borderRadius: "10px" }} onClick={() => followUser()}>Follow</button>
                }
              </>
            </div>
          </div>

          <div className="gallery">
            {
              // !userProfile ? "Loading..." :
              userProfile.posts.map(item => {
                // !posts ? "Loading..." :
                //   posts.map(item => {

                return (
                  <div key={item._id} className="img-item" style={{ height: "250px", display: "flex", alignItems: "center" }}>
                    {/* <div></div> */}
                    <img src={item.photo} alt={item.title} />
                  </div>
                )
              })
            }
          </div>
        </div>}
    </>
  )
}

export default UserProfile























{

  // <div className="card profile-card" key={item._id}>
  //   <h5>{item.postedBy.name}</h5>
  //   <div className="card-img">
  //     <img style={{ width: "100%" }} src={item.photo} />
  //   </div>
  //   <div className="card-content">
  //     {item.likes.includes(state._id) ?
  //       <i className="material-icons" onClick={() => unlikePost(item._id)} style={{ color: "red", cursor: "pointer" }}>favorite</i> :
  //       <i className="material-icons" onClick={() => likePost(item._id)} style={{ "cursor": "pointer" }}>favorite_border</i>
  //     }
  //     <p>{item.likes.length} likes</p>
  //     <p>{item.title}</p>
  //     <p><span style={{ "fontWeight": "bold" }}>Caption</span> : {item.body}</p>
  //     {
  //       item.comments.map(item => {
  //         return (
  //           // console.log(item),
  //           <p key={item._id}><span style={{ "fontWeight": "bold" }}>{(item.postedBy.name)}</span> : {(item.text)}</p>
  //         )
  //       })
  //     }

  //     <form onSubmit={(e) => {
  //       e.preventDefault()
  //       // console.log(e.target[0])
  //       makeComment(e.target[0].value, item._id)
  //       e.target[0].value = ''
  //     }}>
  //       <input type="text" placeholder="Add a comment" />
  //     </form>
  //   </div>
  // </div>


  // <div key={item._id} className="img-item">
  //   <img src={item.photo} alt={item.title} />
  // </div>
}


// ************************************************************************************


{
  // import React, { useEffect, useState, useContext } from 'react'
  // import { UserContext } from '../../App'
  // import { useParams } from 'react-router-dom'


  // const UserProfile = () => {
  //   const { state, dispatch } = useContext(UserContext)
  //   const [userProfile, setUserProfile] = useState(null)
  //   // const [user, setUser] = useState(null)
  //   // const [posts, setPosts] = useState(null)

  //   const { userId } = useParams()
  //   var currentUserId = localStorage.getItem("user")

  //   useEffect(() => {
  //     fetch(`http://localhost:5000/user/${userId}`, {
  //       headers: {
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       }
  //     })
  //       .then(res => res.json())
  //       .then(result => {
  //         // console.log(result)
  //         setUserProfile(result)
  //         // console.log(result.user)
  //         // console.log(result.posts)
  //         // setUser(result.user)
  //         // setPosts(result.posts)
  //       })
  //       .catch(err => console.log(err))
  //   }, [])


  //   const likePost = (id) => {
  //     fetch("http://localhost:5000/like", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       },
  //       body: JSON.stringify({
  //         postId: id
  //       })
  //     }).then(res => res.json())
  //       .then(result => {
  //         const newData = userProfile.posts.map(item => {
  //           if (item._id === result._id) {
  //             return result
  //           } else {
  //             return item
  //           }
  //         })
  //         // setPosts(newData)
  //         setUserProfile(newData)
  //         // console.log(newData)
  //       })
  //       .catch(err => console.log(err))
  //   }

  //   const unlikePost = (id) => {
  //     fetch("http://localhost:5000/unlike", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       },
  //       body: JSON.stringify({
  //         postId: id
  //       })
  //     }).then(res => res.json())
  //       .then(result => {
  //         const newData = userProfile.posts.map(item => {
  //           if (item._id === result._id) {
  //             return result
  //           } else {
  //             return item
  //           }
  //         })
  //         setUserProfile(newData)
  //         // setPosts(newData)
  //       })
  //   }

  //   const makeComment = (text, postId) => {
  //     fetch("http://localhost:5000/comment", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       },
  //       body: JSON.stringify({ text, postId })
  //     })
  //       .then(res => res.json())
  //       .then(result => {
  //         const newData = userProfile.posts.map(item => {
  //           if (item._id === result._id) {
  //             return result
  //           } else {
  //             return item
  //           }
  //         })
  //         setUserProfile(newData)
  //         // setPosts(newData)
  //         // console.log()
  //       })
  //       .catch(err => console.log(err))
  //   }

  //   const followUser = () => {
  //     fetch("http://localhost:5000/follow", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       },
  //       body: JSON.stringify({
  //         followId: userId
  //       })
  //     })
  //       .then(res => res.json())
  //       .then(result => {
  //         console.log(result)
  //         setUserProfile(userProfile)
  //       })
  //   }

  //   const unfollowUser = () => {
  //     fetch("http://localhost:5000/unfollow", {
  //       method: "put",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + localStorage.getItem("jwt")
  //       },
  //       body: JSON.stringify({
  //         unfollowId: userId
  //       })
  //     })
  //       .then(res => res.json())
  //       .then(result => {
  //         console.log(result)
  //         setUserProfile(userProfile)
  //       })
  //   }

  //   return (
  //     // console.log(mypics),
  //     <>
  //       {!userProfile ? <h3>Loading...</h3> :
  //         <div style={{ maxWidth: "650px", margin: "0 auto" }}>
  //           <div style={{
  //             display: "flex",
  //             justifyContent: "space-around",
  //             margin: "18px 5px",
  //             padding: "20px",
  //             borderBottom: "2px solid black"
  //           }}>
  //             <div>
  //               <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
  //                 src="https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHBlcnNvbnxlbnwwfDJ8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60" />
  //             </div>
  //             <div>
  //               {/* <h4>{user ? user.name : "Loading..."}</h4> */}
  //               <h4>{userProfile.user.name}</h4>
  //               <div style={{ display: "flex", justifyContent: "space-between", width: "110%" }}>
  //                 <h6>{userProfile.posts.length} posts</h6>
  //                 <h6>{userProfile.user.followers.length} followers</h6>
  //                 <h6>{userProfile.user.following.length} following</h6>
  //               </div>
  //               <>
  //                 {userProfile.user.followers.includes(state._id) ?
  //                   <button className="btn waves-effect waves-light #1565c0 blue darken-3" style={{ marginTop: "10px", borderRadius: "10px" }} onClick={() => unfollowUser()}>Unfollow</button> :
  //                   <button className="btn waves-effect waves-light #1565c0 blue darken-3" style={{ marginTop: "10px", borderRadius: "10px" }} onClick={() => followUser()}>Follow</button>
  //                 }
  //               </>
  //             </div>
  //           </div>

  //           <div className="gallery">
  //             {
  //               // !userProfile ? "Loading..." :
  //               userProfile.posts.map(item => {
  //                 // !posts ? "Loading..." :
  //                 //   posts.map(item => {

  //                 return (
  //                   <div key={item._id} className="img-item" style={{ height: "250px", display: "flex", alignItems: "center" }}>
  //                     {/* <div></div> */}
  //                     <img src={item.photo} alt={item.title} />
  //                   </div>
  //                 )
  //               })
  //             }
  //           </div>
  //         </div>}
  //     </>
  //   )
  // }

  // export default UserProfile
}