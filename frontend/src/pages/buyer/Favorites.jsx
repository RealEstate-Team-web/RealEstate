import { Search, Filter, Heart, Trash2, Share2 } from 'lucide-react';

export const Favorites = () => {
  const favoriteProperties = [
    {
      id: 1,
      title: 'Luxury Villa',
      location: 'Bole, Addis Ababa',
      type: 'Villa',
      status: 'Sold',
      statusColor: 'bg-amber-600 text-white',
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
      statusColor: 'bg-emerald-600 text-white',
      price: '$120,000',
      beds: 2,
      baths: 2,
      sqft: '188m²',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      title: 'Luxury Villa',
      location: 'Bole, Addis Ababa',
      type: 'Villa',
      status: 'Sold',
      statusColor: 'bg-amber-600 text-white',
      price: '$350,000',
      beds: 4,
      baths: 3,
      sqft: '330m²',
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 4,
      title: 'Modern Apartment',
      location: 'Bole, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      statusColor: 'bg-emerald-600 text-white',
      price: '$120,000',
      beds: 2,
      baths: 2,
      sqft: '188m²',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5,
      title: 'Family House',
      location: 'Yeka, Addis Ababa',
      type: 'House',
      status: 'Sold',
      statusColor: 'bg-amber-600 text-white',
      price: '$120,000',
      beds: 3,
      baths: 7,
      sqft: '180m²',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Modern Apartment',
      location: 'Kazanchis, Addis Ababa',
      type: 'Apartment',
      status: 'Active',
      statusColor: 'bg-emerald-600 text-white',
      price: '$120,000',
      beds: 3,
      baths: 2,
      sqft: '190m²',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Favorites <span className="text-slate-400 font-normal">(12 results)</span>
        </h1>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search saved properties..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-700 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-none transition"
          />
        </div>

        <button className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-700/20 transition cursor-pointer">
          <Filter size={15} />
          <span>Filter by status</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Sort by</span>
          <select className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-700">
            <option>Date added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Favorites Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProperties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Heart Badge */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={prop.img}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${prop.statusColor}`}>
                  {prop.status}
                </span>
                <button
                  className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-full shadow-md transition hover:scale-110 cursor-pointer"
                  title="Remove from favorites"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Information */}
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm">{prop.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{prop.location}</p>

                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 font-medium">
                  <span>{prop.beds} Bed</span>
                  <span>•</span>
                  <span>{prop.baths} Baths</span>
                  <span>•</span>
                  <span>{prop.sqft}</span>
                </div>
              </div>
            </div>

            {/* Price & Action Buttons */}
            <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100/60">
              <span className="text-base font-extrabold text-slate-900">{prop.price}</span>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove Favorite"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                  title="Share Property"
                >
                  <Share2 size={16} />
                </button>
                <button className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <button className="px-3.5 py-1.5 bg-blue-700 text-xs font-bold text-white rounded-lg shadow-xs">1</button>
        <button className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">
          2
        </button>
      </div>
    </div>
  );
};

export default Favorites;
