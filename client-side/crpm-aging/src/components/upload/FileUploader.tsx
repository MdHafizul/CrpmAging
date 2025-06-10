
import React, { useState } from 'react';
import Loader from '../ui/Loader';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  accept?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelected,
  isUploading,
  accept = '.xlsx,.xls'
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload an Excel file');
      return;
    }
    
    onFileSelected(file);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors 
        ${isUploading ? 'bg-gray-50 border-gray-300' : isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'} 
        ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'} relative`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="flex flex-col items-center">
          <Loader size="md" color="blue" className="mb-4" />
          <p className="text-gray-600">Uploading file...</p>
        </div>
      ) : (
        <>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept={accept}
            disabled={isUploading}
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your Excel file here, or <span className="text-blue-500">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: .xlsx, .xls
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploader;