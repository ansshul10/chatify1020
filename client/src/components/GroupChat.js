import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUsers, FaArrowLeft, FaEllipsisV, FaSun, FaMoon, FaSignOutAlt, FaUserPlus, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import MessageActions from './MessageActions';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const GroupChat = () => {
  const navigate = useNavigate();
  const [groupMessages, setGroupMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [menuMessageId, setMenuMessageId] = useState(null);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupCategory, setGroupCategory] = useState('other');
  const [isPublic, setIsPublic] = useState(false);
  const isAnonymous = !!localStorage.getItem('anonymousId');
  const userId = isAnonymous ? localStorage.getItem('anonymousId') : JSON.parse(localStorage.getItem('user'))?.id;
  const username = isAnonymous ? localStorage.getItem('anonymousUsername') : JSON.parse(localStorage.getItem('user'))?.username;
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  const longPressTimer = useRef(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    if (!userId || !username) {
      window.location.href = '/';
      return;
    }

    socket.emit('join', userId);
    fetchGroups();
    fetchPublicGroups();

    socket.on('loadGroupMessages', (groupMsgs) => {
      const normalizedGroupId = groupMsgs.groupId.toString();
      setGroupMessages((prev) => ({
        ...prev,
        [normalizedGroupId]: groupMsgs.messages || [],
      }));
    });

    socket.on('receiveGroupMessage', (message) => {
      const normalizedGroupId = message.groupId.toString();
      setGroupMessages((prev) => ({
        ...prev,
        [normalizedGroupId]: [...(prev[normalizedGroupId] || []), message],
      }));
    });

    socket.on('groupMessageEdited', ({ groupId, messageId, content, edited }) => {
      setGroupMessages((prev) => ({
        ...prev,
        [groupId]: prev[groupId].map((msg) =>
          msg._id === messageId ? { ...msg, content, edited } : msg
        ),
      }));
    });

    socket.on('groupMessageDeleted', ({ groupId, messageId }) => {
      setGroupMessages((prev) => ({
        ...prev,
        [groupId]: prev[groupId].filter((msg) => msg._id !== messageId),
      }));
    });

    socket.on('groupUpdate', (updatedGroup) => {
      setGroups((prev) => prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
      setPublicGroups((prev) => prev.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
    });

    socket.on('userListUpdate', (onlineUsers) => {
      setUsers(onlineUsers);
    });

    socket.on('reactionUpdate', ({ messageId, reactions }) => {
      setGroupMessages((prev) => {
        const groupId = Object.keys(prev).find((gid) =>
          prev[gid].some((msg) => msg._id === messageId)
        );
        if (groupId) {
          return {
            ...prev,
            [groupId]: prev[groupId].map((msg) =>
              msg._id === messageId ? { ...msg, reactions } : msg
            ),
          };
        }
        return prev;
      });
    });

    socket.on('error', ({ msg }) => {
      setError(msg);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('actionResponse', ({ type, success, msg }) => {
      setError(success ? '' : msg);
      setTimeout(() => setError(''), 3000);
      if (success) {
        if (type === 'leaveGroup') {
          setGroups((prev) => prev.filter((g) => g._id !== selectedGroupId));
          setSelectedGroupId(null);
        } else if (type === 'deleteGroup') {
          setGroups((prev) => prev.filter((g) => g._id !== selectedGroupId));
          setPublicGroups((prev) => prev.filter((g) => g._id !== selectedGroupId));
          setSelectedGroupId(null);
          navigate('/group-chat');
        }
      }
      setIsDropdownOpen(false);
    });

    window.history.pushState({ page: 'groupchat' }, null, window.location.pathname);
    const handlePopState = (event) => {
      event.preventDefault();
      if (selectedGroupId) {
        setSelectedGroupId(null);
        window.history.pushState({ page: 'grouplist' }, null, window.location.pathname);
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      socket.off('loadGroupMessages');
      socket.off('receiveGroupMessage');
      socket.off('groupMessageEdited');
      socket.off('groupMessageDeleted');
      socket.off('groupUpdate');
      socket.off('userListUpdate');
      socket.off('reactionUpdate');
      socket.off('error');
      socket.off('actionResponse');
      window.removeEventListener('popstate', handlePopState);
    };
  }, [userId, username, isAnonymous, navigate]);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/group/my-groups`, {
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data || []);
    } catch (err) {
      setError('Failed to load your groups');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchPublicGroups = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/group/public`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch public groups');
      const data = await response.json();
      setPublicGroups(data || []);
    } catch (err) {
      setError('Failed to load public groups');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to join a group');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/group/${groupId}/add-member`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error('Failed to join group');
      const updatedGroup = await response.json();
      setGroups((prev) => [...prev, updatedGroup]);
      setPublicGroups((prev) => prev.filter((g) => g._id !== groupId));
      setSelectedGroupId(groupId.toString());
      navigate('/group-chat', { state: { groupId: groupId.toString() } });
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError('Group name is required');
      setTimeout(() => setError(''), 3000);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to create a group');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/group/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name: groupName, category: groupCategory, isPublic }),
      });
      if (!response.ok) throw new Error('Failed to create group');
      const group = await response.json();
      setIsCreateGroupModalOpen(false);
      setGroupName('');
      setGroupCategory('other');
      setIsPublic(false);
      fetchGroups();
      setSelectedGroupId(group._id.toString());
      navigate('/group-chat', { state: { groupId: group._id.toString() } });
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    if (selectedGroupId) {
      socket.emit('joinGroup', { groupId: selectedGroupId, userId });
    }
  }, [selectedGroupId, userId]);

  useEffect(() => {
    if (selectedGroupId && groupMessages[selectedGroupId]?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedGroupId, groupMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedGroupId) {
      setError('Please type a message and select a group');
      setTimeout(() => setError(''), 3000);
      return;
    }
    const messageData = { groupId: selectedGroupId, userId, content: newMessage, sender: userId, createdAt: new Date() };
    socket.emit('sendGroupMessage', messageData);
    setNewMessage('');
  };

  const handleTyping = (e) => setNewMessage(e.target.value);

  const handleDoubleClick = (messageId) => {
    setActiveMessageId(activeMessageId === messageId ? null : messageId);
    setMenuMessageId(null);
  };

  const handleLongPressStart = (messageId, isSender) => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      if (isSender) setMenuMessageId((prev) => (prev === messageId ? null : messageId));
      else setActiveMessageId(messageId);
    }, 500);
  };

  const handleLongPressEnd = () => clearTimeout(longPressTimer.current);

  const handleHoverStart = (messageId) => {
    clearTimeout(hoverTimeout.current);
    setMenuMessageId(messageId);
  };

  const handleHoverEnd = () => {
    hoverTimeout.current = setTimeout(() => setMenuMessageId(null), 1500);
  };

  const handleBackToGroupList = () => {
    setSelectedGroupId(null);
    navigate('/group-chat');
  };

  const handleLeaveGroup = () => {
    if (!selectedGroupId) return;
    socket.emit('leaveGroup', { groupId: selectedGroupId, userId });
  };

  const handleDeleteGroup = () => {
    if (!selectedGroupId) return;
    socket.emit('deleteGroup', { groupId: selectedGroupId, userId });
  };

  const getUsername = (id) => {
    if (id === userId) return username;
    const user = users.find((u) => u.id === id);
    return user ? user.username : 'Unknown';
  };

  const getGroupName = (id) => {
    const group = groups.find((g) => g._id === id) || publicGroups.find((g) => g._id === id);
    return group ? group.name : 'Unknown Group';
  };

  const isCreator = () => {
    const group = groups.find((g) => g._id === selectedGroupId);
    return group && group.creator.toString() === userId;
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } };
  const chatVariants = { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
  const messageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
  const dropdownVariants = { hidden: { opacity: 0, scale: 0.8, y: -10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, type: 'spring', stiffness: 200, damping: 15 } } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } } };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full z-10 pt-16"><Navbar /></div>
      <div className="w-full flex-grow flex flex-col h-[100vh]">
        <AnimatePresence>
          {!selectedGroupId && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full h-[94vh] flex flex-col overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Your Groups</h2>
                  {!isAnonymous && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreateGroupModalOpen(true)}
                      className={`${isDarkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'} text-white p-2 rounded-lg flex items-center space-x-2`}
                    >
                      <FaPlus />
                      <span>Create Group</span>
                    </motion.button>
                  )}
                </div>
                {groups.length === 0 ? (
                  <p className="text-gray-400 mb-4">No groups yet. Create or join one!</p>
                ) : (
                  groups.map((group) => (
                    <motion.div 
                      key={group._id} 
                      whileHover={{ scale: 1.02 }} 
                      onClick={() => {
                        setSelectedGroupId(group._id.toString());
                        navigate('/group-chat', { state: { groupId: group._id.toString() } });
                      }} 
                      className={`p-2 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} mb-2`}
                    >
                      <FaUsers className="inline mr-2" /> {group.name} ({group.category})
                    </motion.div>
                  ))
                )}

                <h2 className="text-lg font-semibold mb-2 mt-4">Public Groups</h2>
                {publicGroups.length === 0 ? (
                  <p className="text-gray-400">No public groups available.</p>
                ) : (
                  publicGroups
                    .filter((pg) => !groups.some((g) => g._id === pg._id))
                    .map((group) => (
                      <motion.div 
                        key={group._id} 
                        whileHover={{ scale: 1.02 }} 
                        className={`p-2 rounded-lg flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} mb-2`}
                      >
                        <span 
                          onClick={() => {
                            setSelectedGroupId(group._id.toString());
                            navigate('/group-chat', { state: { groupId: group._id.toString() } });
                          }} 
                          className="cursor-pointer"
                        >
                          <FaUsers className="inline mr-2" /> {group.name} ({group.category})
                        </span>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.95 }} 
                          onClick={() => handleJoinGroup(group._id)} 
                          className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-400'}`}
                        >
                          <FaUserPlus />
                        </motion.button>
                      </motion.div>
                    ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedGroupId && (
            <motion.div variants={chatVariants} initial="hidden" animate="visible" exit="hidden" className={`flex flex-col flex-grow ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-200 border-gray-400'}`}>
              <div className={`flex items-center justify-between border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-400'} p-4`}>
                <div className="flex items-center space-x-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={handleBackToGroupList} 
                    className={`${isDarkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
                  >
                    <FaArrowLeft className="text-xl sm:text-2xl" />
                  </motion.button>
                  <FaUsers className="text-blue-500 text-xl" />
                  <span className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    Group: <span className="text-red-400">{getGroupName(selectedGroupId)}</span>
                  </span>
                </div>
                <div className="relative flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)} 
                      className={`p-2 rounded-full ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-300'}`}
                    >
                      {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
                    </button>
                  </motion.div>
                  {!isAnonymous && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className={`${isDarkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <FaEllipsisV className="text-xl" />
                    </motion.button>
                  )}
                  <AnimatePresence>
                    {isDropdownOpen && !isAnonymous && (
                      <motion.div 
                        initial="hidden" 
                        animate="visible" 
                        exit="hidden" 
                        variants={dropdownVariants} 
                        className={`absolute right-4 top-12 w-52 ${isDarkMode ? 'bg-black border-gray-600' : 'bg-gray-200 border-gray-400'} border rounded-lg shadow-2xl p-3 z-10`}
                      >
                        <motion.div 
                          whileHover={{ backgroundColor: isDarkMode ? '#1F2937' : '#e5e7eb', scale: 1.05 }} 
                          onClick={handleLeaveGroup} 
                          className={`flex items-center space-x-2 p-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'} cursor-pointer rounded-md`}
                        >
                          <FaSignOutAlt /><span>Leave Group</span>
                        </motion.div>
                        {isCreator() && (
                          <motion.div 
                            whileHover={{ backgroundColor: isDarkMode ? '#1F2937' : '#e5e7eb', scale: 1.05 }} 
                            onClick={handleDeleteGroup} 
                            className={`flex items-center space-x-2 p-2 text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'} cursor-pointer rounded-md`}
                          >
                            <FaTrash /><span>Delete Group</span>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className={`flex-grow overflow-y-auto space-y-4 px-4 pt-6 scrollbar-thin ${isDarkMode ? 'scrollbar-thumb-red-500 scrollbar-track-gray-800' : 'scrollbar-thumb-red-400 scrollbar-track-gray-300'}`}>
                <AnimatePresence>
                  {(!groupMessages[selectedGroupId] || groupMessages[selectedGroupId].length === 0) && !error && (
                    <motion.p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center text-sm sm:text-base`}>
                      No messages yet. Start chatting! 💬
                    </motion.p>
                  )}
                  {groupMessages[selectedGroupId]?.map((msg) => (
                    <motion.div 
                      key={msg._id} 
                      variants={messageVariants} 
                      initial="hidden" 
                      animate="visible" 
                      exit="hidden" 
                      className={`flex ${msg.sender.toString() === userId ? 'justify-end' : 'justify-start'} relative`}
                      onDoubleClick={() => handleDoubleClick(msg._id)}
                    >
                      <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md p-3 rounded-lg shadow-md ${msg.sender.toString() === userId ? (isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-900') : (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-400 text-gray-800')}`}>
                        <p 
                          className="text-sm sm:text-base" 
                          onMouseEnter={msg.sender.toString() === userId ? () => handleHoverStart(msg._id) : null} 
                          onMouseLeave={msg.sender.toString() === userId ? handleHoverEnd : null} 
                          onTouchStart={msg.sender.toString() === userId ? () => handleLongPressStart(msg._id, true) : () => handleLongPressStart(msg._id, false)} 
                          onTouchEnd={handleLongPressEnd} 
                          onTouchMove={handleLongPressEnd}
                        >
                          <span className="font-bold">{getUsername(msg.sender)}:</span> {msg.content} {msg.edited && <span className="text-xs text-gray-400">(edited)</span>}
                        </p>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} block mt-1`}>
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                        <MessageActions 
                          messageId={msg._id} 
                          content={msg.content} 
                          setMessages={setGroupMessages} 
                          reactions={msg.reactions || {}} 
                          showReactions={activeMessageId === msg._id} 
                          isSender={msg.sender.toString() === userId} 
                          showMenu={menuMessageId === msg._id} 
                          userId={userId} 
                          context="group" 
                          groupId={selectedGroupId}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 flex flex-col space-y-2">
                {error && (
                  <p className={`text-red-400 text-center text-sm sm:text-base ${isDarkMode ? 'bg-red-900' : 'bg-red-200'} bg-opacity-20 p-2 rounded`}>
                    {error} ⚠️
                  </p>
                )}
              </div>

              <form onSubmit={handleSendMessage} className={`flex items-center p-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-400'} gap-2`}>
                <motion.div className={`flex-grow flex items-center border ${isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-400 bg-gray-100'} rounded-lg p-2 sm:p-3`}>
                  <input 
                    ref={messageInputRef} 
                    type="text" 
                    value={newMessage} 
                    onChange={handleTyping} 
                    placeholder="Type a message..." 
                    className={`w-full bg-transparent ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-sm sm:text-base focus:outline-none`} 
                  />
                </motion.div>
                <motion.button 
                  type="submit" 
                  className={`${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} p-2 sm:p-3 rounded-lg shadow-lg`} 
                  disabled={!newMessage.trim()}
                >
                  <FaPaperPlane className="text-lg sm:text-xl" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateGroupModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
              onClick={() => setIsCreateGroupModalOpen(false)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`p-6 rounded-xl w-full max-w-md mx-4 shadow-2xl ${isDarkMode ? 'bg-[#1A1A1A] text-white border-gray-700' : 'bg-gray-100 text-black border-gray-300'} border`}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
                <form onSubmit={handleCreateGroup} className="space-y-5">
                  <div>
                    <label className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Group Name</label>
                    <input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className={`w-full p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-500' : 'bg-white text-black placeholder-gray-400'} shadow-inner`}
                      placeholder="Enter group name"
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category</label>
                    <select
                      value={groupCategory}
                      onChange={(e) => setGroupCategory(e.target.value)}
                      className={`w-full p-3 mt-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} shadow-inner`}
                    >
                      <option value="dance">Dance</option>
                      <option value="sport">Sport</option>
                      <option value="movie">Movie</option>
                      <option value="music">Music</option>
                      <option value="gaming">Gaming</option>
                      <option value="tech">Tech</option>
                      <option value="social">Social</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      className="form-checkbox text-red-400 h-5 w-5"
                    />
                    <label className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Make Public</label>
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-red-400 text-sm text-center ${isDarkMode ? 'bg-red-900' : 'bg-red-200'} bg-opacity-20 p-2 rounded`}
                    >
                      {error} ⚠️
                    </motion.p>
                  )}
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCreateGroupModalOpen(false)}
                      className={`px-5 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-300 text-black'} shadow-md`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05, backgroundColor: isDarkMode ? '#DC2626' : '#F87171' }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-5 py-2 rounded-lg ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'} shadow-md`}
                    >
                      Create
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default GroupChat;