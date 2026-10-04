import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { dataService } from '../lib/supabase';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setError('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be smaller than 5 MB.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await dataService.uploadImage(file);
      onChange(uploadedUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to process image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-video max-h-64 flex items-center justify-center">
          <img
            src={value}
            alt="Item preview"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg shadow-md transition-colors"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <CheckCircle className="w-3 h-3" /> Photo Attached
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
            isDragging
              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-orange-400 dark:hover:border-orange-500 bg-neutral-50/50 dark:bg-neutral-900/40'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-7 h-7 border-2 border-neutral-300 border-t-orange-600 rounded-full animate-spin" />
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Processing image...</p>
            </div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-2.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                JPG, PNG, or WEBP (Max 5 MB)
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
