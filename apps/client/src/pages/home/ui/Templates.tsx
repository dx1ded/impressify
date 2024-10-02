import { useQuery } from "@apollo/client"

import type { FindTemplatesQuery, FindTemplatesQueryVariables } from "~/__generated__/graphql"
import { Template, FIND_TEMPLATES } from "~/entities/template"
import { CreatePresentation } from "~/features/create-presentation"
import { Skeleton } from "~/shared/ui-kit/skeleton"
import { Loader } from "~/shared/ui/Loader"

export function Templates() {
  const { data, loading } = useQuery<FindTemplatesQuery, FindTemplatesQueryVariables>(FIND_TEMPLATES)

  return (
    <div className="grid grid-cols-6 gap-4">
      <CreatePresentation>
        {(createPresentation, { loading: createPresentationLoading }) => (
          <>
            {/* Loader on the full page */}
            {createPresentationLoading && <Loader />}
            {/* Blank presentation */}
            <Template
              name="Blank presentation"
              thumbnailUrl="https://ssl.gstatic.com/docs/templates/thumbnails/slides-blank-googlecolors.png"
              createPresentation={createPresentation}
            />
            {loading ? (
              <>
                <Skeleton className="h-[7.375rem] bg-gray-200" />
                <Skeleton className="h-[7.375rem] bg-gray-200" />
                <Skeleton className="h-[7.375rem] bg-gray-200" />
                <Skeleton className="h-[7.375rem] bg-gray-200" />
                <Skeleton className="h-[7.375rem] bg-gray-200" />
              </>
            ) : (
              data?.findTemplates?.map((template, i) => (
                <Template
                  key={i}
                  id={template.id}
                  name={template.name}
                  thumbnailUrl={template.presentation.slides[0].thumbnailUrl}
                  createPresentation={createPresentation}
                />
              ))
            )}
          </>
        )}
      </CreatePresentation>
    </div>
  )
}
