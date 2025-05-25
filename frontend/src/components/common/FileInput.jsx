import React, { forwardRef, useRef, useState } from 'react';
import { cn } from '../../utils/helpers';
import { Upload, X } from 'lucide-react';

const FileInput = forwardRef(
  (
    {
      label,
      id,
      name,
      accept = 'image/*',
      onChange,
      onBlur,
      error,
      touched,
      disabled = false,
      required = false,
      className = '',
      labelClassName = '',
      containerClassName = '',
      preview = true,
      multiple = false,
      maxSize = 5 * 1024 * 1024, // 5MB
      ...props
    },
    ref
  ) => {
    const inputId = id || name || `file-input-${Math.random().toString(36).substr(2, 9)}`;
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      
      if (!selectedFile) {
        setFile(null);
        setPreviewUrl(null);
        setErrorMessage('');
        return;
      }

      // Check file size
      if (selectedFile.size > maxSize) {
        const formattedMaxSize = (maxSize / (1024 * 1024)).toFixed(2);
        setErrorMessage(`File size exceeds ${formattedMaxSize}MB`);
        resetFileInput();
        return;
      }

      setFile(selectedFile);
      setErrorMessage('');
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }

      // Call the original onChange handler if provided
      if (onChange) {
        onChange(e);
      }
    };

    const handleRemove = () => {
      resetFileInput();
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    };

    const resetFileInput = () => {
      setFile(null);
      setPreviewUrl(null);
      setErrorMessage('');
    };

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    const labelClasses = cn(
      'block text-sm font-medium text-gray-700 mb-1',
      { 'text-red-600': (error && touched) || errorMessage },
      labelClassName
    );

    const displayError = (error && touched) || errorMessage;
    const errorText = errorMessage || error;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          id={inputId}
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          onBlur={onBlur}
          disabled={disabled}
          className="hidden"
          multiple={multiple}
          {...props}
        />
        
        {preview && (previewUrl || file) ? (
          <div className="mt-1">
            <div className="relative group">
              {previewUrl ? (
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt={file?.name || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file?.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-500"
                    aria-label="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className={cn(
              'mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer',
              'hover:border-blue-500 hover:bg-blue-50 transition-colors',
              { 'border-red-500': displayError },
              { 'opacity-50 cursor-not-allowed': disabled }
            )}
          >
            <div className="space-y-1 text-center">
              <div className="flex justify-center">
                <Upload
                  className="mx-auto h-12 w-12 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor={inputId}
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id={inputId}
                    name={name}
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={accept}
                    disabled={disabled}
                    multiple={multiple}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {accept.includes('image/') ? 'PNG, JPG, GIF up to 5MB' : 'File up to 5MB'}
              </p>
            </div>
          </div>
        )}
        
        {displayError && (
          <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
            {errorText}
          </p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export default FileInput;
