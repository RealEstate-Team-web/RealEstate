import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Heart, Share2, X } from "lucide-react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_THUMBNAILS = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80",
];

const PropertyGallery = ({
  images = [],
  coverImage,
  title = "Property",
  status = "Active",
  isFavorite = false,
  onToggleFavorite,
  onShare,
}) => {
  const allImages = images.length > 0
    ? images
    : coverImage
    ? [coverImage, ...DEFAULT_THUMBNAILS.slice(1)]
    : DEFAULT_THUMBNAILS;

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const nextImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hero / Main Image */}
      <div className="relative h-[380px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden shadow-sm group">
        <img
          src={allImages[activeIndex] || FALLBACK_IMAGE}
          alt={`${title} - view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-teal text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md shadow">
            {status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label="Save to favorites"
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-navy hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share property"
            className="w-10 h-10 rounded-full bg-white/90 text-navy flex items-center justify-center shadow-md hover:bg-white transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Arrows (if multiple images) */}
        {allImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-4 flex items-center justify-between pointer-events-none">
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="pointer-events-auto w-10 h-10 rounded-full bg-white/80 hover:bg-white text-navy flex items-center justify-center shadow transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* View All Photos Button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="absolute bottom-5 left-5 inline-flex items-center gap-2 bg-navy/80 hover:bg-navy backdrop-blur-sm text-white text-[12px] font-semibold px-4 py-2 rounded-lg border border-white/20 shadow-lg transition-all"
        >
          <Camera className="w-4 h-4 text-gold" />
          View All {allImages.length} Photos
        </button>
      </div>

      {/* Thumbnails Row */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.slice(0, 4).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-teal shadow-md scale-[1.02]"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label="Close modal"
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center">
            <img
              src={allImages[activeIndex]}
              alt={`${title} fullscreen ${activeIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <p className="text-white/70 text-sm mt-4">
            {activeIndex + 1} / {allImages.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
