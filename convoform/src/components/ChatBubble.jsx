import React from 'react';
import { motion } from 'framer-motion';

const ChatBubble = ({ message, type = 'bot', avatar }) => {
  // Animasi untuk bubble chat
  const bubbleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className={`flex mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`}
      initial="hidden"
      animate="visible"
      variants={bubbleVariants}
    >
      {type === 'bot' && avatar && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mr-2">
          <img src={avatar} alt="Bot Avatar" className="h-full w-full object-cover" />
        </div>
      )}
      
      <div 
        className={`px-4 py-2 rounded-lg max-w-[80%] ${
          type === 'user' 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        {message}
      </div>
      
      {type === 'user' && avatar && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden ml-2">
          <img src={avatar} alt="User Avatar" className="h-full w-full object-cover" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatBubble;