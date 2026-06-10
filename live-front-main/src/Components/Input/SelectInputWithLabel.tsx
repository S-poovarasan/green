import React from "react";
import { cn } from "@/lib/utils";
import { Dropdown } from "primereact/dropdown";
import { Info } from "lucide-react";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface SelectInputProps {
  name: string;
  label: string;
  options: Option[];
  value?: string | number | boolean;
  onChange?: (e: any) => void; // PrimeReact dropdown change event
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  bgColor?: string;
  errorStatus?: boolean;
}

const SelectInputWithLabel: React.FC<SelectInputProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  required = false,
  disabled = false,
  bgColor = "#fff",
  errorStatus = false,
}) => {
  return (
    <div className="w-full">
      {label.length > 0 && (
        <label htmlFor={name} className="font-bold text-gray-700 mb-2 block">
          {label} {required && <span className="text-[red]">*</span>}
        </label>
      )}
      <Dropdown
        id={name}
        name={name}
        value={value}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full h-10 lg:h-11 text-sm rounded-2xl px-0 focus:border-none",
          className
        )}
        style={{
          backgroundColor: bgColor,
          border: "none",
          borderRadius: 10,
          boxShadow:
            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
        }}
        required={required}
      />
      {errorStatus && (
        <label
          htmlFor={name}
          className="font-bold text-[red] mt-1 flex gap-1 items-center "
        >
          <Info width={15} height={15} /> Field Required Attention
        </label>
      )}
    </div>
  );
};

export default SelectInputWithLabel;
