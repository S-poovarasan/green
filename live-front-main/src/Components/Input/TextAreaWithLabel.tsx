import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { InputTextarea } from "primereact/inputtextarea";
import React from "react";

interface TextAreaWithLabelProps {
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  readonly?: boolean;
  bgColor?: string;
  errorStatus?: boolean;
  errormessage?: string;
  disabled?: boolean;
  rows?: number;
}

const TextAreaWithLabel: React.FC<TextAreaWithLabelProps> = ({
  name,
  label,
  placeholder,
  className,
  value,
  onChange,
  required = false,
  readonly = false,
  bgColor = "#fff",
  errorStatus = false,
  errormessage = "",
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className="w-full">
      {label.length > 0 && (
        <label htmlFor={name} className="font-bold text-gray-700 mb-2 block">
          {label} {required && <span className="text-[red]">*</span>}
        </label>
      )}

      <InputTextarea
        id={name}
        name={name}
        style={{
          boxShadow:
            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
          border: "none",
          borderRadius: 10,
          backgroundColor: bgColor,
        }}
        className={cn(
          "w-full text-sm rounded-2xl resize-none focus:border-none",
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readonly}
        disabled={disabled}
        rows={rows}
      />

      {errorStatus && (
        <label
          htmlFor={name}
          className="font-bold text-[red] mt-1 flex gap-1 items-center"
        >
          <Info width={15} height={15} />
          {errormessage.length > 0 ? errormessage : "Field Required Attention"}
        </label>
      )}
    </div>
  );
};

export default TextAreaWithLabel;
