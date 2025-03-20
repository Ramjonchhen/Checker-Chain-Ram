import React from "react"
import type { NextPage } from "next"
import Layout from "layout"
import { Meta } from "components"
import { SearchComponent } from "modules/search"

const SearchPage: NextPage = () => {
  return (
    <Layout>
      <Meta
        title={`CheckerChain - Crypto Reviews | CheckerChain`}
        url="/search"
      />
      <SearchComponent />
    </Layout>
  )
}

export default SearchPage
