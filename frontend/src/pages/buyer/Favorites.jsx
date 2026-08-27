import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Heart,
  Trash2,
  Share2,
  Building,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { getFavorites, removeFavorite } from '../../services/favorite.service';

export const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [toastMessage, setToastMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadFavorites = useCallback(async () => {
    try {
      const data = await getFavorites();
      setFavorites(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to load favorites:', err);
      setError(err.message || 'Failed to load favorite properties');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    getFavorites()
      .then((data) => {
        if (!ignore) {
          setFavorites(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error('Failed to load favorites:', err);
          setError(err.message || 'Failed to load favorite properties');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveFavorite = async (propertyId, title) => {
    const previous = [...favorites];
    // Optimistic UI removal
    setFavorites((prev) => prev.filter((item) => String(item.id) !== String(propertyId)));
    showToast(`Removed "${title || 'Property'}" from favorites`);

    try {
      await removeFavorite(propertyId);
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      // Revert if failed
      setFavorites(previous);
      showToast('Failed to remove favorite. Please try again.');
    }
  };

  const handleShare = (prop) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + `/buyer/properties`);
      showToast(`Link to "${prop.title}" copied to clipboard!`);
    } else {
      showToast('Property link ready to share');
    }
  };

  // Filter & Sort Logic
  const filteredAndSortedFavorites = useMemo(() => {
    let result = [...favorites];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          (p.title && p.title.toLowerCase().includes(q)) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((p) => (p.status || 'Active').toLowerCase() === statusFilter.toLowerCase());
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const pA = Number(String(a.price).replace(/[^0-9.-]+/g, '')) || 0;
        const pB = Number(String(b.price).replace(/[^0-9.-]+/g, '')) || 0;
        return pA - pB;
      });
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => {
        const pA = Number(String(a.price).replace(/[^0-9.-]+/g, '')) || 0;
        const pB = Number(String(b.price).replace(/[^0-9.-]+/g, '')) || 0;
        return pB - pA;
      });
    } else {
      // Date added default
      result.sort((a, b) => new Date(b.favoritedAt || 0) - new Date(a.favoritedAt || 0));
    }

    return result;
  }, [favorites, searchQuery, statusFilter, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredAndSortedFavorites.length / itemsPerPage) || 1;
  const paginatedFavorites = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedFavorites.slice(start, start + itemsPerPage);
  }, [filteredAndSortedFavorites, currentPage]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          My Favorites{' '}
          <span className="text-slate-400 font-normal text-lg">
            ({filteredAndSortedFavorites.length} {filteredAndSortedFavorites.length === 1 ? 'result' : 'results'})
          </span>
        </h1>
      </div>

      {/* Control Bar: Search, Status Filter & Sort */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search saved properties by title, location..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-none transition"
          />
        </div>

        {/* Filter by Status */}
        <div className="flex items-center space-x-2">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="date">Date added (Newest)</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-700 text-xs font-medium">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <button
            onClick={loadFavorites}
            className="underline font-bold hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs animate-pulse p-4 space-y-3"
            >
              <div className="h-44 bg-slate-200 rounded-xl w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-4 bg-slate-100 rounded w-full pt-2"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State: No Saved Properties */}
      {!loading && !error && filteredAndSortedFavorites.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <Heart size={32} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No favorite properties found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {searchQuery || statusFilter !== 'all'
              ? 'No saved properties match your current search and filter criteria.'
              : "You haven't added any properties to your favorites yet. Browse through our listings to find your dream home."}
          </p>
          <button
            onClick={() => navigate('/buyer/properties')}
            className="mt-5 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Building size={16} />
            <span>Browse Properties</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Favorites Cards Grid */}
      {!loading && !error && paginatedFavorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFavorites.map((prop) => {
            const status = prop.status || 'Active';
            const statusColor =
              status.toLowerCase() === 'sold'
                ? 'bg-amber-600 text-white'
                : status.toLowerCase() === 'pending'
                ? 'bg-sky-600 text-white'
                : 'bg-emerald-600 text-white';

            return (
              <div
                key={prop.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Heart Badge */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={
                        prop.imageUrl ||
                        prop.img ||
                        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400'
                      }
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${statusColor}`}
                    >
                      {status}
                    </span>
                    <button
                      onClick={() => handleRemoveFavorite(prop.id, prop.title)}
                      className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow-md transition hover:scale-110 cursor-pointer"
                      title="Remove from favorites"
                      aria-label="Remove favorite"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>

                  {/* Information */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{prop.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {prop.location || `${prop.city || 'Addis Ababa'}, Ethiopia`}
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 font-medium">
                      <span>{prop.bedrooms || prop.beds || 3} Beds</span>
                      <span>•</span>
                      <span>{prop.bathrooms || prop.baths || 2} Baths</span>
                      <span>•</span>
                      <span>{prop.area || prop.sqft || '200m²'}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100/60">
                  <span className="text-base font-extrabold text-slate-900">
                    {typeof prop.price === 'number'
                      ? `$${prop.price.toLocaleString()}`
                      : prop.price || '$150,000'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRemoveFavorite(prop.id, prop.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Remove Favorite"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleShare(prop)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Share Property"
                      aria-label="Share"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => navigate('/buyer/properties')}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
