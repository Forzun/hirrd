import { useUser } from '@clerk/clerk-react';
import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRotue = ({ children }) => {
   const {isSignedIn , user , isLoaded} = useUser();
   const navigate = useNavigate();
   const { pathname } = useLocation();

   if(isLoaded && !isSignedIn && isSignedIn !== undefined){
      return <Navigate to="/?sign-in=true" />
   }

   if(user !== undefined && !user?.unsafeMetadata?.role && pathname !== "/onboarding"){
      return <Navigate to="/onboarding" />
   }

   return children
}

export default ProtectedRotue