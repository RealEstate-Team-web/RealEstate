import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Eye,
  Users,
  Pencil,
  Copy,
  Trash2,
  AlertTriangle,
  Loader2,
  Building2,
  Plus,
  X,
  Check,
  Landmark,
} from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import {
  getMyProperties,
  deleteProperty,
  duplicateProperty,
} from '../../services/property.service';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'available', label: 'Available' },
  { key: 'sold', label: 'Sold' },
  { key: 'rented', label: 'Rented' },
];

const statusStyles = {
  draft: 'bg-slate-100 text-slate-600 border-slate-200',
  available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sold: 'bg-sky-50 text-sky-700 border-sky-200',
  rented: 'bg-amber-50 text-amber-700 border-amber-200',
};

const formatPrice = (price) =>
  price != null ? `Br ${Number(price).toLocaleString()}` : '—';

const Properties = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toastMessage, toastTone, showToast } = useToast();

  const activeStatus = searchParams.get('status') || 'all';
  const q = searchParams.get('search') || '';
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);

  const [localSearch, setLocalSearch] = useState(q);
  const [prevQ, setPrevQ] = useState(q);
  const [data, setData] = useState({ properties: [], pagination: { total: 0, totalPages: 1 } });
  const [loadedKey, setLoadedKey] = useState('');
  const [loadError, setLoadError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  if (prevQ !== q) {
    setPrevQ(q);
    setLocalSearch(q);
  }

  const fetchKey = `${activeStatus}|${q}|${page}`;
  const loading = fetchKey !== loadedKey;

  const updateQuery = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === '' || value === undefined || value === null) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const buildParams = useCallback(() => {
    const params = { limit: 8, page };
    if (activeStatus !== 'all') params.status = activeStatus;
    if (q) params.q = q;
    return params;
  }, [activeStatus, q, page]);

  const loadPage = useCallback(
    async (params, { isCancelled } = {}) => {
      try {
        const result = await getMyProperties(params);
        if (isCancelled?.()) return;
        setData(result);
        setLoadError('');
      } catch {
        if (isCancelled?.()) return;
        setLoadError('Failed to load your properties. Please try again.');
      } finally {
        setLoadedKey(fetchKey);
      }
    },
    [fetchKey],
  );

  useEffect(() => {
    let cancelled = false;

    const runLoad = async () => {
      await loadPage(buildParams(), { isCancelled: () => cancelled });
    };
    runLoad();

    return () => {
      cancelled = true;
    };
  }, [loadPage, buildParams]);

  const refresh = useCallback(
    async () => loadPage(buildParams()),
    [loadPage, buildParams],
  );

  const selectStatus = (status) => {
    updateQuery({ status, page: 1 });
  };

  const applySearch = (e) => {
    e.preventDefault();
    updateQuery({ search: localSearch.trim() || '', page: 1 });
  };

  const handleEdit = (id) => navigate(`/agent/properties/edit/${id}`);

  const handleDuplicate = async (property) => {
    setBusyId(property.id);
    try {
      await duplicateProperty(property.id);
      showToast(`"${property.title}" duplicated as a draft`);
      setConfirmDeleteId(null);
      await refresh();
    } catch (err) {
      showToast(err?.message || 'Failed to duplicate property.', { tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (property) => {
    if (confirmDeleteId !== property.id) {
      setConfirmDeleteId(property.id);
      return;
    }

    setBusyId(property.id);
    try {
      await deleteProperty(property.id);
      showToast('Property deleted successfully.');
      setConfirmDeleteId(null);
      await refresh();
    } catch (err) {
      showToast(err?.message || 'Failed to delete property.', { tone: 'error' });
    } finally {
      setBusyId(null);
    }
  };

  const properties = Array.isArray(data?.properties) ? data.properties : [];
  const pagination = data?.pagination ?? { total: 0, totalPages: 1 };

  return (
    <div className="space-y-5 font-sans">
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium ${
            toastTone === 'error' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
          }`}
          role={toastTone === 'error' ? 'alert' : 'status'}
        >
          {toastTone === 'error' ? (
            <AlertTriangle size={16} className="shrink-0" />
          ) : (
            <Check size={16} className="text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <form onSubmit={applySearch} className="flex-1 flex items-center max-w-md">
          <div className="flex items-center flex-1 bg-white border border-slate-200 focus-within:border-[#4A9FF5] rounded-lg px-3 h-10 transition">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by title, city or address..."
              aria-label="Search properties"
              className="w-full ml-2 bg-transparent text-[13px] outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => updateQuery({ search: '', page: 1 })}
                aria-label="Clear search"
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="ml-2 h-10 px-4 rounded-lg bg-[#4A9FF5] text-white text-[13px] font-semibold hover:bg-[#3d8be0] transition cursor-pointer"
          >
            Search
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/agent/properties/new')}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#142238] text-white text-[13px] font-semibold hover:bg-[#1d3357] transition cursor-pointer"
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const active = activeStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => selectStatus(tab.key)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition cursor-pointer ${
                active
                  ? 'bg-[#4A9FF5] text-white shadow-[0_3px_10px_rgba(74,159,245,0.3)]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 flex items-center space-x-4 animate-pulse">
              <div className="w-20 h-16 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                <div className="h-3 w-1/4 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && loadError && (
        <div
          role="alert"
          className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 flex items-center space-x-2"
        >
          <AlertTriangle size={15} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && !loadError && properties.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 px-6 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Building2 size={26} className="text-slate-400" />
          </div>
          <h3 className="text-[15px] font-bold text-[#101820]">
            {q || activeStatus !== 'all' ? 'No matching properties' : 'No properties yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {q || activeStatus !== 'all'
              ? 'Try a different search or status filter.'
              : 'Add your first listing to start receiving buyer inquiries.'}
          </p>
          {!q && activeStatus === 'all' && (
            <button
              type="button"
              onClick={() => navigate('/agent/properties/new')}
              className="mt-4 inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#4A9FF5] text-white text-[13px] font-semibold hover:bg-[#3d8be0] transition cursor-pointer"
            >
              <Plus size={16} />
              Add Property
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {!loading && !loadError && properties.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] min-w-[760px]">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-semibold">Property</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-center">Views</th>
                  <th className="px-4 py-3 font-semibold text-center">Leads</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {property.cover_image ? (
                            <img
                              src={property.cover_image}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 size={18} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => handleEdit(property.id)}
                            className="font-semibold text-slate-800 hover:text-[#4A9FF5] text-left leading-snug cursor-pointer line-clamp-1"
                          >
                            {property.title}
                          </button>
                          <p className="text-[11px] text-slate-400 mt-0.5 capitalize">
                            {property.listingType === 'sale' ? 'For Sale' : 'For Rent'}
                            {property.bedrooms ? ` · ${property.bedrooms} bd` : ''}
                            {property.bathrooms ? ` · ${property.bathrooms} ba` : ''}
                            {property.area ? ` · ${property.area} m²` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {[property.city, property.country].filter(Boolean).join(', ') || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize border ${statusStyles[property.status] || statusStyles.draft}`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center space-x-1 text-slate-600">
                        <Eye size={13} className="text-slate-400" />
                        <span>{property.views}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center space-x-1 text-slate-600">
                        <Users size={13} className="text-slate-400" />
                        <span>{property.leads}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(property.id)}
                          title="Edit"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#4A9FF5] hover:bg-[#4A9FF5]/10 transition cursor-pointer"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(property)}
                          disabled={busyId === property.id}
                          title="Duplicate as draft"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition cursor-pointer disabled:opacity-50"
                        >
                          {busyId === property.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(property)}
                          disabled={busyId === property.id}
                          title={confirmDeleteId === property.id ? 'Click again to confirm delete' : 'Delete'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer disabled:opacity-50 ${
                            confirmDeleteId === property.id
                              ? 'bg-[#D96B67] text-white'
                              : 'text-slate-400 hover:text-[#D96B67] hover:bg-rose-50'
                          }`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2-step delete confirm hint */}
      {confirmDeleteId && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertTriangle size={15} className="shrink-0" />
          <span className="flex-1">
            Press the red trash icon again to permanently delete this listing. This cannot be undone.
          </span>
          <button
            type="button"
            onClick={() => setConfirmDeleteId(null)}
            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-white text-rose-700 font-semibold hover:bg-rose-100 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !loadError && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-slate-500">
            Page {page} of {pagination.totalPages} ·{' '}
            {pagination.total} {pagination.total === 1 ? 'property' : 'properties'}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => updateQuery({ page: page - 1 })}
              className="px-3.5 h-9 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= pagination.totalPages}
              onClick={() => updateQuery({ page: page + 1 })}
              className="px-3.5 h-9 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-600 hover:border-slate-300 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Tips footer */}
      {!loading && !loadError && properties.length > 0 && (
        <div className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800">
          <Landmark size={15} className="shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Submission Note:</span> Listings are published immediately —
            no administrator approval is required. Use <span className="font-medium">Save as Draft</span>{' '}
            to keep a listing private, then press <span className="font-medium">Publish</span> when ready.
          </p>
        </div>
      )}
    </div>
  );
};

export default Properties;