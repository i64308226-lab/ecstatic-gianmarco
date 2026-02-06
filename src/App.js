import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [viewMode, setViewMode] = useState("chats");
  const [serverStatus, setServerStatus] = useState("online");
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Загрузка данных при запуске
  useEffect(() => {
    const savedUsers = localStorage.getItem("messenger_users");
    const savedMessages = localStorage.getItem("messenger_messages");
    const savedGroups = localStorage.getItem("messenger_groups");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  // Сохранение данных при изменении
  useEffect(() => {
    localStorage.setItem("messenger_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("messenger_messages", JSON.stringify(messages));
  }, [messages]);

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Рабочая группа",
      type: "group",
      members: [1, 2, 3],
      avatar: "https://placehold.co/48x48/F59E0B/FFFFFF?text =РГ",
      lastMessage: "Напоминаю о встрече",
      time: "Вчера",
      unread: 0,
    },
    {
      id: 2,
      name: "Личные беседы",
      type: "channel",
      members: [1, 2, 3],
      avatar: "https://placehold.co/48x48/10B981/FFFFFF?text =ЛБ",
      lastMessage: "Привет!",
      time: "10:30",
      unread: 0,
    },
  ]);

  useEffect(() => {
    localStorage.setItem("messenger_groups", JSON.stringify(groups));
  }, [groups]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRegister = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const handleLogin = (email, password) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser) {
      const message = {
        id: Date.now(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: newMessage,
        timestamp: new Date().toISOString(),
        avatar:
          currentUser.avatar ||
          `https://placehold.co/40x40/4F46E5/FFFFFF?text= ${currentUser.name.charAt(
            0
          )}`,
      };

      setMessages([...messages, message]);
      setNewMessage("");

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply = {
          id: Date.now() + 1,
          senderId: 1,
          senderName: "Администратор",
          content: "Понял, спасибо!",
          timestamp: new Date().toISOString(),
          avatar: "https://placehold.co/40x40/10B981/FFFFFF?text =АД",
        };
        setMessages((prev) => [...prev, reply]);
      }, 2000);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredChats = [
    {
      id: 1,
      name: "Администратор",
      avatar: "https://placehold.co/40x40/10B981/FFFFFF?text =АД",
      lastMessage: "Добро пожаловать!",
      time: "Сейчас",
      unread: 0,
      online: true,
    },
  ];

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const newGroup = {
        id: Date.now(),
        name: groupName,
        type: "group",
        members: [currentUser.id, ...selectedUsers],
        avatar: `https://placehold.co/48x48/4F46E5/FFFFFF?text= ${groupName.charAt(
          0
        )}`,
        lastMessage: "Создана группа",
        time: "Только что",
        unread: 0,
      };

      setGroups([...groups, newGroup]);
      setGroupName("");
      setSelectedUsers([]);
      setShowCreateGroup(false);
    }
  };

  // Форма регистрации/входа
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">6 Messenger</h1>
            <p className="text-gray-600 mt-2">Войдите или зарегистрируйтесь</p>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLogin
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors mt-2 ${
                !isLogin
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Регистрация
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const email = formData.get("email");
                  const password = formData.get("password");
                  if (handleLogin(email, password)) {
                    // Успешный вход
                  } else {
                    alert("Неверные данные");
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Войти
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const userData = {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    password: formData.get("password"),
                  };
                  handleRegister(userData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Зарегистрироваться
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                {isLogin ? "Зарегистрироваться" : "Войти"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Основной интерфейс чата
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">6 Messenger</h1>
            <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === "online" ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs">{serverStatus}</span>
              </div>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-2.572 1.065c-.94 1.543-3.31.826-2.37 2.37a1.724 1.724 0 00-1.065 2.572c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.065c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 002.572-1.065c.94-1.543 3.31-.826 2.37-2.37a1.724 1.724 0 001.065-2.572z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 mb-3">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400"
                  : "bg-yellow-400"
              }`}
            ></div>
            <span className="text-xs">
              {connectionStatus === "connected"
                ? "Подключено к серверу"
                : "Подключение..."}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setViewMode("chats")}
            className={`flex-1 py-3 text-sm font-medium ${
              viewMode === "chats"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Чаты
          </button>
          <button
            onClick={() => setViewMode("groups")}
            className={`flex-1 py-3 text-sm font-medium ${
              viewMode === "groups"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Группы
          </button>
        </div>

        {/* Chat/List */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "chats" ? (
            <>
              {filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeChat === index
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => setActiveChat(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {chat.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100">
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="w-full flex items-center justify-center space-x-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Создать группу</span>
                </button>
              </div>

              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    activeChat === index
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => setActiveChat(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {group.type === "group" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {group.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {group.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {group.lastMessage}
                        </p>
                        {group.unread > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                            {group.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={
                viewMode === "chats"
                  ? filteredChats[activeChat]?.avatar
                  : groups[activeChat]?.avatar
              }
              alt={
                viewMode === "chats"
                  ? filteredChats[activeChat]?.name
                  : groups[activeChat]?.name
              }
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-900">
                {viewMode === "chats"
                  ? filteredChats[activeChat]?.name
                  : groups[activeChat]?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {viewMode === "chats"
                  ? filteredChats[activeChat]?.online
                    ? "В сети"
                    : "Не в сети"
                  : `${groups[activeChat]?.members?.length || 0} участников`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    message.senderId === currentUser.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-xs lg:max-w-md ${
                      message.senderId === currentUser.id
                        ? "flex-row-reverse"
                        : "flex-row"
                    } items-end space-x-2`}
                  >
                    <img
                      src={message.avatar}
                      alt={message.senderName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        message.senderId === currentUser.id
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === currentUser.id
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-end space-x-2">
                  <img
                    src={
                      viewMode === "chats"
                        ? filteredChats[activeChat]?.avatar
                        : groups[activeChat]?.avatar
                    }
                    alt={
                      viewMode === "chats"
                        ? filteredChats[activeChat]?.name
                        : groups[activeChat]?.name
                    }
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3"
          >
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Настройки</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Профиль</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={
                      currentUser.avatar ||
                      `https://placehold.co/60x60/4F46E5/FFFFFF?text= ${currentUser.name.charAt(
                        0
                      )}`
                    }
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {currentUser.name}
                    </p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Состояние сервера
                </h3>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        serverStatus === "online"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">
                      {serverStatus === "online"
                        ? "Сервер онлайн"
                        : "Сервер офлайн"}
                    </span>
                  </div>
                  <button className="text-xs text-blue-500 hover:text-blue-600">
                    Переподключиться
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  Настройки уведомлений
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Уведомления</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Звук уведомлений</span>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Безопасность</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Изменить пароль
                  </button>
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Настройки приватности
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Создать группу
                </h2>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название группы
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Введите название группы"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите участников
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {users
                    .filter((u) => u.id !== currentUser.id)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter((id) => id !== user.id)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <img
                          src={
                            user.avatar ||
                            `https://placehold.co/32x32/4F46E5/FFFFFF?text= ${user.name.charAt(
                              0
                            )}`
                          }
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-700">{user.name}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedUsers.length === 0}
                  className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Создать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
