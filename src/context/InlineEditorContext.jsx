/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { uploadImageToCloudinary } from '../lib/cloudinary.js'
import { savePageField } from '../lib/homeContentRepository.js'

const InlineEditorContext = createContext({
  closeEditor: () => {},
  isEditing: false,
  openEditor: () => {},
  saveStatus: 'idle',
})

export function useInlineEditor() {
  return useContext(InlineEditorContext)
}

function EditorToolbar({ onExit, pageId, saveStatus }) {
  const pageLabel = pageId === 'about' ? 'About Page' : 'Home Page'

  return (
    <div className="editor-toolbar" role="status">
      <div>
        <span>{pageLabel}</span>
        <strong>Inline edit mode</strong>
      </div>
      <p>{saveStatus === 'saving' ? 'Saving live change...' : saveStatus === 'saved' ? 'Saved' : 'Click any outlined text, link, or image to edit.'}</p>
      <button className="button button--secondary" onClick={onExit} type="button">
        Exit
      </button>
    </div>
  )
}

function ConfirmSaveDialog({ fieldLabel, isSaving, onCancel, onConfirm }) {
  return (
    <div aria-modal="true" className="editor-modal" role="dialog">
      <div className="editor-modal__panel editor-confirm">
        <span className="editor-modal__eyebrow">Confirm live update</span>
        <h2>Save this change?</h2>
        <p>
          This writes directly to Firebase and creates a revision backup before the new value goes live.
        </p>
        <div className="editor-confirm__field">{fieldLabel}</div>
        <div className="editor-modal__actions">
          <button className="button button--secondary" disabled={isSaving} onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button button--primary" disabled={isSaving} onClick={onConfirm} type="button">
            {isSaving ? 'Saving...' : 'Save live'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InlineFieldDialog({ activeEdit, closeEditor, pageId, stageSave }) {
  const [draftText, setDraftText] = useState('')
  const [draftLabel, setDraftLabel] = useState('')
  const [draftHref, setDraftHref] = useState('')
  const [draftSrc, setDraftSrc] = useState('')
  const [draftAlt, setDraftAlt] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  React.useEffect(() => {
    if (!activeEdit) return

    setDraftText(activeEdit.field?.value ?? '')
    setDraftLabel(activeEdit.field?.label ?? '')
    setDraftHref(activeEdit.field?.href ?? '')
    setDraftSrc(activeEdit.field?.src ?? '')
    setDraftAlt(activeEdit.field?.alt ?? '')
    setUploadMessage('')
    setIsUploading(false)
  }, [activeEdit])

  if (!activeEdit) return null

  async function handleFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadMessage('Uploading image...')

    try {
      const result = await uploadImageToCloudinary(file, `brahamlicia/${pageId}`)
      setDraftSrc(result.secureUrl)
      setUploadMessage('Upload complete. Click Done to save it live.')
    } catch (error) {
      setUploadMessage(error.message ?? 'Image upload failed. You can still replace by URL.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleDone() {
    if (activeEdit.type === 'text') {
      stageSave({ type: 'text', value: draftText })
      return
    }

    if (activeEdit.type === 'link') {
      stageSave({ type: 'link', href: draftHref, label: draftLabel })
      return
    }

    stageSave({ type: 'image', alt: draftAlt, src: draftSrc })
  }

  return (
    <div aria-modal="true" className="editor-modal" role="dialog">
      <div className="editor-modal__panel">
        <span className="editor-modal__eyebrow">Editing</span>
        <h2>{activeEdit.label}</h2>

        {activeEdit.type === 'text' ? (
          <label className="editor-field">
            <span>Text</span>
            {activeEdit.multiline ? (
              <textarea onChange={(event) => setDraftText(event.target.value)} rows="7" value={draftText} />
            ) : (
              <input onChange={(event) => setDraftText(event.target.value)} type="text" value={draftText} />
            )}
          </label>
        ) : null}

        {activeEdit.type === 'link' ? (
          <>
            <label className="editor-field">
              <span>Label</span>
              <input onChange={(event) => setDraftLabel(event.target.value)} type="text" value={draftLabel} />
            </label>
            <label className="editor-field">
              <span>Link URL</span>
              <input onChange={(event) => setDraftHref(event.target.value)} type="text" value={draftHref} />
            </label>
          </>
        ) : null}

        {activeEdit.type === 'image' ? (
          <>
            <label className="editor-field">
              <span>Replace by URL</span>
              <input onChange={(event) => setDraftSrc(event.target.value)} type="url" value={draftSrc} />
            </label>
            <label className="editor-field">
              <span>Alt text</span>
              <input onChange={(event) => setDraftAlt(event.target.value)} type="text" value={draftAlt} />
            </label>
            <label className="editor-field editor-field--upload">
              <span>Upload from PC</span>
              <input accept="image/jpeg,image/png,image/webp" disabled={isUploading} onChange={handleFileUpload} type="file" />
            </label>
            {draftSrc ? (
              <figure className="editor-image-preview">
                <img alt={draftAlt} src={draftSrc} />
              </figure>
            ) : null}
            {uploadMessage ? <p className="editor-note">{uploadMessage}</p> : null}
          </>
        ) : null}

        <div className="editor-modal__actions">
          <button className="button button--secondary" onClick={closeEditor} type="button">
            Cancel
          </button>
          <button className="button button--primary" disabled={isUploading} onClick={handleDone} type="button">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export function InlineEditorProvider({ children, onExit, pageId = 'home', user }) {
  const [activeEdit, setActiveEdit] = useState(null)
  const [pendingSave, setPendingSave] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [saveError, setSaveError] = useState('')

  const closeEditor = useCallback(() => setActiveEdit(null), [])

  const openEditor = useCallback((config) => {
    setSaveError('')
    setActiveEdit(config)
  }, [])

  const stageSave = useCallback(
    (fieldValue) => {
      setPendingSave({
        fieldKey: activeEdit.fieldKey,
        fieldLabel: activeEdit.label,
        fieldValue,
      })
      setActiveEdit(null)
    },
    [activeEdit],
  )

  const confirmSave = useCallback(async () => {
    if (!pendingSave) return

    setSaveStatus('saving')
    setSaveError('')

    try {
      await savePageField(pageId, pendingSave.fieldKey, pendingSave.fieldValue, user)
      setPendingSave(null)
      setSaveStatus('saved')
      window.setTimeout(() => setSaveStatus('idle'), 1800)
    } catch (error) {
      setSaveError(error.message)
      setSaveStatus('idle')
    }
  }, [pageId, pendingSave, user])

  const handleClickCapture = useCallback((event) => {
    const target = event.target instanceof Element ? event.target : null
    const anchor = target?.closest('a')

    if (anchor) {
      event.preventDefault()
    }
  }, [])

  const value = useMemo(
    () => ({
      closeEditor,
      isEditing: true,
      openEditor,
      saveStatus,
    }),
    [closeEditor, openEditor, saveStatus],
  )

  return (
    <InlineEditorContext.Provider value={value}>
      <div className="editor-mode-shell" onClickCapture={handleClickCapture}>
        <EditorToolbar onExit={onExit} pageId={pageId} saveStatus={saveStatus} />
        {saveError ? <div className="editor-error">{saveError}</div> : null}
        {children}
      </div>
      <InlineFieldDialog activeEdit={activeEdit} closeEditor={closeEditor} pageId={pageId} stageSave={stageSave} />
      {pendingSave ? (
        <ConfirmSaveDialog
          fieldLabel={pendingSave.fieldLabel}
          isSaving={saveStatus === 'saving'}
          onCancel={() => setPendingSave(null)}
          onConfirm={confirmSave}
        />
      ) : null}
    </InlineEditorContext.Provider>
  )
}

