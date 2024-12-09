import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CloudUpload, Trash2 } from "lucide-react";
import { fileUploadCustomer } from "@/services/kyc";
import { RequiredField } from "./SGFormField";

const MAX_FILE_SIZE = 2000000; // 2MBchange this based on business requirements

export default function FileInput({
  name,
  label,
  setFileId,
  isDisabled,
  setIsDisabled,
  required,
  className,
}: {
  name: string;
  label: string;
  setFileId: Dispatch<SetStateAction<string>>;
  isDisabled?: boolean;
  setIsDisabled?: Dispatch<SetStateAction<boolean>>;
  required?: boolean;
  className?: string;
}) {
  const [file, setFile] = useState<File | undefined>(undefined);
  // const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDisabled) {
      // setDragActive(false);
      setError("");
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        const file = droppedFiles[0];
        if (file.type === "" || file.size === 0) {
          setError("Folders are not allowed.");
          return;
        }
        setFile(file);
      }
    }
  };

  let formData = new FormData();
  useEffect(() => {
    if (!file) return;
    if (file && file.size > MAX_FILE_SIZE) {
      setError("File cannot be above 2MB. Please upload a smaller file");
    } else {
      formData.append("file", file);
      formData.append("doc_type", name);
      uploadFile(formData);
    }
  }, [file]);

  const uploadFile = async (data: any) => {
    setLoading(true);
    const response = await fileUploadCustomer(data);
    if (response) {
      if (response.status === 200) {
        setError("false");
        setFileId(response.data.data.uuid);
        setLoading(false);
      } else {
        setError(response.data.message ? response.data.message : "An error occurred");
        setLoading(false);
      }
    }
  };

  const fieldStateClass = () => {
    if (error === "") return "border-dotted border-gray-400";
    else if (error === "false") return "border-solid border-green-800";
    else return "border-solid border-red";
  };

  const handleFileDelete = () => {
    setError("");
    setFile(undefined);
    setFileId("");
    if (setIsDisabled) {
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    handleFileDelete();
  }, [label]);

  return (
    <div className="w-full space-y-1">
      <label className="text-sm font-normal leading-none">
        {label}
        {required && <RequiredField />}
      </label>
      <div
        className={`flex items-center justify-between cursor-pointer h-11 text-center bg-gray-50 text-gray-800 border rounded-lg ${fieldStateClass()} ${
          file && "cursor-not-allowed"
        } ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label
          htmlFor={name}
          className={`flex items-center w-full px-4 text-xs ${file ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {!file && <CloudUpload className="mr-2.5 w-5 h-5 text-gray-800" />}
          {file ? (
            <span> {file.name.length > 25 ? file?.name.slice(0, 25) : file.name}</span>
          ) : (
            <span>
              Drag & drop image here <i className="ml-2">or</i> <b className="ml-2 font-medium text-black">Browse</b>
            </span>
          )}
          <input
            id={name}
            type="file"
            className="hidden"
            disabled={file ? true : false}
            accept="image/png, image/jpeg, application/pdf"
            onChange={(e) => {
              setError("");
              setFile(e?.target?.files?.[0]);
            }}
            onClick={(e) => (e.currentTarget.value = "")}
          />
        </label>
        {file && (
          <Trash2
            color="#000000"
            className={`mx-3 cursor-pointer w-5 h-5`}
            onClick={() => {
              if (!isDisabled) {
                handleFileDelete();
              }
            }}
          />
        )}
      </div>
      {error.length > 7 && <span className="text-xs text-red">{error}</span>}
      {error === "false" && <span className="text-xs text-green-800">Uploaded</span>}
      {loading && <span className="text-xs">Uploading...</span>}
    </div>
  );
}
