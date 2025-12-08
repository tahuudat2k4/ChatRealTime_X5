import {BrowserRouter, Routes, Route} from 'react-router';
import ChatAppPage from './pages/ChatAppPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useThemeStore } from './stores/useThemeStore';
import { use, useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from './stores/useSocketStore';

// Main application 
function App() {

  const {isDark, setTheme} = useThemeStore();
  const {accessToken} = useAuthStore();
  const {connectSocket, disconnectSocket} = useSocketStore();


  useEffect(() =>{
    setTheme(isDark);
  }, [isDark])

  useEffect(() => {
    if(accessToken){
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken])
  return ( 
  <>
    <Toaster richColors/>
    <BrowserRouter>
        <Routes>
          {/* Public routes*/}
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/signin" element={<SignInPage/>} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<ChatAppPage/>} />
          </Route>
        </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
