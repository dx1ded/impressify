import { Small } from "~/shared/ui/Typography"

interface TemplateProps {
  id?: number
  name: string
  thumbnailUrl: string
  createPresentation(templateId?: number): void | Promise<void>
}

export function Template({ id, name, thumbnailUrl, createPresentation }: TemplateProps) {
  return (
    <button type="button" className="text-left" onClick={() => createPresentation(id)}>
      <img src={thumbnailUrl} className="mb-2 rounded-lg" alt="Template thumbnail" />
      <Small as="span">{name}</Small>
    </button>
  )
}
