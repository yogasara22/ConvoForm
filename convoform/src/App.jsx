import { useState, useEffect } from 'react';
import FormEngine from './components/FormEngine';
import { exportToCSV, exportToJSON } from './utils/exportData';
import { initEmailJS, sendFormData } from './utils/sendEmail';
import './App.css';

function App() {
  const [config, setConfig] = useState(null);
  const [formAnswers, setFormAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load configuration from demo-config.json
    fetch('/demo-config.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }
        return response.json();
      })
      .then(data => {
        setConfig(data);
        setLoading(false);
        
        // Initialize EmailJS if config includes emailConfig
        if (data.emailConfig && data.emailConfig.userId) {
          initEmailJS(data.emailConfig.userId);
        }
      })
      .catch(err => {
        console.error('Error loading configuration:', err);
        setError('Failed to load form configuration. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleFormComplete = (answers) => {
    setFormAnswers(answers);
  };

  const handleExportCSV = () => {
    if (formAnswers && config) {
      exportToCSV(formAnswers, config.steps, 'form-responses');
    }
  };

  const handleExportJSON = () => {
    if (formAnswers && config) {
      exportToJSON(formAnswers, config.steps, 'form-responses');
    }
  };

  const handleSendEmail = async () => {
    if (formAnswers && config && config.emailConfig) {
      try {
        const { serviceId, templateId } = config.emailConfig;
        await sendFormData(formAnswers, config.steps, serviceId, templateId);
        alert('Form responses sent successfully!');
      } catch (err) {
        console.error('Error sending email:', err);
        alert('Failed to send form responses. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ConvoForm</h1>
        <p>A conversational form builder for modern web applications</p>
      </header>

      <main className="app-main">
        {config && (
          <FormEngine 
            config={config} 
            onComplete={handleFormComplete} 
          />
        )}

        {formAnswers && (
          <div className="export-actions">
            <h3>Form Completed!</h3>
            <p>What would you like to do with your responses?</p>
            <div className="button-group">
              <button onClick={handleExportCSV} className="export-btn">
                Export as CSV
              </button>
              <button onClick={handleExportJSON} className="export-btn">
                Export as JSON
              </button>
              {config && config.emailConfig && (
                <button onClick={handleSendEmail} className="export-btn">
                  Send via Email
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} ConvoForm - All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;
