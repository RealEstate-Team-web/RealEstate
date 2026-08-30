import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const PROPERTY_TYPES = [
  { value: "", label: "Property Type" },
  { value: "1", label: "Apartment" },
  { value: "2", label: "Villa" },
  { value: "3", label: "House" },
  { value: "4", label: "Commercial" },
  { value: "5", label: "Land" },
];

const SearchBar = ({
  initialSearch = "",
  initialType = "",
  onSearch,
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const searchValue = search.trim();

    const searchData = {
      search: searchValue,
      categoryId: type,
    };

    
 
    if (onSearch) {
      onSearch(searchData);
      return;
    }

    
    const params = new URLSearchParams();

    if (searchValue) {
      params.set("search", searchValue);
    }

    if (type) {
      params.set("categoryId", type);
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/properties?${queryString}`
        : "/properties"
    );
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex flex-col items-stretch gap-3 rounded-2xl bg-white p-4 shadow-xl shadow-navy/10 sm:flex-row sm:items-center sm:p-5"
    >
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <Search
          className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        />

        <input
          type="text"
          placeholder="Location, city or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border py-3 pl-10 pr-4 text-[14px] text-ink placeholder-muted transition-colors focus:border-teal focus:outline-none"
        />
      </div>

      {/* Property Type */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="min-w-[150px] rounded-lg border border-border bg-white px-4 py-3 text-[14px] text-ink transition-colors focus:border-teal focus:outline-none"
      >
        {PROPERTY_TYPES.map(({ value, label }) => (
          <option
            key={value}
            value={value}
          >
            {label}
          </option>
        ))}
      </select>

      {/* Search button */}
      <button
        type="submit"
        className="shrink-0 cursor-pointer rounded-lg bg-teal px-8 py-3 text-center text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-dark hover:shadow"
      >
        Search Properties
      </button>
    </form>
  );
};

export default SearchBar;