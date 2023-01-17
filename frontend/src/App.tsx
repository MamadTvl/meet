import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Routes, Route } from 'react-router-dom';
import ThemeProvider from './component/theme/context/ThemeProvider';
import { CssBaseline } from '@mui/material';
import Home from './component/pages/Home';
import Profile from './component/pages/Profile';
import Room from './component/pages/Room';
import Login from './component/pages/Login';
import Layout from './component/layout';
import { Router } from './component/link/Link';
import SignUp from './component/pages/SignUp';
import { SnackbarProvider } from 'notistack';

const App: React.FC = () => {
    return (
        <Router>
            <ThemeProvider>
                <CssBaseline />
                <SnackbarProvider>
                    <Layout>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='/sign-up' element={<SignUp />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/room/:id' element={<Room />} />
                        </Routes>
                    </Layout>
                </SnackbarProvider>
            </ThemeProvider>
        </Router>
    );
};

export default App;
