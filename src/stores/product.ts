/* eslint-disable @typescript-eslint/no-explicit-any */
import { backendUrls } from "constants/backendUrls"
import { UserMeta } from "interfaces/user"
import { cancelRequestAxios } from "utils/cancleRequest"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"
import { OperatingHoursData } from "components/hoursOfOperation/DisplayHoursOfOperation"

export interface Product {
  _id: string
  slug: string
  name: string
  category: {
    _id: string
    name: string
  }
  description: string
  subcategories: string[] | never[]
  logo?: string
  coverImage?: string
  whitepaperUrl?: string
  teams?: any[]
  url: string
  contactEmail?: string
  discord?: string
  telegram?: string
  twitterProfile?: string
  isClaimed?: boolean
  network?: string
  createdBy?: UserMeta
  owners?: UserMeta[] | never[]
  isSubscribed?: boolean
  isOwner?: boolean
  subscribersCount?: number
  createdAt?: string
  reviewCount?: number
  status?: "draft" | "published" | "reviewed" | "removed" | "rewarded" | "notReviewed"
  reviewDeadline?: number
  currentReviewCycle?: number;
  location?: string;
  openTime?: string;
  closeTime?: string;
  specialReviewRequest?: string;
  discountCode?: string;
  offer?: string;
  gallery?: any[];
  isClaiming?: boolean;
  updatedAt?: string;
  __v?: number;
  epoch?: number;
  normalizedTrustScore?: number;
  trustScore?: number;
  reward?: number
  operation?: OperatingHoursData
  ratingScore?: number
}
interface IProductFieldData {
  page: number
  limit: number
  total: number
  products: Product[] | any[]
}

interface IGenericProductActionProps {
  page?: number
  search?: string
  category?: string
  append?: boolean
  user?: string
}

interface ProductState {
  loading: boolean
  subscribeLoading: boolean
  error: string
  products: IProductFieldData
  pendingProducts: {
    products: Product[] | any[]
  }
  myProducts: IProductFieldData
  trending: Product[] | any[]
  mySubscription: IProductFieldData
  product: Product
}

interface IProductActions {
  addProduct: (data: any) => Promise<any>
  getPendingProducts: () => Promise<any>
  getProducts: ({
    page,
    append,
    search,
    category
  }: Omit<IGenericProductActionProps, "user">) => Promise<any>
  getMyProducts: ({
    page,
    append,
    search,
    user
  }: Omit<IGenericProductActionProps, "category">) => Promise<any>
  getMySubscription: ({
    page,
    append,
    search,
    user
  }: Omit<IGenericProductActionProps, "category">) => Promise<any>
  getProduct: (slug: string, currentUser: string) => Promise<any>
  subscribeProduct: (slug: string) => Promise<any>
  updateProduct: (productId: string, data: any) => Promise<any>
  uploadProductImage: (
    productId: string,
    image: File,
    type: "coverImage" | "logo"
  ) => Promise<any>
  removeProductImage: (
    productId: string,
    type: "coverImage" | "logo"
  ) => Promise<any>
  checkSlug: (slug: string) => Promise<any>
  checkClaim: (productId: string) => Promise<any>
  checkProductStatus: (productId: string) => Promise<any>
  addTeamMember: (productId: string, data: any) => Promise<any>
  removeTeamMember: (productId: string, data: any) => Promise<any>
  syncProduct: (productId: string) => Promise<any>
  getTrending: () => Promise<any>
  deleteProduct: (productId: string) => Promise<any>
  setCurrentProduct: (product: Product) => void
  resetCurrentProduct: () => void
}

const initialFieldData: IProductFieldData = {
  page: 0,
  limit: 0,
  total: 0,
  products: []
}

