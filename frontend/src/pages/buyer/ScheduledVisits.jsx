import React, { useState } from 'react';
import { Search, Filter, Calendar, XCircle, Clock } from 'lucide-react';

export const ScheduledVisits = () => {
  const [visits, setVisits] = useState([
    {
      id: 1,
      title: 'Luxury Villa, Villa, Addis Ababa',
      specs: 'Daniel Tesfaye • 330m²',
      status: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Kebede',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 2,
      title: 'Luxury Villa, Yeka, Addis Ababa',
      specs: 'Daniel Tesfaye • 280m²',
      status: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Kebede',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 3,
      title: 'Modern Apartment, Addis Ababa',
      specs: 'Daniel Tesfaye • 188m²',
      status: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Kalleh',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 4,
      title: 'Modern Apartment, Addis Ababa',
      specs: 'Daniel Tesfaye • 200m²',
      status: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Home',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 5,
      title: 'Modern Villa, Yeka, Addis Ababa',
      specs: 'Daniel Tesfaye • 310m²',
      status: 'Pending',
      statusColor: 'bg-amber-100 text-amber-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Kebede',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 6,
      title: 'Family House, Yeka, Addis Ababa',
      specs: 'Daniel Tesfaye • 180m²',
      status: 'Confirmed',
      statusColor: 'bg-emerald-100 text-emerald-800 font-bold',
      dateTime: 'Mon, Oct 23, 2023 | 10:00 AM - 10:30 AM',
      agentName: 'Abebe Kebede',
      agentRole: 'Lead Agent',
      agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400',
    },
  ]);

  const handleCancelVisit = (id) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Cancelled', statusColor: 'bg-rose-100 text-rose-800 font-bold' } : v))
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Scheduled Visits <span className="text-slate-400 font-normal">({visits.length} upcoming)</span>
        </h1>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search visits..."
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
            <option>Date: Soonest</option>
            <option>Date: Latest</option>
          </select>
        </div>
      </div>

      {/* Visits List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
        {visits.map((visit) => (
          <div key={visit.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition">
            {/* Property Info */}
            <div className="flex items-center space-x-4 min-w-0">
              <img src={visit.img} alt={visit.title} className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-xs" />
              <div className="min-w-0">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider mb-1 ${visit.statusColor}`}>
                  {visit.status}
                </span>
                <h3 className="font-bold text-slate-900 text-sm truncate">{visit.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{visit.specs}</p>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/70">
              <Clock size={15} className="text-blue-700" />
              <span>{visit.dateTime}</span>
            </div>

            {/* Agent Info */}
            <div className="flex items-center space-x-3">
              <img src={visit.agentAvatar} alt={visit.agentName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
              <div>
                <p className="text-xs font-bold text-slate-900">{visit.agentName}</p>
                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                  {visit.agentRole}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              {visit.status !== 'Cancelled' && (
                <button
                  onClick={() => handleCancelVisit(visit.id)}
                  className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer"
                >
                  <XCircle size={15} />
                  <span>Cancel Visit</span>
                </button>
              )}
              <button className="flex items-center space-x-1 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 transition cursor-pointer">
                <Calendar size={15} />
                <span>Reschedule Visit</span>
              </button>
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

export default ScheduledVisits;
