import { Link } from "react-router-dom";
import {
  BedDouble,
  Bath,
  Maximize2,
  CarFront,
  MapPin,
} from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

const getImage = (property) => {
  if (property.image) return property.image;

  if (property.image_url) return property.image_url;

  if (property.cover_image) return property.cover_image;

  if (Array.isArray(property.images) && property.images.length > 0) {
    const firstImage = property.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }
  }

  return FALLBACK_IMAGE;
};

const getLocation = (property) => {
  // Mock data structure
  if (property.location) {
    const address = property.location.address;
    const city = property.location.city;

    if (address && city) {
      return `${address}, ${city}`;
    }

    return address || city || "Location unavailable";
  }

  // Backend may return address/city directly
  if (property.address && property.city) {
    return `${property.address}, ${property.city}`;
  }

  if (property.address) {
    return property.address;
  }

  if (property.city) {
    return property.city;
  }

  return "Location unavailable";
};

const getStatus = (property) => {
  return property.status || property.listingStatus || "Active";
};

const getPrice = (property) => {
  if (
    property.formattedPrice &&
    property.formattedPrice !== "Price on request"
  ) {
    return property.formattedPrice;
  }

  if (!property.price) {
    return "Price on request";
  }

  return `${Number(property.price).toLocaleString()} ETB`;
};

const getArea = (property) => {
  if (!property.area) {
    return "—";
  }

  const unit = property.areaUnit || "m²";

  return `${Number(property.area).toLocaleString()} ${unit}`;
};

const PropertyCard = ({ property }) => {
  const image = getImage(property);
  const location = getLocation(property);
  const price = getPrice(property);
  const status = getStatus(property);
  const area = getArea(property);

  return (
    <article
      className="
        group
        w-full
        overflow-hidden
        rounded-xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#0F9690]/40
        hover:shadow-xl
      "
    >
      {/*  IMAGE  */}

      <div className="relative h-[200px] w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={property.title || "Property"}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-105
          "
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />

        {/* Hover overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-black/0
            transition-colors
            duration-300
            group-hover:bg-black/10
          "
        />

        {/* Price */}

        <div
          className="
            absolute
            left-3
            top-3
            rounded-lg
            bg-[#66AC39]
            px-3
            py-1.5
            text-xs
            font-bold
            text-white
            shadow-md
          "
        >
          {price}
        </div>

        {/* Status */}

        {status && (
          <div
            className="
              absolute
              bottom-3
              right-3
              rounded-md
              bg-[#0F8690]
              px-2.5
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-white
              shadow-md
            "
          >
            {status}
          </div>
        )}
      </div>

      {/*  CONTENT  */}

      <div className="p-5">

        {/* Title */}

        <h3
          className="
            line-clamp-1
            text-base
            font-bold
            text-[#162831]
            transition-colors
            duration-200
            group-hover:text-[#0F9690]
          "
          title={property.title}
        >
          {property.title || "Untitled Property"}
        </h3>

        {/* Location */}

        <div className="mt-2 flex min-w-0 items-center gap-1.5">
          <MapPin
            className="h-3.5 w-3.5 shrink-0 text-[#0F9690]"
          />

          <p
            className="
              min-w-0
              truncate
              text-xs
              text-slate-500
            "
            title={location}
          >
            {location}
          </p>
        </div>

        {/*  SPECS */}

        <div
          className="
            mt-5
            grid
            grid-cols-4
            gap-2
            border-t
            border-slate-100
            pt-4
          "
        >

          {/* Bedrooms */}

          <div
            className="
              flex
              flex-col
              items-center
              gap-1
              text-xs
              text-slate-500
            "
          >
            <BedDouble className="h-5 w-5 text-[#0F9690]" />

            <span>
              {property.bedrooms ?? "—"}
            </span>
          </div>

          {/* Bathrooms */}

          <div
            className="
              flex
              flex-col
              items-center
              gap-1
              text-xs
              text-slate-500
            "
          >
            <Bath className="h-5 w-5 text-[#0F9690]" />

            <span>
              {property.bathrooms ?? "—"}
            </span>
          </div>

          {/* Parking */}

          <div
            className="
              flex
              flex-col
              items-center
              gap-1
              text-xs
              text-slate-500
            "
          >
            <CarFront className="h-5 w-5 text-[#0F9690]" />

            <span>
              {property.parking ?? property.park ?? "—"}
            </span>
          </div>

          {/* Area */}

          <div
            className="
              flex
              min-w-0
              flex-col
              items-center
              gap-1
              text-xs
              text-slate-500
            "
          >
            <Maximize2 className="h-5 w-5 text-[#0F9690]" />

            <span
              className="max-w-full truncate"
              title={area}
            >
              {area}
            </span>
          </div>

        </div>

        {/*  DETAILS BUTTON  */}

        <div className="mt-5">
          <Link
            to={`/properties/${property.id}`}
            className="
              flex
              h-9
              w-full
              items-center
              justify-center
              rounded-lg
              bg-[#0F9690]
              px-4
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#0c7d78]
              hover:shadow-md
              active:scale-[0.98]
            "
          >
            View Details
          </Link>
        </div>

      </div>
    </article>
  );
};

export default PropertyCard;