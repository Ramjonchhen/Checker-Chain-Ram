import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Input, Modal, TextArea } from "components"
import { useEffect, useState } from "react"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
// import { useReviewStore } from "stores/review"
import { useProductStore } from "stores/product"
import { useToastStore } from "stores/toast"
import { useAirDropStore } from "stores/airdrop"
import { useProductAirdropContract } from "hooks/useProductAirdropContract"
import toast from "react-hot-toast"

import { useWallet } from "hooks/useWallet"
import { getNetwork } from "config"
// import { useUserStore } from "stores"

const network = getNetwork()
interface FormValues {
  title: string | never
  description: string | never
  amount: string | never
  startDate: Date | never
  endDate: Date | never
  data: File | never
}

interface AddressData {
  wallet: string | never
  amount: string | never
}

export const CreateAirdrop = () => {
  const [showModal, setShowModal] = useState(false)
  const { createAirdrop, isCancelled, isSuccessful, isFailed } =
    useProductAirdropContract()
  const { wallet } = useWallet()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema: any = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    amount: Yup.string().required("Amount is required"),
    startDate: Yup.date()
      .min(new Date(), "Start date must be greater than current date")
      .required("Start date is required"),
    endDate: Yup.date()
      .when(
        "startDate",
        (startDate, schema) => startDate && !!schema && schema.min(startDate)
      )
      .required("End date is required"),
    data: Yup.mixed().required("Airdrop data file is required")
  })
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    trigger,
    getValues,
    register,
    reset
  } = useForm<FormValues>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: "1000",
      title: "Airdrop Title"
      // date now + 1 day in utc milliseconds
    }
  })

  useEffect(() => {
    if (!getValues("startDate")) {
      setValue("startDate", new Date())
      setValue("endDate", new Date(new Date().getTime() + 86400000))
    }
  }, [setValue, trigger, getValues])

  // const { createReview, getReviews } = useReviewStore()
  const { product } = useProductStore()
  const { createAirdrop: saveAirdrop } = useAirDropStore()
  const { errorToast } = useToastStore()
  // const { user } = useUserStore()

  useEffect(() => {
    if (isSuccessful) {
      toast.success("Airdrop created successfully")
      document.body.style.overflow = "auto"
    } else if (isCancelled) {
      toast.error("Airdrop creation cancelled")
    } else if (isFailed) {
      toast.error("Error creating airdrop")
    }
  }, [isCancelled, isSuccessful, isFailed])

  const onSubmit = (data: FormValues) => {
    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("amount", data.amount)
    formData.append("startDate", data.startDate.toString())
    formData.append("endDate", data.endDate.toString())
    formData.append("data", data.data)
    formData.append("product", product?._id)
    saveAirdrop(formData).then(async (response) => {
      if (!response) {
        errorToast({
          message: "Error creating airdrop"
        })
        return
      }
      reset()
      const startTime =
        Date.now() > data.startDate.getTime()
          ? Date.now()
          : data.startDate.getTime()
      const d1 = {
        admin: wallet.address,
        startTime: parseInt((startTime / 1000 + 1 * 60).toString(), 10),
        duration: parseInt(
          ((data.endDate.getTime() - startTime) / 1000 - 1 * 60).toString(),
          10
        ),
        airdropRoot: response.data.root,
        airdropId: response.data._id,
        amount: Number(data.amount),
        callback: () => {
          setShowModal(false)
          document.body.style.overflow = "auto"
        }
      }
      await createAirdrop(d1)
    })
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <Button
          title="Create Airdrop"
          variant="outlined"
          onClick={async () => {
            setShowModal(true)

            // // test airdrop
            // for(let i=0;i<15;i++){
            //     await new Promise((resolve) => setTimeout(resolve, 1000));
            //     const jsonData = [
            //         {
            //             wallet: "erd1wz7cyxkr0tr7np3cq2q97y3zgqa3msmr7ly0crlgr29wh3je4zeq6wqp8z",
            //             amount: 10 * (10** config.tokenDecimal)
            //         }
            //     ]
            //     const formData = new FormData()
            //     formData.append("title", "Airdrop Title")
            //     formData.append("description", "Airdrop Description")
            //     formData.append("amount", (10 * (1/0.99)).toString())
            //     formData.append("startDate", new Date().toString())
            //     formData.append("endDate", new Date(new Date().getTime() + 86400000).toString())
            //     const file = new File([JSON.stringify(jsonData)], "airdrop.json", {
            //         type: "application/json",
            //     })
            //     formData.append("data", file)
            //     formData.append("product", product?._id)
            //     saveAirdrop(formData).then(async (response) => {
            //         toast.success("Created airdrop "+ i)
            //         if (!response) {
            //             errorToast({
            //                 message: "Error creating airdrop"
            //             })
            //         }
            //     })
            // }
          }}
        />
      </div>
      <Modal
        onHide={() => setShowModal(false)}
        closeButton
        display={showModal}
        className="w-[540px] h-[540px] overflow-auto"
      >
        <div className="flex flex-col">
          <span className="text-neutral-900 font-[500] text-base leading-4">
            Create Airdrop
          </span>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Input
              className="mt-4"
              placeholder="Airdrop Title"
              type="text"
              label="Airdrop Title"
              error={!!errors.title}
              helper={errors.title?.message?.toString()}
              {...register("title")}
            />
            <div className="flex flex-col">
              <Input
                label="Start Date"
                className="mt-4"
                placeholder="Start Date"
                type="datetime-local"
                error={!!errors.startDate}
                helper={errors.startDate?.message?.toString()}
                {...register("startDate")}
              />
              <Input
                label="End Date"
                className="mt-4"
                placeholder="End Date"
                type="datetime-local"
                error={!!errors.endDate}
                helper={errors.endDate?.message?.toString()}
                {...register("endDate")}
              />
            </div>

            <Input
              type="file"
              className="mt-4"
              label="Airdrop data"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (
                  file.type === "application/vnd.ms-excel" ||
                  file.type === "text/csv" ||
                  file.type ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                ) {
                  const reader = new FileReader()
                  reader.readAsText(file)
                  reader.onload = (e: ProgressEvent<FileReader>) => {
                    // get data from reader.result
                    const result = e.target?.result
                    if (result) {
                      // parse array of address and amount
                      const jsonifyData: AddressData[] = []
                      const rows = result
                        .toString()
                        .split("\n")
                        .map((each) => each.replace("\r", ""))
                      rows.forEach((data, index) => {
                        const row = data.toString().includes("\t")
                          ? data.split("\t")
                          : data.split(",")
                        if (index !== 0 && row.length >= 2) {
                          jsonifyData.push({
                            wallet: row[0].toString().trim(),
                            amount: (
                              Number(row[1].toString().trim()) *
                              10 ** network.tokenDecimal
                            ).toString()
                          })
                        }
                      })
                      // create a json file
                      const jsonFile = new File(
                        [JSON.stringify(jsonifyData)],
                        "airdrop.json",
                        { type: "application/json" }
                      )
                      // upload json file to server
                      setValue("data", jsonFile)
                      setValue(
                        "amount",
                        (
                          (jsonifyData
                            .map((each) => Number(each.amount))
                            .reduce((a, b) => a + b, 0) *
                            1) /
                          (0.99 * 10 ** network.tokenDecimal)
                        ).toString()
                      )
                      trigger("amount")
                    }
                  }
                } else {
                  errorToast({
                    message: "Invalid file type"
                  })
                  return
                }
              }}
            />

            <span>
              Note: Download sample airdrop file{" "}
              <span
                onClick={() => {
                  // download sample file
                  const sampleData: AddressData[] = [
                    {
                      wallet: "Wallet Address",
                      amount: "Amount"
                    },
                    {
                      wallet: "0x0000000000000000000000000000000000000000",
                      amount: "100"
                    },
                    {
                      wallet: "0x0000000000000000000000000000000000000001",
                      amount: "200"
                    }
                  ]
                  // create a csv file

                  const csvContent =
                    "data:text/csv;charset=utf-8," +
                    sampleData
                      .map((each) => each.wallet + "," + each.amount)
                      .join("\n")

                  // download csv file
                  const url = encodeURI(csvContent)
                  const link = document.createElement("a")

                  link.href = url
                  link.setAttribute("download", "airdrop.csv")
                  document.body.appendChild(link)
                  link.click()
                  link.remove()
                }}
                className="text-blue-800 cursor-pointer hover:underline"
              >
                {" "}
                Click me{" "}
              </span>
            </span>

            <Input
              label="Total Airdrop Amount (CHECKR)"
              className="mt-4"
              placeholder="Total Airdrop Amount"
              type="number"
              error={!!errors.amount}
              helper={
                errors.amount?.message?.toString() ||
                "Note: Fee Included" +
                  " " +
                  "\nDistributed: " +
                  (Number(getValues("amount")) || 1) * 0.99 +
                  " " +
                  "CHECKR\nFee: " +
                  (Number(getValues("amount")) || 1) * 0.01 +
                  " " +
                  "CHECKR"
              }
              value={getValues("amount")}
              onChange={(e) => {
                setValue("amount", e.target.value)
                trigger("amount")
              }}
            />
            <TextArea
              label="Airdrop Description"
              className="mt-4"
              placeholder="Airdrop Description"
              error={!!errors.description}
              helper={errors.description?.message?.toString()}
              {...register("description")}
            />

            <Button type="submit" className="mt-2 w-full">
              Submit
            </Button>
          </form>
        </div>
      </Modal>
    </>
  )
}
