import { z } from "zod"

import { MAX_NAME_LENGTH } from "~/entities/presentation"

export const PresentationNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(MAX_NAME_LENGTH, `Name can be maximum ${MAX_NAME_LENGTH} symbols`),
})
