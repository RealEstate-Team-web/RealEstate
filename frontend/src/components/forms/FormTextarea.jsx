const FormTextarea = ({ label, name, value, onChange, error, placeholder, maxLength }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[13px] font-semibold text-[#101820]">
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
        className="w-full resize-y rounded-[5px] border bg-white px-3 py-2 text-[13px] text-[#263942] outline-none transition-colors placeholder:text-muted/70 focus:border-teal focus:ring-2 focus:ring-teal/20"
        style={{
          borderColor: error ? '#E5484D' : '#D5DDE0',
          minHeight: 52,
        }}
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