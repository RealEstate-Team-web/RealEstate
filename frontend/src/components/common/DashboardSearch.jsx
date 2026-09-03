import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Home, Building2, ArrowRight } from 'lucide-react';
import { searchEntities } from '../../services/admin.service';

const DEBOUNCE_MS = 300;

const ROUTE_MAP = {
  admin: {
    users: '/admin/users',
    agents: '/admin/agents',
    properties: '/admin/properties',
  },
};

const LABEL_MAP = {
  admin: { users: 'Users', agents: 'Agents', properties: 'Properties' },
};

const DashboardSearch = ({ role = 'admin' }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  const routes = ROUTE_MAP[role] || ROUTE_MAP.admin;
  const labels = LABEL_MAP[role] || LABEL_MAP.admin;

  const fetchResults = useCallback(async (term) => {
    const requestId = ++requestIdRef.current;
    if (!term.trim()) {
      if (requestId === requestIdRef.current) {
        setResults(null);
        setError(null);
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchEntities(term);
      if (requestId !== requestIdRef.current) return;
      setResults(data);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setResults(null);
      setError('Search failed. Please try again.');
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setOpen(true);
    setError(null);
    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(value), DEBOUNCE_MS);
  };

  const handleClear = () => {
    requestIdRef.current += 1;
    setQuery('');
    setResults(null);
    setError(null);
    setOpen(false);
    setLoading(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  const handleSelect = (path, term, itemId) => {
    setOpen(false);
    navigate(`${path}?q=${encodeURIComponent(term)}&highlight=${itemId}`);
  };

  const handleViewAll = (path, term) => {
    setOpen(false);
    navigate(`${path}?q=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const totalResults = results
    ? (results.users?.length || 0) + (results.agents?.length || 0) + (results.properties?.length || 0)
    : 0;

  const hasResults = results && totalResults > 0;
  const showDropdown = open && (loading || hasResults || error || (query.trim() && !loading));

  const sections = [
    { key: 'users', icon: Users, color: 'text-[#4A9FF5]', bg: 'bg-[#E7F0FB]' },
    { key: 'agents', icon: Building2, color: 'text-[#1D6FD3]', bg: 'bg-blue-50' },
    { key: 'properties', icon: Home, color: 'text-[#4FAF83]', bg: 'bg-emerald-50' },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Search users, agents, properties..."
          aria-label="Search dashboard"
          className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-9 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#4A9FF5] focus:ring-1 focus:ring-[#4A9FF5]/30 transition font-medium"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-6 text-xs text-slate-400">
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-slate-300 border-t-transparent rounded-full" />
              Searching...
            </div>
          )}

          {!loading && error && query.trim() && (
            <div className="py-6 text-center text-xs text-rose-600">
              {error}
            </div>
          )}

          {!loading && !hasResults && !error && query.trim() && (
            <div className="py-6 text-center text-xs text-slate-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && hasResults && sections.map(({ key, icon: Icon, color, bg }) => {
            const items = results[key] || [];
            if (items.length === 0) return null;
            return (
              <div key={key} className="border-b border-slate-100 last:border-b-0">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-50/80">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-md ${bg} ${color} flex items-center justify-center`}>
                      <Icon size={12} />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                      {labels[key] || key}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{items.length}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(routes[key], query, item.id)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition flex items-center gap-3 cursor-pointer"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.email || item.agency_name || item.city || '—'}
                        </p>
                      </div>
                      <ArrowRight size={12} className="text-slate-300 shrink-0" />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleViewAll(routes[key], query)}
                  className="w-full px-4 py-2 text-[11px] font-semibold text-[#4A9FF5] hover:bg-blue-50 transition text-center cursor-pointer"
                >
                  View all {labels[key]?.toLowerCase()} results →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardSearch;
