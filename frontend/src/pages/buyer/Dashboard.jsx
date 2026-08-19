import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Home,
  Calendar,
  Search,
  Sparkles,
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  Clock
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Abebe';

  const stats = [
    {
      title: 'Total Saved Properties',
      value: '12',
      change: '12% from last month',
      icon: Home,
      iconBg: 'bg-blue-50 text-blue-600',
      changeColor: 'text-emerald-600',
    },
    {
      title: 'Upcoming Visits',
      value: '3',
      change: 'this month',
      icon: Calendar,
      iconBg: 'bg-indigo-50 text-indigo-600',
      changeColor: 'text-slate-400',
    },
    {
      title: 'Recent Searches',
      value: '5',
      change: 'this month',
      icon: Search,
      iconBg: 'bg-slate-100 text-slate-600',
      changeColor: 'text-slate-400',
    },
    {
      title: 'New Recommendations',
      value: '4',
      change: '25% from last month',
      icon: Sparkles,
      iconBg: 'bg-emerald-50 text-emerald-600',
      changeColor: 'text-emerald-600',
    },
  ];

  const recentMessages = [
    {
      id: 1,
      name: 'Sara Tamrat',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      snippet: 'Interested in Luxury Villa in Bole',
      time: '10:30 AM',
      unread: true,
    },
    {
      id: 2,
      name: 'Daniel Tesfaye',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      snippet: 'Question about the apartment',
      time: 'Yesterday',
      unread: true,
    },
    {
      id: 3,
      name: 'Liya Bekele',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      snippet: 'Schedule a visit request',
      time: 'May 24',
      unread: false,
    },
    {
      id: 4,
      name: 'Mekdes Alemu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      snippet: 'Thanks for the information',
      time: 'May 25',
      unread: false,
    },
  ];

  const recentlyViewed = [
    {
      id: 101,
      title: 'Luxury Villa',
      specs: '4 Bed - 3 Bath - 330m²',
      type: 'Villa',
      location: 'Bole, Addis Ababa',
      price: '$350,000',
      status: 'Active',
      statusColor: 'bg-emerald-50 text-emerald-700 font-semibold',
      views: 245,
      img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 102,
      title: 'Modern Apartment',
      specs: '2 Bed - 2 Bath - 188m²',
      type: 'Apartment',
      location: 'Kazanchis, Addis Ababa',
      price: '$130,000',
      status: 'Pending',
      statusColor: 'bg-amber-50 text-amber-700 font-semibold',
      views: 128,
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 103,
      title: 'Family House',
      specs: '3 Bed - 7 Bath - 180m²',
      type: 'House',
      location: 'Yeka, Addis Ababa',
      price: '$200,000',
      status: 'Sold',
      statusColor: 'bg-slate-100 text-slate-600 font-semibold',
      views: 312,
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200',
    },
  ];

  const upcomingVisits = [
    {
      id: 201,
      day: '27',
      month: 'MAY',
      title: 'Luxury Villa in Bole',
      agent: 'Sara Tamrat',
      time: '13:00 AM',
      status: 'Confirmed',
    },
    {
      id: 202,
      day: '28',
      month: 'MAY',
      title: 'Modern Apartment',
      agent: 'Daniel Tesfaye',
      time: '11:00 PM',
      status: 'Confirmed',
    },
    {
      id: 203,
      day: '30',
      month: 'MAY',
      title: 'Family House in Yeka',
      agent: 'Liya Bekele',
      time: '11:00 AM',
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome Greeting Banner */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-xs text-slate-500 mt-1">Here's what's happening with your properties today.</p>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{stat.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className={`mt-3 text-[11px] font-medium flex items-center gap-1 ${stat.changeColor}`}>
              <TrendingUp size={13} />
              <span>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Section: Property Views Chart & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Property Views Over Time Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Property Views Over Time</h2>
            <select className="bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded-lg px-2.5 py-1 focus:outline-none hover:bg-slate-50">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          <div className="relative w-full h-56 flex">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between text-[10px] text-slate-400 font-medium pr-3 py-1 select-none">
              <span>1,500</span>
              <span>1,200</span>
              <span>900</span>
              <span>680</span>
              <span>300</span>
              <span>0</span>
            </div>

            {/* SVG Chart Line Area */}
            <div className="flex-1 relative flex flex-col justify-between">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
                <div className="border-b border-slate-100 w-full"></div>
              </div>

              {/* SVG Curve Path & Nodes */}
              <svg className="w-full h-full overflow-visible relative z-10" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="refGraphFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 110 C 50 110, 50 70, 83 70 C 120 70, 130 90, 166 90 C 210 90, 220 50, 250 50 C 290 50, 300 70, 333 70 C 370 70, 380 40, 416 40 C 460 40, 470 20, 500 20 L 500 150 L 0 150 Z"
                  fill="url(#refGraphFill)"
                />
                <path
                  d="M 0 110 C 50 110, 50 70, 83 70 C 120 70, 130 90, 166 90 C 210 90, 220 50, 250 50 C 290 50, 300 70, 333 70 C 370 70, 380 40, 416 40 C 460 40, 470 20, 500 20"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {[[0, 110], [83, 70], [166, 90], [250, 50], [333, 70], [416, 40], [500, 20]].map(([cx, cy], idx) => (
                  <circle key={idx} cx={cx} cy={cy} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between text-[11px] text-slate-400 font-medium pt-2">
                <span>May 20</span>
                <span>May 21</span>
                <span>May 22</span>
                <span>May 23</span>
                <span>May 24</span>
                <span>May 25</span>
                <span>May 26</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Messages Widget */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Recent Messages</h2>
            <button
              onClick={() => navigate('/buyer/messages')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => navigate('/buyer/messages')}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-lg px-1.5 transition cursor-pointer"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={msg.avatar} alt={msg.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{msg.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{msg.snippet}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[10px] font-medium text-slate-400">{msg.time}</p>
                  {msg.unread && <span className="inline-block w-2 h-2 rounded-full bg-blue-600 mt-1"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Viewed Properties Table & Upcoming Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recently Viewed Properties Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Recently Viewed Properties</h2>
            <button
              onClick={() => navigate('/buyer/properties')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Property</th>
                  <th className="py-2.5 px-2">Type</th>
                  <th className="py-2.5 px-2">Location</th>
                  <th className="py-2.5 px-2">Price</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2">Views</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentlyViewed.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-3">
                        <img src={prop.img} alt={prop.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{prop.title}</p>
                          <p className="text-[10px] text-slate-400">{prop.specs}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-medium">{prop.type}</td>
                    <td className="py-3 px-2 text-slate-500">{prop.location}</td>
                    <td className="py-3 px-2 font-bold text-slate-900">{prop.price}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${prop.statusColor}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{prop.views}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end space-x-1 text-slate-400">
                        <button
                          onClick={() => navigate('/buyer/properties')}
                          className="p-1 hover:text-blue-600 transition cursor-pointer"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        <button className="p-1 hover:text-slate-700 transition cursor-pointer" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1 hover:text-rose-600 transition cursor-pointer" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Upcoming Visits Schedule List */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Upcoming Visits</h2>
              <button
                onClick={() => navigate('/buyer/visits')}
                className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between hover:bg-slate-100/70 transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-slate-200/70 text-slate-700 rounded-lg flex flex-col items-center justify-center shrink-0">
                      <span className="text-[9px] font-bold uppercase leading-none text-slate-500">{visit.month}</span>
                      <span className="text-sm font-bold leading-tight mt-0.5">{visit.day}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{visit.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{visit.agent}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {visit.time}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      visit.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
