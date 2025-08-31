import React from 'react';
import { cn } from '@/lib/utils';
import { FormFieldProps } from '@/types';

interface InputProps extends FormFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Input({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  value,
  onChange,
  className,
  ...props
}: InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-neutral-700',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full px-4 py-2 border border-neutral-300 rounded-lg transition-colors',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  name,
  placeholder,
  required = false,
  error,
  disabled = false,
  value,
  onChange,
  rows = 4,
  className,
  ...props
}: {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>) {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className={cn(
            'block text-sm font-medium text-neutral-700',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        rows={rows}
        className={cn(
          'w-full px-4 py-2 border border-neutral-300 rounded-lg transition-colors resize-vertical',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'disabled:bg-neutral-50 disabled:cursor-not-allowed',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
