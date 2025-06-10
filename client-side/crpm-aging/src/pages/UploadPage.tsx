import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useFileUpload } from '../hooks/useFileUpload';
import FileUploader from '../components/upload/FileUploader';
import UploadStatus from '../components/upload/UploadStatus';
import Snackbar from '../components/ui/Snackbar';
import Layout from '../components/layout/Layout';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUploadedFile } = useAppContext();
  const { uploadFile, file, fileName, status, message, error } = useFileUpload();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error' | 'info'>('info');

  const handleFileSelected = async (selectedFile: File) => {
    try {
      await uploadFile(selectedFile);
      setUploadedFile(selectedFile);
      setSnackbarMessage('File uploaded successfully!');
      setSnackbarType('success');
      setShowSnackbar(true);
    } catch (err) {
      setSnackbarMessage(err instanceof Error ? err.message : 'Upload failed');
      setSnackbarType('error');
      setShowSnackbar(true);
    }
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          TNB Collection Recovery Management
        </h1>
        
        <FileUploader 
          onFileSelected={handleFileSelected} 
          isUploading={status === 'uploading'} 
        />
        
        <UploadStatus 
          isUploaded={status === 'success'} 
          fileName={fileName} 
          onViewDashboard={handleViewDashboard} 
        />
        
        <Snackbar 
          message={snackbarMessage} 
          type={snackbarType} 
          isVisible={showSnackbar} 
          onClose={() => setShowSnackbar(false)} 
        />
      </div>
    </div>
    </Layout>
  );
};

export default UploadPage;