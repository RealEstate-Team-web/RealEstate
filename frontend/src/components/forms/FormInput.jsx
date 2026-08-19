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
      <label htmlFor={name} className="text-[13px] font-semibold text-[#101820]">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-[5px] border bg-white transition-colors focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20"
        style={{
          borderColor: error ? '#E5484D' : '#D5DDE0',
          minHeight: 36,
        }}
      >
        {Icon && (
          <span className="flex w-9 shrink-0 items-center justify-center border-r border-[#D9E0E2]">
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
          className="w-full bg-transparent px-3 text-[13px] text-[#263942] outline-none placeholder:text-muted/70"
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