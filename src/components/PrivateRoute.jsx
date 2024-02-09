import React from 'react'
import { useAuthStatus } from '../hooks/useAuthStatus';
import { Outlet ,  Navigate } from 'react-router-dom'
const PrivateRoute = () => {
    const [loggedIn , checkingStatus] = useAuthStatus()
    if(checkingStatus){
        return <h3>Loading... </h3>
    }
  return loggedIn ? <Outlet/> : <Navigate to="/sig-in" /> ; 
}

export default PrivateRoute
