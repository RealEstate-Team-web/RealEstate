import React, { useState } from 'react';
import { Search, Calendar, Paperclip, Smile, Send } from 'lucide-react';

export const Messages = () => {
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Abebe Kebede',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Hi Abebe, I\'m interested in the Luxury Villa. Is it still available?',
      time: '10:35 AM',
      unreadCount: 2,
      active: true,
    },
    {
      id: 2,
      name: 'Albie Kalleh',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Yes, it is. Would you like to schedule a visit?',
      time: '9:20 AM',
      unreadCount: 0,
      active: false,
    },
    {
      id: 3,
      name: 'Axbie Home Agent',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Axbie Home from Luxury Villa visit confirmation.',
      time: '10:25 AM',
      unreadCount: 0,
      active: false,
    },
    {
      id: 4,
      name: 'Sara Tamrat',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      lastMessage: 'Modern Apartment in Kazanchis details.',
      time: '10:04 AM',
      unreadCount: 0,
      active: false,
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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Messages <span className="text-slate-400 font-normal">(3 active)</span>
        </h1>
      </div>

      {/* Split Chat Box Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left: Conversations List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200/80">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search for conversations..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveThreadId(conv.id)}
                className={`p-4 flex items-center space-x-3 cursor-pointer transition ${
                  conv.id === activeThreadId
                    ? 'bg-blue-50/80 border-l-4 border-blue-600'
                    : 'hover:bg-slate-100/60'
                }`}
              >
                <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{conv.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{conv.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Thread View (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          {/* Active Thread Header */}
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                alt="Abebe Kebede"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Abebe Kebede</h3>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                </span>
              </div>
            </div>

            <button className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs">
              <Calendar size={15} />
              <span>Schedule Visit</span>
            </button>
          </div>

          {/* Chat Messages List */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 max-h-[440px]">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'agent' && (
                  <img src={msg.avatar} alt="Agent" className="w-8 h-8 rounded-full object-cover shrink-0" />
                )}
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs font-medium ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/10'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right font-normal ${
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
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 flex items-center space-x-3 bg-slate-50/50">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer" title="Attach file">
              <Paperclip size={18} />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer" title="Emoji">
              <Smile size={18} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
            <button
              type="submit"
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-md shadow-blue-600/20"
            >
              <span>Send</span>
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
