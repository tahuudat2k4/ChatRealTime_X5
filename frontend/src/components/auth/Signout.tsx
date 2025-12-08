import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { LogOut } from 'lucide-react';
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
    <Button variant={'completeGhost'} onClick={handleSignout}><LogOut className='text-destructive'/>Đăng Xuất</Button>
  )
}

export default Signout;
