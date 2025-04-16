
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Paperclip, X, File, Image, FileText, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { TaskAttachment } from '@/store/useTaskStore';

interface AttachmentUploaderProps {
  onUpload: (attachment: Omit<TaskAttachment, 'id'>) => void;
  className?: string;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
}

export function AttachmentUploader({ 
  onUpload, 
  className, 
  maxSize = 10, 
  acceptedFileTypes 
}: AttachmentUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `The maximum file size is ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }
    
    // Check file type if acceptedFileTypes is provided
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileType = file.type;
      if (!acceptedFileTypes.some(type => fileType.includes(type))) {
        toast({
          title: "Invalid file type",
          description: `Accepted file types: ${acceptedFileTypes.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Simulate upload progress
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        // Create file URL and prepare attachment object
        const fileUrl = URL.createObjectURL(file);
        const attachment: Omit<TaskAttachment, 'id'> = {
          name: file.name,
          type: file.type.split('/').pop()?.toUpperCase() || 'FILE',
          size: formatFileSize(file.size),
          url: fileUrl,
          uploadedAt: new Date().toISOString(),
          uploadedBy: {
            id: '1', // This would be the current user's ID in a real implementation
            name: 'Current User' // This would be the current user's name
          }
        };
        
        onUpload(attachment);
        
        toast({
          title: "File uploaded",
          description: `${file.name} has been successfully uploaded.`
        });
      }
    }, 100);
  };
  
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
    handleFileSelect(e.dataTransfer.files);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Format file size helper function
  const formatFileSize = (size: number): string => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <div className={className}>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => handleFileSelect(e.target.files)}
        accept={acceptedFileTypes?.join(',')}
      />
      
      {isUploading ? (
        <Card className="border-dashed">
          <CardContent className="p-4 flex flex-col items-center">
            <div className="w-full mb-2">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-dashed cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <CardContent className="p-4 flex flex-col items-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Maximum file size: {maxSize}MB
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for displaying attachment icons
export function AttachmentIcon({ type }: { type: string }) {
  type = type.toLowerCase();
  
  if (type === 'pdf') {
    return <FileText className="text-red-500" size={16} />;
  } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(type)) {
    return <Image className="text-blue-500" size={16} />;
  } else if (['doc', 'docx', 'txt', 'rtf'].includes(type)) {
    return <FileText className="text-blue-500" size={16} />;
  } else if (['xls', 'xlsx', 'csv'].includes(type)) {
    return <FileText className="text-green-500" size={16} />;
  } else if (['ppt', 'pptx'].includes(type)) {
    return <FileText className="text-orange-500" size={16} />;
  } else {
    return <File className="text-gray-500" size={16} />;
  }
}
