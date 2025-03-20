/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserMeta } from "interfaces/user"
import {create} from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "./user"

export interface Discussion {
  _id: string
  title: string
  description: string
  category: {
    _id: string
    name: string
  }
  images?: string[]
  slug: string
  createdBy: UserMeta
  createdAt?: string
  votes?: number
  isUpVoted?: boolean
  isDownVoted?: boolean
  comments?: number
}

export interface Comment {
  _id: string
  comment: string
  createdBy: UserMeta
  parent?: string
  createdAt: string
  repliesCount: number
}

interface DiscussionState {
  loading: boolean
  error: string
  currentDiscussion: string
  discussions: {
    page: number
    limit: number
    total: number
    discussions: Discussion[] | never[]
  }
  myDiscussions: {
    page: number
    limit: number
    total: number
    discussions: Discussion[] | never[]
  }
  comments: {
    page: number
    limit: number
    total: number
    comments: Comment[] | never[]
  }
  discussion: Discussion
  uploadDiscussion: (discussion: any) => Promise<any>
  getDiscussions: (props: {
    page?: number
    append?: boolean
    currentUser?: string
  }) => Promise<any>
  getMyDiscussions: (props: {
    page?: number
    append?: boolean
    currentUser?: string
  }) => Promise<any>
  getDiscussion: (slug: string, currentUser?: string) => Promise<any>
  voteDiscussion: (discussionId: string, vote: number) => Promise<any>
  commentDiscussion: (discussionId: string, data: any) => Promise<any>
  setCurrentDiscussion: (discussionId: string) => void
  getDiscussionComments: (
    discussionId: string,
    props: {
      page?: number
      append?: boolean
      parent?: string
      store?: boolean
      limit?: number
    }
  ) => Promise<any>
  // removeDiscussion: (id: string) => Promise<any>
}

const initialState = {
  loading: false,
  error: "",
  currentDiscussion: "",
  discussions: {
    page: 0,
    limit: 0,
    total: 0,
    discussions: []
  },
  myDiscussions: {
    page: 0,
    limit: 0,
    total: 0,
    discussions: []
  },
  comments: {
    page: 0,
    limit: 0,
    total: 0,
    comments: []
  },
  discussion: {
    _id: "",
    title: "",
    description: "",
    images: [],
    slug: "",
    category: {
      _id: "",
      name: ""
    },
    createdBy: {
      _id: "",
      name: "",
      bio: "",
      wallet: "",
      username: "",
      profilePicture: ""
    }
  }
}

