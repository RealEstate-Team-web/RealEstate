import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'

const PasswordInput = ({ label, name, value, onChange, error, onBlur }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-[#101820]">
        {label}
      </label>
      <div
        className="flex items-stretch overflow-hidden rounded-[5px] border bg-white transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20"
        style={{
          borderColor: error ? '#E5484D' : '#D5DDE0',
          minHeight: 36,
        }}
      >
        <span className="flex w-9 shrink-0 items-center justify-center border-r border-[#D9E0E2]">
          <Lock size={17} strokeWidth={1.8} color="#687980" />
        </span>
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={name === 'confirmPassword' ? 'new-password' : 'current-password'}
          className="w-full bg-transparent px-3 text-[13px] text-[#263942] outline-none placeholder:text-muted/70"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="flex w-9 shrink-0 items-center justify-center text-muted transition-colors hover:text-teal"
        >
          {visible ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}

export default PasswordInput