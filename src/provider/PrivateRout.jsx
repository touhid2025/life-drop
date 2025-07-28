import React, { use } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from './AuthProvider';
import Loader from '../component/Loader';


const PrivateRoute = ({children}) => {
    const {userr,loading} = use(AuthContext);
    const location = useLocation();
    
      if(loading){
        return <Loader></Loader>;
      };

    if(userr && userr?.email){
        return children;
    }
    return <Navigate state={location.pathname} to={'/log/login'}></Navigate>
};

export default PrivateRoute;