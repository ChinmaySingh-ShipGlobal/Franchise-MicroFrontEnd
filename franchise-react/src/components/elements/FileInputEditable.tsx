import { downloadFiles } from "@/lib/utils";
import { fileUpload, fileUploadCustomer } from "@/services/kyc";
import { CloudUpload, Download, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { RequiredField } from "./SGFormField";

// initial state - empty / filled
// actions - upload file, drag and drop file, download file, delete file
// validations - file size (max 5MB), file format (pdf, png, jpeg)
const MAX_FILE_SIZE = 2000000; // 2MBchange this based on business requirements

//TODO - add responsive width to input

interface FileInputEditableProps {
  name: string; //field id of the input field
  label: string; //field label
  required?: boolean; // required field
  fileId: string; // uuid of the file
  setFileId: React.Dispatch<React.SetStateAction<string>>;
  setDocumentVerified?: React.Dispatch<React.SetStateAction<boolean>>;
  setReason?: React.Dispatch<React.SetStateAction<string>>;
  status?: string; // approved, rejected, pending
  reason?: string; // reason for rejection
  customer?: boolean; // customer or kyc
}

export default function FileInputEditable({
  name,
  label,
  required,
  fileId,
  setFileId,
  setDocumentVerified,
  setReason,
  status,
  reason,
  customer,
}: FileInputEditableProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // call upload file API when file is reuploaded
  let fileData = new FormData();
  useEffect(() => {
    if (!file) return;
    if (file && file.size > MAX_FILE_SIZE) {
      setError("File cannot be above 2MB. Please upload a smaller file");
    } else {
      fileData.append("file", file);
      fileData.append("doc_type", name);
      uploadFile(fileData);
    }
  }, [file]);

  const uploadFile = async (data: any) => {
    setLoading(true);
    setSuccess(false);
    let response;
    if (customer) {
      response = await fileUploadCustomer(data);
    } else {
      response = await fileUpload(data);
    }
    if (response) {
      if (response.status === 200) {
        setSuccess(true);
        setFileId(response.data.data.uuid);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };
  const handleDelete = () => {
    setFile(undefined);
    setFileId(null);
    setSuccess(false);
    if (setDocumentVerified) setDocumentVerified(false);
    if (setReason) setReason("");
    setError("");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (file || fileId) return;
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
  };

  return (
    <div>
      <div className="w-full space-y-1">
        <label className="text-sm font-normal leading-none">
          {label}
          {required && <RequiredField />}
        </label>
        <div
          className={`flex items-center justify-between cursor-pointer text-center bg-gray-50 text-gray-800 border border-dotted rounded-lg min-w-48 
            ${error && "border-red"} 
            ${fileId ? (status === "approved" || success ? "border-green-800" : "border-red-800") : "border-input"}
          `}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <label
            htmlFor={name}
            className={`flex items-center w-full h-11 px-4 text-xs ${
              file || fileId ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {file ? (
              <span> {file.name.length > 25 ? file?.name.slice(0, 25) : file.name}</span>
            ) : fileId ? (
              <span>{name}</span>
            ) : (
              <>
                <CloudUpload className="mr-2.5 w-5 h-5 text-gray-800" />
                <span>
                  Drag & drop image here <i className="ml-2">or</i>{" "}
                  <b className="ml-2 font-medium text-black">Browse</b>
                </span>
              </>
            )}
            <input
              id={name}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, application/pdf"
              disabled={file || fileId ? true : false}
              onChange={(e) => {
                setFile(e.target?.files?.[0]);
              }}
              onClick={(e) => (e.currentTarget.value = "")}
            />
          </label>
          {(file || fileId) && !error && (
            <Download
              color="#000000"
              className={`mx-3 cursor-pointer w-5 h-5 hover:scale-125`}
              onClick={() => downloadFiles([fileId])}
            />
          )}
          {(file || fileId) && (
            <Trash2 color="#000000" className={`mx-3 cursor-pointer w-5 h-5 hover:scale-125`} onClick={handleDelete} />
          )}
        </div>
        {fileId && !file && status && (
          <span className={`text-xs ${status === "approved" ? "text-green-800" : "text-red"}`}>
            {status === "approved" ? "Uploaded" : reason}
          </span>
        )}
        {error.length > 7 && <span className="text-xs text-red">{error}</span>}
        {success && <span className="text-xs text-green-800">Uploaded</span>}
        {loading && <span className="text-xs">Uploading...</span>}
      </div>
    </div>
  );
}
