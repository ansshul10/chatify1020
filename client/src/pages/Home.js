import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import {
  FaUser,
  FaCheckCircle,
  FaComment,
  FaShieldAlt,
  FaRocket,
  FaGlobe,
  FaStar,
  FaEnvelope,
  FaQuestionCircle,
  FaArrowRight,
  FaSun,
  FaMoon,
  FaUsers,
  FaPaperPlane,
  FaHistory,
  FaUserSecret,
  FaUserPlus,
  FaBan,
  FaUserEdit,
  FaLock,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust path as needed

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Theme state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Signed-up user state
  const [isAnonymous, setIsAnonymous] = useState(false); // Anonymous user state
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const anonymousId = localStorage.getItem('anonymousId');

    if (token) {
      setIsAuthenticated(true);
      setIsAnonymous(false);
    } else if (anonymousId) {
      setIsAuthenticated(false);
      setIsAnonymous(true);
    } else {
      setIsAuthenticated(false);
      setIsAnonymous(false);
    }
  }, [navigate]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1, backgroundColor: isDarkMode ? '#1A1A1A' : '#d1d5db', transition: { duration: 0.3 } },
    tap: { scale: 0.95 },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
  };

  // Feature Data for Normal Home
  const features = [
    { icon: <FaComment className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Instant Messaging ⚡', desc: 'Chat in real-time with zero delays.' },
    { icon: <FaShieldAlt className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Top-Notch Security 🔒', desc: 'End-to-end encryption for privacy.' },
    { icon: <FaRocket className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Fast & Lightweight 🚀', desc: 'Sleek app for any device.' },
    { icon: <FaGlobe className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Global Connectivity 🌍', desc: 'Chat worldwide seamlessly.' },
  ];

  // Testimonial Data
  const testimonials = [
    { quote: 'Chatify’s anonymous mode is a game-changer!', author: 'Anonymous User' },
    { quote: 'Fast, secure, and intuitive—best app ever!', author: 'Jane D.' },
    { quote: 'Global chats with top privacy—love it!', author: 'Mark S.' },
  ];

  // FAQ Data
  const faqs = [
    { question: 'What is Chatify?', answer: 'A real-time, secure, and anonymous messaging platform.' },
    { question: 'Is my data safe?', answer: 'Yes, with end-to-end encryption.' },
    { question: 'Can I chat without signing up?', answer: 'Yes, via anonymous mode!' },
  ];

  // Chat Home Features for Signed-Up Users
  const chatHomeFeatures = [
    { icon: <FaPaperPlane className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Start a Chat', desc: 'Message instantly.', link: '/chat' },
    { icon: <FaUsers className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Join Groups', desc: 'Explore or create groups.', link: '/group-chat' },
    { icon: <FaHistory className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Recent Chats', desc: 'Resume your chats.', link: '/chat' },
  ];

  // Anonymous Home Features
  const anonymousHomeFeatures = [
    { icon: <FaPaperPlane className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Quick Chat', desc: 'Start messaging instantly.', link: '/chat' },
    { icon: <FaUsers className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Join Groups', desc: 'Explore public groups.', link: '/group-chat' },
    { icon: <FaUserSecret className="text-red-500 text-3xl mb-4 mx-auto" />, title: 'Stay Anonymous', desc: 'Chat incognito.', link: '/chat' },
  ];

  // Sign-Up Benefits Features
  const signUpBenefits = [
    { icon: <FaHistory className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Chat History', desc: 'Access past messages anytime.' },
    { icon: <FaUserPlus className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Friend Lists', desc: 'Build and manage contacts.' },
    { icon: <FaBan className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Block Users', desc: 'Control who you chat with.' },
    { icon: <FaUsers className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Create Groups', desc: 'Start your own communities.' },
    { icon: <FaUserEdit className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Custom Profile', desc: 'Personalize your identity.' },
    { icon: <FaLock className="text-green-500 text-3xl mb-4 mx-auto" />, title: 'Enhanced Security', desc: 'Extra privacy options.' },
  ];

  // Normal Home Page (Unauthenticated Users)
  const NormalHome = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16 flex-grow">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <motion.div variants={textVariants} className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 lg:space-y-8 px-4 sm:px-0">
          <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Chatify 🌟
          </h1>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-center lg:text-left max-w-xl`}>
            Discover seamless communication—connect instantly, chat anonymously, or join global communities in real-time.
          </p>
          <div className="space-y-4 sm:space-y-6">
            <motion.div whileHover={{ x: 10 }} className="flex items-center space-x-4 justify-center lg:justify-start">
              <FaCheckCircle className="text-red-500" />
              <span>Real-Time Messaging ⚡</span>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center space-x-4 justify-center lg:justify-start">
              <FaCheckCircle className="text-red-500" />
              <span>Anonymous Chat Option 🕵️‍♂️</span>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center space-x-4 justify-center lg:justify-start">
              <FaCheckCircle className="text-red-500" />
              <span>Secure & Private 🔒</span>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="flex items-center space-x-4 justify-center lg:justify-start">
              <FaCheckCircle className="text-red-500" />
              <span>Cross-Platform Sync 🌍</span>
            </motion.div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6">
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Link to="/login" className={`p-4 rounded-lg font-semibold shadow-lg flex items-center space-x-2 ${isDarkMode ? 'bg-[#1A1A1A] text-red-600' : 'bg-gray-300 text-red-500'}`}>
                <FaUser />
                <span>Login</span>
              </Link>
            </motion.div>
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Link to="/anonymous" className={`p-4 rounded-lg font-semibold shadow-lg flex items-center space-x-2 ${isDarkMode ? 'bg-[#1A1A1A] text-red-600' : 'bg-gray-300 text-red-500'}`}>
                <FaArrowRight />
                <span>Start Chatting Anonymously</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="w-full lg:w-1/2 flex items-center justify-center z-10">
          <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} perspective={1000} className="w-full max-w-lg">
            <div className={`p-6 sm:p-6 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(255,0,0,0.3),-10px_0_20px_rgba(255,0,0,0.3)] transform transition-all duration-300`}>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white hover:text-red-600' : 'text-gray-900 hover:text-red-500'} transition-colors duration-300`}>
                🚀 Launch Your Chat Now
              </h2>
              <ul className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-4`}>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>🎉 Instant chats with anyone!</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>🕵️‍♂️ Go incognito!</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>⚡ Lightning-fast!</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>🌍 Global reach.</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>🎨 Customize your vibe.</span></li>
              </ul>
            </div>
          </Tilt>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full flex flex-col items-center space-y-12 py-12">
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Why Choose Chatify? 🤔
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {features.map((feature, index) => (
            <Tilt key={index} tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onHoverStart={() => setActiveFeature(index)} onHoverEnd={() => setActiveFeature(null)} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-[#1A1A1A] border-gray-700' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(255,0,0,0.2),-10px_0_20px_rgba(255,0,0,0.2)] transition-all duration-300`}>
                {feature.icon}
                <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`text-center mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature.desc}</p>
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-sm mt-2 text-center">
                      Learn More →
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </Tilt>
          ))}
        </div>
        <section className="w-full flex flex-col items-center space-y-8 py-12">
          <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to Join the Chat Revolution? 🎉
          </motion.h2>
          <motion.p variants={textVariants} className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center max-w-xl`}>
            Connect, explore, or chat—Chatify has it all. Register now!
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
              <Link to="/signup" className={`p-4 rounded-lg font-semibold shadow-lg flex items-center space-x-2 ${isDarkMode ? 'bg-[#1A1A1A] text-red-600' : 'bg-gray-300 text-red-500'}`}>
                <FaUser />
                <span>Sign Up Now</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </section>

      {/* Testimonials Section */}
      <section className={`w-full flex flex-col items-center space-y-12 py-12 rounded-xl p-6 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-200'}`}>
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          What Our Users Say 💬
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={cardVariants} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-400'}`}>
              <FaStar className="text-yellow-400 text-2xl mb-4 mx-auto" />
              <p className={`text-center italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.quote}"</p>
              <p className="text-red-500 font-semibold text-center mt-4">— {testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full flex flex-col items-center space-y-12 py-12">
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Frequently Asked Questions ❓
        </motion.h2>
        <div className="w-full max-w-3xl space-y-6">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={cardVariants} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-[#1A1A1A] border-gray-700' : 'bg-gray-200 border-gray-400'}`}>
              <div className="flex items-center space-x-3">
                <FaQuestionCircle className="text-red-500 text-xl" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{faq.question}</h3>
              </div>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
        <motion.div whileHover={{ scale: 1.05 }} className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Link to="/contact" className="text-red-500 hover:underline flex items-center justify-center space-x-2">
            <FaEnvelope />
            <span>Have more questions? Contact us!</span>
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="w-full flex flex-col items-center space-y-12 py-12">
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Chatify Stats 📊
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <motion.div variants={cardVariants} className="text-center">
            <p className="text-4xl font-bold text-red-500">50K+</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Anonymous Users</p>
          </motion.div>
          <motion.div variants={cardVariants} className="text-center">
            <p className="text-4xl font-bold text-red-500">500K+</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Messages Sent</p>
          </motion.div>
          <motion.div variants={cardVariants} className="text-center">
            <p className="text-4xl font-bold text-red-500">99.9%</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Uptime</p>
          </motion.div>
          <motion.div variants={cardVariants} className="text-center">
            <p className="text-4xl font-bold text-red-500">40+</p>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Countries</p>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Chat Home Page (Signed-Up Users)
  const ChatHome = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16 flex-grow">
      <section className="flex flex-col items-center space-y-8">
        <motion.h1 variants={textVariants} className={`text-3xl sm:text-5xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome Back to Chatify! 👋
        </motion.h1>
        <motion.p variants={textVariants} className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center max-w-2xl`}>
          Jump into your chats, connect with friends, or explore groups—everything’s ready for you!
        </motion.p>
      </section>
      <section className="w-full flex flex-col items-center space-y-12">
        <motion.h2 variants={textVariants} className={`text-2xl sm:text-3xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Actions
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {chatHomeFeatures.map((feature, index) => (
            <Tilt key={index} tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => navigate(feature.link)} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-[#1A1A1A] border-gray-700' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(255,0,0,0.2),-10px_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 cursor-pointer`}>
                {feature.icon}
                <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`text-center mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>
      <section className="w-full flex flex-col items-center space-y-8">
        <motion.h2 variants={textVariants} className={`text-2xl sm:text-3xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Get Started
        </motion.h2>
        <motion.p variants={textVariants} className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center`}>
          Pick an action above to dive into your chats!
        </motion.p>
      </section>
    </div>
  );

  // Advanced Anonymous Home Page (Anonymous Users)
  const AnonymousHome = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16 flex-grow">
      {/* Welcome Section */}
      <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        <motion.div variants={textVariants} className="w-full lg:w-1/2 flex flex-col justify-center space-y-6 lg:space-y-8 px-4 sm:px-0">
          <h1 className={`text-3xl sm:text-5xl font-extrabold text-center lg:text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Hey, Anonymous Trailblazer! 🕵️‍♂️
          </h1>
          <p className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed text-center lg:text-left max-w-xl`}>
            You’re chatting incognito—total freedom, zero traces. Explore quick chats or join groups, all while staying under the radar.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} className="flex justify-center lg:justify-start">
            <Link to="/chat" className={`p-4 rounded-lg font-semibold shadow-lg flex items-center space-x-2 ${isDarkMode ? 'bg-[#1A1A1A] text-red-600' : 'bg-gray-300 text-red-500'}`}>
              <FaPaperPlane />
              <span>Start Chatting Now</span>
            </Link>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="w-full lg:w-1/2 flex items-center justify-center z-10">
          <Tilt tiltMaxAngleX={20} tiltMaxAngleY={20} perspective={1000} className="w-full max-w-lg">
            <div className={`p-6 rounded-xl shadow-2xl border ${isDarkMode ? 'bg-black border-gray-800' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(255,0,0,0.3),-10px_0_20px_rgba(255,0,0,0.3)] transform transition-all duration-300`}>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-6 text-center ${isDarkMode ? 'text-white hover:text-red-600' : 'text-gray-900 hover:text-red-500'} transition-colors duration-300`}>
                Your Anonymous Adventure 🚀
              </h2>
              <ul className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-4`}>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>Chat instantly, no strings attached.</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>Stay completely anonymous.</span></li>
                <li className="flex items-start space-x-2"><FaCheckCircle className="text-red-500 mt-1" /><span>Join global group chats.</span></li>
              </ul>
            </div>
          </Tilt>
        </motion.div>
      </section>

      {/* Current Features Section */}
      <section className="w-full flex flex-col items-center space-y-12 py-12">
        <motion.h2 variants={textVariants} className={`text-2xl sm:text-3xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          What You’ve Got Now
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {anonymousHomeFeatures.map((feature, index) => (
            <Tilt key={index} tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => navigate(feature.link)} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-[#1A1A1A] border-gray-700' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(255,0,0,0.2),-10px_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 cursor-pointer`}>
                {feature.icon}
                <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`text-center mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feature.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Sign-Up Benefits Section */}
      <section className="w-full flex flex-col items-center space-y-12 py-12 bg-gradient-to-r from-red-500/10 to-green-500/10 rounded-xl">
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Unlock Premium Features with Sign-Up 🌟
        </motion.h2>
        <motion.p variants={textVariants} className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center max-w-2xl`}>
          Take your Chatify experience to the next level—sign up to access these exclusive perks!
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {signUpBenefits.map((benefit, index) => (
            <Tilt key={index} tiltMaxAngleX={15} tiltMaxAngleY={15} perspective={1000}>
              <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} className={`p-6 rounded-lg shadow-md border ${isDarkMode ? 'bg-[#1A1A1A] border-gray-700' : 'bg-gray-200 border-gray-400'} hover:shadow-[10px_0_20px_rgba(0,255,0,0.2),-10px_0_20px_rgba(0,255,0,0.2)] transition-all duration-300`}>
                {benefit.icon}
                <h3 className={`text-xl font-semibold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{benefit.title}</h3>
                <p className={`text-center mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{benefit.desc}</p>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* Enhanced Call-to-Action */}
      <section className="w-full flex flex-col items-center space-y-8 py-12">
        <motion.h2 variants={textVariants} className={`text-3xl sm:text-4xl font-extrabold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Ready to Level Up? 🎉
        </motion.h2>
        <motion.p variants={textVariants} className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-center max-w-2xl`}>
          Sign up now to unlock chat history, friend management, group creation, and more—all while keeping the fun of Chatify!
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
            <Link to="/signup" className={`p-4 rounded-lg font-semibold shadow-lg flex items-center space-x-2 ${isDarkMode ? 'bg-[#1A1A1A] text-red-600' : 'bg-gray-300 text-red-500'} hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-300`}>
              <FaUser />
              <span>Sign Up for Free</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Link to="/chat" className="text-red-500 hover:underline flex items-center justify-center space-x-2">
              <FaArrowRight />
              <span>Continue Anonymously</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className={`min-h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} flex flex-col pt-20 overflow-x-hidden`}>
      <Navbar />
      {isAuthenticated ? <ChatHome /> : isAnonymous ? <AnonymousHome /> : <NormalHome />}
      <motion.div whileHover={{ scale: 1.1 }} className="fixed top-20 right-4 z-50">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-300'}`}>
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
      </motion.div>
      <motion.footer variants={footerVariants} initial="hidden" animate="visible" className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-300'} py-6 border-t`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <div className={`mb-4 sm:mb-0 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chatify</span> © {new Date().getFullYear()} All rights reserved.
          </div>
          <div className={`flex space-x-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <a href="/terms" className="hover:text-red-500 transition-colors">Terms of Service</a>
            <a href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <a href="/contact" className="hover:text-red-500 transition-colors">Contact Us</a>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default Home;
