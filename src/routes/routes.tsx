import { AuthLayout, MainLayout } from '@/layout'
import { Dashboard, Issue, IssueTabs, Landing, Login, Overview, Register, Settings } from '@/pages'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([

    {
        path: '',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
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
                element: <Issue />,
                children: [

                    {
                        path: "/issues/:issueId",
                        element: <IssueTabs />,
                        children: [
                            {
                                index: true,
                                element: <Overview />
                            }
                        ]
                    }
                ]
            },
            {
                path: '/settings',
                element: <Settings />,
            }



        ]
    }


])