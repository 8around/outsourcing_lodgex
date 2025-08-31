import React from 'react';
import { cn } from '@/lib/utils';

interface CheckboxProps {
  id?: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={cn('flex items-center', className)}>
      <input
        type="checkbox"
        id={id || `${name}-${value}`}
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary-500 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />
      <label
        htmlFor={id || `${name}-${value}`}
        className={cn(
          'ml-2 text-sm font-medium text-neutral-900',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer'
        )}
      >
        {label}
      </label>
    </div>
  );
}
