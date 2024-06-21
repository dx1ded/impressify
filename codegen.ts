import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: "apps/server/src/graphql/schemas/*.graphql",
  documents: "apps/client/src/**/*.ts",
  ignoreNoDocuments: true,
  generates: {
    "apps/server/src/graphql/__generated__.ts": {
      config: {
        useIndexSignature: true,
      },
      plugins: ["typescript", "typescript-resolvers"],
    },
    "apps/client/src/__generated__/": {
      preset: "client",
      plugins: ["typescript"],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: {
          unmaskFunctionName: "getFragment"
        }
      }
    }
  }
};

export default config
