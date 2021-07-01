import React, { useState, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'


const NewPassword = () => {
  const history = useHistory()
  const [password, setPassword] = useState('')
  const { token } = useParams()
  // console.log(token);

  const PostData = () => {

    fetch('http://localhost:5000/newpassword', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        token
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
          type='password'
          placeholder='Enter new password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => PostData()}>Confirm</button>
      </div>
    </div>
  )
}

export default NewPassword