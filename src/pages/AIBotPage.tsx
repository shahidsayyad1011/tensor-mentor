import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/data';
import { sendMessage } from '@/lib/ai-service';
import { Send, Bot, User, Key, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const SUGGESTIONS = [
  'Generate 5 mark notes on DBMS Normalization',
  'Explain DSA stacks with example',
  'Give important questions for OOP',
  'What is TCP/IP model?',
];

const AIBotPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tensor-teach-api-key') || '');
  const [showKeyInput, setShowKeyInput] = useState(() => !localStorage.getItem('tensor-teach-api-key'));
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const saveKey = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('tensor-teach-api-key', apiKey.trim());
    setShowKeyInput(false);
    toast.success('API key saved securely');
  };

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    if (!apiKey) {
      setShowKeyInput(true);
      toast.error('Please enter your OpenRouter API key first');
      return;
    }

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(newMessages, apiKey);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to get AI response');
      setMessages([...newMessages, { role: 'assistant', content: `⚠️ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold font-display text-foreground">Tensor AI</h1>
            <p className="text-[10px] text-muted-foreground">Powered by OpenRouter</p>
          </div>
        </div>
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Key className={`w-4 h-4 ${apiKey ? 'text-green-400' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* API Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border"
          >
            <div className="p-4 flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Enter OpenRouter API Key"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-secondary border border-border focus:border-primary outline-none text-foreground"
              />
              <button
                onClick={saveKey}
                className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium"
              >
                Save
              </button>
            </div>
            <p className="px-4 pb-3 text-[10px] text-muted-foreground flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Get your key at openrouter.ai — stored locally only
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-4 animate-pulse-glow">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold font-display text-foreground mb-2">
              Ask me anything!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              I can help with notes, explanations, important questions & more.
            </p>
            <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm p-3 rounded-lg glass-card-hover text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                msg.role === 'user'
                  ? 'gradient-bg text-primary-foreground rounded-br-md'
                  : 'glass-card text-foreground rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:rounded-lg [&_code]:text-accent">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                msg.content
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="animate-pulse">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about any subject..."
            className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary outline-none text-foreground text-sm"
            disabled={loading}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={loading || !input.trim()}
            className="p-3 rounded-xl gradient-bg text-primary-foreground disabled:opacity-50 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AIBotPage;
