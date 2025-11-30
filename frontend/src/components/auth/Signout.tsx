import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router';

const Signout = () => {
    const {signOut} = useAuthStore();
    const navigate = useNavigate();
    const handleSignout = async () =>{
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.log(error);
        } 
    }
  return (
    <Button onClick={handleSignout}>Đăng xuất</Button>
  )
}

export default Signout;
