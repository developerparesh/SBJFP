"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Conversation,
  getStoredConversations,
  sendCandidateMessage,
  saveStoredConversations,
} from "@/lib/messagesData";

const AUTO_REPLIES = [
  "Thank you for the update! I will share this with the engineering lead.",
  "Sounds great! Feel free to review the technical checklist before the round.",
  "Got it! We have marked this on your candidate profile.",
  "Perfect. The Google Meet link will be active 10 minutes prior to the start time.",
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("conv-001");
  const [inputMessage, setInputMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded = getStoredConversations();
    setConversations(loaded);
    if (loaded.length > 0 && !activeConvId) {
      setActiveConvId(loaded[0].id);
    }
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isTyping]);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || !activeConversation) return;

    const updated = sendCandidateMessage(activeConversation.id, text.trim());
    setConversations(updated);
    setInputMessage("");

    // Simulate realistic HR auto-reply after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      const replyText = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const withReply = updated.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: replyText,
            lastTimestamp: timeNow,
            messages: [
              ...c.messages,
              {
                id: `msg-${Date.now()}`,
                sender: "hr" as const,
                senderName: c.hrName,
                text: replyText,
                timestamp: timeNow,
              },
            ],
          };
        }
        return c;
      });

      setConversations(withReply);
      saveStoredConversations(withReply);
      setIsTyping(false);
    }, 1500);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hrName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1320] text-slate-100 font-sans selection:bg-[#42D6A4]/30">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Link href="/dashboard/candidate" className="hover:text-[#42D6A4] transition-colors">
                Candidate Portal
              </Link>
              <span>/</span>
              <span className="text-slate-200">Direct In-App Messages</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>💬</span> Recruiter &amp; HR Direct Chat
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/candidate"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              ← Back to Portal
            </Link>
          </div>
        </div>

        {/* 2-Column Chat Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[620px] bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur">
          {/* Left Column: Conversations List */}
          <div className="md:col-span-4 border-r border-slate-800/80 flex flex-col bg-slate-900/40">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search HR or company..."
                  className="w-full text-xs py-2 pl-8 pr-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#1479C9]"
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-slate-500">🔍</span>
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                      isActive
                        ? "bg-[#102A43]/80 border-l-4 border-l-[#1479C9]"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                      {conv.hrAvatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">{conv.hrName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">{conv.lastTimestamp}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-[#42D6A4] truncate">
                        {conv.companyName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Chat Thread */}
          <div className="md:col-span-8 flex flex-col bg-[#0b1320]/60">
            {activeConversation ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-sm">
                      {activeConversation.hrAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{activeConversation.hrName}</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                      </div>
                      <p className="text-xs text-slate-400">
                        {activeConversation.hrRole} • <span className="text-slate-300 font-semibold">{activeConversation.companyName}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/jobs/${activeConversation.jobId}`}
                    className="text-xs font-bold text-[#42D6A4] hover:underline hidden sm:inline"
                  >
                    View Job Requirements →
                  </Link>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                  <div className="text-center my-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
                      Encrypted In-App Chat • Role: {activeConversation.jobTitle}
                    </span>
                  </div>

                  {activeConversation.messages.map((msg) => {
                    const isMe = msg.sender === "candidate";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">• {msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                            isMe
                              ? "bg-gradient-to-r from-[#1479C9] to-blue-600 text-white rounded-tr-none"
                              : "bg-slate-800/90 border border-slate-700 text-slate-200 rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}

                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 w-fit">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                      <span>{activeConversation.hrName} is typing a response...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Suggestion Chips */}
                <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex-shrink-0">
                    Quick Prompts:
                  </span>
                  {[
                    "Can we review the technical round agenda?",
                    "Is this role open to 100% remote working?",
                    "I have confirmed my interview slot on the calendar!",
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendMessage(chip)}
                      className="text-[11px] px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={`Message ${activeConversation.hrName} directly...`}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1479C9]"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition flex items-center gap-1.5 ${
                      inputMessage.trim()
                        ? "bg-[#1479C9] hover:bg-blue-600 cursor-pointer"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span>Send</span>
                    <span>➔</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <span className="text-4xl mb-2">💬</span>
                <p className="text-sm">Select a conversation thread on the left to start messaging.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
