const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  icon: Icon,
  onBlur,
  autoComplete,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-[#101820] dark:text-white">
        {label}
      </label>
      <div
        className={`flex items-stretch overflow-hidden rounded-[5px] bg-white transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20 dark:bg-[#1E293B] ${
          error ? 'border border-[#E5484D] dark:border-[#E5484D]' : 'border border-[#D5DDE0] dark:border-slate-700'
        }`}
        style={{ minHeight: 36 }}
      >
        {Icon && (
          <span className="flex w-9 shrink-0 items-center justify-center border-r border-[#D9E0E2] dark:border-slate-700">
            <Icon size={17} strokeWidth={1.8} color="#687980" />
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent px-3 text-[13px] text-[#263942] outline-none placeholder:text-muted/70 dark:text-white dark:placeholder:text-slate-400"
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

export default FormInput