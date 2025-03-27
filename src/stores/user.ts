/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios"
import { constants } from "constants/common"
import jwt from "jsonwebtoken"
import { Preference } from "modules/onboarding/components/Preferences"
import { cancelRequestAxios } from "utils/cancleRequest"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import jwt_decode from "jwt-decode"
import { supportingWallets } from "modules/connection/ConnectionItem"

interface ISecondayWallet {
  walletType: supportingWallets,
  adddress: string,
}

interface ISocial {
  provider: "X" | "Google",
  providerId: string,
}

export interface User {
  _id: string
  achievementPoints: string
  badge: string[]
  bestDescribeInCheckerchain: string
  createdAt: string
  follower: number
  following: number
  isProfileComplete: boolean
  lastLoginAt: string
  level: string
  name: string
  personalGoalForCheckingPost: number
  points: number
  preference: Preference[]
  profilePicture?: string | null
  coverImage?: string | null
  rank: number
  wallet: string
  secondaryWallet: ISecondayWallet[]
  socialType?: ISocial,
  bio?: string
  username: string
  followed: boolean
  referralCode: string
  email?: string
  emailVerified: boolean
  emailNotification: boolean
  profileScore?: number
  reward?: number;
  totalReward?: number;
  isVerified?: boolean
  nextCreateProductTime?: number
}

export interface LeaderboardUser {
  username: string
  wallet: string
  points: number
  rank: number
  previousRank: number
  name: string
  image?: string
  profileScore?: number
}

export interface LeaderboardState {
  myRank: number
  users: LeaderboardUser[]
}


export interface WalletData {
  provider: supportingWallets,
  account: string
  isPrimary: boolean,
}

interface UserState {
  onboarding: User
  loading: boolean
  isOnboardedLoaded: boolean
  preferenceLoading: boolean
  error: string
  wallet: string
  // for tracking initial wallet sign up
  signInWallet?: WalletData,
  addingWallet?: WalletData,
  signInWithWallet: (walletData: WalletData) => void
  connectAdditionalWallet: (walletData: WalletData) => void
  authorization: string
  user: User
  otherUser: User
  isOnboarded: boolean
  isLoggedIn: boolean,
  followers: object[]
  followings: object[]
  referrals: any
  recommendedFollowers: User[]
  setAuthorization: (token: string) => void
  getMe: (token: string) => void,
  getReferrals: () => void
  setOnboarding: (data: object) => void
  checkOnboarded: () => void
  connectWallet: (walletData: WalletData) => void
  addAdditionalWallet: (walletData: WalletData) => void
  fetchProfile: () => void
  checkIsProfileComplete: () => void
  followUser: (wallet: string, updateOtherUser?: boolean) => Promise<any>
  getFollowers: (wallet: string) => void
  getFollowings: (wallet: string) => void
  getRecommendedFollowers: () => void
  editProfile: (user: object) => void
  fetchOtherProfile: (username: string) => void
  connectedLeaderboards: LeaderboardState
  globalLeaderboards: LeaderboardState
  fetchConnectedLeaderboards: () => void
  fetchGlobalLeaderboards: () => void
  updatePreferences: (title: string, subcategories: string[]) => void
  // updateProfileImage: (data: FormData) => any
  checkUsernameExists: (username: string) => any
  checkEmailExists: (email: string) => any
  signup: (walletData: WalletData) => any
  checkWalletExists: (walletData: WalletData) => Promise<any>
  reset: () => void
  searchUsers: (query: string) => Promise<any>
  uploadImage: (
    image: File,
    type: "coverImage" | "profilePicture"
  ) => Promise<any>
  removeImage: (type: "coverImage" | "profilePicture") => Promise<any>
  resendVerificationEmail: () => Promise<any>
}

