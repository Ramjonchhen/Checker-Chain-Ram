/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react"
import { Button, ConfirmDialog, Input, Modal } from "components"
import * as Icons from "assets/icons"
import { getBaseBackendImageUrl } from "utils"
import { useUserStore } from "stores"
import { useProductStore } from "stores/product"
import { useToastStore } from "stores/toast"

export function TeamsAndOwnership() {
  const [showModal, setShowModal] = useState(false)
  const { searchUsers } = useUserStore()
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any>([])
  const { product, addTeamMember, removeTeamMember } = useProductStore()
  const { successToast, errorToast } = useToastStore()
  return (
    <div>
      <form className="flex flex-col gap-4 py-10 px-12">
        <span className="block text-neutral-900 text-base font-semibold leading-6">
          Manage Teams
        </span>
        <div className="flex flex-col gap-2 divide-y divide-separator max-h-[200px] overflow-auto">
          {product?.teams?.map((team) => (
            <div
              key={team._id}
              className="flex items-center gap-[14px] py-2 px-4"
            >
              <img
                // onClick={() => router.push(`/user/${team.username}`)}
                className="rounded-full w-[45px] h-[45px] object-contain cursor-pointer border border-separate"
                alt="Creator"
                src={`${getBaseBackendImageUrl(team.profilePicture, "avatar")}`}
              />
              <div className="flex flex-col ">
                <span className="text-content-primary font-semibold text-base">
                  {team.name}
                </span>
                <span className="text-neutral-500 text-sm">
                  {team.username}
                </span>
              </div>
              <div className="ml-auto">
                <ConfirmDialog
                  message="Are you sure you want to remove this team member?"
                  onConfirm={() => {
                    removeTeamMember(product._id, {
                      teamId: team._id
                    })
                      .then(() => {
                        successToast({
                          message: "Team member removed successfully"
                        })
                      })
                      .catch(() => {
                        errorToast({
                          message: "Failed to remove team member"
                        })
                      })
                  }}
                >
                  <Icons.TrashIcon className="w-[20px] h-[20px] text-error hover cursor-pointer" />
                </ConfirmDialog>
              </div>
            </div>
          ))}
          {product?.teams?.length === 0 && (
            <div className="flex items-center justify-center py-4">
              <span className="text-neutral-500 text-sm">
                No team members yet
              </span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="text"
          startIcon={<Icons.UserAdd />}
          title="Add Team Member"
          onClick={() => setShowModal(true)}
        />
        <Modal
          closeButton
          display={showModal}
          onHide={() => {
            setShowModal(false)
            setSelectedUser(null)
            setSearchResults([])
          }}
          className="!min-w-[340px] min-h-[120px] px-5 pt-8"
        >
          <div className="flex flex-col gap-4">
            <span className="block text-neutral-900 text-base font-semibold leading-6">
              Add a team member to your product
            </span>
            {!selectedUser && (
              <>
                <Input
                  type="text"
                  placeholder="Search by name or username"
                  autoFocus
                  onChange={(e) => {
                    setTimeout(() => {
                      searchUsers(e.target.value).then((result) =>
                        setSearchResults(result)
                      )
                    }, 100)
                  }}
                />
                <div className="flex flex-col h-[200px] overflow-auto">
                  {searchResults.map((result: any) => (
                    <div
                      key={result._id}
                      className="flex items-center gap-[14px] py-2 px-4 hover:bg-primary-50 cursor-pointer rounded-md"
                      onClick={() => {
                        setSelectedUser(result)
                      }}
                    >
                      <img
                        // onClick={() => router.push(`/user/${team.username}`)}
                        className="rounded-full w-[45px] h-[45px] object-contain cursor-pointer border border-separate"
                        alt="Creator"
                        src={`${getBaseBackendImageUrl(
                          result.profilePicture,
                          "avatar"
                        )}`}
                      />
                      <div className="flex flex-col ">
                        <span className="text-content-primary font-semibold text-base">
                          {result.name}
                        </span>
                        <span className="text-neutral-500 text-sm">
                          {result.username}
                        </span>
                      </div>
                    </div>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="flex items-center justify-center py-4">
                      <span className="text-neutral-500 text-sm">
                        No results found
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
            {selectedUser && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-[14px] py-2 px-4">
                  <img
                    className="rounded-full w-[45px] h-[45px] object-contain cursor-pointer border border-separate"
                    alt="Creator"
                    src={`${getBaseBackendImageUrl(
                      selectedUser.profilePicture,
                      "avatar"
                    )}`}
                  />
                  <div className="flex flex-col ">
                    <span className="text-content-primary font-semibold text-base">
                      {selectedUser.name}
                    </span>
                    <span className="text-neutral-500 text-sm">
                      {selectedUser.username}
                    </span>
                  </div>
                  <Icons.TrashIcon
                    className="ml-auto w-[20px] h-[20px] text-error hover cursor-pointer"
                    onClick={() => {
                      setSelectedUser(null)
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="default"
                  title="Add Team Member"
                  className="mt-2"
                  onClick={async () => {
                    const res = await addTeamMember(product._id, {
                      userId: selectedUser._id
                    })
                    setShowModal(false)
                    if (res) {
                      successToast({
                        message: "Team member added successfully"
                      })
                    } else {
                      errorToast({
                        message: "Failed to add team member"
                      })
                    }
                    setSelectedUser(null)
                    setSearchResults([])
                  }}
                />
              </div>
            )}
          </div>
        </Modal>
      </form>
    </div>
  )
}
