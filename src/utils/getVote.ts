export const getVote = (
  vote: "up" | "down",
  isUpVoted: boolean,
  isDownVoted: boolean
) => {
  if ((vote === "up" && isUpVoted) || (vote === "down" && isDownVoted)) {
    return 0
  }
  return vote === "down" ? -1 : 1
}