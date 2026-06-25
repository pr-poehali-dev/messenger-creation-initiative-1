import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

// ─── Types ────────────────────────────────────────────────────────────────────

type FileAttachment = {
  name: string;
  size: string;
  type: 'image' | 'doc';
  url?: string;
};

type Message = {
  id: number;
  text: string;
  time: string;
  mine: boolean;
  file?: FileAttachment;
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
  isGroup?: boolean;
  members?: string[];
  messages: Message[];
};

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialChats: Chat[] = [
  {
    id: 1, name: 'Анна Соколова', avatar: 'АС', color: 'bg-rose-100 text-rose-600',
    status: 'в сети', last: 'Давай созвонимся вечером?', time: '14:32', unread: 2, online: true,
    messages: [
      { id: 1, text: 'Привет! Как продвигается проект?', time: '14:20', mine: false },
      { id: 2, text: 'Привет! Всё отлично, почти закончили дизайн', time: '14:24', mine: true },
      { id: 3, text: 'Супер, не терпится увидеть результат ✨', time: '14:30', mine: false },
      { id: 4, text: 'Давай созвонимся вечером?', time: '14:32', mine: false },
    ],
  },
  {
    id: 2, name: 'Дмитрий Орлов', avatar: 'ДО', color: 'bg-blue-100 text-blue-600',
    status: 'был(а) недавно', last: 'Отправил документы на почту', time: '12:05', unread: 0, online: false,
    messages: [
      { id: 1, text: 'Документы готовы?', time: '11:50', mine: true },
      { id: 2, text: 'Да, отправил документы на почту', time: '12:05', mine: false },
      { id: 3, text: '', time: '12:06', mine: false, file: { name: 'Договор_2024.pdf', size: '1.2 МБ', type: 'doc' } },
    ],
  },
  {
    id: 3, name: 'Мария Лебедева', avatar: 'МЛ', color: 'bg-emerald-100 text-emerald-600',
    status: 'в сети', last: 'Спасибо большое! 🙏', time: '10:18', unread: 0, online: true,
    messages: [
      { id: 1, text: 'Скинула тебе референсы', time: '10:10', mine: false },
      { id: 2, text: '', time: '10:12', mine: false, file: { name: 'reference.jpg', size: '840 КБ', type: 'image', url: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400' } },
      { id: 3, text: 'Получил, выглядит здорово', time: '10:15', mine: true },
      { id: 4, text: 'Спасибо большое! 🙏', time: '10:18', mine: false },
    ],
  },
  {
    id: 4, name: 'Команда Дизайна', avatar: 'КД', color: 'bg-amber-100 text-amber-600',
    status: '4 участника', last: 'Игорь: встреча в 15:00', time: 'Вчера', unread: 5, online: false,
    isGroup: true, members: ['Анна Соколова', 'Дмитрий Орлов', 'Мария Лебедева', 'Игорь Петров'],
    messages: [
      { id: 1, text: 'Всем привет, как дела с макетами?', time: '09:00', mine: false },
      { id: 2, text: 'Встреча в 15:00, не забудьте', time: '09:30', mine: false },
    ],
  },
];

const initialContacts: Contact[] = [
  { id: 1, name: 'Анна Соколова',    avatar: 'АС', color: 'bg-rose-100 text-rose-600',       phone: '+7 (999) 123-45-67', email: 'anna@example.com',   role: 'Дизайнер',         online: true  },
  { id: 2, name: 'Дмитрий Орлов',   avatar: 'ДО', color: 'bg-blue-100 text-blue-600',       phone: '+7 (999) 234-56-78', email: 'dmitry@example.com', role: 'Разработчик',      online: false },
  { id: 3, name: 'Мария Лебедева',  avatar: 'МЛ', color: 'bg-emerald-100 text-emerald-600', phone: '+7 (999) 345-67-89', email: 'maria@example.com',  role: 'Менеджер проекта', online: true  },
  { id: 4, name: 'Игорь Петров',    avatar: 'ИП', color: 'bg-violet-100 text-violet-600',   phone: '+7 (999) 456-78-90', email: 'igor@example.com',   role: 'Директор',         online: false },
  { id: 5, name: 'Светлана Козлова',avatar: 'СК', color: 'bg-pink-100 text-pink-600',       phone: '+7 (999) 567-89-01', email: 'sveta@example.com',  role: 'Маркетолог',       online: true  },
  { id: 6, name: 'Алексей Смирнов', avatar: 'АС', color: 'bg-orange-100 text-orange-600',   phone: '+7 (999) 678-90-12', email: 'alexey@example.com', role: 'Аналитик',         online: false },
  { id: 7, name: 'Екатерина Новак', avatar: 'ЕН', color: 'bg-teal-100 text-teal-600',       phone: '+7 (999) 789-01-23', email: 'kate@example.com',   role: 'QA-инженер',       online: true  },
  { id: 8, name: 'Роман Васильев',  avatar: 'РВ', color: 'bg-indigo-100 text-indigo-600',   phone: '+7 (999) 890-12-34', email: 'roman@example.com',  role: 'DevOps',           online: false },
];

// ─── Profile Panel ────────────────────────────────────────────────────────────

const ProfilePanel = () => {
  const [editing, setEditing] = useState(false);
  const [name,   setName]   = useState('Александр Волков');
  const [status, setStatus] = useState('На связи');
  const [phone,  setPhone]  = useState('+7 (999) 000-11-22');
  const [email,  setEmail]  = useState('alex@example.com');
  const [bio,    setBio]    = useState('Люблю создавать удобные продукты и общаться с командой 🚀');
  const [saved,  setSaved]  = useState(false);

  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const statusOptions = ['На связи', 'Занят', 'Не беспокоить', 'Отошёл', 'Невидимый'];
  const statusColors: Record<string, string> = {
    'На связи': 'bg-emerald-500', 'Занят': 'bg-amber-500',
    'Не беспокоить': 'bg-red-500', 'Отошёл': 'bg-zinc-400', 'Невидимый': 'bg-zinc-300',
  };

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl px-8 py-10">
        {/* Avatar block */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 text-5xl font-bold text-primary select-none">
              АВ
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:scale-105 transition-transform">
              <Icon name="Camera" size={16} />
            </button>
            <span className={`absolute bottom-0 left-0 h-4 w-4 rounded-full border-2 border-card ${statusColors[status]}`} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
          {saved && (
            <span className="animate-fade-in rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-600">
              ✓ Изменения сохранены
            </span>
          )}
        </div>

        {/* Info card */}
        <div className="mb-4 rounded-3xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Личные данные</h3>
            <button
              onClick={() => editing ? save() : setEditing(true)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${editing ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-muted'}`}>
              <Icon name={editing ? 'Check' : 'Pencil'} size={14} />
              {editing ? 'Сохранить' : 'Изменить'}
            </button>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Имя', icon: 'User',      value: name,  set: setName,  placeholder: 'Ваше имя' },
              { label: 'Телефон', icon: 'Phone',  value: phone, set: setPhone, placeholder: '+7 ...' },
              { label: 'Email',   icon: 'Mail',   value: email, set: setEmail, placeholder: 'email@...' },
            ].map(({ label, icon, value, set, placeholder }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Icon name={icon} size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                  {editing
                    ? <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                        className="w-full rounded-xl bg-secondary px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
                    : <div className="text-sm font-medium">{value}</div>
                  }
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary mt-0.5">
                <Icon name="AlignLeft" size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">О себе</div>
                {editing
                  ? <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                      className="w-full resize-none rounded-xl bg-secondary px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
                  : <div className="text-sm leading-relaxed">{bio}</div>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4 rounded-3xl border border-border bg-card p-6">
          <h3 className="mb-3 font-semibold">Статус</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${status === s ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-muted'}`}>
                <span className={`h-2 w-2 rounded-full ${statusColors[s]}`} />
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: 'Сообщений', value: '1 284', icon: 'MessageCircle' },
            { label: 'Контактов',  value: '8',     icon: 'Users' },
            { label: 'Групп',      value: '2',     icon: 'UsersRound' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-4">
              <Icon name={icon} size={20} className="text-primary mb-1" />
              <div className="text-xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="rounded-3xl border border-red-100 bg-red-50/50 p-5">
          <h3 className="mb-3 text-sm font-semibold text-red-700">Опасная зона</h3>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors text-left">
              <Icon name="LogOut" size={16} /> Выйти из аккаунта
            </button>
            <button className="flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 transition-colors text-left">
              <Icon name="Trash2" size={16} /> Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Settings Panel ───────────────────────────────────────────────────────────

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}>
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

const SettingsPanel = () => {
  const [notifMessages, setNotifMessages]   = useState(true);
  const [notifCalls,    setNotifCalls]      = useState(true);
  const [notifGroups,   setNotifGroups]     = useState(true);
  const [soundMsg,      setSoundMsg]        = useState(true);
  const [soundCall,     setSoundCall]       = useState(true);
  const [vibration,     setVibration]       = useState(true);
  const [readReceipts,  setReadReceipts]    = useState(true);
  const [lastSeen,      setLastSeen]        = useState(true);
  const [onlineStatus,  setOnlineStatus]    = useState(true);
  const [theme,         setTheme]           = useState<'light' | 'system'>('light');
  const [fontSize,      setFontSize]        = useState<'small' | 'medium' | 'large'>('medium');
  const [lang,          setLang]            = useState('ru');

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4 rounded-3xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );

  const Row = ({ icon, label, desc, right }: { icon: string; label: string; desc?: string; right: React.ReactNode }) => (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon name={icon} size={17} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto">
      <div className="mx-auto max-w-xl px-8 py-10">
        <h2 className="mb-6 text-2xl font-bold">Настройки</h2>

        <Section title="Уведомления">
          <Row icon="MessageCircle" label="Сообщения" desc="Уведомления о новых сообщениях"
            right={<Toggle checked={notifMessages} onChange={() => setNotifMessages(p => !p)} />} />
          <Row icon="Phone" label="Звонки" desc="Входящие голосовые и видеозвонки"
            right={<Toggle checked={notifCalls} onChange={() => setNotifCalls(p => !p)} />} />
          <Row icon="Users" label="Группы" desc="Сообщения в групповых чатах"
            right={<Toggle checked={notifGroups} onChange={() => setNotifGroups(p => !p)} />} />
        </Section>

        <Section title="Звук и вибрация">
          <Row icon="Volume2" label="Звук сообщений"
            right={<Toggle checked={soundMsg} onChange={() => setSoundMsg(p => !p)} />} />
          <Row icon="PhoneCall" label="Звук звонков"
            right={<Toggle checked={soundCall} onChange={() => setSoundCall(p => !p)} />} />
          <Row icon="Vibrate" label="Вибрация"
            right={<Toggle checked={vibration} onChange={() => setVibration(p => !p)} />} />
        </Section>

        <Section title="Приватность">
          <Row icon="CheckCheck" label="Подтверждение прочтения" desc="Собеседник видит, что вы прочли сообщение"
            right={<Toggle checked={readReceipts} onChange={() => setReadReceipts(p => !p)} />} />
          <Row icon="Clock" label="Время последнего визита" desc="Кто может видеть, когда вы были в сети"
            right={<Toggle checked={lastSeen} onChange={() => setLastSeen(p => !p)} />} />
          <Row icon="Eye" label="Статус «в сети»" desc="Показывать собеседникам, что вы онлайн"
            right={<Toggle checked={onlineStatus} onChange={() => setOnlineStatus(p => !p)} />} />
        </Section>

        <Section title="Внешний вид">
          <Row icon="Sun" label="Тема оформления"
            right={
              <div className="flex rounded-xl bg-secondary p-1 gap-1">
                {(['light', 'system'] as const).map((t) => (
                  <button key={t} onClick={() => setTheme(t)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${theme === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                    {t === 'light' ? 'Светлая' : 'Системная'}
                  </button>
                ))}
              </div>
            } />
          <Row icon="Type" label="Размер шрифта"
            right={
              <div className="flex rounded-xl bg-secondary p-1 gap-1">
                {(['small', 'medium', 'large'] as const).map((f) => (
                  <button key={f} onClick={() => setFontSize(f)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${fontSize === f ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                    {f === 'small' ? 'Мал' : f === 'medium' ? 'Средний' : 'Большой'}
                  </button>
                ))}
              </div>
            } />
        </Section>

        <Section title="Язык и регион">
          <Row icon="Globe" label="Язык интерфейса"
            right={
              <select value={lang} onChange={(e) => setLang(e.target.value)}
                className="rounded-xl bg-secondary px-3 py-1.5 text-sm outline-none">
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            } />
        </Section>

        <Section title="Данные и хранилище">
          <Row icon="HardDrive" label="Использование памяти" desc="Кэш: 24 МБ"
            right={<button className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium hover:bg-muted transition-colors">Очистить</button>} />
          <Row icon="Download" label="Автозагрузка медиа" desc="Фото, видео, документы"
            right={<Toggle checked={true} onChange={() => {}} />} />
        </Section>

        <Section title="О приложении">
          <Row icon="Info" label="Версия" desc="1.0.0" right={<span className="text-xs text-muted-foreground">актуальная</span>} />
          <Row icon="Shield" label="Политика конфиденциальности" right={<Icon name="ChevronRight" size={16} className="text-muted-foreground" />} />
          <Row icon="FileText" label="Условия использования" right={<Icon name="ChevronRight" size={16} className="text-muted-foreground" />} />
        </Section>
      </div>
    </div>
  );
};

// ─── Nav ──────────────────────────────────────────────────────────────────────

const navItems = [
  { id: 'chats',    icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts', icon: 'Users',         label: 'Контакты' },
  { id: 'profile',  icon: 'User',          label: 'Профиль' },
  { id: 'settings', icon: 'Settings',      label: 'Настройки' },
];

const COLORS = ['bg-rose-100 text-rose-600','bg-blue-100 text-blue-600','bg-emerald-100 text-emerald-600','bg-violet-100 text-violet-600','bg-amber-100 text-amber-600','bg-pink-100 text-pink-600'];

// ─── Component ────────────────────────────────────────────────────────────────

const Index = () => {
  // chats
  const [chats, setChats]       = useState<Chat[]>(initialChats);
  const [activeId, setActiveId] = useState(1);
  const [activeNav, setActiveNav] = useState('chats');
  const [search, setSearch]     = useState('');
  const [input, setInput]       = useState('');

  // calls
  const [callMode, setCallMode]       = useState<'voice' | 'video' | null>(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const [micMuted, setMicMuted]       = useState(false);
  const [speakerOff, setSpeakerOff]   = useState(false);
  const [camOff, setCamOff]           = useState(false);
  const [frontCam, setFrontCam]       = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // files
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<FileAttachment | null>(null);

  // contacts
  const [contacts, setContacts]           = useState<Contact[]>(initialContacts);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAddContact, setShowAddContact]   = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '', role: '' });

  // groups
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName]             = useState('');
  const [groupMembers, setGroupMembers]       = useState<string[]>([]);

  // pwa
  const [installPrompt, setInstallPrompt] = useState<{ prompt: () => void; userChoice: Promise<unknown> } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as never); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const activeChat = chats.find((c) => c.id === activeId)!;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeChat?.messages.length, activeId]);

  useEffect(() => {
    if (!callMode) return;
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callMode]);

  // video stream
  useEffect(() => {
    if (callMode !== 'video' || camOff) return;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: frontCam ? 'user' : 'environment' }, audio: true })
      .then((stream) => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(() => {});
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, [callMode, camOff, frontCam]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  const fmtCall = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startCall = (mode: 'voice' | 'video') => {
    setCallSeconds(0); setMicMuted(false); setSpeakerOff(false); setCamOff(false);
    setCallMode(mode);
  };

  const endCall = () => {
    if (videoRef.current?.srcObject)
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    setCallMode(null);
  };

  const send = () => {
    const hasText = input.trim();
    if (!hasText && !pendingFile) return;
    const now = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    const msg: Message = { id: Date.now(), text: input.trim(), time: now, mine: true, file: pendingFile ?? undefined };
    setChats((prev) => prev.map((c) => c.id === activeId
      ? { ...c, last: pendingFile ? `📎 ${pendingFile.name}` : input, time: now, messages: [...c.messages, msg] }
      : c
    ));
    setInput(''); setPendingFile(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isImg = f.type.startsWith('image/');
    const size = f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} МБ` : `${Math.round(f.size / 1024)} КБ`;
    const attachment: FileAttachment = { name: f.name, size, type: isImg ? 'image' : 'doc', url: isImg ? URL.createObjectURL(f) : undefined };
    setPendingFile(attachment);
    e.target.value = '';
  };

  const addContact = () => {
    if (!newContact.name.trim()) return;
    const initials = newContact.name.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    setContacts((prev) => [...prev, { id: Date.now(), name: newContact.name.trim(), avatar: initials, color: COLORS[prev.length % COLORS.length], phone: newContact.phone, email: newContact.email, role: newContact.role, online: false }]);
    setNewContact({ name: '', phone: '', email: '', role: '' });
    setShowAddContact(false);
  };

  const createGroup = () => {
    if (!groupName.trim() || groupMembers.length < 2) return;
    const initials = groupName.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const newGroup: Chat = {
      id: Date.now(), name: groupName.trim(), avatar: initials, color: COLORS[chats.length % COLORS.length],
      status: `${groupMembers.length} участника`, last: 'Группа создана', time: 'только что',
      unread: 0, online: false, isGroup: true, members: groupMembers,
      messages: [{ id: 1, text: `Группа «${groupName}» создана`, time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }), mine: true }],
    };
    setChats((prev) => [newGroup, ...prev]);
    setActiveId(newGroup.id);
    setActiveNav('chats');
    setGroupName(''); setGroupMembers([]);
    setShowCreateGroup(false);
  };

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null);
  };

  const filtered = chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(contactSearch.toLowerCase())
  );
  const grouped = filteredContacts.reduce<Record<string, Contact[]>>((acc, c) => {
    const l = c.name[0].toUpperCase(); if (!acc[l]) acc[l] = []; acc[l].push(c); return acc;
  }, {});

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen w-full bg-secondary/40 text-foreground antialiased">

      {/* ── Rail ── */}
      <nav className="flex w-[76px] flex-col items-center gap-2 border-r border-border bg-card py-6">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Icon name="Send" size={20} />
        </div>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setActiveNav(item.id)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${activeNav === item.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
            <Icon name={item.icon} size={22} />
          </button>
        ))}
        <button className="mt-auto flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground hover:bg-secondary">
          <Icon name="LogOut" size={20} />
        </button>
      </nav>

      {/* ── Sidebar ── */}
      <aside className="flex w-[320px] shrink-0 flex-col border-r border-border bg-card">
        <header className="flex items-center justify-between px-6 pb-3 pt-7">
          <h1 className="text-[24px] font-bold tracking-tight">
            {activeNav === 'contacts' ? 'Контакты' : 'Сообщения'}
          </h1>
          <div className="flex items-center gap-1">
            {installPrompt && (
              <button onClick={install} className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:scale-105 transition-transform">
                <Icon name="Download" size={14} /> Установить
              </button>
            )}
            {activeNav === 'chats' && (
              <button onClick={() => setShowCreateGroup(true)} title="Создать группу"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors">
                <Icon name="UsersRound" size={20} />
              </button>
            )}
            {activeNav === 'contacts' && (
              <button onClick={() => setShowAddContact(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors">
                <Icon name="UserPlus" size={20} />
              </button>
            )}
          </div>
        </header>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
            <Icon name="Search" size={16} className="text-muted-foreground" />
            <input
              value={activeNav === 'contacts' ? contactSearch : search}
              onChange={(e) => activeNav === 'contacts' ? setContactSearch(e.target.value) : setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
          {activeNav === 'chats' && filtered.map((chat) => (
            <button key={chat.id} onClick={() => setActiveId(chat.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${activeId === chat.id ? 'bg-accent' : 'hover:bg-secondary'}`}>
              <div className="relative shrink-0">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold ${chat.color}`}>
                  {chat.isGroup ? <Icon name="Users" size={20} /> : chat.avatar}
                </div>
                {chat.online && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-emerald-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="truncate font-semibold">{chat.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
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

          {activeNav === 'contacts' && Object.keys(grouped).sort().map((letter) => (
            <div key={letter}>
              <div className="mb-1 mt-3 px-2 text-xs font-semibold text-muted-foreground">{letter}</div>
              {grouped[letter].map((c) => (
                <button key={c.id} onClick={() => setSelectedContact(c)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${selectedContact?.id === c.id ? 'bg-accent' : 'hover:bg-secondary'}`}>
                  <div className="relative shrink-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${c.color}`}>{c.avatar}</div>
                    {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-sm">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main className="flex flex-1 flex-col bg-background overflow-hidden">

        {/* CONTACTS detail */}
        {activeNav === 'contacts' && (
          <div className="flex flex-1 items-center justify-center p-10">
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
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> в сети
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-6 flex justify-center gap-3">
                  <button onClick={() => { setActiveNav('chats'); const ch = chats.find((c) => c.name === selectedContact.name); if (ch) setActiveId(ch.id); }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground hover:scale-105 transition-transform">
                    <Icon name="MessageCircle" size={20} />
                  </button>
                  <button onClick={() => startCall('voice')}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground hover:scale-105 transition-transform">
                    <Icon name="Phone" size={20} />
                  </button>
                  <button onClick={() => startCall('video')}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground hover:scale-105 transition-transform">
                    <Icon name="Video" size={20} />
                  </button>
                  <button onClick={() => { setContacts((p) => p.filter((c) => c.id !== selectedContact.id)); setSelectedContact(null); }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 hover:scale-105 transition-transform">
                    <Icon name="Trash2" size={20} />
                  </button>
                </div>
                <div className="space-y-3 rounded-3xl bg-secondary p-5">
                  {selectedContact.phone && <div className="flex items-center gap-3"><Icon name="Phone" size={15} className="text-muted-foreground" /><span className="text-sm">{selectedContact.phone}</span></div>}
                  {selectedContact.email && <div className="flex items-center gap-3"><Icon name="Mail"  size={15} className="text-muted-foreground" /><span className="text-sm">{selectedContact.email}</span></div>}
                  {selectedContact.role  && <div className="flex items-center gap-3"><Icon name="Briefcase" size={15} className="text-muted-foreground" /><span className="text-sm">{selectedContact.role}</span></div>}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Выберите контакт</p>
              </div>
            )}
          </div>
        )}

        {/* CHAT */}
        {activeNav === 'chats' && activeChat && <>
          {/* header */}
          <header className="flex items-center justify-between border-b border-border px-7 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold ${activeChat.color}`}>
                {activeChat.isGroup ? <Icon name="Users" size={18} /> : activeChat.avatar}
              </div>
              <div>
                <div className="font-semibold leading-tight">{activeChat.name}</div>
                <div className={`text-xs ${activeChat.online ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  {activeChat.isGroup ? activeChat.members?.join(', ') : activeChat.status}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!activeChat.isGroup && <>
                <button onClick={() => startCall('voice')} className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                  <Icon name="Phone" size={20} />
                </button>
                <button onClick={() => startCall('video')} className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary transition-colors">
                  <Icon name="Video" size={20} />
                </button>
              </>}
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors">
                <Icon name="Search" size={20} />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors">
                <Icon name="MoreVertical" size={20} />
              </button>
            </div>
          </header>

          {/* messages */}
          <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-2.5 overflow-y-auto px-7 py-6">
            {activeChat.messages.map((m) => (
              <div key={m.id} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[60%] rounded-3xl px-4 py-2.5 animate-message-in ${m.mine ? 'rounded-br-lg bg-primary text-primary-foreground' : 'rounded-bl-lg bg-card shadow-sm'}`}>
                  {m.file && m.file.type === 'image' && m.file.url && (
                    <img src={m.file.url} alt={m.file.name} className="mb-2 max-h-48 w-full rounded-2xl object-cover" />
                  )}
                  {m.file && m.file.type === 'doc' && (
                    <div className={`mb-2 flex items-center gap-2 rounded-xl p-2.5 ${m.mine ? 'bg-white/15' : 'bg-secondary'}`}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon name="FileText" size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-medium ${m.mine ? 'text-primary-foreground' : ''}`}>{m.file.name}</div>
                        <div className={`text-xs ${m.mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.file.size}</div>
                      </div>
                      <Icon name="Download" size={16} className={m.mine ? 'text-primary-foreground/70 shrink-0' : 'text-muted-foreground shrink-0'} />
                    </div>
                  )}
                  {m.text && <p className="text-[15px] leading-snug">{m.text}</p>}
                  <span className={`mt-0.5 block text-right text-[11px] ${m.mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* pending file preview */}
          {pendingFile && (
            <div className="mx-7 mb-2 flex items-center gap-3 rounded-2xl border border-border bg-secondary px-4 py-3">
              {pendingFile.type === 'image' && pendingFile.url
                ? <img src={pendingFile.url} className="h-10 w-10 rounded-lg object-cover" alt="" />
                : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon name="FileText" size={18} /></div>
              }
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{pendingFile.name}</div>
                <div className="text-xs text-muted-foreground">{pendingFile.size}</div>
              </div>
              <button onClick={() => setPendingFile(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Icon name="X" size={18} />
              </button>
            </div>
          )}

          {/* input */}
          <footer className="border-t border-border px-7 py-4 shrink-0">
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChange} />
              <button onClick={() => fileInputRef.current?.click()}
                className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors">
                <Icon name="Paperclip" size={20} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Напишите сообщение..."
                className="h-11 flex-1 rounded-full bg-secondary px-5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/30"
              />
              <button onClick={send}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95">
                <Icon name="Send" size={18} />
              </button>
            </div>
          </footer>
        </>}

        {/* ── Profile ── */}
        {activeNav === 'profile' && <ProfilePanel />}

        {/* ── Settings ── */}
        {activeNav === 'settings' && <SettingsPanel />}
      </main>

      {/* ── Voice call overlay ── */}
      {callMode === 'voice' && (
        <div className="fixed inset-0 z-50 flex animate-fade-in flex-col items-center justify-center bg-background/95 backdrop-blur-xl">
          <div className="relative mb-8">
            <span className={`absolute inset-0 animate-pulse-ring rounded-full ${activeChat?.color ?? 'bg-blue-100'}`} />
            <div className={`relative flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold ${activeChat?.color ?? 'bg-blue-100'}`}>
              {activeChat?.avatar ?? '?'}
            </div>
          </div>
          <h2 className="text-2xl font-bold">{activeChat?.name ?? 'Вызов'}</h2>
          <p className="mt-2 text-muted-foreground">{fmtCall(callSeconds)} · голосовой вызов</p>
          <div className="mt-10 flex items-center gap-4">
            <button onClick={() => setMicMuted((p) => !p)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${micMuted ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground hover:bg-muted'}`}>
              <Icon name={micMuted ? 'MicOff' : 'Mic'} size={22} />
            </button>
            <button onClick={endCall}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-transform hover:scale-105 active:scale-95">
              <Icon name="PhoneOff" size={26} />
            </button>
            <button onClick={() => setSpeakerOff((p) => !p)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${speakerOff ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-foreground hover:bg-muted'}`}>
              <Icon name={speakerOff ? 'VolumeX' : 'Volume2'} size={22} />
            </button>
          </div>
        </div>
      )}

      {/* ── Video call overlay ── */}
      {callMode === 'video' && (
        <div className="fixed inset-0 z-50 flex animate-fade-in flex-col bg-zinc-950 text-white">
          {/* video area */}
          <div className="relative flex-1 overflow-hidden">
            {camOff ? (
              <div className="flex h-full items-center justify-center">
                <div className={`flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold ${activeChat?.color ?? 'bg-blue-100'}`}>
                  {activeChat?.avatar ?? '?'}
                </div>
              </div>
            ) : (
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover scale-x-[-1]" />
            )}
            {/* pip self */}
            <div className="absolute right-4 top-4 h-28 w-20 overflow-hidden rounded-2xl bg-zinc-800 border border-zinc-700">
              <div className="flex h-full items-center justify-center text-zinc-400 text-xs">Вы</div>
            </div>
            {/* caller name */}
            <div className="absolute left-0 right-0 top-4 text-center">
              <p className="text-sm font-semibold text-white/80">{activeChat?.name}</p>
              <p className="text-xs text-white/50">{fmtCall(callSeconds)} · видеовызов</p>
            </div>
          </div>
          {/* controls */}
          <div className="flex items-center justify-center gap-4 bg-zinc-900/80 py-6 backdrop-blur">
            <button onClick={() => setMicMuted((p) => !p)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${micMuted ? 'bg-destructive/80 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
              <Icon name={micMuted ? 'MicOff' : 'Mic'} size={22} />
            </button>
            <button onClick={() => setCamOff((p) => !p)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${camOff ? 'bg-destructive/80 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
              <Icon name={camOff ? 'VideoOff' : 'Video'} size={22} />
            </button>
            <button onClick={endCall}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white transition-transform hover:scale-105 active:scale-95">
              <Icon name="PhoneOff" size={26} />
            </button>
            <button onClick={() => setFrontCam((p) => !p)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors">
              <Icon name="RefreshCw" size={22} />
            </button>
            <button onClick={() => setSpeakerOff((p) => !p)}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${speakerOff ? 'bg-destructive/80 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
              <Icon name={speakerOff ? 'VolumeX' : 'Volume2'} size={22} />
            </button>
          </div>
        </div>
      )}

      {/* ── Create group modal ── */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={() => setShowCreateGroup(false)}>
          <div className="animate-fade-in w-full max-w-md rounded-3xl bg-card p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-5 text-lg font-bold">Новая группа</h3>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Название группы *</label>
              <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5">
                <Icon name="UsersRound" size={15} className="text-muted-foreground shrink-0" />
                <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Например: Команда проекта"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              </div>
            </div>
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Участники (выберите минимум 2)</label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
                {contacts.map((c) => {
                  const selected = groupMembers.includes(c.name);
                  return (
                    <button key={c.id}
                      onClick={() => setGroupMembers((p) => selected ? p.filter((n) => n !== c.name) : [...p, c.name])}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors ${selected ? 'bg-accent' : 'hover:bg-secondary'}`}>
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${c.color}`}>{c.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.role}</div>
                      </div>
                      {selected && <Icon name="Check" size={16} className="text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
              {groupMembers.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">Выбрано: {groupMembers.join(', ')}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCreateGroup(false)} className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
              <button onClick={createGroup} disabled={!groupName.trim() || groupMembers.length < 2}
                className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100">
                Создать группу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add contact modal ── */}
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
                    <input value={newContact[key as keyof typeof newContact]}
                      onChange={(e) => setNewContact((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowAddContact(false)} className="flex-1 rounded-2xl bg-secondary py-2.5 text-sm font-medium hover:bg-muted transition-colors">Отмена</button>
              <button onClick={addContact} className="flex-1 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform active:scale-95">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;