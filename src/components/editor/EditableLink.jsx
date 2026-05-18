import React from 'react'
import { useHomeField } from '../../context/HomeContentContext.jsx'
import { useInlineEditor } from '../../context/InlineEditorContext.jsx'

export function EditableLink({ className = '', fieldKey, label }) {
  const field = useHomeField(fieldKey)
  const { isEditing, openEditor } = useInlineEditor()
  const linkLabel = field?.label ?? ''
  const href = field?.href ?? '#'

  function handleEdit(event) {
    if (!isEditing) return

    event.preventDefault()
    event.stopPropagation()
    openEditor({ field, fieldKey, label: label ?? fieldKey, type: 'link' })
  }

  return (
    <a className={`${className}${isEditing ? ' editable-field editable-field--link' : ''}`} href={href} onClick={handleEdit}>
      {linkLabel}
    </a>
  )
}
