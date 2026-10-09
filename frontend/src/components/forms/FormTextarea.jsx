const FormTextarea = ({ label, name, value, onChange, error, placeholder, maxLength }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-[#101820] dark:text-white">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className={`w-full resize-y rounded-[5px] bg-white px-3 py-2 text-[13px] text-[#263942] outline-none transition-colors placeholder:text-muted/70 focus:border-teal focus:ring-2 focus:ring-teal/20 dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-400 ${
          error ? 'border border-[#E5484D] dark:border-[#E5484D]' : 'border border-[#D5DDE0] dark:border-slate-700'
        }`}
        style={{ minHeight: 52 }}
      />
      {error && (
        <p role="alert" className="text-xs text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormTextarea