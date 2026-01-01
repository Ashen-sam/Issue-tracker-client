import { AuthLayout, MainLayout } from '@/layout'
import { Dashboard, Issue, Login, Register } from '@/pages'
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

    },
    {
        path: '',
        element: <MainLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/issues',
                element: <Issue />
            },

        ]
    }


])