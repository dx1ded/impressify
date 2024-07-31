import { z } from "zod"

export const GetHelpValidationSchema = z.object({
  text: z.string().min(1, "Minimum 1 symbol in length").max(128, "Maximum 128 symbol in length"),
})
