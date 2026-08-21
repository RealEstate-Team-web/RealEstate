import { useState } from 'react';
import { Search, Calendar, Paperclip, Smile, Send, ArrowLeft } from 'lucide-react';

export const Messages = () => {
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Abebe Kebede',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Hi Abebe, I\'m interested in the Luxury Villa. Is it still available?',
      time: '10:35 AM',
      unreadCount: 2,
    },
    {
      id: 2,
      name: 'Albie Kalleh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Yes, it is. Would you like to schedule a visit?',
      time: '9:20 AM',
      unreadCount: 0,
    },
    {
      id: 3,
      name: 'Axbie Home Agent',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Axbie Home from Luxury Villa visit confirmation.',
      time: '10:25 AM',
      unreadCount: 0,
    },
    {
      id: 4,
      name: 'Sara Tamrat',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Modern Apartment in Kazanchis details.',
      time: '10:04 AM',
      unreadCount: 0,
    },
  ];

  const [chatMessages, setChatMessages] = useState([
    {
      id: 101,
      sender: 'agent',
      text: "Hi Abebe, I'm interested in the Luxury Villa. Is it still available?",
      time: '10:10 AM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 102,
      sender: 'user',
      text: 'Yes, it is. Would you like to schedule a visit?',
      time: '10:15 AM',
    },
    {
      id: 103,
      sender: 'agent',
      text: "Hi Abebe, I'm interested in the Luxury Villa.",
      time: '10:18 AM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 104,
      sender: 'user',
      text: 'Yes, it is. Would you like to schedule a visit?',
      time: '10:25 AM',
    },
  ]);

  const activeAgent = conversations.find((c) => c.id === activeThreadId) || conversations[0];

  const handleSelectConversation = (id) => {
    setActiveThreadId(id);
    setMobileView('chat');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: newMessage,
        time: 'Just now',
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Messages <span className="text-slate-400 font-normal">(3 active)</span>
        </h1>
      </div>

      {/* Split / Responsive Chat Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left: Conversations List (Visible on desktop OR when mobileView === 'list') */}
        <div
          className={`lg:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50 ${
            mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="p-3.5 border-b border-slate-200/80">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search for conversations..."
                className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-3.5 flex items-center space-x-3 cursor-pointer transition ${
                  conv.id === activeThreadId
                    ? 'bg-blue-50/90 border-l-4 border-blue-600'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{conv.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{conv.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Thread View (Visible on desktop OR when mobileView === 'chat') */}
        <div
          className={`lg:col-span-8 flex flex-col justify-between bg-white ${
            mobileView === 'list' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Active Thread Header */}
          <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center space-x-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className="p-1 text-slate-600 hover:text-slate-900 lg:hidden cursor-pointer shrink-0"
                title="Back to conversation list"
              >
                <ArrowLeft size={18} />
              </button>
              <img
                src={activeAgent.avatar}
                alt={activeAgent.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{activeAgent.name}</h3>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </span>
              </div>
            </div>

            <button className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0">
              <Calendar size={14} />
              <span className="hidden sm:inline">Schedule Visit</span>
              <span className="sm:hidden">Book</span>
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1 max-h-[420px]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <img src={msg.avatar} alt="Agent" className="w-7 h-7 rounded-full object-cover shrink-0" />
                )}
                <div
                  className={`max-w-[82%] sm:max-w-md p-3 rounded-xl text-xs font-medium ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-2xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right font-normal ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Composer Footer */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200/80 flex items-center space-x-2 bg-slate-50/50">
            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0" title="Attach file">
              <Paperclip size={17} />
            </button>
            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 transition cursor-pointer shrink-0" title="Emoji">
              <Smile size={17} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-600 transition min-w-0"
            />
            <button
              type="submit"
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
