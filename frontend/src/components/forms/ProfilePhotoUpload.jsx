import { useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const ProfilePhotoUpload = ({ onChange, error }) => {
  const { t } = useTranslation('auth')
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')

  const handleFile = (file) => {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      onChange({ error: t('photo_invalid') })
      return
    }
    if (file.size > MAX_SIZE) {
      onChange({ error: t('photo_too_large') })
      return
    }
    onChange({ file, error: null })
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#101820] dark:text-white">{t('photo_label')}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={t('photo_upload')}
          className={`relative flex h-[50px] w-[50px] shrink-0 items-center justify-center overflow-hidden rounded-full ${
            preview ? 'bg-transparent' : 'bg-[#E5E7E8] dark:bg-slate-800'
          }`}
        >
          {preview ? (
            <img
              src={preview}
              alt={t('photo_preview_alt')}
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
          ) : (
            <Plus size={22} strokeWidth={1.6} color="#687980" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full border border-[#D5DDE0] bg-white dark:border-slate-700 dark:bg-[#1E293B]">
            <Plus size={9} strokeWidth={2.5} color="#687980" />
          </span>
        </button>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-[12px] font-medium text-navy transition-colors hover:text-teal dark:text-slate-200"
        >
          {t('photo_upload')}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}

export default ProfilePhotoUpload