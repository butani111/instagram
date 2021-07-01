import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/createpost">Create Post</Link></li>,
        <button className="btn waves-effect waves-light #1565c0 blue darken-3"
          onClick={() => {
            localStorage.clear()
            dispatch({ type: "CLEAR" })
            history.push('/signin')
          }}>Sign out</button>
      ]
    } else {
      return [
        <li><Link to="/signin">Signin</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
      ]
    }
  }

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar