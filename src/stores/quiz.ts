/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { api } from "stores"
import { backendUrls } from "constants/backendUrls"

export type IQuizQuestionData = {
  _id?: string
  category?: string
  subcategories?: string[]
  question?: string
  qn?: number
  isScoring?: boolean
  yesWeightage?: number
  noWeightage?: number
  __v?: number
  createdAt?: Date
  updatedAt?: Date
  inputField?: "Select" | "TextArea" | "Rating"
  type: string
  prompt: string
}

interface IQuizDataStore {
  quizQuestions: IQuizQuestionData[]
  getQuizQuestions: (category: string) => void
  postQuizResponse: (quizData: any) => Promise<any>
}

export const useQuizesStore = create<IQuizDataStore>()(
  devtools((set) => ({
    quizQuestions: [],
    getQuizQuestions: async (category) => {
      try {
        const res = await api.get(backendUrls.getQuizQuestions(category))
        if (res.data.message === "success") {
          set({
            quizQuestions: res.data.data
          })
        }
        // console.log(res, "here")
      } catch (err) {
        console.log(err)
      }
      //   set({
      //     pairData: res as PairData
      //   })
    },
    postQuizResponse: async (quizData: any) => {
      try {
        const res = await api.post(backendUrls.postQuizResponse, quizData)
        return res
      } catch (err) {
        throw err
      }
    }
  }))
)
