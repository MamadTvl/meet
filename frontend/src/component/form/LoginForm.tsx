import {
    Box,
    Button,
    FormControl,
    Grid,
    styled,
    TextField,
    Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Api,
    apiEndpoint,
    LoginApiFailedResult,
    LoginApiResult,
} from '../../utils/Api';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useSnackbar } from 'notistack';

const loginSchema = yup.object({
    phone: yup
        .string()
        .matches(/[0][9][0-9]{9}/, {
            message: 'Your phone number is not valid',
        })
        .required('Enter Your Phone Number'),
    password: yup.string().required('Enter your password'),
});

type LoginForm = yup.InferType<typeof loginSchema>;

const LoginForm = () => {
    const { enqueueSnackbar } = useSnackbar();
    const formik = useFormik<LoginForm>({
        initialValues: { password: '', phone: '' },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                const response = await Api<
                    LoginApiResult,
                    AxiosResponse<LoginApiResult>,
                    LoginForm
                >(apiEndpoint.login, {
                    method: 'POST',
                    data: {
                        ...values,
                    },
                });
                enqueueSnackbar(response.data.message, { variant: 'success' });
                localStorage.setItem('meet-token', response.data.token);
            } catch (err: any) {
                enqueueSnackbar(err.response.data.message, {
                    variant: 'error',
                });
            }
        },
    });

    return (
        <Grid
            container
            component={'form'}
            onSubmit={formik.handleSubmit}
            spacing={2}
            direction={'column'}
            alignItems={'center'}>
            <Grid item xs={12}>
                <Typography variant='h4'>{'Login'}</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    type='tel'
                    name='phone'
                    placeholder='Phone'
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
                <TextField
                    type='password'
                    name='password'
                    placeholder='Password'
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
