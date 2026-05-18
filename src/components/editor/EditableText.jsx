import React from 'react'
import { usePageField } from '../../context/PageContentContext.jsx'
import { useInlineEditor } from '../../context/InlineEditorContext.jsx'

export function EditableText({ as = 'span', className = '', fieldKey, label, multiline = false, pageId }) {
  const field = usePageField(fieldKey)
  const { isEditing, openEditor } = useInlineEditor()
  const value = field?.value ?? ''

  if (!isEditing) {
    return React.createElement(as, { className }, value)
  }

  function handleEdit(event) {
    event.preventDefault()
    event.stopPropagation()
    openEditor({ field, fieldKey, label: label ?? fieldKey, multiline, pageId, type: 'text' })
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleEdit(event)
    }
  }

  return React.createElement(
    as,
    {
      className: `${className} editable-field editable-field--text`.trim(),
      onClick: handleEdit,
      onKeyDown: handleKeyDown,
      role: 'button',
      tabIndex: 0,
    },
    value,
  )
}



