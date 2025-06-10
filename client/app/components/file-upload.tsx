'use client';
import { UploadCloud, FileText, X } from "lucide-react";
import * as React from "react";
import { useCallback, useState, useRef } from "react";

const FileUploadComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleFileUploadButton = useCallback(() => {
    const el = document.createElement('input');
    el.setAttribute('type', 'file');
    el.setAttribute('accept', 'application/pdf');

    el.addEventListener('change', async () => {
      const file = el.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    });

    el.click();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/upload/pdf', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Upload successful:', data);
      // You might want to handle the successful upload here (e.g., update parent state)
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error state here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div 
        onClick={handleFileUploadButton}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          isDragging 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-gray-600 hover:border-blue-400 hover:bg-gray-700/50'
        }`}
      >
        <div className="p-3 bg-blue-500/20 rounded-full group-hover:bg-blue-500/30 transition-colors">
          <UploadCloud className="text-blue-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-center">
          {isDragging ? 'Drop your PDF here' : 'Upload PDF File'}
        </h3>
        <p className="text-sm text-gray-400 text-center">
          {isDragging ? 'Release to upload' : 'Drag & drop or click to browse'}
        </p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />
      </div>
      
      {/* Uploaded file preview */}
      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg flex items-center gap-3 border border-gray-600 animate-in fade-in">
          <FileText className="text-blue-400" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button 
            onClick={() => setSelectedFile(null)}
            className="text-gray-400 hover:text-red-400 transition-colors"
            disabled={isUploading}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <button
        onClick={handleProcessDocument}
        disabled={!selectedFile || isUploading}
        className={`mt-6 w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
          selectedFile
            ? 'bg-blue-600 hover:bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Process Document'
        )}
      </button>
    </div>
  );
};

export default FileUploadComponent;