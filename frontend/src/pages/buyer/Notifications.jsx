import { useState } from 'react';
import {
  CheckCircle,
  Star,
  MessageSquare,
  TrendingDown,
  XCircle,
  CheckCheck,
  Filter
} from 'lucide-react';

export const Notifications = () => {
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      unread: true,
      type: 'visit_approved',
      title: 'Visit Approved',
      description: 'Your visit request for Luxury Villa in Bole has been approved by the seller.',
      time: 'Mon, 10:30 AM',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 2,
      unread: true,
      type: 'new_match',
      title: 'New Property Match',
      description: 'New match found: Modern Apartment in Kazanchis, $120,000.',
      time: 'Mon, 9:15 AM',
      icon: Star,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 3,
      unread: false,
      type: 'agent_reply',
      title: 'Agent Reply',
      description: 'Abebe Kebede replied to your message about the Family House.',
      time: 'Sun, 4:50 PM',
      icon: MessageSquare,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      id: 4,
      unread: false,
      type: 'price_drop',
      title: 'Price Drop',
      description: 'Price drop alert! The Luxury Villa in Yeka is now $330,000.',
      time: 'Sun, 2:10 PM',
      icon: TrendingDown,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 5,
      unread: false,
      type: 'visit_cancelled',
      title: 'Visit Cancelled',
      description: 'The seller cancelled the visit for the Modern Apartment in Kazanchis.',
      time: 'Sat, 11:05 AM',
      icon: XCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 6,
      unread: false,
      type: 'new_match',
      title: 'New Property Match',
      description: 'New match found: Family House in CMC, $210,000.',
      time: 'Sat, 9:00 AM',
      icon: Star,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 7,
      unread: false,
      type: 'visit_approved',
      title: 'Visit Approved',
      description: 'Your visit request for Family House in Yeka has been approved.',
      time: 'Fri, 3:20 PM',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'unread') return n.unread;
    if (filterType === 'visits') return n.type.includes('visit');
    if (filterType === 'price') return n.type === 'price_drop';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Notifications <span className="text-slate-400 font-normal">({notifications.filter(n => n.unread).length} unread)</span>
        </h1>
      </div>

      {/* Action Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium">Filter</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="all">Show all</option>
            <option value="unread">Unread only</option>
            <option value="visits">Visit Alerts</option>
            <option value="price">Price Drops</option>
          </select>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
        >
          <CheckCheck size={16} />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications List Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition ${
              notif.unread ? 'bg-blue-50/20' : ''
            }`}
          >
            <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
              {/* Unread Status Dot */}
              <div className="w-3 shrink-0 pt-1 sm:pt-0 flex justify-center">
                {notif.unread ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-2xs" title="Unread"></span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium sm:hidden">(Read)</span>
                )}
              </div>

              {/* Event Icon */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${notif.color}`}>
                <notif.icon size={18} />
              </div>

              {/* Message Details */}
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-normal">{notif.description}</p>
              </div>
            </div>

            {/* Time */}
            <span className="text-[11px] font-semibold text-slate-400 shrink-0 self-end sm:self-center pl-6 sm:pl-0">
              {notif.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
