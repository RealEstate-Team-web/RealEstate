import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  X,
  MapPin,
  ArrowRight,
} from "lucide-react";

import {
  getProperties,
  searchProperties,
} from "../../services/property.service";

import PropertyCard from "../../components/property/PropertyCard";

import { getPropertyImageUrl } from "../../utils/helpers";


const normalizeProperties = (response) => {
  if (!response) {
    return [];
  }

  const data = response?.data || response;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.properties)) {
    return data.properties;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const getPropertyImage = (property) => {
  return (
    getPropertyImageUrl(property) ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85"
  );
};

const getPropertyType = (property) => {
  return (
    property.property_type ||
    property.propertyType ||
    property.type ||
    property.category?.name ||
    "Property"
  );
};

const getCategoryId = (property) => {
  return (
    property.categoryId ||
    property.category_id ||
    property.category?.id ||
    ""
  );
};

const getSearchText = (property) => {
  return [
    property.title,
    property.name,
    property.description,
    property.city,
    property.location,
    property.address,
    property.property_type,
    property.propertyType,
    property.type,
    property.category?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const formatPrice = (price) => {
  if (
    price === null ||
    price === undefined ||
    price === "" ||
    Number.isNaN(Number(price))
  ) {
    return "Price on request";
  }

  return `${Number(price).toLocaleString()} ETB`;
};



const filterProperties = (properties, filters) => {
  let filtered = [...properties];

  /*
   * Search
   *
   * Searches:
   * - title
   * - city
   * - address
   * - location
   * - description
   * - property type
   * - category
   */
  if (filters.search) {
    const searchValue = filters.search
      .trim()
      .toLowerCase();

    filtered = filtered.filter((property) =>
      getSearchText(property).includes(searchValue)
    );
  }

  /*
   * Support old ?city= query as well.
   */
  if (filters.city && !filters.search) {
    const cityValue = filters.city
      .trim()
      .toLowerCase();

    filtered = filtered.filter((property) =>
      getSearchText(property).includes(cityValue)
    );
  }

  /*
   * Property category
   */
  if (filters.categoryId) {
    filtered = filtered.filter(
      (property) =>
        String(getCategoryId(property)) ===
        String(filters.categoryId)
    );
  }

  /*
   * Minimum price
   */
  if (filters.minPrice) {
    filtered = filtered.filter(
      (property) =>
        Number(property.price) >=
        Number(filters.minPrice)
    );
  }

  /*
   * Maximum price
   */
  if (filters.maxPrice) {
    filtered = filtered.filter(
      (property) =>
        Number(property.price) <=
        Number(filters.maxPrice)
    );
  }

  /*
   * Sorting
   */
  if (filters.sort === "price_low") {
    filtered.sort(
      (a, b) =>
        Number(a.price || 0) -
        Number(b.price || 0)
    );
  }

  if (filters.sort === "price_high") {
    filtered.sort(
      (a, b) =>
        Number(b.price || 0) -
        Number(a.price || 0)
    );
  }

  if (filters.sort === "newest") {
    filtered.sort((a, b) => {
      const dateA = new Date(
        a.createdAt ||
          a.created_at ||
          0
      ).getTime();

      const dateB = new Date(
        b.createdAt ||
          b.created_at ||
          0
      ).getTime();

      return dateB - dateA;
    });
  }

  return filtered;
};


const Properties = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  /*
   * Read search from the URL.
   *
   * SearchBar uses ?search=
   *
   * city is also supported for compatibility.
   */
  const initialSearch =
    searchParams.get("search") ||
    searchParams.get("city") ||
    "";

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [search, setSearch] =
    useState(initialSearch);

  const [categoryId, setCategoryId] =
    useState(
      searchParams.get("categoryId") || ""
    );

  const [minPrice, setMinPrice] =
    useState(
      searchParams.get("minPrice") || ""
    );

  const [maxPrice, setMaxPrice] =
    useState(
      searchParams.get("maxPrice") || ""
    );

  const [sort, setSort] =
    useState(
      searchParams.get("sort") || "newest"
    );

 

  const buildFilters = useCallback(() => {
    return {
      search: search.trim(),
      categoryId,
      minPrice,
      maxPrice,
      sort,
    };
  }, [
    search,
    categoryId,
    minPrice,
    maxPrice,
    sort,
  ]);


  const updateUrl = useCallback(
    (filters) => {
      const params = {};

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.categoryId) {
        params.categoryId =
          filters.categoryId;
      }

      if (filters.minPrice) {
        params.minPrice =
          filters.minPrice;
      }

      if (filters.maxPrice) {
        params.maxPrice =
          filters.maxPrice;
      }

      if (
        filters.sort &&
        filters.sort !== "newest"
      ) {
        params.sort = filters.sort;
      }

      setSearchParams(params);
    },
    [setSearchParams]
  );


  const loadProperties = useCallback(
    async (filters = {}, options = {}) => {
      const { isCancelled } = options;
      setLoading(true);
      setLoadError("");

      try {
        let apiProperties = [];

        if (filters.search?.trim()) {
          const response =
            await searchProperties(
              filters.search.trim()
            );

          if (isCancelled?.()) return;

          apiProperties =
            normalizeProperties(response);


          apiProperties =
            filterProperties(
              apiProperties,
              filters
            );

          setProperties(apiProperties);
          return;
        }


        const response =
          await getProperties({
            categoryId:
              filters.categoryId || undefined,

            minPrice:
              filters.minPrice || undefined,

            maxPrice:
              filters.maxPrice || undefined,

            sort:
              filters.sort || undefined,
          });

        if (isCancelled?.()) return;

        apiProperties =
          normalizeProperties(response);


        setProperties(apiProperties);
      } catch (error) {

        if (isCancelled?.()) return;

        console.warn(
          "Property API request failed.",
          error
        );

        setProperties([]);
        setLoadError(
          "We couldn't load properties. Please try again in a moment."
        );
      } finally {
        if (!isCancelled?.()) setLoading(false);
      }
    },
    []
  );

 
  useEffect(() => {
    let active = true;

    const urlSearch =
      searchParams.get("search") ||
      searchParams.get("city") ||
      "";

    const urlCategory =
      searchParams.get("categoryId") || "";

    const urlMinPrice =
      searchParams.get("minPrice") || "";

    const urlMaxPrice =
      searchParams.get("maxPrice") || "";

    const urlSort =
      searchParams.get("sort") || "newest";

    setSearch(urlSearch);
    setCategoryId(urlCategory);
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setSort(urlSort);

    loadProperties({
      search: urlSearch,
      categoryId: urlCategory,
      minPrice: urlMinPrice,
      maxPrice: urlMaxPrice,
      sort: urlSort,
    }, {
      isCancelled: () => !active,
    });

    return () => {
      active = false;
    };
  }, [
    searchParams,
    loadProperties,
  ]);

 
  const handleFilter = (e) => {
    e.preventDefault();

    const filters = buildFilters();

    updateUrl(filters);
  };

  const handleSort = (value) => {
    const filters = {
      ...buildFilters(),
      sort: value,
    };

    setSort(value);

    updateUrl(filters);
  };


  const clearFilters = () => {
    const filters = {
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    };

    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");

    updateUrl(filters);
  };

 
  return (
    <main className="w-full min-w-0 overflow-x-hidden bg-[#F7F9FA]">


      <section className="relative isolate min-h-[370px] w-full overflow-hidden sm:min-h-[420px] lg:min-h-[450px]">

        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,25,34,.92), rgba(8,25,34,.65), rgba(8,25,34,.78)), url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90')",
          }}
        />

        <div className="pointer-events-none absolute left-[10%] top-1/3 h-60 w-60 rounded-full bg-[#0F9690]/15 blur-[110px]" />

        <div className="pointer-events-none absolute right-[10%] top-1/3 h-52 w-52 rounded-full bg-[#22B8B1]/10 blur-[100px]" />

        <div className="relative mx-auto flex min-h-[370px] w-full max-w-[1280px] items-center px-5 py-20 sm:min-h-[420px] sm:px-8 lg:min-h-[450px] lg:px-10">

          <div className="max-w-[720px] animate-[fadeUp_.7s_ease-out_both]">

            <div className="mb-4 flex items-center gap-2.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#2AC3BB] shadow-[0_0_12px_rgba(42,195,187,.9)]" />

              <span className="text-[9px] font-bold uppercase tracking-[.22em] text-[#54D4CD] sm:text-[10px]">
                Explore Properties
              </span>

            </div>

            <h1
              className="text-[36px] font-bold leading-[1.05] tracking-tight text-white min-[480px]:text-[43px] sm:text-[52px] lg:text-[60px]"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Find Your

              <span className="block text-[#25B8B1]">
                Dream Property.
              </span>
            </h1>

            <p className="mt-5 max-w-[620px] text-[13px] leading-6 text-[#C5D3D9] sm:text-[15px] sm:leading-7">
              Discover modern homes, apartments,
              villas and commercial properties from
              trusted real estate professionals.
            </p>

          </div>

        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-[#F7F9FA] to-transparent" />

      </section>

  
      <section className="relative z-10 w-full px-4 sm:px-6 lg:px-8">

        <div className="mx-auto -mt-5 w-full max-w-[1240px] sm:-mt-8">

          <div className="relative">

            <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-[#0F9690]/5 blur-xl" />

            <div className="relative rounded-2xl border border-[#DDE7EA] bg-white p-4 shadow-[0_12px_40px_rgba(16,42,52,.08)] sm:p-5 lg:p-6">

              <form
                onSubmit={handleFilter}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
              >

                {/* Search / Location */}

                <div className="min-w-0">

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74858C]">
                    Location
                  </label>

                  <div className="relative">

                    <MapPin
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0F9690]"
                    />

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="City / Location"
                      className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] pl-9 pr-3.5 text-[13px] text-[#162831] outline-none transition-all focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                    />

                  </div>

                </div>

                {/* Property Type */}

                <div className="min-w-0">

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74858C]">
                    Property Type
                  </label>

                  <select
                    value={categoryId}
                    onChange={(e) =>
                      setCategoryId(
                        e.target.value
                      )
                    }
                    className="box-border h-11 w-full min-w-0 cursor-pointer rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] text-[#4C6069] outline-none transition-all focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                  >

                    <option value="">
                      All Properties
                    </option>

                    <option value="1">
                      Apartment
                    </option>

                    <option value="2">
                      Villa
                    </option>

                    <option value="3">
                      House
                    </option>

                    <option value="4">
                      Commercial
                    </option>

                    <option value="5">
                      Land
                    </option>

                  </select>

                </div>

                {/* Minimum Price */}

                <div className="min-w-0">

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74858C]">
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                    placeholder="Min price"
                    className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] outline-none transition-all focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                  />

                </div>

                {/* Maximum Price */}

                <div className="min-w-0">

                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#74858C]">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value
                      )
                    }
                    placeholder="Max price"
                    className="box-border h-11 w-full min-w-0 rounded-lg border border-[#DCE5E8] bg-[#FAFCFC] px-3.5 text-[13px] outline-none transition-all focus:border-[#0F9690] focus:bg-white focus:ring-4 focus:ring-[#0F9690]/10"
                  />

                </div>

                {/* Apply */}

                <div className="flex flex-col">

                  <label className="mb-1.5 hidden text-[10px] font-bold uppercase tracking-wider text-transparent lg:block">
                    Filter
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#0F9690] px-5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(15,150,144,.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0D827D] hover:shadow-[0_10px_25px_rgba(15,150,144,.24)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <SlidersHorizontal size={15} />

                    {loading
                      ? "Searching..."
                      : "Apply Filters"}

                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5"
                    />

                  </button>

                </div>

              </form>

              {/* Bottom controls */}

              <div className="mt-4 flex flex-col gap-3 border-t border-[#EDF1F2] pt-4 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex w-fit cursor-pointer items-center gap-1.5 text-[10px] font-semibold text-[#7A898F] transition-colors hover:text-red-500"
                >
                  <X size={13} />

                  Clear Filters
                </button>

                <div className="flex items-center gap-2">

                  <ArrowDownUp
                    size={14}
                    className="text-[#7A898F]"
                  />

                  <select
                    value={sort}
                    onChange={(e) =>
                      handleSort(
                        e.target.value
                      )
                    }
                    className="cursor-pointer rounded-lg border border-[#DCE5E8] bg-white px-3 py-2 text-[10px] font-semibold text-[#4C6069] outline-none transition-colors focus:border-[#0F9690]"
                  >

                    <option value="newest">
                      Newest Listings
                    </option>

                    <option value="price_low">
                      Lowest Price
                    </option>

                    <option value="price_high">
                      Highest Price
                    </option>

                  </select>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PROPERTY LIST */}

      <section className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

        <div className="pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-[#0F9690]/4 blur-[120px]" />

        <div className="relative mx-auto w-full max-w-[1240px]">

          {/* Heading */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#0F9690] sm:text-[10px]">
                Available Properties
              </span>

              <h2
                className="mt-2 text-[27px] font-bold tracking-tight text-[#162831] sm:text-[31px]"
                style={{
                  fontFamily:
                    "var(--font-display)",
                }}
              >
                Latest Properties
              </h2>

              <p className="mt-1 text-[11px] text-[#71818A] sm:text-[12px]">
                {properties.length}{" "}
                {properties.length === 1
                  ? "property"
                  : "properties"}{" "}
                found
              </p>

            </div>

            <Link
              to="/"
              className="group flex w-fit items-center gap-1.5 text-[11px] font-semibold text-[#0F9690]"
            >
              Back Home

              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1"
              />

            </Link>

          </div>

          {/* Loading */}

          {loading ? (

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-xl border border-[#E3EAEC] bg-white"
                  >

                    <div className="h-[230px] animate-pulse bg-[#E8EFF1]" />

                    <div className="space-y-3 p-4">

                      <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8EFF1]" />

                      <div className="h-3 w-1/2 animate-pulse rounded bg-[#E8EFF1]" />

                      <div className="h-8 w-1/3 animate-pulse rounded bg-[#E8EFF1]" />

                      <div className="h-3 w-full animate-pulse rounded bg-[#E8EFF1]" />

                    </div>

                  </div>
                )
              )}

            </div>

          ) : loadError ? (

            /* ERROR */

            <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50 px-5 py-16 text-center shadow-[0_8px_30px_rgba(16,42,52,0.04)] sm:py-20">
              <h3 className="text-[18px] font-bold text-rose-700">
                Something went wrong
              </h3>
              <p className="mx-auto mt-2 max-w-[420px] text-[12px] leading-5 text-rose-700/80">
                {loadError}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 cursor-pointer rounded-lg bg-[#0F9690] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(15,150,144,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0D827D]"
              >
                Reset filters
              </button>
            </div>

          ) : properties.length === 0 ? (

            /* EMPTY */

            <div className="relative overflow-hidden rounded-2xl border border-[#DDE7EA] bg-white px-5 py-16 text-center shadow-[0_8px_30px_rgba(16,42,52,.04)] sm:py-20">

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F9690]/7 blur-[70px]" />

              <div className="relative">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F9690]/10 text-[#0F9690]">

                  <Search size={24} />

                </div>

                <h3 className="mt-5 text-[18px] font-bold text-[#162831]">
                  No properties found
                </h3>

                <p className="mx-auto mt-2 max-w-[380px] text-[12px] leading-5 text-[#71818A]">
                  We couldn't find properties
                  matching your current filters.
                  Try another city, location,
                  property type, or price range.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 cursor-pointer rounded-lg bg-[#0F9690] px-5 py-2.5 text-[11px] font-semibold text-white shadow-[0_6px_18px_rgba(15,150,144,.16)] transition-all hover:-translate-y-0.5 hover:bg-[#0D827D]"
                >
                  Clear Filters
                </button>

              </div>

            </div>

          ) : (

            /* PROPERTY CARDS */

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {properties.map(
                (property, index) => (

                  <div
                    key={
                      property.id ||
                      property._id ||
                      index
                    }
                    className="group min-w-0 animate-[fadeUp_.55s_ease-out_both]"
                    style={{
                      animationDelay:
                        `${index * 70}ms`,
                    }}
                  >

                    <PropertyCard
                      property={{
                        ...property,

                        image:
                          getPropertyImage(
                            property
                          ),

                        property_type:
                          getPropertyType(
                            property
                          ),

                        formattedPrice:
                          formatPrice(
                            property.price
                          ),
                      }}
                    />

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </section>

      {/* AGENT CTA */}

      <section className="relative w-full overflow-hidden border-t border-[#E4EBED] bg-white px-4 py-12 sm:px-6 sm:py-14 md:px-8 lg:px-10">

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F9690]/5 blur-[100px]" />

        <div className="relative mx-auto flex w-full max-w-[950px] flex-col items-center justify-between gap-6 rounded-2xl border border-[#DDE7EA] bg-[#F8FAFA] p-6 text-center shadow-[0_8px_30px_rgba(16,42,52,.04)] sm:p-8 md:flex-row md:text-left">

          <div className="min-w-0">

            <span className="text-[9px] font-bold uppercase tracking-[.18em] text-[#0F9690]">
              For Property Professionals
            </span>

            <h2
              className="mt-2 text-[22px] font-bold tracking-tight text-[#162831] sm:text-[25px]"
              style={{
                fontFamily:
                  "var(--font-display)",
              }}
            >
              Want to list your properties?
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-[#71818A] sm:text-[12px]">
              Join our network of professional
              real estate agents.
            </p>

          </div>

          <Link
            to="/register"
            className="group flex shrink-0 items-center gap-2 rounded-lg bg-[#E69500] px-6 py-3 text-[11px] font-bold text-white shadow-[0_6px_18px_rgba(230,149,0,.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#D48800] hover:shadow-[0_10px_25px_rgba(230,149,0,.22)]"
          >
            Become an Agent

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />

          </Link>

        </div>

      </section>

      {/* ANIMATION */}

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>

    </main>
  );
};

export default Properties;