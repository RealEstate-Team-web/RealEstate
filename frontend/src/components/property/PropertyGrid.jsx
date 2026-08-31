import { PackageSearch } from "lucide-react";
import PropertyCard from "./PropertyCard";
import Loader from "../common/Loader";
const PropertyGrid = ({ properties, loading }) => {

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (!properties?.length) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 text-muted text-center">
        <PackageSearch className="w-12 h-12 text-border" />
        <div>
          <p className="text-[16px] font-semibold text-ink">No properties found</p>
          <p className="text-[14px] mt-1">Try adjusting your search filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;