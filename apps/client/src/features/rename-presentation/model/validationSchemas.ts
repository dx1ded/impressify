import { z } from "zod"

export const PresentationNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(36, "Name can be maximum 36 symbols"),
})
