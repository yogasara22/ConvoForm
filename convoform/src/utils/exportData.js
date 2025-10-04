/**
 * Utility functions for exporting form data to CSV or JSON
 */

/**
 * Convert form answers to CSV format and trigger download
 * @param {Object} answers - The form answers object
 * @param {Array} questions - The form questions array
 * @param {String} filename - The name of the file to download (without extension)
 */
export const exportToCSV = (answers, questions, filename = 'form-data') => {
  // Create headers from questions
  const headers = questions.map(q => q.text.replace(/,/g, ' '));
  
  // Create row data from answers
  const data = questions.map(q => {
    const answer = answers[q.id];
    
    // Handle different types of answers
    if (q.type === 'file' && answer) {
      return answer.name;
    }
    
    // Convert to string and escape commas
    return answer ? String(answer).replace(/,/g, ' ') : '';
  });
  
  // Combine headers and data
  const csvContent = [
    headers.join(','),
    data.join(',')
  ].join('\n');
  
  // Create and download the file
  downloadFile(csvContent, `${filename}.csv`, 'text/csv');
};

/**
 * Convert form answers to JSON format and trigger download
 * @param {Object} answers - The form answers object
 * @param {Array} questions - The form questions array
 * @param {String} filename - The name of the file to download (without extension)
 */
export const exportToJSON = (answers, questions, filename = 'form-data') => {
  // Create a structured object with question text and answers
  const formattedData = questions.reduce((acc, question) => {
    const answer = answers[question.id];
    
    // Handle file type
    if (question.type === 'file' && answer) {
      acc[question.text] = answer.name;
    } else {
      acc[question.text] = answer || '';
    }
    
    return acc;
  }, {});
  
  // Convert to JSON string
  const jsonContent = JSON.stringify(formattedData, null, 2);
  
  // Create and download the file
  downloadFile(jsonContent, `${filename}.json`, 'application/json');
};

/**
 * Helper function to create and download a file
 * @param {String} content - The file content
 * @param {String} filename - The name of the file
 * @param {String} contentType - The MIME type of the file
 */
const downloadFile = (content, filename, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

export default {
  exportToCSV,
  exportToJSON
};