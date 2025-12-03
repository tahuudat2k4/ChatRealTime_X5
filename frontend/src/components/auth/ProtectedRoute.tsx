import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import {Navigate, Outlet} from 'react-router'
const ProtectedRoute = () => {
    const {accessToken, user, loading, refresh, fetchMe} = useAuthStore();
    const [starting, setStarting] = useState(true);
    const init = async () => {
      if(!accessToken){
          await refresh();
      }
      // If accessToken is valid
      if(accessToken && !user){
          await fetchMe();
      }
      // Initialization complete
      setStarting(false);
    };
    // On component mount, initialize auth state
    useEffect(() => {
      init();
    }, []);
    // If still loading, you can return a loading indicator here
    if( starting || loading ){
        return (<div className='flex h-screen items-center justify-center'>Đang tải trang...</div>);
    }
    // If no access token, redirect to signin page
    if(!accessToken){
        return (
            <Navigate
                to="/signin"
                replace
            />
        );
    }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute;
