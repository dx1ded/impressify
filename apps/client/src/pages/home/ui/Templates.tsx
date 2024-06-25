import { Template } from "~/entities/template"
import { CreatePresentation } from "~/features/create-presentation"
import { Loader } from "~/shared/ui/Loader"

const mock = [
  {
    thumbnailUrl: "https://ssl.gstatic.com/docs/templates/thumbnails/slides-blank-googlecolors.png",
    name: "Blank presentation",
  },
  {
    thumbnailUrl:
      "https://ssl.gstatic.com/docs/templates/thumbnails/1E6hdH0vSvl4KN-Qw-iY2PZ7Z7tbDtu8RCQdcPAgp4SY_400.png",
    name: "Your big idea",
  },
  {
    thumbnailUrl:
      "https://ssl.gstatic.com/docs/templates/thumbnails/1WjVCubPisUNIvoZD0A2k1TPUlZ9lDu4vLq59TZVzR5c_400.png",
    name: "Photo album",
  },
  {
    thumbnailUrl:
      "https://ssl.gstatic.com/docs/templates/thumbnails/10YVLN43w0YaMLEVXw7OtGGmSwJudiwuUc9KqFbVeEP0_400.png",
    name: "Wedding",
  },
  {
    thumbnailUrl:
      "https://ssl.gstatic.com/docs/templates/thumbnails/1k6R5IbsAxOL3Q6QUE2UDBBvIhRHK5pk0w3nPnLznb1k_400.png",
    name: "Portfolio",
  },
  {
    thumbnailUrl:
      "https://ssl.gstatic.com/docs/templates/thumbnails/1Fs7asoafAErq1gmelmNAfyeocErbVAndJ5Cv6DUtPmo_400_2.png",
    name: "Lookbook",
  },
]

export function Templates() {
  return (
    <div className="grid grid-cols-6 gap-4">
      <CreatePresentation>
        {(createPresentation, loading) => (
          <>
            {loading && <Loader />}
            {mock.map((template, i) => (
              <Template
                key={i}
                thumbnailUrl={template.thumbnailUrl}
                name={template.name}
                createPresentation={createPresentation}
              />
            ))}
          </>
        )}
      </CreatePresentation>
    </div>
  )
}
