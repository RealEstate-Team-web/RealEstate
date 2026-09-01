import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Layers,
  Heart,
  Grid,
  Map as MapIcon,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MessageSquare,
  BedDouble,
  Bath,
  Maximize2,
} from 'lucide-react';
import { getFavorites, addFavorite, removeFavorite } from '../../services/favorite.service';
import { getProperties } from '../../services/property.service';
import { BookVisitModal } from '../../components/buyer/BookVisitModal';
import { InquiryModal } from '../../components/buyer/InquiryModal';
import { useToast } from '../../hooks/useToast';

export const BrowseProperties = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState('split');
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    location.state?.selectedPropertyId || 1
  );
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [favsLoading, setFavsLoading] = useState(true);
  const [favsError, setFavsError] = useState(null);
  const [bookingProperty, setBookingProperty] = useState(null);
  const [inquireProperty, setInquireProperty] = useState(null);
  const [apiProperties, setApiProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const mutationVersionsRef = useRef(new Map());
  const { toastMessage, showToast } = useToast();

  const demoProperties = [
    {
      id: 1,
      title: 'Luxury Villa in Bole',
      location: 'Bole, Addis Ababa',
      type: 'Villa',
      status: 'Sold',
      price: '$350,000',
      beds: 4,
      baths: 3,
      sqft: '330m²',
      lat: 8.9984,
      lon: 38.7892,
      pinTop: '55%',
      pinLeft: '65%',
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      title: 'Modern Apartment',
      location: 'Kazanchis, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      price: '$120,000',
      beds: 2,
      baths: 2,
      sqft: '188m²',
      lat: 9.0182,
      lon: 38.7665,
      pinTop: '38%',
      pinLeft: '45%',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      title: 'Family House in Yeka',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Sold',
      price: '$120,000',
      beds: 3,
      baths: 7,
      sqft: '180m²',
      lat: 9.0345,
      lon: 38.7912,
      pinTop: '25%',
      pinLeft: '70%',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      title: 'Modern Apartment in Bole',
      location: 'Bole, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      price: '$120,000',
      beds: 2,
      baths: 2,
      sqft: '188m²',
      lat: 8.9922,
      lon: 38.7855,
      pinTop: '60%',
      pinLeft: '62%',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5,
      title: 'Contemporary Townhouse',
      location: 'Sarbet, Addis Ababa',
      type: 'Townhouse',
      status: 'Active',
      price: '$275,000',
      beds: 3,
      baths: 3,
      sqft: '240m²',
      lat: 8.995,
      lon: 38.74,
      pinTop: '58%',
      pinLeft: '35%',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Luxury Penthouse Suite',
      location: 'Old Airport, Addis Ababa',
      type: 'Penthouse',
      status: 'Active',
      price: '$450,000',
      beds: 4,
      baths: 4,
      sqft: '410m²',
      lat: 8.985,
      lon: 38.745,
      pinTop: '70%',
      pinLeft: '40%',
      img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400',
    },
  ];

  const loadFavs = useCallback(async () => {
    setFavsLoading(true);
    setFavsError(null);
    try {
      const favs = await getFavorites();
      if (Array.isArray(favs)) {
        setFavoritedIds(new Set(favs.map((f) => f.id || f.propertyId)));
        setFavsError(null);
      }
    } catch (err) {
      console.warn('Failed to load user favorite IDs:', err);
      setFavsError('Could not load your saved favorites');
    } finally {
      setFavsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getFavorites()
      .then((favs) => {
        if (isMounted && Array.isArray(favs)) {
          setFavoritedIds(new Set(favs.map((f) => f.id || f.propertyId)));
          setFavsError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Failed to load user favorite IDs:', err);
          setFavsError('Could not load your saved favorites');
        }
      })
      .finally(() => {
        if (isMounted) {
          setFavsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (e, prop) => {
    if (favsLoading || favsError) return;

    e.stopPropagation();
    const propId = prop.id;
    const isAdding = !favoritedIds.has(propId);
    const nextVersion = (mutationVersionsRef.current.get(propId) || 0) + 1;
    mutationVersionsRef.current.set(propId, nextVersion);

    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (isAdding) {
        next.add(propId);
      } else {
        next.delete(propId);
      }
      return next;
    });

    if (isAdding) {
      try {
        await addFavorite(propId);
        if (mutationVersionsRef.current.get(propId) === nextVersion) {
          showToast(`Saved "${prop.title}" to favorites!`);
        }
      } catch (err) {
        console.error('Failed to save favorite:', err);
        if (mutationVersionsRef.current.get(propId) === nextVersion) {
          setFavoritedIds((prev) => {
            const next = new Set(prev);
            next.delete(propId);
            return next;
          });
          showToast('Failed to save favorite. Please try again.');
        }
      }
    } else {
      try {
        await removeFavorite(propId);
        if (mutationVersionsRef.current.get(propId) === nextVersion) {
          showToast(`Removed "${prop.title}" from favorites`);
        }
      } catch (err) {
        console.error('Failed to remove favorite:', err);
        if (mutationVersionsRef.current.get(propId) === nextVersion) {
          setFavoritedIds((prev) => {
            const next = new Set(prev);
            next.add(propId);
            return next;
          });
          showToast('Failed to remove favorite. Please try again.');
        }
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoadingProperties(true);
        const result = await getProperties({ limit: 20 });
        if (!isMounted) return;
        const list = Array.isArray(result?.properties)
          ? result.properties
          : Array.isArray(result)
          ? result
          : [];

        if (list.length > 0) {
          const mapped = list.map((p, idx) => ({
            id: p.id,
            title: p.title,
            location: p.address
              ? `${p.address}, ${p.city || ''}`
              : p.city || 'Addis Ababa',
            type: p.listingType || p.category || 'Property',
            status:
              (p.status || 'Active').charAt(0).toUpperCase() +
              (p.status || 'Active').slice(1),
            price:
              typeof p.price === 'number'
                ? `$${p.price.toLocaleString()}`
                : p.price || '$0',
            beds: p.bedrooms ?? '—',
            baths: p.bathrooms ?? '—',
            sqft: p.area ? `${p.area}m²` : '—',
            lat: p.latitude || 8.98 + idx * 0.01,
            lon: p.longitude || 38.75 + idx * 0.01,
            pinTop: `${30 + ((idx * 15) % 50)}%`,
            pinLeft: `${30 + ((idx * 20) % 50)}%`,
            img:
              p.cover_image ||
              p.image_url ||
              p.images?.[0] ||
              'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400',
          }));
          setApiProperties(mapped);
          setSelectedPropertyId(mapped[0].id);
        }
      } catch (err) {
        console.warn('Using fallback demo properties for browsing:', err);
      } finally {
        if (isMounted) setLoadingProperties(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const displayProperties = apiProperties.length > 0 ? apiProperties : demoProperties;
  const activeProp = displayProperties.find((p) => p.id === selectedPropertyId) || displayProperties[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Favorite Loading Error Banner with Retry */}
      {favsError && (
        <div
          role="alert"
          className="rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{favsError}. Some favorite statuses may not reflect your account.</span>
          </div>
          <button
            type="button"
            onClick={loadFavs}
            disabled={favsLoading}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 shrink-0 text-xs"
          >
            {favsLoading ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          Browse Properties <span className="text-slate-400 font-normal">(143 results)</span>
        </h1>
      </div>

      {/* Control Bar matching Screenshot 2 */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search locations, keywords..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer">
          <Filter size={14} />
          <span>Filters</span>
          <span className="bg-blue-800 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-0.5">3 Applied</span>
        </button>

        {/* Sort */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by</span>
          <select className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-2 focus:outline-none">
            <option>Date: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* View Toggles */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center space-x-1">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500'
              }`}
              title="Split Map View"
            >
              <MapIcon size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid size={15} />
            </button>
          </div>

          <button className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer">
            <Layers size={14} />
            <span>Compare (2)</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Split Map & Property Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* OpenStreetMap Map Provider Container with Place Pin Markers */}
        {viewMode === 'split' && (
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl overflow-hidden min-h-[540px] relative shadow-2xs flex flex-col justify-between p-2.5">
            {/* Map Canvas with Interactive OpenStreetMap Iframe */}
            <div className="relative flex-1 rounded-lg overflow-hidden border border-slate-200">
              <iframe
                title="Addis Ababa OpenStreetMap"
                width="100%"
                height="100%"
                className="min-h-[440px] w-full border-0"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=38.7100%2C8.9600%2C38.8400%2C9.0600&amp;layer=mapnik"
              ></iframe>

              {/* Interactive Location Pin Markers Layer on top of Map */}
              <div className="absolute inset-0 pointer-events-auto">
                {displayProperties.map((prop) => (
                  <div
                    key={prop.id}
                    style={{ top: prop.pinTop, left: prop.pinLeft }}
                    onClick={() => setSelectedPropertyId(prop.id)}
                    className="absolute -translate-x-1/2 -translate-y-full cursor-pointer group z-20"
                  >
                    {/* Pin Label Box */}
                    <div
                      className={`px-2 py-1 rounded-md text-[10px] font-bold shadow-md transition-transform duration-200 flex items-center gap-1 border whitespace-nowrap ${
                        prop.id === selectedPropertyId
                          ? 'bg-blue-600 text-white border-white scale-110 ring-2 ring-blue-400/40'
                          : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-slate-900 hover:text-white hover:scale-105'
                      }`}
                    >
                      <MapPin size={11} className={prop.id === selectedPropertyId ? 'text-white' : 'text-blue-600'} />
                      <span>{prop.location.split(',')[0]}: {prop.price}</span>
                    </div>
                    {/* Pin Pointer Arrow */}
                    <div
                      className={`w-2 h-2 rotate-45 mx-auto -mt-1 border-r border-b ${
                        prop.id === selectedPropertyId ? 'bg-blue-600 border-white' : 'bg-white border-slate-300'
                      }`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Top Map Controls Tag */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold px-2.5 py-1 rounded border border-slate-200 shadow-2xs flex items-center gap-1">
                <Navigation size={12} className="text-blue-600" /> Addis Ababa (Bole, Kazanchis, Yeka)
              </div>
            </div>

            {/* Selected Property Map Footer Card */}
            <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center space-x-3">
              <img
                src={activeProp.img}
                alt={activeProp.title}
                className="w-11 h-11 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{activeProp.title}</h4>
                <p className="text-[10px] text-slate-500">{activeProp.location} • {activeProp.sqft}</p>
                <p className="text-xs font-extrabold text-blue-600 mt-0.5">{activeProp.price}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeProp) setBookingProperty(activeProp);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
              >
                <Calendar size={13} />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        )}

        {/* Property Cards Catalog Grid */}
        <div className={viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div
            className={`grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
            {displayProperties.map((prop) => {
              const isFavorited = favoritedIds.has(prop.id);
              const isSelected = prop.id === selectedPropertyId;

              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedPropertyId(prop.id)}
                  className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                    isSelected ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md' : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Photo & Top Badges */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={prop.img}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                      {/* Status Pill */}
                      <span
                        className={`absolute top-3.5 left-3.5 text-[11px] font-bold px-3 py-1 rounded-full tracking-wide shadow-xs ${
                          prop.status === 'Active'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900/85 text-white backdrop-blur-xs'
                        }`}
                      >
                        {prop.status}
                      </span>

                      {/* Favorite Heart Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(e, prop)}
                        disabled={favsLoading || Boolean(favsError)}
                        className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition cursor-pointer shadow-md ${
                          isFavorited
                            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                            : 'bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500'
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-pressed={isFavorited}
                      >
                        <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} />
                      </button>

                      {/* Price Banner on Image */}
                      <div className="absolute bottom-3 left-3.5">
                        <span className="text-white text-lg font-black tracking-tight drop-shadow-md">
                          {prop.price}
                        </span>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                            {prop.title}
                          </h3>
                          {prop.type && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                              {prop.type}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5 line-clamp-1">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span>{prop.location}</span>
                        </p>
                      </div>

                      {/* Specs Pills */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-slate-600">
                        <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold">
                          <BedDouble size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{prop.beds} Beds</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold">
                          <Bath size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{prop.baths} Baths</span>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-semibold">
                          <Maximize2 size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{prop.sqft}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="px-5 pb-5 pt-1 grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInquireProperty(prop);
                      }}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Send inquiry to listing agent"
                    >
                      <MessageSquare size={13} className="text-slate-500 shrink-0" />
                      <span>Inquire</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookingProperty(prop);
                      }}
                      className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      title="Schedule a property tour"
                    >
                      <Calendar size={13} className="text-blue-600 shrink-0" />
                      <span>Tour</span>
                    </button>

                    <Link
                      to={`/properties/${prop.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center text-center shadow-2xs"
                      title="View full property details"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <button className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-md hover:bg-slate-50 cursor-pointer">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-xs font-bold text-white rounded-md">1</button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-md hover:bg-slate-50 cursor-pointer">
              2
            </button>
            <button className="px-3 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-md hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Book Visit Modal */}
      {bookingProperty && (
        <BookVisitModal
          isOpen={Boolean(bookingProperty)}
          onClose={() => setBookingProperty(null)}
          property={bookingProperty}
          onSuccess={(_created, msg) => {
            showToast(msg);
          }}
        />
      )}

      {/* Inquire Modal */}
      {inquireProperty && (
        <InquiryModal
          isOpen={Boolean(inquireProperty)}
          onClose={() => setInquireProperty(null)}
          property={inquireProperty}
          onSuccess={(_created, msg) => {
            showToast(msg || 'Inquiry sent successfully!');
          }}
        />
      )}
    </div>
  );
};

export default BrowseProperties;
