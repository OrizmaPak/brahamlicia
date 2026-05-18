import React from 'react'
import { useHomeField } from '../../context/HomeContentContext.jsx'
import { useInlineEditor } from '../../context/InlineEditorContext.jsx'

export function EditableImage({ className = '', fieldKey, label, loading }) {
  const field = useHomeField(fieldKey)
  const { isEditing, openEditor } = useInlineEditor()
  const alt = field?.alt ?? ''
  const src = field?.src ?? ''

  function handleEdit(event) {
    if (!isEditing) return

    event.preventDefault()
    event.stopPropagation()
    openEditor({ field, fieldKey, label: label ?? fieldKey, type: 'image' })
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleEdit(event)
    }
  }

  return (
    <img
      alt={alt}
      className={`${className}${isEditing ? ' editable-field editable-field--image' : ''}`}
      loading={loading}
      onClick={handleEdit}
      onKeyDown={handleKeyDown}
      role={isEditing ? 'button' : undefined}
      src={src}
      tabIndex={isEditing ? 0 : undefined}
    />
  )
}
