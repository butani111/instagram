import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'



const Signin = () => {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const PostData = () => {
    if (! /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      return M.toast({ html: "Invalid Email Format", classes: "font-black #ff8a80 red accent-1" })
    }

    fetch('http://localhost:5000/signin', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email
      })
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "font-black #ff8a80 red accent-1" })
        } else {
          localStorage.setItem('jwt', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          dispatch({ type: "USER", payload: data.user })
          M.toast({ html: "Signed-in successfully.", classes: "font-black #64ffda teal accent-2" })
          // console.log(data)
          history.push('/')
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
        <input
          type='password'
          placeholder='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="btn waves-effect waves-light #1565c0 blue darken-3" onClick={() => PostData()}>Sign In</button>
        <h6>
          <Link to="/signup">Don't have an account?</Link>
        </h6>
        <p>
          <Link to="/reset">Forgot Password?</Link>
        </p>
      </div>
    </div>
  )
}

export default Signin