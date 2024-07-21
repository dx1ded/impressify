import { z } from "zod"

export const UserEmailSchema = z.object({
  email: z.string().email("It doesn't seem to be an e-mail address"),
})
