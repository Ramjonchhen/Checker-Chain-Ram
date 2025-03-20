// import { Meta } from "components"
// import ProductImage from "assets/images/avatar/nftavatar.png"
import axios from "axios"
import { constants } from "constants/common"
import { UserMeta } from "interfaces/user"
import Layout from "layout"
import { Product } from "modules/product"
import { GetServerSideProps, NextPage } from "next"
import { useEffect } from "react"

import { useProductStore, Product as ProductInterface } from "stores/product"
import { useUserStore } from "stores"
import { twMerge } from "tailwind-merge"
import { extractXcharactersFromText } from "utils/helper"
import { useRouter } from "next/router"
import { useToastStore } from "stores/toast"

const ProductPage: NextPage<{
  product: ProductInterface
}> = ({ product }) => {
  const { resetCurrentProduct, getProduct } = useProductStore((state) => state)
  const { errorToast } = useToastStore()
  const router = useRouter()

  const { user } = useUserStore()

  useEffect(() => {
    // can be refactored more to avoid dupliacte api calls
    getProduct(product.slug, user._id).then((found) => {
      if (!found) {
        errorToast({
          message: "Product not found"
        })
        router.replace("/")
      }
    })
    return () => resetCurrentProduct()
  }, [product, user._id])

  const { name: productName = "" } = product

  const { metaDescription, metaTitle } = getMetaTextAndDesc(
    productName,
    product?.description
  )

  return (
    <Layout
      meta={{
        title: metaTitle,
        description: metaDescription,
        image: `${process.env.NEXT_PUBLIC_SPACE_BASE}${product?.logo || ""}`,
        url: `/product/${product?.slug || ""}`
      }}
    >
      {/* <Meta
        title={metaTitle}
        description={metaDescription}
        // image={`${process.env.NEXT_PUBLIC_SPACE_BASE}${product?.logo || ""}`}
        url={`/product/${product?.slug || ""}`}
      /> */}
      <div className={twMerge(`${constants.APP_CONTAINER_WIDTH}`)}>
        <Product
          className="px-0 sm:px-8 pt-0 sm:pt-5 bg-[#F7F7F7]"
          category={product?.category?.name}
          description={product?.description}
          title={productName}
          subcategories={product?.subcategories ?? []}
          image={product.logo ?? ""}
          createdBy={product?.createdBy as UserMeta}
          url={product?.url || ""}
          whitepaperUrl={product?.whitepaperUrl || ""}
          claimedBy={
            product?.owners && product.owners.length > 0
              ? product.owners[0]
              : undefined
          }
          coverImage={product?.coverImage}
          reviewDeadline={product?.reviewDeadline}
          operation={product?.operation}
        />
      </div>
    </Layout>
  )
}

function getMetaTextAndDesc(productName = "", description = "") {
  const metaTitle = `${productName} Reviews and Ratings | CheckerChain - Crypto Reviews`

  const metaDescription = extractXcharactersFromText({
    text: `${productName} Reviews and Ratings - ${description}`,
    startCount: 0,
    endCount: 161
  })

  return {
    metaTitle,
    metaDescription
  }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query

  try {
    const { data: response } = await axios.get(`/products/${slug}`, {
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
    })
    const product = response.data as ProductInterface
    const { metaTitle, metaDescription } = getMetaTextAndDesc(
      product?.name,
      product?.description
    )

    return {
      props: {
        product,
        meta: {
          title: metaTitle,
          description: metaDescription,
          image: `${process.env.NEXT_PUBLIC_SPACE_BASE}${
            product?.coverImage || ""
          }`,
          url: `/product/${product?.slug || ""}`
        }
      }
    }
  } catch (error) {
    console.log(error)
    return {
      props: {
        product: {} as ProductInterface
      }
    }
  }
}

export default ProductPage
