import { z } from "zod"

export const GetHelpValidationSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(256, "Text can be maximum 256 symbols in length"),
})
