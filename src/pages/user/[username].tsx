import axios from "axios"
import { Meta } from "components"
import { backendUrls } from "constants/backendUrls"
import { useWallet } from "hooks/useWallet"
import { ITrendingProducts } from "interfaces/trending"
import { UserMeta } from "interfaces/user"
import Layout from "layout"
import { Profile } from "modules/profile"
import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"
import { useUserStore } from "stores"

const ProfilePage: NextPage<{
  otherUserMeta: UserMeta
  trendingProductsData: ITrendingProducts[]
}> = ({ otherUserMeta, trendingProductsData = [] }) => {
  const { fetchOtherProfile, otherUser, authorization, user } = useUserStore(
    (state) => state
  )

  const {
    wallet: { address }
  } = useWallet()
  useEffect(() => {
    if (
      user.username !== otherUserMeta.username &&
      otherUser.username !== otherUserMeta.username
    ) {
      fetchOtherProfile(otherUserMeta.username)
    }
  }, [otherUserMeta, authorization, user, otherUser, address])

  const selectedUserData =
    user.username === otherUserMeta.username ? user : otherUser

  const metaUserText = `${otherUserMeta?.name || ""} (@${
    otherUserMeta?.username || ""
  })`

  const metaTitle = `${metaUserText}'s profile on CheckerChain | CheckerChain - Crypto Reviews`

  const metaDescription = `See all the projects and products listed, reviewed or liked by ${metaUserText} with earnings and follower details on CheckerChain`

  return (
    <Layout>
      <Meta
        title={metaTitle}
        description={metaDescription}
        image={`${process.env.NEXT_PUBLIC_SPACE_BASE}/${
          otherUserMeta.profilePicture || ""
        }`}
        url={`/user/${otherUserMeta.username || ""}`}
      />
      <Profile
        user={selectedUserData}
        trendingProductsData={trendingProductsData}
      />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let trendingProductsData: ITrendingProducts[] = [] as ITrendingProducts[]
  let user: UserMeta = {
    _id: "",
    bio: "",
    name: "",
    wallet: "",
    username: "",
    profilePicture: "",
    follower: 0,
    following: 0,
    profileScore: 0
  }

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/getMetaData`,
      {
        params: {
          username: context.query.username
        }
      }
    )
    user = data.user as UserMeta
  } catch (err) {
    console.error(err)
  }

  try {
    const { data } = await axios.get(backendUrls.getTrendingItems("products"), {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
    })
    // @ts-ignore
    trendingProductsData = data?.data.slice(0, 5) as ITrendingProducts[]
    // @ts-ignore
  } catch (err) {
    console.log(err)
  }

  return {
    props: {
      otherUserMeta: user,
      meta: {
        title: `${user.name} (@${user.username})'s profile on CheckerChain`,
        description: `See all the projects and products listed, reviewed or liked by ${user.name} (@${user.username}) with earnings and follower details on CheckerChain`,
        image: `${process.env.NEXT_PUBLIC_SPACE_BASE}/${
          user.profilePicture || ""
        }`,
        url: `/user/${user.username || ""}`
      },
      trendingProductsData
    }
  }
}

export default ProfilePage