export const useDiscussionStore = create<DiscussionState>()(
  devtools((set, get) => ({
    ...initialState,
    setCurrentDiscussion: (discussionId: string) => {
      set({ currentDiscussion: discussionId })
    },
    uploadDiscussion: async (discussion: any) => {
      set({ loading: true })
      const formData = new FormData()
      discussion.images.forEach((image: File) =>
        formData.append("images", image)
      )
      formData.append("title", discussion.title)
      formData.append("description", discussion.description)
      formData.append("category", discussion.category)
      console.debug(formData.get("images"))
      try {
        const { data: response } = await api.post(`/discussions`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        set({ loading: false })
        return response
      } catch (error: any) {
        console.debug(error)
        set({ loading: false })
        return false
      }
    },
    getDiscussions: async (props) => {
      try {
        set({ loading: true, currentDiscussion: "" })
        const { data: response } = await api.get(`/discussions`, {
          params: {
            page: props?.page || 1,
            limit: 9,
            currentUser: props?.currentUser || ""
          }
        })
        console.debug(response)
        set({
          discussions: {
            ...(response?.data || initialState.discussions),
            discussions: props?.append
              ? [
                  ...get().discussions.discussions,
                  ...(response?.data?.discussions || [])
                ]
              : response?.data?.discussions || []
          },
          loading: false
        })
        return response.data
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getMyDiscussions: async (props) => {
      try {
        set({ loading: true, currentDiscussion: "" })
        const { data: response } = await api.get(`/discussions/myDiscussions`, {
          params: {
            page: props?.page || 1,
            limit: 9,
            currentUser: props?.currentUser || ""
          }
        })
        set({
          myDiscussions: {
            ...(response?.data || initialState.myDiscussions),
            discussions: props?.append
              ? [
                  ...get().myDiscussions.discussions,
                  ...(response?.data?.discussions || [])
                ]
              : response?.data?.discussions || []
          },
          loading: false
        })
      } catch (err: any) {
        set({ error: err.message, loading: false })
      }
    },
    getDiscussion: async (slug, currentUser = "") => {
      try {
        set({ loading: true })
        const { data: response } = await api.get(`/discussions/${slug}`, {
          params: {
            currentUser
          }
        })
        set({
          loading: false,
          discussion: response?.data || initialState.discussion
        })
        return response
      } catch (err: any) {
        set({ loading: false })
        return false
      }
    },
    voteDiscussion: async (discussionId, vote: number) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          `/discussions/${discussionId}/vote`,
          {
            vote
          }
        )
        console.debug(response)
        const discussions = {
          ...get().discussions,
          discussions: get().discussions.discussions.map((discussion) => {
            if (discussion._id === discussionId) {
              return {
                ...discussion,
                ...(response?.data || {})
              } as Discussion
            }
            return discussion as Discussion
          })
        }
        const myDiscussions = {
          ...get().myDiscussions,
          discussions: get().myDiscussions.discussions.map((discussion) => {
            if (discussion._id === discussionId) {
              return {
                ...discussion,
                ...(response?.data || {})
              } as Discussion
            }
            return discussion as Discussion
          })
        }

        const discussion = {
          ...get().discussion,
          ...(get().discussion._id === discussionId ? response?.data || {} : {})
        }

        console.debug(myDiscussions)
        set({
          loading: false,
          discussions: discussions,
          myDiscussions: myDiscussions,
          discussion: discussion
        })
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    commentDiscussion: async (discussionId, data) => {
      try {
        set({ loading: true })
        const { data: response } = await api.post(
          `/discussions/${discussionId}/comments`,
          data
        )
        console.debug(response)
        if (!data.parent) {
          const discussionData = get().discussions.discussions.find(
            (discussion) => discussion._id === discussionId
          )
          const myDiscussionData = get().myDiscussions.discussions.find(
            (discussion) => discussion._id === discussionId
          )

          set({
            comments: {
              ...get().comments,
              total: get().comments.total + 1,
              comments: [...get().comments.comments, response?.data]
            },
            discussions: {
              ...get().discussions,
              discussions: get().discussions.discussions.map((discussion) => {
                if (discussion._id === discussionId) {
                  return {
                    ...discussion,
                    comments: (discussionData?.comments || 0) + 1
                  }
                }
                return discussion
              })
            },
            myDiscussions: {
              ...get().myDiscussions,
              discussions: get().myDiscussions.discussions.map((discussion) => {
                if (discussion._id === discussionId) {
                  return {
                    ...discussion,
                    comments: (myDiscussionData?.comments || 0) + 1
                  }
                }
                return discussion
              })
            }
          })
        }
        return response
      } catch (err: any) {
        set({ error: err.message, loading: false })
        return false
      }
    },
    getDiscussionComments(
      discussionId,
      { page = 1, append = false, parent = "", store = false, limit = 9 }
    ) {
      store && set({ loading: true })
      return api
        .get(`/discussions/${discussionId}/comments`, {
          params: {
            page: page || 1,
            limit,
            parent
            // currentUser: props?.currentUser || ""
          }
        })
        .then(({ data: response }) => {
          console.debug(response)
          if (store) {
            set({
              comments: {
                ...(response?.data || initialState.comments),
                comments: append
                  ? [
                      ...get().comments.comments,
                      ...(response?.data?.comments || [])
                    ]
                  : response?.data?.comments || []
              },
              loading: false
            })
          }
          return response.data
        })
        .catch((err: any) => {
          store && set({ error: err.message, loading: false })
        })
    }
    // removeDiscussion: async (id: string) => {
    //   set({ loading: true })
    //   const { data: response } = await api.delete(`/discussions/${id}`)
    //   set({
    //     loading: false,
    //     discussion: initialState.discussion
    //   })
    //   return response
    // }
  }))
)
