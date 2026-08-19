import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Map,
  Grid,
  Layers,
  Heart,
  Plus,
  Bed,
  Bath,
  Maximize,
  MapPin
} from 'lucide-react';

export const BrowseProperties = () => {
  const [viewMode, setViewMode] = useState('split'); // 'split' or 'grid'

  const demoProperties = [
    {
      id: 1,
      title: 'Luxury Villa',
      location: 'Bole, Addis Ababa',
      type: 'Villa',
      status: 'Sold',
      price: '$350,000',
      beds: 4,
      baths: 3,
      sqft: '330m²',
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
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      title: 'Family House',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Sold',
      price: '$120,000',
      beds: 3,
      baths: 7,
      sqft: '180m²',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      title: 'Modern Apartment',
      location: 'Bole, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      price: '$120,000',
      beds: 5,
      baths: 3,
      sqft: '250m²',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5,
      title: 'Family House',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Active',
      price: '$120,000',
      beds: 5,
      baths: 4,
      sqft: '210m²',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Liya Bekele Residence',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Active',
      price: '$120,000',
      beds: 8,
      baths: 5,
      sqft: '400m²',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Browse Properties <span className="text-slate-400 font-normal">(143 results)</span>
        </h1>
      </div>

      {/* Control Bar: Search, Filters, Sort, View Toggles */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search locations, keywords..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-none transition"
          />
        </div>

        {/* Filter Button */}
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer">
          <Filter size={15} />
          <span>Filters</span>
          <span className="bg-blue-800 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">3</span>
        </button>

        {/* Sort Picker */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by</span>
          <select className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500">
            <option>Date: Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {/* View Mode Toggle & Compare Tool */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
            <button
              onClick={() => setViewMode('split')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'split' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Split Map View"
            >
              <Map size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
          </div>

          <button className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer">
            <Layers size={15} />
            <span>Compare (2)</span>
          </button>
        </div>
      </div>

      {/* Content Layout: Split Map / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map Placeholder (Left 5 Cols when split) */}
        {viewMode === 'split' && (
          <div className="lg:col-span-5 bg-slate-200 border border-slate-300/80 rounded-2xl overflow-hidden min-h-[420px] relative shadow-inner flex flex-col justify-between p-4">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

            {/* Map Controls Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-1.5">
                <MapPin size={13} className="text-blue-600" /> Addis Ababa Map View
              </span>
              <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                Price Clusters
              </span>
            </div>

            {/* Map Pin Cluster Mock Visuals */}
            <div className="relative z-10 my-auto py-12 flex flex-wrap items-center justify-center gap-6">
              <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
                $350k
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
                $120k
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
                $200k
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
                Bole
              </div>
              <div className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border-2 border-white">
                Kazanchis
              </div>
            </div>

            {/* Map Footer Mini Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-md flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=150"
                alt="Modern Apartment"
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Modern Apartment</h4>
                <p className="text-[10px] text-slate-500">2 Bed • 2 Bath • 188m²</p>
                <p className="text-xs font-extrabold text-blue-600 mt-0.5">$130,000</p>
              </div>
            </div>
          </div>
        )}

        {/* Property Cards Catalog Grid (Right 7 Cols when split, 12 Cols when grid) */}
        <div className={viewMode === 'split' ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {demoProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Property Image & Status Badge */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={prop.img}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        prop.status === 'Active'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {prop.status}
                    </span>
                    <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500 rounded-full backdrop-blur-xs transition cursor-pointer">
                      <Heart size={16} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm">{prop.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prop.location}</p>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 font-medium">
                      <span>{prop.beds} Beds</span>
                      <span>•</span>
                      <span>{prop.baths} Baths</span>
                      <span>•</span>
                      <span>{prop.sqft}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100/60">
                  <span className="text-base font-extrabold text-slate-900">{prop.price}</span>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-xs font-semibold text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
              2
            </button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseProperties;
