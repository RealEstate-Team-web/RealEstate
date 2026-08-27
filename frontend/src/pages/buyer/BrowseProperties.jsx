import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Layers,
  Heart,
  Grid,
  Map as MapIcon,
  MapPin,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { getFavorites, addFavorite, removeFavorite } from '../../services/favorite.service';

export const BrowseProperties = () => {
  const [viewMode, setViewMode] = useState('split');
  const [selectedPropertyId, setSelectedPropertyId] = useState(1);
  const [favoritedIds, setFavoritedIds] = useState(new Set([1, 2, 4]));
  const [toastMessage, setToastMessage] = useState(null);

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
      title: 'Modern Residence',
      location: 'Bole, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      price: '$120,000',
      beds: 5,
      baths: 3,
      sqft: '250m²',
      lat: 8.9912,
      lon: 38.7820,
      pinTop: '65%',
      pinLeft: '58%',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5,
      title: 'Family Estate',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Active',
      price: '$120,000',
      beds: 5,
      baths: 4,
      sqft: '210m²',
      lat: 9.0410,
      lon: 38.7980,
      pinTop: '20%',
      pinLeft: '80%',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Liya Bekele Residence',
      location: 'CMC, Addis Ababa',
      type: 'House',
      status: 'Active',
      price: '$120,000',
      beds: 8,
      baths: 5,
      sqft: '400m²',
      lat: 9.0230,
      lon: 38.8210,
      pinTop: '42%',
      pinLeft: '85%',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400',
    },
  ];

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const favs = await getFavorites();
        if (Array.isArray(favs)) {
          setFavoritedIds(new Set(favs.map((f) => f.id || f.propertyId)));
        }
      } catch (err) {
        console.warn('Failed to load user favorite IDs:', err);
      }
    };
    loadFavs();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFavorite = async (e, prop) => {
    e.stopPropagation();
    const isFav = favoritedIds.has(prop.id);
    const nextSet = new Set(favoritedIds);

    if (isFav) {
      nextSet.delete(prop.id);
      setFavoritedIds(nextSet);
      showToast(`Removed "${prop.title}" from favorites`);
      try {
        await removeFavorite(prop.id);
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    } else {
      nextSet.add(prop.id);
      setFavoritedIds(nextSet);
      showToast(`Saved "${prop.title}" to favorites!`);
      try {
        await addFavorite(prop.id);
      } catch (err) {
        console.error('Failed to save favorite:', err);
      }
    }
  };

  const activeProp = demoProperties.find((p) => p.id === selectedPropertyId) || demoProperties[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
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
                {demoProperties.map((prop) => (
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
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition cursor-pointer">
                View
              </button>
            </div>
          </div>
        )}

        {/* Property Cards Catalog Grid */}
        <div className={viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoProperties.map((prop) => {
              const isFavorited = favoritedIds.has(prop.id);

              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedPropertyId(prop.id)}
                  className={`bg-white border rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer ${
                    prop.id === selectedPropertyId ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200/80'
                  }`}
                >
                  <div>
                    {/* Photo & Badges */}
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={prop.img}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span
                        className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                          prop.status === 'Active'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-white'
                        }`}
                      >
                        {prop.status}
                      </span>
                      <button
                        onClick={(e) => handleToggleFavorite(e, prop)}
                        className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-xs transition cursor-pointer shadow-xs ${
                          isFavorited
                            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
                            : 'bg-white/85 hover:bg-white text-slate-600 hover:text-rose-500'
                        }`}
                        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label="Toggle Favorite"
                      >
                        <Heart size={15} fill={isFavorited ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                      <h3 className="font-bold text-slate-900 text-xs truncate">{prop.title}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{prop.location}</p>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100 font-medium">
                        <span>{prop.beds} Beds</span>
                        <span>•</span>
                        <span>{prop.baths} Baths</span>
                        <span>•</span>
                        <span>{prop.sqft}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="px-3.5 pb-3.5 pt-1.5 flex items-center justify-between border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-900">{prop.price}</span>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
                      View Details
                    </button>
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
    </div>
  );
};

export default BrowseProperties;