const initialUserState: User = {
  _id: "",
  achievementPoints: "",
  badge: [],
  bestDescribeInCheckerchain: "",
  createdAt: "",
  follower: 0,
  following: 0,
  isProfileComplete: false,
  lastLoginAt: "",
  level: "",
  name: "",
  personalGoalForCheckingPost: 0,
  points: 0,
  preference: [],
  profilePicture: "",
  rank: 0,
  wallet: "",
  secondaryWallet: [],
  username: "",
  followed: false,
  referralCode: "",
  email: "",
  emailVerified: false,
  emailNotification: false,
  isVerified: false,
  nextCreateProductTime: 0,
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

api.interceptors.request.use((config: AxiosRequestConfig) => {
  // eslint-disable-next-line no-param-reassign
  if (window.localStorage.getItem("token")) {
    const token = window.localStorage.getItem("token") as string
    try {
      const decoded = jwt_decode(token) as any
      if (decoded.exp < Date.now() / 1000) {
        window.localStorage.removeItem("token")
      } else {
        config.headers = {
          Authorization: token ? `Bearer ${token || ""}` : ""
        }
      }
    } catch (error) {
      window.localStorage.removeItem("token")
    }

  }
  return config
})

const initialState = {
  onboarding: initialUserState,
  wallet: "",
  authorization: "",
  user: initialUserState,
  otherUser: initialUserState,
  isOnboarded: false,
  isOnboardedLoaded: false,
  isLoggedIn: false,
  loading: false,
  preferenceLoading: false,
  error: "",
  followers: [],
  followings: [],
  recommendedFollowers: [],
  referrals: {},
  connectedLeaderboards: {
    myRank: 0,
    users: []
  },
  globalLeaderboards: {
    myRank: 0,
    users: []
  }
}

const cancelRequestAxiosObject = new cancelRequestAxios()

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    ...initialState,
    setAuthorization: (token: string) => {
      set({ authorization: token })
    },
    getMe: async (token) => {
      try {
        set({ loading: true })
        const { data } = await api.get(`/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        set({ user: data.user, loading: false })
        set({ authorization: token });
      } catch (error) {
        return false;
      }
    },
    setOnboarding: (data: object) => {
      const userEmail = get()?.user?.email;
      const onBoardingEmail = userEmail ? undefined : get().onboarding.email;
      set({ onboarding: { ...get().onboarding, ...data, email: onBoardingEmail, } })
    },
    checkUsernameExists: async (username: string) => {
      try {
        const { data } = await api.get(`/checkUsername?username=${username}`, {
          headers: {
            Authorization: `Bearer ${get().authorization}`
          }
        })
        return data.exists
      } catch (error) {
        return false
      }
    },
    checkEmailExists: async (email) => {
      try {
        const { data } = await api.get(`/checkEmail?email=${email}`, {
          headers: {
            Authorization: `Bearer ${get().authorization}`
          }
        })
        return data.exists
      } catch (error) {
        return false
      }
    },
    checkWalletExists: async (walletData: WalletData) => {
      return api.get(`/checkWallet?address=${walletData.account}&walletType=${walletData.provider}&isPrimary=${walletData.isPrimary}`)
    },
    checkOnboarded: async () => {
      set({ loading: true })
      const { data } = await api.get(`/checkOnboarded`, {
        headers: {
          Authorization: `Bearer ${get().authorization}`
        }
      });
      set({
        isOnboarded: data["isOnboarded"],
        isOnboardedLoaded: true,
        loading: false
      })
    },
    connectWallet: async (walletData: WalletData) => {
      set({ loading: true })
      const { data } = await api.post(`/connect`, {
        walletToken: jwt.sign(
          {
            address: walletData.account,
            walletType: walletData.provider,
            isPrimary: walletData.isPrimary,
          },
          constants.WALLET_PVT_KEY,
          {
            expiresIn: 60 * 1000
          }
        )
      })
      window.localStorage.setItem("token", data["accessToken"])
      window.localStorage.setItem("rtoken", data["refreshToken"])
      set({ wallet: walletData.account, authorization: data["accessToken"] || "", loading: false })
    },
    addAdditionalWallet: async (walletData: WalletData) => {
      set({ loading: true })
      const { data } = await api.post(`/addWallet`, {
        walletToken: jwt.sign(
          {
            address: walletData.account,
            walletType: walletData.provider,
            isPrimary: walletData.isPrimary,
          },
          constants.WALLET_PVT_KEY,
          {
            expiresIn: 60 * 1000
          }
        ),
        headers: {
          Authorization: `Bearer ${get().authorization}`
        }
      });

      set({ user: data.user, loading: false })
    },
    signup: async (walletData: WalletData) => {
      set({ loading: true })
      const { data } = await api.post(`/signup`, {
        walletToken: jwt.sign(
          {
            address: walletData.account,
            walletType: walletData.provider,
            isPrimary: walletData.isPrimary,
          },
          constants.WALLET_PVT_KEY,
          {
            expiresIn: 60 * 1000
          }
        )
      })
      window.localStorage.setItem("token", data["accessToken"])
      window.localStorage.setItem("rtoken", data["refreshToken"])
      set({ wallet: walletData.account, authorization: data["accessToken"] || "", loading: false })
    },
    editProfile: async (user: object) => {
      set({ loading: true, preferenceLoading: true })
      const { data } = await api.post(
        `/editProfile`,
        {
          walletId: get().wallet,
          ...user
        },
        {
          headers: {
            Authorization: `Bearer ${get().authorization}`
          }
        }
      )
      set({
        loading: false,
        user: data.user,
        preferenceLoading: false
      })
      return data
    },
    updatePreferences: (title: string, subcategories: string[]) => {
      const preference = get().user?.preference.map((each) => {
        if (each.category === title) {
          return {
            category: title,
            subcategory: subcategories
          }
        }
        return each
      })
      if (preference.every((item) => item.category !== title)) {
        preference.push({
          category: title,
          subcategory: subcategories
        })
      }
      set({ user: { ...get().user, preference } })
    },
    // updateProfileImage: async (data: FormData) => {
    //   set({ loading: true })
    //   data.append("wallet", get().wallet)
    //   const { data: result } = await api.post(`/editProfile`, data, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //       Authorization: `Bearer ${get().authorization}`
    //     }
    //   })
    //   const user = result.user
    //   user.profilePicture = `${user.profilePicture}?v=${Date.now()}`
    //   set({ loading: false, user })
    //   return result
    // },
    fetchProfile: async () => {
      set({ loading: true })
      const { data } = await api.get(`/myProfile`, {
        headers: {
          Authorization: `Bearer ${get().authorization}`
        }
      })
      data && data.user && set({ user: data.user, loading: false, isLoggedIn: true })
    },
    fetchOtherProfile: async (username: string) => {
      console.log("fetch other profile called: ")
      set({
        loading: true,
        otherUser: initialUserState
      })

      const { data } = await api.get(`/users/${username}`, {
        params: {
          wallet: get().wallet
        }
      })

      console.log("feth other profile data is: ", data);
      set({ otherUser: data.user, loading: false })
    },
    checkIsProfileComplete: async () => {
      console.log("check is porifle comeplete called")
      if (get().wallet) {
        set({ loading: true })
        const { data } = await api.get(`/isCompleteProfile`)
        set({ isOnboarded: data.isProfileComplete, loading: false })
      }
    },
    followUser: async (wallet, updateOtherUser = true) => {
      if (get().wallet) {
        set({ loading: true })
        const response = await api.post(
          `/follow`,
          {
            followFrom: get().wallet,
            followTo: wallet
          },
          {
            headers: {
              Authorization: `Bearer ${get().authorization}`
            }
          }
        )
        set({
          loading: false,
          user: {
            ...get().user,
            following: response.data.data.following,
            points: response.data.data.points
          },
          ...(updateOtherUser
            ? {
              otherUser: {
                ...get().otherUser,
                follower: response.data.data.toFollowers,
                followed: !get().otherUser.followed,
                points: response.data.data.toPoints
              }
            }
            : {})
        })
        return response
      }
    },
    getFollowers: async (wallet) => {
      if (wallet) {
        set({ loading: true })
        const { data } = await api.get(`/followerList/${wallet}`, {
          headers: {
            Authorization: `Bearer ${get().authorization}`
          },
          params: {
            currentWallet: get().wallet
          }
        })
        set({ followers: data.follower, loading: false })
      }
    },
    getFollowings: async (wallet) => {
      if (wallet) {
        set({ loading: true })
        const { data } = await api.get(`/followingList/${wallet}`, {
          headers: {
            Authorization: `Bearer ${get().authorization}`
          },
          params: {
            currentWallet: get().wallet
          }
        })
        set({ followings: data.following, loading: false })
      }
    },
    getRecommendedFollowers: async () => {
      try {
        set({ loading: true })
        const { data } = await api.get(`/recommendedFollowers`, {
          headers: {
            Authorization: get().authorization
              ? `Bearer ${get().authorization}`
              : ""
          }
        })
        set({
          recommendedFollowers: data.users,
          loading: false
        })
      }
      catch (err) {
        console.log(err, "er")
        set({ loading: false })
      }

    },
    fetchConnectedLeaderboards: async () => {
      set({ loading: true })
      const { data } = await api.get("/leaderboard/connected", {
        headers: {
          Authorization: `Bearer ${get().authorization}`
        },
        params: {
          wallet: get().wallet
        }
      })
      set({ connectedLeaderboards: data.data })
      set({ loading: false })
    },
    fetchGlobalLeaderboards: async () => {
      set({ loading: true })
      let wallet: any = null;
      if (window.localStorage.getItem("token")) {
        const token = window.localStorage.getItem("token") as string
        try {
          const decoded = jwt_decode(token) as any
          wallet = decoded.wallet
        } catch (error) {
          window.localStorage.removeItem("token")
        }
      }
      const { data } = await api.get("/leaderboard/global", {
        headers: {
          Authorization: `Bearer ${get().authorization}`
        },
        params: wallet ? {
          wallet
        } : {}
      })
      set({ globalLeaderboards: data.data })
      set({ loading: false })
    },
    getReferrals: async () => {
      const { data } = await api.get("/getReferrals", {
        headers: {
          Authorization: `Bearer ${get().authorization}`
        },
        params: {
          wallet: get().wallet
        }
      })
      set({ referrals: data.referrals })
      // set({ loading: false })
    },
    searchUsers: async (query: string) => {
      if (!query) {
        return []
      }
      cancelRequestAxiosObject.cancelAndCreateToken()
      const { data } = await api.get("/users", {
        params: {
          search: query
        },
        cancelToken: cancelRequestAxiosObject.cancelRequest.token
      })
      cancelRequestAxiosObject.resetCancelToken()
      return data.users
    },
    uploadImage: async (image, type) => {
      try {
        set({ loading: true })
        const formData = new FormData()
        formData.append("image", image)
        formData.append("type", type)
        const { data: response } = await api.post(`/uploadImage`, formData)
        // console.debug(response)
        set({ loading: false })
        set({
          user: {
            ...get().user,
            [type]: response.data[type]
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    removeImage: async (type) => {
      set({ loading: true })
      try {
        const { data: response } = await api.post(`/removeImage`, {
          type
        })
        // console.debug(response)
        set({ loading: false })
        set({
          user: {
            ...get().user,
            [type]: ""
          }
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    resendVerificationEmail: async () => {
      set({ loading: true })
      try {
        const { data: response } = await api.post(`/sendVerificationEmail`)
        // console.debug(response)
        set({ loading: false })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return (
          err?.response?.data || {
            status: "error",
            message: "Verification email failed to send"
          }
        )
      }
    },
    reset: () => set(initialState),
    signInWithWallet: (walletData: WalletData) => set({ signInWallet: walletData }),
    connectAdditionalWallet: (walletData: WalletData) => set({ addingWallet: walletData }),
  }))
)