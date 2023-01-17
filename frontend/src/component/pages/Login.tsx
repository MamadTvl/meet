import { Box, Button, Card, Container, Typography } from '@mui/material';
import LoginForm from '../form/LoginForm';

const Login = () => {
    return (
        <Container maxWidth={'sm'}>
            <Card sx={{ mt: 5, p: 3 }}>
                <LoginForm />
            </Card>
        </Container>
    );
};

export default Login;
