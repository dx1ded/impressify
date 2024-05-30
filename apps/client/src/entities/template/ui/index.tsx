import { Small } from "~/shared/ui/Typography"

interface TemplateProps {
  thumbnailUrl: string
  name: string
}

export function Template({ thumbnailUrl, name }: TemplateProps) {
  return (
    <button type="button" className="text-left">
      <img src={thumbnailUrl} className="mb-2 rounded-lg" alt="Template thumbnail" />
      <Small as="span">{name}</Small>
    </button>
  )
}
