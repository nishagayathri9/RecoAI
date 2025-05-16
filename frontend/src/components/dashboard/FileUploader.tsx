import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { DatasetFile } from '../../types';

interface FileUploaderProps {
  onFilesAccepted: (files: DatasetFile[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAccepted }) => {
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Check file types (only CSV and JSON allowed)
    const validFiles = acceptedFiles.filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/json' ||
      file.name.endsWith('.csv') ||
      file.name.endsWith('.json')
    );
    
    if (validFiles.length < acceptedFiles.length) {
      setError('Only CSV and JSON files are supported.');
    }
    
    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type || (file.name.endsWith('.csv') ? 'text/csv' : 'application/json')
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
      onFilesAccepted(newFiles);
    }
  }, [onFilesAccepted]);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxSize: 10485760 // 10MB
  });
  
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFilesAccepted(newFiles);
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps({
          className: `border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/5' : 
            isDragReject ? 'border-error bg-error/5' : 
            'border-white/20 hover:border-primary/50 hover:bg-primary/5'
          }`
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-primary/20' : 'bg-white/5'}`}>
            <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-white/70'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium mb-1">
              {isDragActive ? "Drop your files here" : "Drag & drop your dataset files"}
            </p>
            <p className="text-white/60 text-sm">
              {isDragReject 
                ? "File type not supported" 
                : "Support for CSV and JSON files (max 10MB)"}
            </p>
          </div>
          
          <button className="btn-outline px-4 py-2 text-sm">
            Browse Files
          </button>
        </div>
      </div>
      
      {error && (
        <motion.div 
          className="bg-error/10 border border-error/30 text-error-lighter rounded-lg p-4 flex items-start"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}
      
      {files.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="font-medium">Uploaded Files</h3>
          
          {files.map((file, index) => (
            <motion.div 
              key={`${file.name}-${index}`}
              className="bg-background-tertiary rounded-lg p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <div className="bg-white/10 rounded-lg p-2 mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <button 
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                onClick={() => removeFile(index)}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;