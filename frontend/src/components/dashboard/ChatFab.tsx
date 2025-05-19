import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatFab: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition hover:bg-primary/90 hover:scale-105 focus:outline-none"
        onClick={() => setOpen(!open)}
        style={{ boxShadow: '0 4px 24px 0 rgba(120,8,208,0.15)' }}
      >
        {open ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] max-w-[90vw] bg-background-tertiary text-white rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col">
          <div className="bg-primary/80 px-5 py-4 flex items-center justify-between">
            <span className="font-bold text-lg">Chat Support</span>
            <button
              aria-label="Close chat"
              className="p-1 text-white hover:text-accent focus:outline-none"
              onClick={() => setOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 px-5 py-4 overflow-y-auto text-sm">
            {/* Placeholder for your chat UI */}
            <div className="text-white/70">Hi there! 👋<br />How can we help you today?</div>
            {/* You can add a form/input and messages here */}
          </div>
          <form className="flex border-t border-white/10 bg-background px-3 py-2">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-white/40"
              placeholder="Type your message..."
              disabled
            />
            <button
              type="button"
              className="ml-2 px-3 py-1 rounded bg-primary text-white font-semibold opacity-60 cursor-not-allowed"
              disabled
            >Send</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatFab;
