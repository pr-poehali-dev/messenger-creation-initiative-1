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

type Contact = {
  id: number;
  name: string;
  avatar: string;
  color: string;
  phone: string;
  email: string;
  role: string;
  online: boolean;
};

const initialContacts: Contact[] = [
  { id: 1, name: 'Анна Соколова',    avatar: 'АС', color: 'bg-rose-100 text-rose-600',    phone: '+7 (999) 123-45-67', email: 'anna@example.com',    role: 'Дизайнер',           online: true  },
  { id: 2, name: 'Дмитрий Орлов',   avatar: 'ДО', color: 'bg-blue-100 text-blue-600',    phone: '+7 (999) 234-56-78', email: 'dmitry@example.com',  role: 'Разработчик',        online: false },
  { id: 3, name: 'Мария Лебедева',  avatar: 'МЛ', color: 'bg-emerald-100 text-emerald-600', phone: '+7 (999) 345-67-89', email: 'maria@example.com', role: 'Менеджер проекта',   online: true  },
  { id: 4, name: 'Игорь Петров',    avatar: 'ИП', color: 'bg-violet-100 text-violet-600', phone: '+7 (999) 456-78-90', email: 'igor@example.com',    role: 'Директор',           online: false },
  { id: 5, name: 'Светлана Козлова',avatar: 'СК', color: 'bg-pink-100 text-pink-600',    phone: '+7 (999) 567-89-01', email: 'sveta@example.com',   role: 'Маркетолог',         online: true  },
  { id: 6, name: 'Алексей Смирнов', avatar: 'АС', color: 'bg-orange-100 text-orange-600',phone: '+7 (999) 678-90-12', email: 'alexey@example.com',  role: 'Аналитик',           online: false },
  { id: 7, name: 'Екатерина Новак', avatar: 'ЕН', color: 'bg-teal-100 text-teal-600',    phone: '+7 (999) 789-01-23', email: 'kate@example.com',    role: 'QA-инженер',         online: true  },
  { id: 8, name: 'Роман Васильев',  avatar: 'РВ', color: 'bg-indigo-100 text-indigo-600',phone: '+7 (999) 890-12-34', email: 'roman@example.com',   role: 'DevOps',             online: false },
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
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', role: '' });
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

  const addContact = () => {
    if (!newContact.name.trim()) return;
    const initials = newContact.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['bg-rose-100 text-rose-600','bg-blue-100 text-blue-600','bg-emerald-100 text-emerald-600','bg-violet-100 text-violet-600','bg-amber-100 text-amber-600'];
    const color = colors[contacts.length % colors.length];
    setContacts((prev) => [...prev, { id: Date.now(), name: newContact.name.trim(), avatar: initials, color, phone: newContact.phone, email: newContact.email, role: newContact.role, online: false }]);
    setNewContact({ name: '', phone: '', email: '', role: '' });
    setShowAddContact(false);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );

  const grouped = filteredContacts.reduce<Record<string, Contact[]>>((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

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

      {/* Contacts panel */}
      {activeNav === 'contacts' && (
        <main className="flex flex-1 flex-col bg-background">
          <header className="flex items-center justify-between border-b border-border px-7 py-5">
            <h2 className="text-xl font-bold">Контакты</h2>
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <Icon name="UserPlus" size={16} />
              Добавить
            </button>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Contact list */}
            <div className="scrollbar-thin w-80 shrink-0 overflow-y-auto border-r border-border px-4 py-4">
              <div className="mb-3 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
                <Icon name="Search" size={16} className="text-muted-foreground" />
                <input
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Поиск контактов..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <p className="mb-3 text-xs text-muted-foreground">{contacts.length} контактов</p>
              {Object.keys(grouped).sort().map((letter) => (
                <div key={letter}>
                  <div className="mb-1 mt-3 px-2 text-xs font-semibold text-muted-foreground">{letter}</div>
                  {grouped[letter].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${selectedContact?.id === c.id ? 'bg-accent' : 'hover:bg-secondary'}`}
                    >
                      <div className="relative shrink-0">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${c.color}`}>{c.avatar}</div>
                        {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Contact detail */}
            <div className="flex flex-1 flex-col items-center justify-center p-10">
              {selectedContact ? (
                <div className="animate-fade-in w-full max-w-sm">
                  <div className="mb-6 flex flex-col items-center gap-3">
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold ${selectedContact.color}`}>
                      {selectedContact.avatar}
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">{selectedContact.name}</h3>
                      <p className="text-muted-foreground">{selectedContact.role}</p>
                      {selectedContact.online && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          в сети
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-6 flex justify-center gap-3">
                    <button
                      onClick={() => { setActiveNav('chats'); const chat = chats.find((ch) => ch.name === selectedContact.name); if (chat) setActiveId(chat.id); }}
                      className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform hover:scale-105"
                    >
                      <Icon name="MessageCircle" size={20} />
                    </button>
                    <button
                      onClick={() => { setCalling(true); setCallSeconds(0); }}
                      className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform hover:scale-105"
                    >
                      <Icon name="Phone" size={20} />
                    </button>
                    <button
                      onClick={() => setContacts((prev) => prev.filter((c) => c.id !== selectedContact.id)) || setSelectedContact(null)}
                      className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-transform hover:scale-105"
                    >
                      <Icon name="Trash2" size={20} />
                    </button>
                  </div>
                  <div className="space-y-3 rounded-3xl bg-secondary p-5">
                    {selectedContact.phone && (
                      <div className="flex items-center gap-3">
                        <Icon name="Phone" size={16} className="text-muted-foreground" />
                        <span className="text-sm">{selectedContact.phone}</span>
                      </div>
                    )}
                    {selectedContact.email && (
                      <div className="flex items-center gap-3">
                        <Icon name="Mail" size={16} className="text-muted-foreground" />
                        <span className="text-sm">{selectedContact.email}</span>
                      </div>
                    )}
                    {selectedContact.role && (
                      <div className="flex items-center gap-3">
                        <Icon name="Briefcase" size={16} className="text-muted-foreground" />
                        <span className="text-sm">{selectedContact.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Icon name="Users" size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Выберите контакт</p>
                </div>
              )}
            </div>
          </div>

          {/* Add contact modal */}
          {showAddContact && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowAddContact(false)}>
              <div className="animate-fade-in w-full max-w-sm rounded-3xl bg-card p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="mb-5 text-lg font-bold">Новый контакт</h3>
                <div className="space-y-3">
                  {[
                    { key: 'name', label: 'Имя *', placeholder: 'Иван Иванов', icon: 'User' },
                    { key: 'phone', label: 'Телефон', placeholder: '+7 (999) 000-00-00', icon: 'Phone' },
                    { key: 'email', label: 'Email', placeholder: 'ivan@example.com', icon: 'Mail' },
                    { key: 'role', label: 'Должность', placeholder: 'Менеджер', icon: 'Briefcase' },
                  ].map(({ key, label, placeholder, icon }) => (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
                      <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
                        <Icon name={icon} size={15} className="shrink-0 text-muted-foreground" />
                        <input
                          value={newContact[key as keyof typeof newContact]}
                          onChange={(e) => setNewContact((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setShowAddContact(false)} className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-medium transition-colors hover:bg-muted">
                    Отмена
                  </button>
                  <button onClick={addContact} className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95">
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Conversation */}
      {activeNav !== 'contacts' && <main className="flex flex-1 flex-col bg-background">
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
      </main>}

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