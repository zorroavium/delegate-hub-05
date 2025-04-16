
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, UploadCloud, FileText, Image, FileArchive, File, X, CheckCircle, UploadIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { TaskAttachment } from '@/store/useTaskStore';
import { cn } from '@/lib/utils';

interface AttachmentUploaderProps {
  onUpload: (file: Omit<TaskAttachment, 'id'>) => void;
  className?: string;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  showPreview?: boolean;
}

export const AttachmentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/svg+xml':
    case 'image':
      return <Image size={16} className="text-blue-500" />;
    case 'application/pdf':
    case 'pdf':
      return <FileText size={16} className="text-red-500" />;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
    case 'docx':
    case 'doc':
      return <FileText size={16} className="text-blue-600" />;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    case 'application/vnd.ms-excel':
    case 'xlsx':
    case 'xls':
      return <FileText size={16} className="text-green-600" />;
    case 'application/zip':
    case 'application/x-zip-compressed':
    case 'zip':
      return <FileArchive size={16} className="text-yellow-500" />;
    default:
      return <File size={16} className="text-gray-500" />;
  }
};

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  onUpload,
  className,
  maxSize = 10, // Default 10MB
  acceptedFileTypes = ['*'],
  showPreview = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
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
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(1) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };
  
  const checkFileType = (file: File) => {
    if (acceptedFileTypes.includes('*')) return true;
    
    const fileType = file.type;
    return acceptedFileTypes.some(type => {
      // Handle types like 'image', 'pdf', etc.
      if (!type.includes('/')) {
        return fileType.startsWith(type) || fileType.endsWith(type);
      }
      return fileType === type;
    });
  };
  
  const isImageFile = (file: File) => {
    return file.type.startsWith('image/');
  };
  
  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };
  
  const handleFile = (file: File) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `The maximum file size is ${maxSize}MB. This file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!checkFileType(file)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file of the following types: ${acceptedFileTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Clear previous preview
    clearPreview();
    
    // Generate preview for image files
    if (showPreview && isImageFile(file)) {
      setPreviewFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
    
    // Simulate upload
    setIsUploading(true);
    
    // Mock upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create attachment object
        const attachment: Omit<TaskAttachment, 'id'> = {
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
          uploadedBy: {
            id: '101', // Replace with actual user ID from auth
            name: 'John Doe' // Replace with actual user name from auth
          }
        };
        
        // Call upload function
        onUpload(attachment);
        
        // Reset state
        setIsUploading(false);
        setUploadProgress(0);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been uploaded successfully.`
        });
      }
    }, 200);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const cancelUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    clearPreview();
  };
  
  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
        accept={acceptedFileTypes.includes('*') ? undefined : acceptedFileTypes.join(',')}
      />
      
      {isUploading ? (
        <div className="border border-border rounded-lg p-4 bg-background">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium truncate">
              {previewFile?.name || "Uploading file..."}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={cancelUpload}
            >
              <X size={14} />
            </Button>
          </div>
          
          {previewUrl && (
            <div className="relative mb-4 overflow-hidden rounded-md border border-border bg-background">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto max-h-40 object-contain"
              />
            </div>
          )}
          
          <div className="w-full mb-2">
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <div className="text-sm">
            Uploading... {uploadProgress}%
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <UploadCloud size={18} className="text-primary" />
            </div>
            <div className="text-sm font-medium">
              Drag & drop a file or click to browse
            </div>
            <div className="text-xs text-muted-foreground">
              {acceptedFileTypes.includes('*') 
                ? `Any file type, max ${maxSize}MB` 
                : `Accepted file types: ${acceptedFileTypes.join(', ')}, max ${maxSize}MB`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
