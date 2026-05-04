import { useState } from 'react';
import API from '../utils/axios';

const ResumeUpload = ({ onParsed }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const { data } = await API.post('/ml/parse-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Resume parsed successfully! ✨');
      
      // Save parsed data to user profile
      await API.post('/user/save-resume', { parsedData: data.data });
      
      // Callback to parent component
      if (onParsed) {
        onParsed(data.data);
      }

      setFile(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to parse resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Upload Your Resume 📄</h3>
      <p className="text-gray-600 mb-4">
        Upload your resume and we'll automatically extract your skills and experience
      </p>

      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {file && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">Selected: {file.name}</p>
        </div>
      )}

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('✨') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {uploading ? 'Parsing...' : 'Parse Resume with AI'}
      </button>
    </div>
  );
};

export default ResumeUpload;