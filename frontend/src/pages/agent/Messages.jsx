import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Send,
  ArrowLeft,
  MessageSquare,
  Building2,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Check,
} from "lucide-react";
import {
  getAgentInquiries,
  getInquiryById,
  replyToInquiry,
  markInquiryRead,
} from "../../services/inquiry.service";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "New" },
  { key: "read", label: "Read" },
  { key: "responded", label: "Responded" },
];

const STATUS_BADGE = {
  pending: { label: "New", className: "bg-amber-100 text-amber-800 border-amber-200" },
  read: { label: "Read", className: "bg-blue-100 text-blue-800 border-blue-200" },
  responded: { label: "Responded", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  archived: { label: "Archived", className: "bg-slate-100 text-slate-700 border-slate-200" },
};

const formatShortDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatFullDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(value);
};

const Messages = () => {
  const { user } = useAuth();
  const { toastMessage, toastTone, showToast } = useToast();
  const messagesEndRef = useRef(null);

  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [activeInquiryId, setActiveInquiryId] = useState(null);
  const [activeLoading, setActiveLoading] = useState(false);
  const [activeError, setActiveError] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [threadReloadKey, setThreadReloadKey] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const loadRequestIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadInquiries = useCallback(
    async (pageToLoad, isMountedRef = { current: true }) => {
      const requestId = ++loadRequestIdRef.current;
      const nextPage = Number.isInteger(pageToLoad) ? pageToLoad : 1;
      try {
        setLoading(true);
        setError("");
        const params = { limit: 50, page: nextPage };
        if (statusFilter !== "all") params.status = statusFilter;
        if (debouncedSearch) params.search = debouncedSearch;

        const response = await getAgentInquiries(params);
        if (!isMountedRef.current || requestId !== loadRequestIdRef.current) return;

        const list = Array.isArray(response?.data) ? response.data : [];
        if (response?.pagination) setPagination(response.pagination);

        if (nextPage === 1) {
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
        } else {
          setInquiries((prev) => [...prev, ...list]);
        }
      } catch (err) {
        if (!isMountedRef.current || requestId !== loadRequestIdRef.current) return;
        setError(err.message || "Failed to load conversations");
      } finally {
        if (isMountedRef.current && requestId === loadRequestIdRef.current) setLoading(false);
      }
    },
    [statusFilter, debouncedSearch],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const mountedRef = { current: true };
    (async () => {
      await loadInquiries(page, mountedRef);
    })();
    return () => {
      mountedRef.current = false;
    };
  }, [page, refreshKey, loadInquiries]);

  useEffect(() => {
    if (!activeInquiryId) {
      return undefined;
    }
    let isCurrent = true;

    const loadActiveThread = async () => {
      try {
        setActiveLoading(true);
        setActiveError("");
        const detailed = await getInquiryById(activeInquiryId);
        if (isCurrent) setActiveInquiry(detailed);
        // Mark as read in background; do not block UI
        markInquiryRead(activeInquiryId)
          .then(() => {
            if (!isCurrent) return;
            setInquiries((prev) =>
              prev.map((item) =>
                item.id === activeInquiryId
                  ? { ...item, isRead: true, status: item.status === "pending" ? "read" : item.status }
                  : item,
              ),
            );
            if (detailed && isCurrent) {
              setActiveInquiry((prev) => (prev ? { ...prev, isRead: true } : prev));
            }
          })
          .catch(() => {
            /* swallow; markRead is best-effort */
          });
      } catch (err) {
        if (isCurrent) {
          setActiveError(
            err.message || "Failed to load this conversation. Please try again.",
          );
        }
      } finally {
        if (isCurrent) setActiveLoading(false);
      }
    };

    loadActiveThread();
    return () => {
      isCurrent = false;
    };
  }, [activeInquiryId, threadReloadKey]);

  useEffect(() => {
    scrollToBottom();
  }, [activeInquiry?.messages]);

  const filteredInquiries = inquiries;

  const handleSelectConversation = (id) => {
    setActiveInquiryId(id);
    setMobileView("chat");
  };

  const handleLoadMore = () => {
    setPage((p) => p + 1);
  };

  useEffect(() => {
    if (page > 1) {
      const mountedRef = { current: true };
      (async () => {
        await loadInquiries(page, mountedRef);
      })();
      return () => { mountedRef.current = false; };
    }
    return undefined;
  }, [page, loadInquiries]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeInquiryId || sending) return;

    setSending(true);
    try {
      const messageText = newMessage.trim();
      const updatedInquiry = await replyToInquiry(activeInquiryId, messageText);
      showToast("Message sent");
      setNewMessage("");

      if (updatedInquiry) {
        setActiveInquiry(updatedInquiry);
      }

      setInquiries((prevList) =>
        prevList.map((item) =>
          item.id === activeInquiryId
            ? {
                ...item,
                latestMessage: messageText,
                updatedAt: new Date().toISOString(),
                status: "responded",
                isRead: true,
              }
            : item,
        ),
      );
    } catch (err) {
      showToast(err.message || "Failed to send message", { tone: "error" });
    } finally {
      setSending(false);
    }
  };

  const threadMessages = useMemo(() => {
    if (!activeInquiry) return [];
    if (Array.isArray(activeInquiry.messages) && activeInquiry.messages.length > 0) {
      return activeInquiry.messages;
    }
    return [
      {
        id: "initial",
        senderId: activeInquiry.buyerId,
        senderRole: "buyer",
        message: activeInquiry.message,
        createdAt: activeInquiry.createdAt,
      },
    ];
  }, [activeInquiry]);

  const buyerName = activeInquiry
    ? `${activeInquiry.buyerFirstName || ""} ${activeInquiry.buyerLastName || ""}`.trim() ||
      activeInquiry.buyerEmail ||
      "Buyer"
    : "";

  return (
    <div className="space-y-6 font-sans">
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium ${
            toastTone === "error" ? "bg-rose-600 text-white" : "bg-slate-900 text-white"
          }`}
          role={toastTone === "error" ? "alert" : "status"}
        >
          {toastTone === "error" ? (
            <AlertCircle size={16} className="shrink-0" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Customer Messages
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Respond to inquiries from buyers about your listings
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setPage(1);
            setRefreshKey((k) => k + 1);
          }}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 shadow-xs transition cursor-pointer flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-8 text-center space-y-4 min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-[3px] border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">
            Loading conversations...
          </p>
        </div>
      )}

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

      {!loading && !error && inquiries.length === 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No inquiries yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When buyers send inquiries on your listings, they will appear here for you to respond.
            </p>
          </div>
          <Link
            to="/agent/properties"
            className="inline-block px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            Manage Listings
          </Link>
        </div>
      )}

      {!loading && !error && inquiries.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          <div
            className={`lg:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50 ${
              mobileView === "chat" ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="p-3.5 border-b border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab.key);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                      statusFilter === tab.key
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                    aria-pressed={statusFilter === tab.key}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto flex-1 max-h-[500px]">
              {filteredInquiries.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No matching inquiries.
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = inq.id === activeInquiryId;
                  const badge = STATUS_BADGE[inq.status] || STATUS_BADGE.pending;
                  const displayMessage = inq.latestMessage || inq.message;
                  const isUnread = !inq.isRead && inq.status === "pending";
                  const displayName = `${inq.buyerFirstName || ""} ${inq.buyerLastName || ""}`.trim() ||
                    inq.buyerEmail ||
                    "Buyer";

                  return (
                    <button
                      type="button"
                      key={inq.id}
                      onClick={() => handleSelectConversation(inq.id)}
                      aria-current={isSelected ? "true" : undefined}
                      className={`w-full text-left p-3.5 flex items-start space-x-3 cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-50/90 border-l-4 border-blue-600"
                          : "hover:bg-slate-100/60"
                      }`}
                    >
                      {inq.buyerAvatar ? (
                        <img
                          src={inq.buyerAvatar}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {displayName[0]?.toUpperCase() || "B"}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs truncate ${
                              isUnread ? "font-bold text-slate-900" : "font-semibold text-slate-800"
                            }`}
                          >
                            {displayName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                            {formatShortDate(inq.updatedAt || inq.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1">
                          <Building2 size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{inq.propertyTitle || 'General inquiry'}</span>
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
                          {isUnread && (
                            <span
                              aria-hidden="true"
                              className="w-2 h-2 rounded-full bg-blue-600"
                            />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
              {inquiries.length > 0 && pagination.totalPages > 1 && pagination.page < pagination.totalPages && (
                <div className="p-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="w-full py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
                  >
                    {loading ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`lg:col-span-8 flex flex-col justify-between bg-white ${
              mobileView === "list" ? "hidden lg:flex" : "flex"
            }`}
          >
            {activeLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                <div className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium">Loading conversation...</p>
              </div>
            ) : activeError ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <p className="text-xs font-medium text-rose-600">{activeError}</p>
                <button
                  type="button"
                  onClick={() => setThreadReloadKey((k) => k + 1)}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : activeInquiry ? (
              <>
                <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setMobileView("list")}
                      className="p-1 text-slate-600 hover:text-slate-900 lg:hidden cursor-pointer shrink-0"
                      title="Back to inquiries list"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    {activeInquiry.buyerAvatar ? (
                      <img
                        src={activeInquiry.buyerAvatar}
                        alt={buyerName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {buyerName[0]?.toUpperCase() || "B"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {buyerName}
                      </h3>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        {activeInquiry.buyerEmail && (
                          <span className="flex items-center gap-0.5">
                            <Mail size={10} /> {activeInquiry.buyerEmail}
                          </span>
                        )}
                        {activeInquiry.buyerPhone && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Phone size={10} /> {activeInquiry.buyerPhone}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {activeInquiry.propertyId && (
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
                        {activeInquiry.propertyTitle || 'General inquiry'}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        {activeInquiry.propertyAddress
                          ? `${activeInquiry.propertyAddress}, `
                          : ""}
                        {activeInquiry.propertyCity}
                      </p>
                      {activeInquiry.propertyPrice && (
                        <p className="font-bold text-blue-600 text-xs mt-0.5">
                          {formatPrice(activeInquiry.propertyPrice)}
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
                )}

                <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 max-h-[380px] bg-slate-50/30">
                  {threadMessages.map((msg, idx) => {
                    const isFromUser =
                      (msg.senderId != null &&
                        user?.id != null &&
                        String(msg.senderId) === String(user.id)) ||
                      (msg.senderRole && msg.senderRole === "agent");

                    return (
                      <div
                        key={msg.id || idx}
                        className={`flex items-end ${
                          isFromUser ? "justify-end" : "justify-start"
                        } space-x-2`}
                      >
                        {!isFromUser && (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mb-1">
                            {activeInquiry.buyerFirstName?.[0]?.toUpperCase() || "B"}
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl shadow-xs space-y-1 ${
                            isFromUser
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                          }`}
                        >
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </p>
                          <div
                            className={`flex items-center justify-between text-[9px] font-normal pt-1 border-t ${
                              isFromUser
                                ? "text-blue-100 border-blue-500/40"
                                : "text-slate-400 border-slate-100"
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

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 border-t border-slate-200/80 flex items-center space-x-2 bg-slate-50/50"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a reply..."
                    disabled={sending}
                    className="flex-1 bg-white border border-slate-200 rounded-xl py-2 px-3.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition min-w-0 disabled:opacity-50"
                    aria-label="Reply message"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {!loading && !error && pagination.total > 0 && (
        <p className="text-[11px] text-slate-500 text-right">
          {pagination.total} total conversation{pagination.total === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
};

export default Messages;
export { Messages };
