import { Small } from "~/shared/ui/Typography"

interface TemplateProps {
  thumbnailUrl: string
  name: string
  createPresentation(template: string): void | Promise<void>
}

export function Template({ thumbnailUrl, name, createPresentation }: TemplateProps) {
  return (
    <button type="button" className="text-left" onClick={() => createPresentation(name)}>
      <img src={thumbnailUrl} className="mb-2 rounded-lg" alt="Template thumbnail" />
      <Small as="span">{name}</Small>
    </button>
  )
}