const initialState: ProductState = {
  loading: false,
  subscribeLoading: false,
  error: "",
  products: initialFieldData,
  pendingProducts: {
    products: []
  },
  myProducts: initialFieldData,
  mySubscription: initialFieldData,
  trending: [],
  product: {
    _id: "",
    slug: "",
    name: "",
    category: {
      _id: "",
      name: ""
    },
    description: "",
    subcategories: [],
    isSubscribed: false,
    url: "",
    reviewDeadline: 0
  }
}

const cancelRequestAxiosObject = new cancelRequestAxios()

export const useProductStore = create<ProductState & IProductActions>()(
  devtools((set, get) => ({
    ...initialState,
    addProduct: async (data: any) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post("/products", data)
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err?.response?.data?.message ?? "Product creation failed.", loading: false })
        // wait for 1 second to show error message
        throw new Error(err?.response?.data?.message ?? "Product creation failed.")
        return false
      }
    },
    updateProduct: async (productId: string, data: any) => {
      try {
        set({ loading: true })
        const { data: response } = await api.put(
          backendUrls.putUpdateProduct(productId),
          data
        )
        set({ loading: false })
        set({
          product: {
            ...get().product,
            ...(response.data || initialState.product)
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    checkSlug: async (slug: string) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(backendUrls.getCheckSlug(slug))
        set({ loading: false })
        return response.data.isSlugExists
      } catch (err: any) {
        set({ error: err?.response?.data?.message ?? err.message, loading: false })
        return false
      }
    },
    getProducts: async ({
      page = 1,
      search = "",
      category = "",
      append = false
    }) => {
      try {
        set({ loading: true })
        cancelRequestAxiosObject.cancelAndCreateToken()
        const { data: response } = await api.get(backendUrls.getProducts, {
          params: {
            page,
            limit: 8,
            search,
            category
          },
          cancelToken: cancelRequestAxiosObject.cancelRequest.token
        })
        cancelRequestAxiosObject.resetCancelToken()
        set({
          products: {
            ...response.data,
            products: append
              ? [...get().products.products, ...response.data.products]
              : response.data.products
          },
          loading: false
        })
      } catch (err: any) {
        console.debug("err", err)
        set({ error: err.message, loading: false })
      }
    },
    getPendingProducts: async () => {
      try {
        set({ loading: true })
        cancelRequestAxiosObject.cancelAndCreateToken()
        const { data: response } = await api.get(
          "/products/getPendingProducts",
          {
            cancelToken: cancelRequestAxiosObject.cancelRequest.token
          }
        )
        cancelRequestAxiosObject.resetCancelToken()
        set({
          pendingProducts: {
            products: response.data.products
          },
          loading: false
        })
      } catch (err: any) {
        console.debug("err", err)
        set({ error: err.message, loading: false })
      }
    },
    getMyProducts: async ({
      page = 1,
      search = "",
      append = false,
      user = ""
    }) => {
      try {
        set({ loading: true })
        cancelRequestAxiosObject.cancelAndCreateToken()
        const { data: response } = await api.get(backendUrls.getMyProducts, {
          params: {
            page,
            limit: 9,
            search,
            user
          },
          cancelToken: cancelRequestAxiosObject.cancelRequest.token
        })
        cancelRequestAxiosObject.resetCancelToken()
        set({
          myProducts: {
            ...response.data,
            products: append
              ? [...get().myProducts.products, ...response.data.products]
              : response.data.products
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getMySubscription: async ({
      page = 1,
      search = "",
      append = false,
      user = ""
    }) => {
      try {
        set({ loading: true })
        cancelRequestAxiosObject.cancelAndCreateToken()
        const { data: response } = await api.get(
          "/subscriptions/mySubscriptions",
          {
            params: {
              page,
              limit: 9,
              search,
              user
            },
            cancelToken: cancelRequestAxiosObject.cancelRequest.token
          }
        )
        cancelRequestAxiosObject.resetCancelToken()
        set({
          mySubscription: {
            ...response.data,
            products: append
              ? [...get().mySubscription.products, ...response.data.products]
              : response.data.products
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getProduct: async (slug: string, currentUser: string) => {
      try {
        set({ loading: true, product: initialState.product })
        const { data: response } = await api.get(backendUrls.getProduct(slug), {
          params: {
            currentUser
          }
        })
        set({ product: response.data || initialState.product, loading: false })
        return true
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    subscribeProduct: async (productId: string) => {
      try {
        set({ subscribeLoading: true })
        const { data: response } = await api.post(
          backendUrls.postSubscribeProduct(productId)
        )
        if (response.status === "success") {
          set({
            product: {
              ...get().product,
              isSubscribed: !get().product.isSubscribed,
              subscribersCount: response.data.subscribersCount || 0
            },
            products: {
              ...get().products,
              products: get().products.products.map((product: any) => {
                if (product._id === productId) {
                  return {
                    ...product,
                    isSubscribed: !product.isSubscribed,
                    subscribersCount: response.data.subscribersCount || 0
                  }
                }
                return product
              })
            },
            myProducts: {
              ...get().myProducts,
              products: get().myProducts.products.map((product: any) => {
                if (product._id === productId) {
                  return {
                    ...product,
                    isSubscribed: !product.isSubscribed,
                    subscribersCount: response.data.subscribersCount || 0
                  }
                }
                return product
              })
            },
            mySubscription: {
              ...get().mySubscription,
              products: get().mySubscription.products.map((product: any) => {
                if (product._id === productId) {
                  return {
                    ...product,
                    isSubscribed: !product.isSubscribed,
                    subscribersCount: response.data.subscribersCount || 0
                  }
                }
                return product
              })
            },
            subscribeLoading: false
          })
        }
      } catch (err: any) {
        set({ error: err.message, subscribeLoading: false })
      }
    },
    uploadProductImage: async (productId, image, type) => {
      try {
        set({ loading: true })
        const formData = new FormData()
        formData.append("image", image)
        formData.append("type", type)
        const { data: response } = await api.post(
          backendUrls.postUploadProductImage(productId),
          formData
        )
        set({ loading: false })
        set({
          product: {
            ...get().product,
            [type]: response.data[type]
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    removeProductImage: async (productId, type) => {
      set({ loading: true })
      try {
        const { data: response } = await api.post(
          backendUrls.postRemoveProductImage(productId),
          {
            type
          }
        )
        set({ loading: false })
        set({
          product: {
            ...get().product,
            [type]: ""
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    checkClaim: async (productId: string) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          backendUrls.postCheckClaim(productId)
        )
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return (
          err?.response?.data || { status: "error", message: "Failed to claim" }
        )
      }
    },
    checkProductStatus: async (productId: string) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          backendUrls.postCheckProductStatus(productId)
        )
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return (
          err?.response?.data || {
            status: "error",
            message: "Failed to get product status"
          }
        )
      }
    },
    addTeamMember: async (productId: string, data: any) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          backendUrls.postAddTeamMember(productId),
          data
        )
        set({ loading: false })
        set({
          product: {
            ...get().product,
            teams: response.data.teams
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    removeTeamMember: async (productId: string, data: any) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          backendUrls.postRemoveTeamMember(productId),
          data
        )
        set({ loading: false })
        set({
          product: {
            ...get().product,
            teams: response.data.teams
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    syncProduct: async (productId) => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(
          backendUrls.postSyncProduct(productId)
        )
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    getTrending: async () => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(backendUrls.getTrending)
        set({ trending: response.data.trending, loading: false })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    deleteProduct: async (productId: string) => {
      try {
        set({ loading: true })
        const { data: response } = await api.delete(
          backendUrls.deleteProduct(productId)
        )
        set({ loading: false, product: initialState.product })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    setCurrentProduct: (product) => {
      set({ product: product || initialState.product })
    },
    resetCurrentProduct: () => set({ product: initialState.product })
  }))
)
