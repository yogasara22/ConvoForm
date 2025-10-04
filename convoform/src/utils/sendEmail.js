/**
 * Utility functions for sending form data via EmailJS
 */
import emailjs from 'emailjs-com';

/**
 * Initialize EmailJS with user ID
 * @param {String} userId - EmailJS user ID
 */
export const initEmailJS = (userId) => {
  emailjs.init(userId);
};

/**
 * Send form data via EmailJS
 * @param {Object} answers - The form answers object
 * @param {Array} questions - The form questions array
 * @param {String} serviceId - EmailJS service ID
 * @param {String} templateId - EmailJS template ID
 * @param {Object} templateParams - Additional template parameters
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendFormData = async (
  answers, 
  questions, 
  serviceId, 
  templateId, 
  templateParams = {}
) => {
  try {
    // Format the answers for the email template
    const formattedAnswers = questions.reduce((acc, question) => {
      const answer = answers[question.id];
      
      // Handle file type
      if (question.type === 'file' && answer) {
        acc[`question_${question.id}`] = question.text;
        acc[`answer_${question.id}`] = answer.name;
      } else {
        acc[`question_${question.id}`] = question.text;
        acc[`answer_${question.id}`] = answer || 'No answer provided';
      }
      
      return acc;
    }, {});
    
    // Combine with additional template parameters
    const emailParams = {
      ...templateParams,
      ...formattedAnswers,
      form_summary: JSON.stringify(
        questions.map(q => ({
          question: q.text,
          answer: answers[q.id] || 'No answer provided'
        })),
        null,
        2
      )
    };
    
    // Send the email
    const response = await emailjs.send(serviceId, templateId, emailParams);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default {
  initEmailJS,
  sendFormData
};