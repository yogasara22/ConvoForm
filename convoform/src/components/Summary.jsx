import React from 'react';
import { motion } from 'framer-motion';

const Summary = ({ answers, questions, onSubmit, onEdit }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <p className="text-gray-600 mb-4">Please review your answers before submitting.</p>
      
      <div className="space-y-4 mb-6">
        {Object.keys(answers).map((key, index) => {
          const question = questions.find(q => q.id === key);
          const answer = answers[key];
          
          if (!question) return null;
          
          return (
            <div key={key} className="border-b pb-3">
              <div className="flex justify-between">
                <p className="font-medium">{question.text}</p>
                <button 
                  onClick={() => onEdit(index)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              </div>
              <p className="text-gray-700 mt-1">
                {question.type === 'file' 
                  ? (answer ? answer.name : 'No file selected') 
                  : (answer || 'No answer provided')}
              </p>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
};

export default Summary;