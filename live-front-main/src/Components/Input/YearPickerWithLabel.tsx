import React from "react";
import { cn } from "@/lib/utils";
import { Dropdown } from "primereact/dropdown";
import { Info } from "lucide-react";

interface YearPickerWithLabelProps {
  name: string;
  label: string;
  className?: string;
  value?: number;
  onChange?: (e: any) => void; // PrimeReact change event
  required?: boolean;
  readonly?: boolean;
  bgColor?: string;
  startYear?: number;
  endYear?: number;
  placeholder?: string;
  errorStatus?: boolean;
  onDoubleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}

const YearPickerWithLabel: React.FC<YearPickerWithLabelProps> = ({
  name,
  label,
  className,
  value,
  onChange,
  required = false,
  readonly = false,
  bgColor = "#fff",
  startYear = 1900,
  placeholder = "Select Year",
  endYear = new Date().getFullYear(),
  errorStatus = false,
  onDoubleClick,
}) => {
  const years = [];

  if (startYear > endYear) {
    for (let year = startYear; year >= endYear; year--) {
      years.push({ label: year.toString(), value: year });
    }
  } else {
    for (let year = startYear; year <= endYear; year++) {
      years.push({ label: year.toString(), value: year });
    }
  }

  return (
    <div className="w-full">
      <label htmlFor={name} className="font-bold text-gray-700 mb-2 block">
        {label} {required && <span className="text-[red]">*</span>}
      </label>
      <Dropdown
        id={name}
        name={name}
        value={value}
        options={years}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          boxShadow:
            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
          border: "none",
          borderRadius: 10,
          backgroundColor: bgColor,
          fontFamily: "Montserrat",
        }}
        className={cn(
          "w-full h-10 lg:h-11 text-sm rounded-2xl focus:border-none",
          className
        )}
        disabled={readonly}
        required={required}
        onDoubleClick={onDoubleClick}
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

export default YearPickerWithLabel;
