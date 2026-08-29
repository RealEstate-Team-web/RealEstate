import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "1", label: "Apartment" },
  { value: "2", label: "Villa" },
  { value: "3", label: "House" },
  { value: "4", label: "Commercial" },
  { value: "5", label: "Land" },
];

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5"];
const BATHROOM_OPTIONS = ["1", "2", "3", "4"];

const FilterSidebar = ({ filters, setFilters, onSearch }) => {
  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearAll = () => {
    setFilters({
      city: "",
      location: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: "",
      sort: "newest",
    });
  };

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 shadow-xs">

      {/* Header with Title & Clear All */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#0F9690]" />
          <span className="font-bold text-[#162831] text-[15px]">Filters</span>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="text-[12px] text-[#64748B] hover:text-[#0F9690] font-medium transition-colors cursor-pointer"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">

        {/* City Input */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            City
          </label>
          <input
            type="text"
            placeholder="e.g. Addis Ababa"
            value={filters.city || ""}
            onChange={(e) => updateFilter("city", e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F9690] transition-colors"
          />
        </div>

        {/* Location / Area Input */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Location / Area
          </label>
          <input
            type="text"
            placeholder="e.g. Bole, CMC..."
            value={filters.location || ""}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F9690] transition-colors"
          />
        </div>

        {/* Property Type Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Property Type
          </label>
          <div className="relative">
            <select
              value={filters.categoryId || ""}
              onChange={(e) => updateFilter("categoryId", e.target.value)}
              className="w-full appearance-none border border-[#E2E8F0] rounded-lg pl-3 pr-8 py-2 text-[13px] text-[#1E293B] bg-white focus:outline-none focus:border-[#0F9690] transition-colors cursor-pointer"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Price Range ($)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F9690] transition-colors"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F9690] transition-colors"
            />
          </div>
        </div>

        {/* Bedrooms Pill Selection */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Bedrooms
          </label>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => updateFilter("bedrooms", "")}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer ${
                !filters.bedrooms
                  ? "bg-[#0F9690] text-white border-[#0F9690] shadow-2xs"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F9690]"
              }`}
            >
              Any
            </button>
            {BEDROOM_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateFilter("bedrooms", n)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer ${
                  filters.bedrooms === n
                    ? "bg-[#0F9690] text-white border-[#0F9690] shadow-2xs"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F9690]"
                }`}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms Pill Selection */}
        <div>
          <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Bathrooms
          </label>
          <div className="flex gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => updateFilter("bathrooms", "")}
              className={`px-3 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer ${
                !filters.bathrooms
                  ? "bg-[#0F9690] text-white border-[#0F9690] shadow-2xs"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F9690]"
              }`}
            >
              Any
            </button>
            {BATHROOM_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => updateFilter("bathrooms", n)}
                className={`px-2.5 py-1 rounded-md text-[12px] font-semibold border transition-all cursor-pointer ${
                  filters.bathrooms === n
                    ? "bg-[#0F9690] text-white border-[#0F9690] shadow-2xs"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F9690]"
                }`}
              >
                {n}+
              </button>
            ))}
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSearch}
            className="w-full flex items-center justify-center gap-2 bg-[#0F9690] hover:bg-[#0D827D] text-white font-semibold py-2.5 rounded-lg transition-colors text-[13px] shadow-xs cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Search Properties
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterSidebar;