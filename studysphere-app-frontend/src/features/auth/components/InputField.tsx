import React from "react";

interface InputFieldProps {
  type: string;
  value: string;
  label?: string;
  placeholder?: string; // Optional placeholder
  onValueChange: (newValue: string) => void; // Called on input change
  onSubmit?: () => void; // Optional submit handler
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  value,
  label,
  placeholder,
  onValueChange,
  onSubmit,
}) => {
  // Handle key press events (e.g., Enter)
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (onSubmit && event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-medium text-text">{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)} // Handle value changes
        onKeyPress={handleKeyPress} // Handle Enter key press
        className="w-72 rounded-lg border border-border bg-surface px-3 py-3 text-text placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-soft)]"
      />
    </div>
  );
};

export default InputField;
