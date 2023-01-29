import {
    Box,
    Button,
    FormControl,
    Grid,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { FormikConfig, FormikHandlers, FormikValues, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthStore } from '../../store/user';
import { Api, apiEndpoint } from '../../utils/Api';

const signupSchema = yup.object({
    code: yup.string().required('Enter verification Code'),
    password: yup
        .string()
        .min(6, 'Password.length >= 6')
        .required('Enter your password'),
    passwordConfirmation: yup
        .string()
        .required('Confirm your password')
        .oneOf([yup.ref('password')], 'passwords not the same'),
});

const codeSchema = yup.object({
    phone: yup
        .string()
        .matches(/[0][9][0-9]{9}/, {
            message: 'Your phone number is not valid',
        })
        .required('Enter Your Phone Number'),
});

type SignupForm = yup.InferType<typeof signupSchema>;
type CodeForm = yup.InferType<typeof codeSchema>;
enum Step {
    SEND_VERIFICATION_CODE,
    SIGN_UP,
}
const LoginForm = () => {
    const [step, setStep] = useState(Step.SEND_VERIFICATION_CODE);
    const { enqueueSnackbar } = useSnackbar();
    const setUser = useAuthStore((store) => store.setUser);
    const navigate = useNavigate();
    
    const codeFormik = useFormik<CodeForm>({
        initialValues: { phone: '' },
        validationSchema: codeSchema,
        onSubmit: async (values) => {
            try {
                const response = await Api(apiEndpoint.sendVerifyCode, {
                    method: 'POST',
                    data: {
                        phone: values.phone,
                    },
                });
                enqueueSnackbar(response.data.message, { variant: 'success' });
                setStep(Step.SIGN_UP);
            } catch (err: any) {
                enqueueSnackbar(err.response.data.message, {
                    variant: 'error',
                });
            }
        },
    });

    const SignUpFormik = useFormik<SignupForm>({
        initialValues: { password: '', code: '', passwordConfirmation: '' },
        validationSchema: signupSchema,
        onSubmit: async (values) => {
            try {
                const response = await Api(apiEndpoint.signup, {
                    method: 'POST',
                    data: {
                        password: values.password,
                        code: values.code,
                        phone: codeFormik.values.phone,
                    },
                });
                enqueueSnackbar(response.data.message, { variant: 'success' });
                localStorage.setItem('meet-token', response.data.token);
                setUser();
                navigate('/profile');
            } catch (err: any) {
                enqueueSnackbar(err.response.data.message, {
                    variant: 'error',
                });
            }
        },
    });

    return (
        <>
            {step === Step.SEND_VERIFICATION_CODE && (
                <PhoneVerificationStep formik={codeFormik} />
            )}
            {step === Step.SIGN_UP && <SignupStep formik={SignUpFormik} />}
        </>
    );
};

const PhoneVerificationStep: React.FC<{
    formik: ReturnType<typeof useFormik<CodeForm>>;
}> = ({ formik }) => {
    return (
        <Grid
            container
            component={'form'}
            onSubmit={formik.handleSubmit}
            spacing={2}
            direction={'column'}
            alignItems={'center'}>
            <Grid item xs={12}>
                <Typography variant='h4'>{'Sign Up'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    type='tel'
                    name='phone'
                    placeholder='Enter your phone number'
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && !!formik.errors.phone}
                    helperText={
                        formik.touched.phone && formik.errors.phone
                            ? formik.errors.phone
                            : ''
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    sx={{ width: 200 }}
                    type='submit'
                    variant='contained'
                    color={'primary'}>
                    next
                </Button>
            </Grid>
        </Grid>
    );
};

const SignupStep: React.FC<{
    formik: ReturnType<typeof useFormik<SignupForm>>;
}> = ({ formik }) => {
    return (
        <Grid
            container
            component={'form'}
            onSubmit={formik.handleSubmit}
            spacing={2}
            direction={'column'}
            alignItems={'center'}>
            <Grid item xs={12}>
                <Typography variant='h4'>{'Sign Up'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name='code'
                    placeholder='enter verification code'
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    error={formik.touched.code && !!formik.errors.code}
                    helperText={
                        formik.touched.code && formik.errors.code
                            ? formik.errors.code
                            : ''
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    type='password'
                    name='password'
                    placeholder='enter your password'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && !!formik.errors.password}
                    helperText={
                        formik.touched.password && formik.errors.password
                            ? formik.errors.password
                            : ''
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    type='password'
                    name='passwordConfirmation'
                    placeholder='reenter your password'
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.passwordConfirmation &&
                        !!formik.errors.passwordConfirmation
                    }
                    helperText={
                        formik.touched.passwordConfirmation &&
                        formik.errors.passwordConfirmation
                            ? formik.errors.passwordConfirmation
                            : ''
                    }
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    sx={{ width: 200 }}
                    type='submit'
                    variant='contained'
                    color={'primary'}>
                    login
                </Button>
            </Grid>
        </Grid>
    );
};

export default LoginForm;
