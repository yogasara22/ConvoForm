import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InputField = ({ 
  type = 'text', 
  placeholder, 
  options = [], 
  onSubmit, 
  label,
  required = false,
  validation = null
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    if (type === 'file') {
      setFile(e.target.files[0]);
    } else {
      setValue(e.target.value);
    }
    setError('');
  };

  const validateInput = () => {
    if (required && !value && type !== 'file') {
      setError('This field is required');
      return false;
    }

    if (required && type === 'file' && !file) {
      setError('Please select a file');
      return false;
    }

    if (validation && value) {
      // Email validation
      if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        setError('Please enter a valid email address');
        return false;
      }

      // Number validation
      if (type === 'number' && isNaN(Number(value))) {
        setError('Please enter a valid number');
        return false;
      }

      // Custom validation
      if (typeof validation === 'function') {
        const customError = validation(value);
        if (customError) {
          setError(customError);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateInput()) {
      if (type === 'file') {
        onSubmit(file);
      } else {
        onSubmit(value);
      }
      setValue('');
      setFile(null);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select 
            value={value} 
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return (
          <textarea 
            value={value} 
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        );
      
      case 'file':
        return (
          <div className="flex flex-col">
            <input 
              type="file" 
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {file.name}
              </div>
            )}
          </div>
        );
      
      case 'date':
        return (
          <input 
            type="date" 
            value={value} 
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      
      default:
        return (
          <input 
            type={type} 
            value={value} 
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex-grow">
          {renderInput()}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button 
          type="submit" 
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default InputField;