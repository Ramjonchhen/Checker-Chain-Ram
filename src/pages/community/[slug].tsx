import Layout from 'layout'
import { DiscussionDetail } from 'modules/discussions'
import { NextPage } from 'next'
import React from 'react'

const DiscussionDetailPage:NextPage = () => {
  return (
    <Layout>
        <DiscussionDetail/>
    </Layout>
  )
}

export default DiscussionDetailPage