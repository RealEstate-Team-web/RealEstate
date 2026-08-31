import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import {
  MapPin,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export const PropertyMap = ({ property }) => {
  const latitude = Number(property?.location?.latitude);
  const longitude = Number(property?.location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-500">
        Location information is not available.
      </div>
    );
  }

  return (
    <div className="relative z-0 h-[280px] overflow-hidden rounded-xl border border-slate-200 sm:h-[350px]">
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="min-w-[180px]">
              <p className="text-sm font-bold text-[#162831]">
                {property?.title || "Property"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {property?.location?.address || ""}
                {property?.location?.city
                  ? `, ${property.location.city}`
                  : ""}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      <div className="pointer-events-none absolute left-3 top-3 z-[1000] rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-[#162831] shadow-md">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#0F9690]" />
          {property?.location?.address || "Location"}
        </div>
      </div>
    </div>
  );
};