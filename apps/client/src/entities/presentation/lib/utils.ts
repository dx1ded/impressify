import dayjs from "dayjs"

export const formatDate = (timestamp: number) => {
  const dateNow = Date.now()
  const dayjsInstance = dayjs(timestamp)

  return dateNow - 1000 * 60 * 60 * 24 < timestamp
    ? dayjsInstance.format("h.mm a")
    : dateNow - 1000 * 60 * 60 * 48 < timestamp
      ? `Yesterday, ${dayjsInstance.format("h.mm a")}`
      : dayjsInstance.format("MMM D, YYYY")
}
