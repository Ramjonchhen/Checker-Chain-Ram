import { Button } from 'components'
import Layout from 'layout'
import React from 'react'

const NotFoundPage = () => {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-2xl font-bold">Page not found</p>
                <Button onClick={() => {
                    window.location.href = "/"
                }} className="mt-4">
                    Go back home
                </Button>
            </div>
        </Layout>
    )
}

export default NotFoundPage
