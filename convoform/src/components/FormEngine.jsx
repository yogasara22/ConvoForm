import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import InputField from './InputField';
import ProgressBar from './ProgressBar';
import Summary from './Summary';

const FormEngine = ({ config, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [conversation, setConversation] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const conversationEndRef = useRef(null);

  const { title, description, steps, botAvatar, userAvatar } = config;

  useEffect(() => {
    // Add initial greeting message
    if (conversation.length === 0 && steps.length > 0) {
      setConversation([
        { type: 'bot', message: title || 'Welcome to our conversational form!', avatar: botAvatar },
        { type: 'bot', message: description || 'Please answer the following questions.', avatar: botAvatar }
      ]);
    }
  }, [config, conversation.length, description, steps.length, title, botAvatar]);

  useEffect(() => {
    // Add the current question to conversation if not already added
    if (steps.length > 0 && currentStep < steps.length && !showSummary) {
      const currentQuestion = steps[currentStep];
      
      // Cek apakah pertanyaan ini sudah ada di conversation
      const questionExists = conversation.some(msg => 
        msg.type === 'bot' && msg.message === currentQuestion.text
      );
      
      if (!questionExists) {
        setConversation(prev => [...prev, { type: 'bot', message: currentQuestion.text, avatar: botAvatar }]);
      }
    }
  }, [currentStep, steps, showSummary, botAvatar]);

  useEffect(() => {
    // Scroll to bottom of conversation
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleInputSubmit = (value) => {
    // Save answer
    const currentQuestion = steps[currentStep];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    // Add user's answer to conversation
    let displayValue = value;
    if (currentQuestion.type === 'file' && value) {
      displayValue = `File: ${value.name}`;
    } else if (currentQuestion.type === 'select' && currentQuestion.options) {
      const option = currentQuestion.options.find(opt => 
        (opt.value || opt) === value
      );
      displayValue = option ? (option.label || option) : value;
    }
    
    setConversation(prev => [...prev, { type: 'user', message: displayValue, avatar: userAvatar }]);
    
    // Move to next step or show summary
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowSummary(true);
        setConversation(prev => [...prev, { 
          type: 'bot', 
          message: 'Thank you for your responses. Please review your answers before submitting.',
          avatar: botAvatar
        }]);
      }
    }, 500);
  };

  const handleEdit = (stepIndex) => {
    setCurrentStep(stepIndex);
    setShowSummary(false);
  };

  const handleSubmit = () => {
    setIsCompleted(true);
    setConversation(prev => [...prev, { 
      type: 'bot', 
      message: 'Thank you for submitting your responses!',
      avatar: botAvatar
    }]);
    
    if (onComplete) {
      onComplete(answers);
    }
  };

  const renderCurrentInput = () => {
    if (isCompleted) {
      return null;
    }
    
    if (showSummary) {
      return (
        <Summary 
          answers={answers} 
          questions={steps} 
          onSubmit={handleSubmit} 
          onEdit={handleEdit}
        />
      );
    }
    
    if (currentStep < steps.length) {
      const currentQuestion = steps[currentStep];
      return (
        <InputField 
          type={currentQuestion.type || 'text'} 
          placeholder={currentQuestion.placeholder}
          options={currentQuestion.options}
          label={currentQuestion.label}
          required={currentQuestion.required}
          validation={currentQuestion.validation}
          onSubmit={handleInputSubmit}
        />
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <ProgressBar 
        currentStep={showSummary ? steps.length : currentStep + 1} 
        totalSteps={steps.length} 
      />
      
      <div className="conversation-container h-96 overflow-y-auto mb-4 p-2">
        {conversation.map((item, index) => (
          <ChatBubble 
            key={index} 
            message={item.message} 
            type={item.type} 
            avatar={item.type === 'bot' ? botAvatar : userAvatar}
          />
        ))}
        <div ref={conversationEndRef} />
      </div>
      
      {renderCurrentInput()}
    </div>
  );
};

export default FormEngine;