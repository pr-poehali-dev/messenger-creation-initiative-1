import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

type Message = {
  id: number;
  text: string;
  time: string;
  mine: boolean;
};

type Chat = {
  id: number;
  name: string;
  avatar: string;
  color: string;
  status: string;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
};

const initialChats: Chat[] = [
  {
    id: 1,
    name: 'Анна Соколова',
    avatar: 'АС',
    color: 'bg-rose-100 text-rose-600',
    status: 'в сети',
    last: 'Давай созвонимся вечером?',
    time: '14:32',
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: 'Привет! Как продвигается проект?', time: '14:20', mine: false },
      { id: 2, text: 'Привет! Всё отлично, почти закончили дизайн', time: '14:24', mine: true },
      { id: 3, text: 'Супер, не терпится увидеть результат ✨', time: '14:30', mine: false },
      { id: 4, text: 'Давай созвонимся вечером?', time: '14:32', mine: false },
    ],
  },
  {
    id: 2,
    name: 'Дмитрий Орлов',
    avatar: 'ДО',
    color: 'bg-blue-100 text-blue-600',
    status: 'был(а) недавно',
    last: 'Отправил документы на почту',
    time: '12:05',
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: 'Документы готовы?', time: '11:50', mine: true },
      { id: 2, text: 'Да, отправил документы на почту', time: '12:05', mine: false },
    ],
  },
  {
    id: 3,
    name: 'Мария Лебедева',
    avatar: 'МЛ',
    color: 'bg-emerald-100 text-emerald-600',
    status: 'в сети',
    last: 'Спасибо большое! 🙏',
    time: '10:18',
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: 'Скинула тебе референсы', time: '10:10', mine: false },
      { id: 2, text: 'Получил, выглядит здорово', time: '10:15', mine: true },
      { id: 3, text: 'Спасибо большое! 🙏', time: '10:18', mine: false },
    ],
  },
  {
    id: 4,
    name: 'Команда Дизайна',
    avatar: 'КД',
    color: 'bg-amber-100 text-amber-600',
    status: '6 участников',
    last: 'Игорь: встреча в 15:00',
    time: 'Вчера',
    unread: 5,
    online: false,
    messages: [
      { id: 1, text: 'Всем привет, как дела с макетами?', time: '09:00', mine: false },
      { id: 2, text: 'Встреча в 15:00, не забудьте', time: '09:30', mine: false },
    ],
  },
];

const navItems = [
  { id: 'chats', icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users', label: 'Контакты' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

const Index = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeId, setActiveId] = useState(1);
  const [activeNav, setActiveNav] = useState('chats');
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [calling, setCalling] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [installPrompt, setInstallPrompt] = useState<{ prompt: () => void; userChoice: Promise<unknown> } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const activeChat = chats.find((c) => c.id === activeId)!;
  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeChat.messages.length, activeId]);

  useEffect(() => {
    if (!calling) return;
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [calling]);

  const send = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              last: input,
              time: now,
              messages: [...c.messages, { id: Date.now(), text: input, time: now, mine: true }],
            }
          : c,
      ),
    );
    setInput('');
  };

  const startCall = () => {
    setCallSeconds(0);
    setCalling(true);
  };

  const fmtCall = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex h-screen w-full bg-secondary/40 text-foreground antialiased">
      {/* Rail */}
      <nav className="flex w-[76px] flex-col items-center gap-2 border-r border-border bg-card py-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon name="Send" size={20} />
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`group flex h-12 w-12 flex-col items-center justify-center rounded-2xl transition-all ${
              activeNav === item.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Icon name={item.icon} size={22} />
          </button>
        ))}
        <button className="mt-auto flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-secondary">
          <Icon name="LogOut" size={20} />
        </button>
      </nav>

      {/* List */}
      <aside className="flex w-[340px] flex-col border-r border-border bg-card">
        <header className="flex items-center justify-between px-6 pb-3 pt-7">
          <h1 className="text-[26px] font-bold tracking-tight">Сообщения</h1>
          {installPrompt && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Icon name="Download" size={14} />
              Установить
            </button>
          )}
        </header>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
            <Icon name="Search" size={18} className="text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
          {filtered.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveId(chat.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${
                activeId === chat.id ? 'bg-accent' : 'hover:bg-secondary'
              }`}
            >
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${chat.color}`}>
                  {chat.avatar}
                </div>
                {chat.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-semibold">{chat.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-muted-foreground">{chat.last}</span>
                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Conversation */}
      <main className="flex flex-1 flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border px-7 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${activeChat.color}`}>
              {activeChat.avatar}
            </div>
            <div>
              <div className="font-semibold leading-tight">{activeChat.name}</div>
              <div className={`text-xs ${activeChat.online ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {activeChat.status}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startCall}
              className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
            >
              <Icon name="Phone" size={20} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary">
              <Icon name="Search" size={20} />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary">
              <Icon name="MoreVertical" size={20} />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-2.5 overflow-y-auto px-7 py-6">
          {activeChat.messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[60%] animate-message-in rounded-3xl px-4 py-2.5 ${
                  m.mine
                    ? 'rounded-br-lg bg-primary text-primary-foreground'
                    : 'rounded-bl-lg bg-card shadow-sm'
                }`}
              >
                <p className="text-[15px] leading-snug">{m.text}</p>
                <span className={`mt-1 block text-right text-[11px] ${m.mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        <footer className="border-t border-border px-7 py-4">
          <div className="flex items-center gap-2">
            <button className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary">
              <Icon name="Paperclip" size={20} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Напишите сообщение..."
              className="h-11 flex-1 rounded-full bg-secondary px-5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
            />
            <button
              onClick={send}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Icon name="Send" size={18} />
            </button>
          </div>
        </footer>
      </main>

      {/* Call overlay */}
      {calling && (
        <div className="fixed inset-0 z-50 flex animate-fade-in flex-col items-center justify-center bg-background/95 backdrop-blur-xl">
          <div className="relative mb-8">
            <span className={`absolute inset-0 animate-pulse-ring rounded-full ${activeChat.color}`} />
            <div className={`relative flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold ${activeChat.color}`}>
              {activeChat.avatar}
            </div>
          </div>
          <h2 className="text-2xl font-bold">{activeChat.name}</h2>
          <p className="mt-2 text-muted-foreground">{fmtCall(callSeconds)} · идёт вызов</p>
          <div className="mt-12 flex items-center gap-5">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted">
              <Icon name="MicOff" size={22} />
            </button>
            <button
              onClick={() => setCalling(false)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Icon name="PhoneOff" size={26} />
            </button>
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-muted">
              <Icon name="Volume2" size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;