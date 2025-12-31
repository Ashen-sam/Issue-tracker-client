import { AuthLayout } from '@/layout'
import { Login, Register } from '@/pages'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([

    {
        path: '',
        element: <AuthLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            }
        ]
    }


])