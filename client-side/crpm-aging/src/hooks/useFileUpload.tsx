
import { useState } from 'react';
import type { UploadStatus } from '../types/upload.types.ts';
import { uploadExcelFile } from '../services/api';

interface UseFileUploadReturn {
  file: File | null;
  fileName: string;
  status: UploadStatus;
  progress: number;
  message: string;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  reset: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setFileName('');
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setError(null);
  };

  const uploadFile = async (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    try {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setStatus('uploading');
      setProgress(0);
      setMessage('Starting upload...');
      setError(null);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      // Call API to upload file
      await uploadExcelFile(selectedFile, (progress) => {
        setProgress(progress);
        setMessage(`Uploading: ${progress}%`);
      });

      // Clear interval and set success
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('success');
      setMessage('File uploaded successfully!');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setMessage('Upload failed');
    }
  };

  return {
    file,
    fileName,
    status,
    progress,
    message,
    error,
    uploadFile,
    reset
  };
};