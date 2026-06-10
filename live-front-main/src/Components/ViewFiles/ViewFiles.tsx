import React, { useState } from "react";
import Button from "../Buttons/ButtonsLabel";
import { Dialog } from "primereact/dialog";
import { Loader2Icon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileData } from "@/Interfaces/CommonInterface";
import { FileHandlerService } from "@/Services/FileHandlerService";

interface ViewFilesProps {
  Filename: string;
  oldFileName?: string;
}

const ViewFiles: React.FC<ViewFilesProps> = ({ Filename, oldFileName = "" }) => {
  const [visible, setVisible] = useState(false);

  const [fileData, setFileData] = useState<FileData | null>(null);

  const getFile = async () => {
    const response: {
      status: boolean;
      data: FileData;
      message: string;
    } = await FileHandlerService.viewFile(Filename);
    if (response.status) {
      setFileData(response.data);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="w-[20%]">
        <Button
          className="h-8 lg:h-8"
          onClick={() => {
            setVisible(true);
            getFile();
          }}
          type="button"
          variant="primary"
        >
          View File
        </Button>
      </div>
      <div className="w-[80%] truncate">
        {oldFileName.length > 0 && oldFileName}
      </div>
      <Dialog
        header="New Sub Trainer Registration Details"
        visible={visible}
        className="w-10/12"
        style={{
          height: "100%",
          borderRadius: "16px", // rounded corners
          overflow: "hidden",
        }}
        headerStyle={{
          display: "none",
        }}
        contentStyle={{
          background: "rgba(255, 255, 255, 0.1)", // semi-transparent
          backdropFilter: "blur(20px)", // frosted glass
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "0 0 16px 16px",
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        onHide={() => {
          setVisible(false);
          setFileData(null);
        }}
      >
        <div className="w-full">
          <div
            onClick={() => {
              setVisible(false);
              setFileData(null);
            }}
            className="flex cursor-pointer justify-center"
          >
            <div
              className={cn(
                "inline-flex items-center justify-center select-none focus:outline-none py-2 px-4 text-[0.8rem] font-bold rounded-xl",
                // sizeClasses[size],
                "bg-[#008080] text-white",
                "shadow-[inset_7px_7px_7px_rgba(153,153,153,0.25),inset_-7px_-7px_7px_rgba(235,235,235,0.25)]",
                "hover:shadow-[inset_9px_9px_9px_rgba(153,153,153,0.28),inset_-9px_-9px_9px_rgba(235,235,235,0.28)]"
                //   "active:shadow-[inset_4px_4px_6px_rgba(153,153,153,0.35),inset_-4px_-4px_6px_rgba(235,235,235,0.35)]"
              )}
            >
              View File
            </div>
            <X
              className="absolute right-2 cursor-pointer"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="h-[76vh] overflow-y-auto custom-scroll flex flex-col justify-center items-center gap-3 pb-3">
          {fileData !== null ? (
            fileData.contentType === "application/pdf" ? (
              <iframe
                className="w-full h-full rounded-lg"
                src={`data:${fileData.contentType};base64,${fileData.base64Data}`}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-gray-600">
                  Preview not available for this file type
                </p>

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = `data:${fileData.contentType};base64,${fileData.base64Data}`;
                    link.download = oldFileName || Filename;
                    link.click();
                  }}
                >
                  Download File
                </Button>
              </div>
            )
          ) : (
            <Loader2Icon size={50} className="animate-spin" />
          )}

        </div>
      </Dialog>
    </div>
  );
};

export default ViewFiles;
