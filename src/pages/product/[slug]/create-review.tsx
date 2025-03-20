import axios from "axios"
import Layout from "layout"
import { GetServerSideProps, NextPage } from "next"
import { Product as ProductInterface } from "stores/product"
import { CreateReview } from "modules/product/review/CreateReview"

const CreateReviewPage: NextPage<{
  product: ProductInterface
}> = ({ product }) => {
  return (
    <Layout>
      <CreateReview product={product} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query
  // console.debug(slug)
  try {
    const { data: response } = await axios.get(`/products/${slug}`, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
    })

    return {
      props: {
        product: response.data as ProductInterface
      }
    }
  } catch (error) {
    console.debug(error)
    return {
      props: {
        product: {} as ProductInterface
      }
    }
  }
}

export default CreateReviewPage
