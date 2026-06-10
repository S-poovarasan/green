import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface FileInputWithLabelProps {
  name: string;
  label?: string;
  className?: string;
  onChange?: (files: FileList | null) => void;
  accept?: string;
  required?: boolean;
  multiple?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  bgColor?: string;
  maxFileSizeMB?: number; // optional file size limit in MB
}

const FileInputWithLabel: React.FC<FileInputWithLabelProps> = ({
  name,
  label = "",
  className,
  onChange,
  accept = "image/*",
  required = false,
  multiple = false,
  readonly = false,
  disabled = false,
  bgColor = "#fff",
  maxFileSizeMB,
}) => {
  // const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Check file size if maxFileSizeMB is provided
    if (maxFileSizeMB) {
      for (let i = 0; i < files.length; i++) {
        const sizeMB = files[i].size / 1024 / 1024;
        if (sizeMB > maxFileSizeMB) {
          setError(`File "${files[i].name}" exceeds ${maxFileSizeMB} MB.`);
          return;
        }
      }
    }

    setError("");

    // Generate image previews
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image/")) {
        urls.push(URL.createObjectURL(files[i]));
      }
    }
    // setPreviewUrls(urls);

    onChange && onChange(files);
  };

  return (
    <div className="w-full">
      {label.length > 0 && (
        <label htmlFor={name} className="font-bold text-gray-700 mb-2 block">
          {label} {required && <span className="text-[red]">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        required={required}
        readOnly={readonly}
        disabled={disabled}
        className={cn(
          "w-full h-auto text-sm rounded-2xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold hover:file:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          boxShadow:
            "inset 7px 7px 7px rgba(153,153,153,0.25), inset -7px -7px 7px rgba(235,235,235,0.25)",
          border: "none",
          borderRadius: 10,
          backgroundColor: bgColor,
          textAlign: "center", // center "No file chosen"
        }}
      />

      {/* Image Previews */}
      {/* {previewUrls.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`preview-${idx}`}
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      )} */}

      {/* Error message */}
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}

      {/* Custom File Button Styles */}
      <style>{`
        input[type="file"]::file-selector-button {
          background-color: #008080;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-weight: 600;
        }
        input[type="file"]::file-selector-button:hover {
          background-color: #006666;
        }
      `}</style>
    </div>
  );
};

export default FileInputWithLabel;
