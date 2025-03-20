import { ProductProps } from "modules/product"
import { AboutProduct } from "modules/product/components/productDescription/AboutProduct"
// import RatingStarView from "components/ratingStar/RatingStarView"
import { SubCategoriesChips } from "modules/product/components/SubCategories"
import { ProductActivity } from "./ProductActivity"
import ClaimProduct from "./ClaimProduct"
import SocialMedia from "./SocialMedia"
import DisplayHoursOfOperation from "components/hoursOfOperation/DisplayHoursOfOperation"
// import MyTeams from "./MyTeams"

type Props = ProductProps

const ProductDescription = ({
  description,
  isCreateProduct,
  subcategories,
  createdBy,
  claimedBy,
  operation
}: Props) => {
  return (
    <div className="mt-3">
      {/*
      SSUBSCRIBE CODE
      <Button
                variant="default"
                title={
                  product.isSubscribed && !isCreateProduct
                    ? "Subscribed"
                    : "Subscribe"
                }
                titleClassName="font-[500]"
                startIcon={<Icons.OutlinedStar className="text-white" />}
                className={`${product.isSubscribed && "bg-neutral-200"}`}
                onClick={() => {
                  if (product._id) {
                    subscribeProduct(product._id)
                  }
                }}
                disabled={isCreateProduct || !authorization}
              /> */}
      {/* hidden for RatingOverCard */}
      {/* <div className="flex gap-2 items-center">
        <RatingStarView rating={3.5} />
        <div className="text-base font-normal text-neutral-600 tracking-[0.02em]">
          1,246
        </div>
      </div> */}

      <div className="mt-4 flex flex-wrap gap-2 w-full max-h-[60px] overflow-auto">
        <SubCategoriesChips subcategories={subcategories} />{" "}
      </div>

      <div className="h-[2px] w-full bg-separator my-6" />

      <AboutProduct
        description={description}
        isCreateProduct={isCreateProduct}
      />
      {!isCreateProduct && <DisplayHoursOfOperation data={operation!} />}
      {!isCreateProduct && <SocialMedia />}
      <ProductActivity createdBy={createdBy} claimedBy={claimedBy} />
      <ClaimProduct isCreateProduct={isCreateProduct} />
      {/* <MyTeams isCreateProduct={isCreateProduct} /> */}
    </div>
  )
}

export default ProductDescription
