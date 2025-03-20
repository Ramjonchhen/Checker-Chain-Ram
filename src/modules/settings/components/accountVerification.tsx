import { yupResolver } from "@hookform/resolvers/yup";
import * as Icons from "assets/icons";
import PendingImage from "assets/images/pending.svg";
import VerifiedImage from "assets/images/verified.svg";
import { Button, Card } from "components";
import { constants } from "constants/common";
import React, { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toSubstring } from "utils";
import * as Yup from "yup";
import {
    AccountVerificationFormData,
    AccountVerificationFormKeys, AccountVerificationProps
} from "./accountVerification.d";

export const AccountVerification: FC<AccountVerificationProps> = ({
  pendingVerification,
}) => {
  const validationSchema: Yup.SchemaOf<AccountVerificationFormData> =
    Yup.object().shape({
      file: Yup.mixed().required("Image is required")
      .test("check-file-format", "Invalid file format",()=>{
        const fileFormat = getValue('file')?.name.split(".") || []
        return constants.ALLOWED_FILES.includes(fileFormat[fileFormat.length - 1]);
      }).test("check-file-size","File size must be less than 1MB",()=>{
        const fileSize = getValue("file")?.size
        return fileSize < constants.MAX_FILE_SIZE
      })
    });
  const {
    formState: { errors },
    setValue,
    handleSubmit,
    trigger,
    getValues,
    reset,
  } = useForm<AccountVerificationFormData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getValue = (key: AccountVerificationFormKeys) => {
    return getValues()[key];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = e.target.files?.length ? e.target.files[0] : undefined;
    setValue("file", data);
    trigger("file");
  };

  const openFileUploadDialog = () => {
    if (!getValue("file")?.name) {
      fileInputRef.current ? (fileInputRef.current.value = "") : null;
      fileInputRef?.current?.click();
    }
  };

  const onSubmit = (data: AccountVerificationFormData) => {
    console.debug(data);
  };

  const divRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState({
    locked: {}
  })
  useEffect(() => {
    if (divRef) {
      setStyles({
        locked: {
          height: `${divRef.current?.scrollHeight}px`,
        }
      })
    }
  }, [divRef])

  return (
    <>
      <div className="relative">
        <div
          style={styles.locked}
          className="z-10 flex-col text-[#787676] text-heading-4 text-center absolute w-full h-full flex justify-center items-center"
        >
          <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          </div>
          <div>Sorry, Account Verification is locked for now.</div>
        </div>
      </div>
    <div ref={divRef} className="blur-sm grayscale">
       <Card className="p-0">
      <div className="px-7 pt-5 pb-2 text-content-primary text-2xl font-medium border-b border-outline-secondary">
        Account Verification
      </div>
      <div className="px-7 py-6 flex md:flex-nowrap flex-wrap md:gap-20 divide-x divide-outline-secondary">
        <div className="w-full md:w-1/2 pt-10">
          {!pendingVerification ? (
            <>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div
                  onClick={openFileUploadDialog}
                  className={`${
                    !getValue("file")?.name && "cursor-pointer"
                  } flex flex-col justify-center items-center rounded-lg border border-dashed border-outline bg-secondary-contrast w-[275px] h-[120px]`}
                >
                  {!getValue("file")?.name && <Icons.UploadIcon />}
                  <div className="flex gap-3 text-content-secondary text-sm mt-3">
                    {toSubstring(getValue("file")?.name, 10, true) ||
                      "Drag and drop or browse"}
                    {getValue("file")?.name && (
                      <Icons.CrossOutlineIcon
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation()
                          reset()
                        }}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>

                <p
                  className={`text-error italic text-xs leading-[18px] ml-3 mt-2`}
                >
                  {errors.file?.message?.toString()}
                </p>
                <Button
                  type="submit"
                  className="mt-8"
                  size="medium"
                  title="Upload"
                />
              </form>
            </>
          ) : (
            <div className={`flex flex-col w-full items-center justify-center`}>
              <PendingImage />
              <div className="mt-4 text-sm text-center text-content-primary w-[320px] font-normal">
                Your account is going through verification. Please revisit later
                to get your result.
              </div>
            </div>
          )}
        </div>
        <div
          className={`flex flex-col w-full mt-5 md:mt-0 md:w-1/2 items-center justify-center`}
        >
          <VerifiedImage />
          <div className="mt-4 text-sm text-content-primary w-[300px] font-normal">
            <p>
              In order to get verified, you need to provide proof of at least
              one of the following types of identification:
            </p>
            <ul className="list-disc pl-4 mt-2">
              <li>
                {`Publicly tweet a post about "profile" to get verified.`}
              </li>
              <li>{`Publicly mention "profile" on the official website.`}</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
    </div>
    </>
  );
};
