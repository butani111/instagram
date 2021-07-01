import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'



const Reset = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')

  const PostData = () => {
    if (! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({ html: "Invalid Email Format", classes: "font-black #ff8a80 red accent-1" })
    }

    fetch('http://localhost:5000/reset-password', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email
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


  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type='text'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => PostData()}>Reset password</button>
      </div>
    </div>
  )
}

export default Reset