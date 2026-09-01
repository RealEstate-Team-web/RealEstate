import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BedDouble,
  Bath,
  Maximize2,
  CarFront,
  CheckCircle2,
  Camera,
  MapPin,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CalendarDays,
  Send,
} from "lucide-react";

import PropertyCard from "../../components/property/PropertyCard";
import {
  NEARBY_PROPERTIES,
  DEMO_PROPERTIES,
} from "../../utils/property.details.mock.data";
import { PropertyMap } from "./PropertyMap.jsx";
import PageLoader from "../../components/common/Loader.jsx";
import { submitInquiry } from "../../services/inquiry.service";
import useAuth from "../../hooks/useAuth";
const PropertyDetails = ({
  propertyData = null,
  nearbyData = null,
}) => {
  const { id } = useParams();
  const { user } = useAuth();

  const [property, setProperty] = useState(propertyData);
  const [loading, setLoading] = useState(!propertyData);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState("");

  // Load property data from API or fallback to demo data
  useEffect(() => {
    setMessageSent(false);
    setMessage("");
    setMessageError("");
    setActiveImage(0);

    const loadProperty = async () => {
      if (propertyData) {
        setProperty(propertyData);
        setLoading(false);
        return;
      }

      if (!id) {
        setError("Invalid property ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/properties/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        setProperty(data.data || data);
      } catch {
        const fallback = DEMO_PROPERTIES.find(
          (item) => String(item.id) === String(id)
        );

        if (fallback) {
          setProperty(fallback);
        } else {
          setError("Property not found");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, propertyData]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F7FAFA]">
        <div className="text-sm font-semibold text-[#0F9690]">
          <PageLoader />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center bg-[#F7FAFA] px-4 text-center">
        <h2 className="text-xl font-extrabold text-[#162831]">
          Property Not Found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {error || "This property could not be found."}
        </p>

        <Link
          to="/properties"
          className="mt-5 rounded-lg bg-[#0F9690] px-5 py-3 text-sm font-bold text-white"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const nearbyProperties =
    Array.isArray(nearbyData) && nearbyData.length > 0
      ? nearbyData
      : NEARBY_PROPERTIES;

  const rawImages = Array.isArray(property?.images)
    ? property.images.filter(Boolean)
    : property?.img || property?.image || property?.image_url
      ? [property?.img || property?.image || property?.image_url]
      : [];

  const images =
    rawImages.length > 0
      ? rawImages
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"];

  const amenities = Array.isArray(property?.amenities)
    ? property.amenities.filter(Boolean)
    : [];

  const agent =
    property?.agent ||
    property?.agentProfile ||
    {};

  const location =
    property?.location ||
    {
      address: property?.address || "",
      city: property?.city || "",
      latitude: property?.latitude,
      longitude: property?.longitude,
    };

  const numericPrice = Number(property?.price);

  const price = Number.isFinite(numericPrice)
    ? numericPrice.toLocaleString()
    : "Price unavailable";

  // Navigate to next image in gallery
  const nextImage = () => {
    if (images.length <= 1) return;

    setActiveImage((current) =>
      current === images.length - 1
        ? 0
        : current + 1
    );
  };

  // Navigate to previous image in gallery
  const previousImage = () => {
    if (images.length <= 1) return;

    setActiveImage((current) =>
      current === 0
        ? images.length - 1
        : current - 1
    );
  };

  const activeImageUrl = images[activeImage] || "";

  // Share property via Web Share API or clipboard
  const shareProperty = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );
        alert("Property link copied to clipboard!");
      }
    } catch {
      console.log("Share cancelled.");
    }
  };

  // Send message to agent for property visit
  const sendScheduleMessage = async () => {
    if (!message.trim() || !property?.id) return;

    if (!user) {
      setMessageError("Please sign in to send an inquiry to the listing agent.");
      return;
    }

    try {
      setSendingMessage(true);
      setMessageError("");

      const senderName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
      const senderEmail = user.email;

      await submitInquiry({
        propertyId: property.id,
        name: senderName,
        email: senderEmail,
        phone: user?.phone || null,
        message: message.trim(),
      });

      setMessageSent(true);
      setMessage("");
    } catch (err) {
      console.error("Failed to send inquiry:", err);
      const errMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(", ")
          : err.message) ||
        "Failed to send your request. Please try again.";
      setMessageError(errMsg);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden bg-[#F7FAFA]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        <div className="mb-6 flex items-center gap-2 overflow-hidden text-xs text-slate-500 sm:mb-8">
          <Link
            to="/"
            className="shrink-0 hover:text-[#0F9690]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/properties"
            className="shrink-0 hover:text-[#0F9690]"
          >
            Properties
          </Link>

          <span>/</span>

          <span className="truncate text-slate-700">
            {property?.title || "Property"}
          </span>
        </div>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="relative h-[260px] overflow-hidden sm:h-[380px] lg:h-[500px]">

            {activeImageUrl ? (
              <img
                src={activeImageUrl}
                alt={property?.title || "Property"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                Property image unavailable
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F9690] px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {property?.status || "Available"}
              </span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#162831] shadow-lg sm:left-5 sm:h-10 sm:w-10"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#162831] shadow-lg sm:right-5 sm:h-10 sm:w-10"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between sm:bottom-6 sm:left-6 sm:right-6">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-wider text-white/75">
                  Property Price
                </p>

                <p className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                  {price !== "Price unavailable"
                    ? `$${price}`
                    : price}
                </p>
              </div>

              {images.length > 0 && (
                <div className="hidden items-center gap-2 rounded-lg bg-white/95 px-4 py-2.5 text-xs font-bold text-[#162831] shadow-lg sm:flex">
                  <Camera className="h-4 w-4 text-[#0F9690]" />
                  {images.length} Photos
                </div>
              )}
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 p-2 sm:grid-cols-5 sm:gap-3 sm:p-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`h-[65px] overflow-hidden rounded-lg border-2 sm:h-[90px] lg:h-[105px] ${
                    activeImage === index
                      ? "border-[#0F9690]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property?.title || "Property"} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#0F9690]">
                {property?.listingType || "Property"}
              </p>

              <h1 className="break-words text-2xl font-extrabold text-[#162831] sm:text-3xl lg:text-4xl">
                {property?.title || "Untitled Property"}
              </h1>

              <div className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F9690]" />

                <span>
                  {location.address || ""}

                  {location.city
                    ? `, ${location.city}`
                    : ""}

                  {location.state
                    ? `, ${location.state}`
                    : ""}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setSaved(!saved)}
                className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-xs font-bold ${
                  saved
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-slate-200 text-[#162831]"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    saved ? "fill-current" : ""
                  }`}
                />

                <span className="hidden sm:inline">
                  {saved ? "Saved" : "Save"}
                </span>
              </button>

              <button
                type="button"
                onClick={shareProperty}
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-bold text-[#162831] hover:border-[#0F9690]"
              >
                <Share2 className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Share
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <span className="text-2xl font-extrabold text-[#0F9690] sm:text-3xl">
              {price !== "Price unavailable"
                ? `$${price}`
                : price}
            </span>

            <span className="rounded-md bg-[#162831] px-3 py-1.5 text-[11px] font-bold text-white">
              {property?.listingType || "Property"}
            </span>

            {agent?.id && (
              <Link
                to={`/agents/${agent.id}`}
                className="ml-auto text-xs font-bold text-[#0F9690]"
              >
                View Listing Agent →
              </Link>
            )}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-extrabold text-[#162831]">
                Key Specs
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Spec
                  icon={<BedDouble />}
                  value={property?.bedrooms ?? "—"}
                  label="Bedrooms"
                />

                <Spec
                  icon={<Bath />}
                  value={property?.bathrooms ?? "—"}
                  label="Bathrooms"
                />

                <Spec
                  icon={<CarFront />}
                  value={property?.parking ?? "—"}
                  label="Parking"
                />

                <Spec
                  icon={<Maximize2 />}
                  value={
                    property?.area != null
                      ? Number(property.area).toLocaleString()
                      : "—"
                  }
                  label={property?.areaUnit || "Area"}
                />
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F7F5] px-3 py-1.5 text-xs font-bold text-[#0F9690]">
                  <CheckCircle2 className="h-4 w-4" />
                  Status: {property?.status || "Available"}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-4 text-lg font-extrabold text-[#162831]">
                Description
              </h2>

              <p className="text-sm leading-7 text-slate-600">
                {property?.description ||
                  "No description is available for this property."}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-extrabold text-[#162831]">
                Amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {amenities.map((amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-[#F8FBFB] p-3"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E6F5F4] text-[#0F9690]">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>

                      <span className="text-sm font-medium text-slate-700">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No amenities are available for this property.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-[#162831]">
                  Location Map
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {location.address || ""}

                  {location.city
                    ? `, ${location.city}`
                    : ""}

                  {location.state
                    ? `, ${location.state}`
                    : ""}
                </p>
              </div>

              <PropertyMap
                property={property}
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-lg bg-[#F3FAF9] px-3 py-2">
                  <p className="text-[10px] text-slate-400">
                    Latitude
                  </p>

                  <p className="text-xs font-bold text-[#162831]">
                    {location.latitude ?? "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-[#F3FAF9] px-3 py-2">
                  <p className="text-[10px] text-slate-400">
                    Longitude
                  </p>

                  <p className="text-xs font-bold text-[#162831]">
                    {location.longitude ?? "—"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="border-b border-slate-100 pb-5 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F9690]">
                  Listing Agent
                </p>

                <div className="mt-4 flex justify-center">
                  {agent?.photo ? (
                    <img
                      src={agent.photo}
                      alt={agent.name || "Listing Agent"}
                      className="h-28 w-28 rounded-full border-4 border-[#E8F7F5] object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#E8F7F5] bg-[#F3FAF9] text-2xl font-extrabold text-[#0F9690]">
                      {agent?.name?.charAt(0) || "A"}
                    </div>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[#162831]">
                  {agent?.name || "Listing Agent"}
                </h3>

                <p className="mt-1 text-sm font-medium text-[#0F9690]">
                  {agent?.role || "Real Estate Agent"}
                </p>

                <div className="mt-3 flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="text-[#E6A23C]"
                    >
                      ★
                    </span>
                  ))}

                  <span className="ml-1 text-xs font-bold text-[#162831]">
                    {agent?.rating != null
                      ? Number(agent.rating).toFixed(1)
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-100 py-5">
                <div className="rounded-xl bg-[#F3FAF9] p-3 text-center">
                  <p className="text-lg font-extrabold text-[#162831]">
                    {agent?.experienceYears ?? "—"}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Years Experience
                  </p>
                </div>

                <div className="rounded-xl bg-[#F3FAF9] p-3 text-center">
                  <p className="text-lg font-extrabold text-[#162831]">
                    {agent?.totalProperties ?? "—"}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Properties
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-b border-slate-100 py-5">
                <AgentInfo
                  icon={<MapPin />}
                  label="Location"
                  value={agent?.location || "Not available"}
                />

                <AgentInfo
                  icon={<Phone />}
                  label="Phone"
                  value={agent?.phone || "Not available"}
                />

                <AgentInfo
                  icon={<Mail />}
                  label="Email"
                  value={agent?.email || "Not available"}
                />
              </div>

              <div className="py-5">
                <h4 className="mb-2 text-sm font-extrabold text-[#162831]">
                  About the Agent
                </h4>

                <p className="text-xs leading-6 text-slate-500">
                  {agent?.bio ||
                    "No agent information is available."}
                </p>
              </div>

              <div className="space-y-2">

                {agent?.id && (
                  <Link
                    to={`/agents/${agent.id}`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-[#162831] text-sm font-bold text-white hover:bg-[#223D49]"
                  >
                    View Full Profile
                  </Link>
                )}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">

                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#0F9690]" />

                  <h4 className="text-sm font-extrabold text-[#162831]">
                    Schedule a Visit
                  </h4>
                </div>

                <p className="mb-3 text-xs leading-5 text-slate-500">
                  Send a message to the listing agent to request a
                  property visit.
                </p>

                {messageSent ? (
                  <div className="rounded-xl border border-[#BFE8E3] bg-[#E8F7F5] p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F9690]" />

                      <div>
                        <p className="text-xs font-bold text-[#162831]">
                          Message sent successfully
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                          The agent can now respond regarding your
                          visit request.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={message}
                      onChange={(event) => {
                        setMessage(event.target.value);
                        if (messageError) setMessageError("");
                      }}
                      rows={4}
                      placeholder={
                        user
                          ? `Hello ${agent?.name || "Agent"}, I would like to schedule a visit for this property.`
                          : "Please sign in to send a direct message or visit request to the agent."
                      }
                      disabled={!user}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-[#FAFCFC] px-3 py-3 text-xs text-[#162831] outline-none placeholder:text-slate-400 focus:border-[#0F9690] focus:ring-1 focus:ring-[#0F9690] disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />

                    {messageError && (
                      <p className="mt-1.5 text-xs text-rose-600 font-medium">
                        {messageError}
                      </p>
                    )}

                    {!user ? (
                      <Link
                        to="/login"
                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F9690] text-sm font-bold text-white transition hover:bg-[#0D827D]"
                      >
                        Sign in to Inquire
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={sendScheduleMessage}
                        disabled={
                          sendingMessage ||
                          !message.trim()
                        }
                        className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0F9690] text-sm font-bold text-white transition hover:bg-[#0D827D] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        {sendingMessage ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Visit Request
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>

            </div>
          </aside>
        </div>

        <section className="mt-10 border-t border-slate-200 pt-8 sm:mt-14 sm:pt-10">

          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0F9690]">
                Explore More
              </p>

              <h2 className="text-xl font-extrabold text-[#162831] sm:text-2xl">
                Nearby Properties
              </h2>
            </div>

            <Link
              to="/properties"
              className="hidden items-center gap-1 text-sm font-bold text-[#0F9690] sm:flex"
            >
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {nearbyProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nearbyProperties.map((item) => (
                <PropertyCard
                  key={item.id}
                  property={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No nearby properties are available.
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F9690] px-6 py-3 text-sm font-bold text-white"
            >
              View All Properties
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

const Spec = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E1F1EF] bg-[#F3FAF9] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0F9690] shadow-sm">
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold text-[#162831]">
          {value}
        </p>

        <p className="text-[10px] text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
};

const AgentInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F7F5] text-[#0F9690]">
        <span className="[&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] text-slate-400">
          {label}
        </p>

        <p className="truncate text-xs font-bold text-[#162831]">
          {value}
        </p>
      </div>
    </div>
  );
};

export default PropertyDetails;