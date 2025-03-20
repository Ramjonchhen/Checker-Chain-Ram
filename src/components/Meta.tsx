import Head from "next/head"
import React from "react"

interface MetaProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

const Meta: React.FC<MetaProps> = ({
  title = "CheckerChain - Crypto Reviews",
  description = "CheckerChain is an AI powered trustless review to earn dApp. Read, write and share crypto reviews. Learn how to earn crypto and get paid to write reviews.",
  keywords = "CheckerChain, Review to Earn, Trustless reviews, Crypto Reviews, Reviews of crypto projects, Reviews of web3 projects, Reviews of dApps, Reviews of NFTs, Reviews of cryptocurrency, Earn money by reviewing, how to earn money by reviewing, how to earn crypto by reviewing, get paid to write reviews, legit apps for making money, crypto reviews, write reviews for money, get paid to review products, earn in reviews, earn crypto, how to make money on crypto, write review and earn money",
  image = "",
  url = ""
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta content={description} name="description" />
      <meta content={title} name="title" />
      <meta
        content={`${keywords}, multiversx crypto, xPortal, Elrond ,app checker, user reviews`}
        name="keywords"
      />
      <meta content="follow, index" name="robots" />
      <meta
        name="twitter:card"
        content="summary_large_image
"
      />
      <meta content={title} name="twitter:title" />
      <meta content={description} name="twitter:description" />
      <meta
        content={
          image && image !== ""
            ? image
            : "https://assets.checkerchain.com/images/CheckerChainApp.png"
        }
        name="twitter:image"
      />
      <meta content={`https://app.checkerchain.com/${url}`} property="og:url" />
      <meta
        content={
          image && image !== ""
            ? image
            : "https://assets.checkerchain.com/images/CheckerChainApp.png"
        }
        property="og:image"
      />
      <meta property="og:type" content="website" />
      <meta content={title} property="og:title" />
      <meta name="twitter:creator" content="@checker_chain" />
      <meta name="twitter:site" content="@checker_chain" />

      <meta property="og:site_name" content="CheckerChain" />
      <meta
        name="og:description"
        property="og:description"
        content={description}
      />
    </Head>
  )
}

export default Meta
