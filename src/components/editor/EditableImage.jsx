import React from 'react'
import { usePageField } from '../../context/PageContentContext.jsx'
import { useInlineEditor } from '../../context/InlineEditorContext.jsx'

export function EditableImage({ className = '', fieldKey, label, loading, pageId }) {
  const field = usePageField(fieldKey)
  const { isEditing, openEditor } = useInlineEditor()
  const alt = field?.alt ?? ''
  const src = field?.src ?? ''

  function handleEdit(event) {
    if (!isEditing) return

    event.preventDefault()
    event.stopPropagation()
    openEditor({
      autoOpenFilePicker: true,
      field,
      fieldKey,
      label: label ?? fieldKey,
      pageId,
      type: 'image',
    })
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleEdit(event)
    }
  }

  if (!isEditing) {
    return <img alt={alt} className={className} loading={loading} src={src} />
  }

  return (
    <span className="editable-image-wrap">
      <img
        alt={alt}
        className={`${className} editable-field editable-field--image`.trim()}
        loading={loading}
        onClick={handleEdit}
        onKeyDown={handleKeyDown}
        role="button"
        src={src}
        tabIndex={0}
      />
      <span className="editable-image-chip" onClick={handleEdit} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
        <span aria-hidden="true" className="editable-image-chip__icon">+</span>
        Change image
      </span>
    </span>
  )
}



