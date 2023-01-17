import { Box, Button, Card, Container, Typography } from '@mui/material';
import SignUpForm from '../form/SignupForm';

const SignUp = () => {
    return (
        <Container maxWidth={'sm'}>
            <Card sx={{ mt: 5, p: 3 }}>
                <SignUpForm />
            </Card>
        </Container>
    );
};

export default SignUp;
