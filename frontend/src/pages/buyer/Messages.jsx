import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Send,
  ArrowLeft,
  MessageSquare,
  Building,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { getInquiries, getInquiryById, replyToInquiry } from '../../services/inquiry.service';
import BookVisitModal from '../../components/buyer/BookVisitModal';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

export const Messages = () => {
  const { user } = useAuth();
  const { toastMessage, showToast } = useToast();
  const messagesEndRef = useRef(null);

  const [inquiries, setInquiries] = useState([]);
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [activeLoading, setActiveLoading] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleModalTarget, setScheduleModalTarget] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInquiries = useCallback(async (isMountedRef = { current: true }) => {
    try {
      setLoading(true);
      setError('');
      const response = await getInquiries({ limit: 50 });
      if (!isMountedRef.current) return;

      const list = Array.isArray(response?.data) ? response.data : [];
      setInquiries(list);

      if (list.length > 0) {
        setActiveInquiryId((current) => {
          if (current && list.some((i) => i.id === current)) return current;
          return list[0].id;
        });
      } else {
        setActiveInquiryId(null);
        setActiveInquiry(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error('Failed to load inquiries:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load conversations');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const mountedRef = { current: true };
    loadInquiries(mountedRef);
    return () => {
      mountedRef.current = false;
    };
  }, [loadInquiries]);

  // Load detailed active inquiry with full thread messages whenever activeInquiryId changes
  useEffect(() => {
    let isCurrent = true;

    if (!activeInquiryId) {
      setActiveInquiry(null);
      return;
    }

    const loadActiveThread = async () => {
      try {
        setActiveLoading(true);
        const detailed = await getInquiryById(activeInquiryId);
        if (isCurrent) {
          setActiveInquiry(detailed);
        }
      } catch (err) {
        console.error('Failed to load inquiry thread:', err);
      } finally {
        if (isCurrent) {
          setActiveLoading(false);
        }
      }
    };

    loadActiveThread();

    return () => {
      isCurrent = false;
    };
  }, [activeInquiryId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeInquiry?.messages]);

  // Filtered threads list
  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    if (statusFilter !== 'all') {
      result = result.filter((i) => (i.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.propertyTitle?.toLowerCase().includes(q) ||
          i.propertyCity?.toLowerCase().includes(q) ||
          i.agentFirstName?.toLowerCase().includes(q) ||
          i.agentLastName?.toLowerCase().includes(q) ||
          i.agencyName?.toLowerCase().includes(q) ||
          i.latestMessage?.toLowerCase().includes(q) ||
          i.message?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [inquiries, statusFilter, searchQuery]);

  const handleSelectConversation = (id) => {
    setActiveInquiryId(id);
    setMobileView('chat');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeInquiryId || sending) return;

    setSending(true);
    try {
      const messageText = newMessage.trim();
      const updatedInquiry = await replyToInquiry(activeInquiryId, messageText);
      showToast('Message sent');
      setNewMessage('');

      // Update active thread with all messages directly
      if (updatedInquiry) {
        setActiveInquiry(updatedInquiry);
      }

      // Update sidebar snippet without reloading the entire list or switching active thread
      setInquiries((prevList) =>
        prevList.map((item) =>
          item.id === activeInquiryId
            ? {
                ...item,
                latestMessage: messageText,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      showToast(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return Number.isNaN(d.getTime())
        ? ''
        : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const formatFullDateTime = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return Number.isNaN(d.getTime())
        ? ''
        : d.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
    } catch {
      return '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'read':
        return {
          label: 'Read by Agent',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'responded':
        return {
          label: 'Responded',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'archived':
        return {
          label: 'Archived',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
      case 'pending':
      default:
        return {
          label: 'Sent (Pending Read)',
          className: 'bg-amber-100 text-amber-800 border-amber-200',
        };
    }
  };

  // Compile messages for active conversation
  const threadMessages = useMemo(() => {
    if (!activeInquiry) return [];
    if (Array.isArray(activeInquiry.messages) && activeInquiry.messages.length > 0) {
      return activeInquiry.messages;
    }
    // Fallback to initial message
    return [
      {
        id: 'initial',
        senderId: activeInquiry.buyerId,
        senderRole: 'buyer',
        message: activeInquiry.message,
        createdAt: activeInquiry.createdAt,
      },
    ];
  }, [activeInquiry]);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Messages & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct communication with listing agents regarding your inquiries
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadInquiries()}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-8 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading your conversations...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">Failed to Load Messages</h3>
            <p className="text-xs text-rose-600 mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => loadInquiries()}
            className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition cursor-pointer shadow-xs"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && inquiries.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No inquiries or messages yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Have a question about a property? Send an inquiry directly to the listing agent while browsing properties!
            </p>
          </div>
          <Link
            to="/buyer/properties"
            className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            Browse Properties
          </Link>
        </div>
      )}

      {/* Split-View Chat / Conversation Interface */}
      {!loading && !error && inquiries.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left: Conversations List */}
          <div
            className={`lg:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50 ${
              mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Status Filter Tabs & Search Header */}
            <div className="p-3.5 border-b border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'read', label: 'Read' },
                  { key: 'responded', label: 'Responded' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                      statusFilter === tab.key
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>

            {/* Conversations List Items */}
            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[500px]">
              {filteredInquiries.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No matching inquiries found.
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = inq.id === activeInquiryId;
                  const badge = getStatusBadge(inq.status);
                  const displayMessage = inq.latestMessage || inq.message;

                  return (
                    <div
                      key={inq.id}
                      onClick={() => handleSelectConversation(inq.id)}
                      className={`p-3.5 flex items-start space-x-3 cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50/90 border-l-4 border-blue-600'
                          : 'hover:bg-slate-100/60'
                      }`}
                    >
                      {/* Property or Agent Thumbnail */}
                      {inq.propertyImage ? (
                        <img
                          src={inq.propertyImage}
                          alt={inq.propertyTitle}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200/80"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Building size={18} />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {inq.propertyTitle}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                            {formatShortDate(inq.updatedAt || inq.createdAt)}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                          Agent: {inq.agentFirstName} {inq.agentLastName}
                        </p>

                        <p className="text-xs text-slate-500 truncate mt-1">
                          {displayMessage}
                        </p>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Chat / Inquiry Thread View */}
          <div
            className={`lg:col-span-8 flex flex-col justify-between bg-white ${
              mobileView === 'list' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {activeInquiry ? (
              <>
                {/* Active Thread Header */}
                <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView('list')}
                      className="p-1 text-slate-600 hover:text-slate-900 lg:hidden cursor-pointer shrink-0"
                      title="Back to inquiries list"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    {activeInquiry.agentAvatar ? (
                      <img
                        src={activeInquiry.agentAvatar}
                        alt={`${activeInquiry.agentFirstName} ${activeInquiry.agentLastName}`}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {activeInquiry.agentFirstName?.[0] || 'A'}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {activeInquiry.agentFirstName} {activeInquiry.agentLastName}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <span>{activeInquiry.agencyName || 'Listing Agent'}</span>
                        {activeInquiry.agentPhone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Phone size={10} /> {activeInquiry.agentPhone}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setScheduleModalTarget(activeInquiry)}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0"
                  >
                    <Calendar size={13} />
                    <span className="hidden sm:inline">Schedule Visit</span>
                    <span className="sm:hidden">Tour</span>
                  </button>
                </div>

                {/* Property Context Banner */}
                <div className="p-3 bg-blue-50/60 border-b border-blue-100 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    {activeInquiry.propertyImage && (
                      <img
                        src={activeInquiry.propertyImage}
                        alt={activeInquiry.propertyTitle}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-blue-200/70"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {activeInquiry.propertyTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        {activeInquiry.propertyAddress ? `${activeInquiry.propertyAddress}, ` : ''}
                        {activeInquiry.propertyCity}
                      </p>
                      {activeInquiry.propertyPrice && (
                        <p className="font-bold text-blue-600 text-xs mt-0.5">
                          ${Number(activeInquiry.propertyPrice).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/properties/${activeInquiry.propertyId}`}
                    className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-bold transition shrink-0"
                  >
                    View Listing
                  </Link>
                </div>

                {/* Message Thread History */}
                <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 max-h-[380px] bg-slate-50/30">
                  {threadMessages.map((msg, idx) => {
                    const isFromUser =
                      String(msg.senderId) === String(user?.id) ||
                      msg.senderRole === 'buyer' ||
                      (!msg.senderRole && idx === 0);

                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex items-end ${isFromUser ? 'justify-end' : 'justify-start'} space-x-2`}
                      >
                        {!isFromUser && (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mb-1">
                            {activeInquiry.agentFirstName?.[0] || 'A'}
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl shadow-2xs space-y-1 ${
                            isFromUser
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          <div
                            className={`flex items-center justify-between text-[9px] font-normal pt-1 border-t ${
                              isFromUser
                                ? 'text-blue-100 border-blue-500/40'
                                : 'text-slate-400 border-slate-100'
                            }`}
                          >
                            <span>{formatFullDateTime(msg.createdAt)}</span>
                            {isFromUser && (
                              <span className="flex items-center gap-0.5">
                                <Check size={11} /> Sent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Composer Footer */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-200/80 flex items-center space-x-2 bg-slate-50/50"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message in this conversation..."
                    disabled={sending}
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition min-w-0 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs my-auto">
                Select an inquiry from the list to view the conversation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book Visit Modal from Active Message */}
      {scheduleModalTarget && (
        <BookVisitModal
          isOpen={Boolean(scheduleModalTarget)}
          onClose={() => setScheduleModalTarget(null)}
          property={{
            id: scheduleModalTarget.propertyId,
            title: scheduleModalTarget.propertyTitle,
            address: scheduleModalTarget.propertyAddress,
            city: scheduleModalTarget.propertyCity,
            price: scheduleModalTarget.propertyPrice,
            img: scheduleModalTarget.propertyImage,
          }}
          onSuccess={(res, msg) => {
            showToast(msg || 'Visit requested successfully!');
            setScheduleModalTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default Messages;
