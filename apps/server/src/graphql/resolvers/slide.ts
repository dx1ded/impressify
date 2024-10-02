import type { ApolloContext } from ".."
import { elementRepository } from "../../database"
import { Image } from "../../entities/Image"
import { Text } from "../../entities/Text"
import type { Resolvers } from "../__generated__"

export default {
  Slide: {
    async elements(parent) {
      const elements = await elementRepository.find({
        where: { slide: { id: parent.id } },
        order: { position: "ASC" },
      })

      return elements.map((element) => {
        if (element instanceof Text) {
          return { __typename: "Text", ...element }
        }
        if (element instanceof Image) {
          return { __typename: "Image", ...element }
        }
        return { __typename: "Shape", ...element }
      })
    },
  },
} as Resolvers<ApolloContext>
