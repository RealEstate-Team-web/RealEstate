const ROLE_OPTIONS = [
  { value: 'buyer', label: 'Buyer / Tenant' },
  { value: 'agent', label: 'Agent' },
]

const RoleSelector = ({ value, onChange, error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-[#101820]">Role Selection</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {ROLE_OPTIONS.map((option) => {
          const checked = value === option.value
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-navy"
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="h-4 w-4 accent-[#159FA7]"
              />
              {option.label}
            </label>
          )
        })}
      </div>
      {error && (
        <p role="alert" className="text-xs text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}

export default RoleSelector