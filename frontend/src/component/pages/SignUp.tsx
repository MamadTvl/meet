import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/user';
import SignUpForm from '../form/SignupForm';

const SignUp = () => {
    const [isLogin, isLoading] = useAuthStore((store) => [
        store.isLogin,
        store.loading,
    ]);
    const navigate = useNavigate();
    if (isLogin && !isLoading) {
        navigate('/profile');
    }
    return (
        <Container maxWidth={'sm'}>
            {isLoading ? (
                <CircularProgress size={25} color={'secondary'} />
            ) : (
                <Card sx={{ mt: 5, p: 3 }}>
                    <SignUpForm />
                </Card>
            )}
        </Container>
    );
};

export default SignUp;
