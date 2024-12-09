import { useEffect, useState } from "react";
import { Download, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

import FranchisePage from "@/layouts/FranchisePage";

import { Card } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ErrorBulkOrderSVG, UploadBulkOrderSVG } from "@/assets/BulkOrderSVG";

import { addBulkOrder } from "@/services/bulkOrder";

interface AddBulkOrderProps {
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowse: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

const MAX_FILE_SIZE = 100000000; // 100MB

export default function BulkOrder() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState<{ invoice_number: string; error: string }[]>([]);
  const [success, setSuccess] = useState<{ invoice_number: string; success: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError([]);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const file = droppedFiles[0];
      if (file.type === "" || file.size === 0) {
        toast({
          title: "Folders are not allowed.",
          variant: "destructive",
        });
        return;
      }
      setFile(file);
    }
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError([]);
    setSuccess([]);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File size should be less than 100MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(file);
    }
  };

  useEffect(() => {
    if (!file) return;
    let formData = new FormData();
    formData.append("file", file);
    uploadBulkOrder(formData);
    setFile(undefined);
  }, [file]);

  // Upload bulk order function to upload the file and handle the response
  const uploadBulkOrder = async (data: FormData) => {
    setError([]);
    setSuccess([]);
    setLoading(true);
    try {
      const response = await addBulkOrder(data);
      if (response) {
        const convertedResponse = transformResponseData(response.data);
        setFile(undefined);
        if (response.status === 400) {
          toast({
            title: response.data.message || "An error occurred",
            variant: "destructive",
          });
        }
        if (response.status === 200) {
          const hasError = convertedResponse.error.length > 0;
          const hasSuccess = convertedResponse.success.length > 0;
          if (hasError && hasSuccess) {
            setError(convertedResponse.error);
            setSuccess(convertedResponse.success);
          } else if (hasError && !hasSuccess) {
            setError(convertedResponse.error);
          } else {
            setSuccess(convertedResponse.success);
            toast({
              title: "Bulk Order",
              description: response.data.message,
              variant: "success",
            });
          }
        }
      }
      navigate("/add-bulk-order");
    } catch (error: any) {
      toast({
        title: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // converting the response into a format that can be used by the SuccessTable and ErrorTable components
  const transformResponseData = (data: any) => {
    const successEntries = Object.entries(data.data.success || {}).map(([invoice_number, successObj]) => ({
      invoice_number,
      success: String(successObj),
    }));
    const errorEntries = Object.entries(data.data.error || {}).map(([invoice_number, errorObj]) => ({
      invoice_number,
      error: String(errorObj),
    }));
    return { success: successEntries, error: errorEntries };
  };

  return (
    <FranchisePage className="h-full min-h-screen">
      <BreadcrumbNav parent="Bulk" pageTitle="Add Bulk Order" title="Add Bulk Order" />
      <div className="flex flex-col mt-3 lg:flex-row">
        <Card className="relative m-0 mb-12 shadow-none lg:w-2/3">
          <AddBulkOrder
            handleDrop={handleDrop}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleBrowse={handleBrowse}
            loading={loading}
          />
          {error.length > 0 && <ErrorTable data={error} />}
          {success.length > 0 && <SuccessTable data={success} />}
        </Card>
        <Instructions />
      </div>
    </FranchisePage>
  );
}

// Error Table component

const ErrorTable = ({ data }: { data: { invoice_number: string; error: string }[] }) => {
  return (
    <>
      <div className="flex items-center justify-start ml-4 space-x-2 mt-9">
        <ErrorBulkOrderSVG />
        <p className="text-xs text-pink-900">
          Following orders could not be processes. Please check below for details.
        </p>
      </div>
      <Card className="p-0 mt-2 border border-pink-200 rounded-lg shadow-none ">
        <table className="w-full text-left rounded">
          <thead className="text-pink-900 bg-orange-100 rounded">
            <tr className="h-10 text-sm">
              <th className="w-1/3 font-normal rounded-tl-lg px-9">Invoice Number</th>
              <th className="w-2/3 px-4 font-normal rounded-tr-lg">Error</th>
            </tr>
          </thead>
          <tbody className="text-sm bg-gray-50">
            {data?.map((item: any, index: number) => (
              <tr key={index} className="border-gray-200 ">
                <td className={`px-9 py-2 ${index === data.length - 1 ? "rounded-bl-lg" : ""}`}>
                  {item.invoice_number}
                </td>
                <td className={`px-4 py-2 ${index === data.length - 1 ? "rounded-br-lg" : ""}`}>{item.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// Success Table component

const SuccessTable = ({ data }: { data: { invoice_number: string; success: string }[] }) => {
  return (
    <>
      <Card className="p-0 mt-4 border border-green-800 rounded-lg shadow-none ">
        <table className="w-full text-left">
          <thead className="text-green-900 bg-green-100 ">
            <tr className="h-10 text-sm">
              <th className="w-1/3 font-normal rounded-tl-lg px-9">Invoice Number</th>
              <th className="w-2/3 px-4 font-normal rounded-tr-lg">Message</th>
            </tr>
          </thead>
          <tbody className="text-sm bg-gray-50">
            {data?.map((item: any, index: number) => (
              <tr key={index} className="border-gray-200 ">
                <td className={`px-9 py-2 ${index === data.length - 1 ? "rounded-bl-lg" : ""}`}>
                  {item.invoice_number}
                </td>
                <td className={`px-4 py-2 ${index === data.length - 1 ? "rounded-br-lg" : ""}`}>{item.success}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

// Instructions component

const Instructions = () => {
  const handleSampleDownload = (fileName: string) => {
    const link = document.createElement("a");
    link.href = fileName;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full p-3 px-5 m-0 mb-12 rounded-lg shadow-none lg:mx-4 lg:w-1/3 text-card-foreground">
      <div className="mt-4 mb-7">
        <h1 className="mb-3 text-base font-semibold">Instruction</h1>
        <ul role="list" className="pl-5 space-y-4 text-sm text-black list-disc ">
          <li>Please upload your CSV file containing file containing the orders.</li>
          <li>The screen will only show orders which have, and the rest of records will be imported.</li>
          <li>You can download a sample CSV file and the country/state code list below for reference.</li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Button className="w-64 font-normal" onClick={() => handleSampleDownload("bulk_order_sample.csv")}>
          <Download className="w-5 h-5 mr-2" />
          <p className="text-xs">Sample CSV File</p>
        </Button>
        <Button className="w-64 font-normal" onClick={() => handleSampleDownload("state_country_list.xlsx")}>
          <Download className="w-5 h-5 mr-2" />
          <p className="text-xs">Country & State Code List</p>
        </Button>
      </div>
    </Card>
  );
};

// Add Bulk Order component

const AddBulkOrder: React.FC<AddBulkOrderProps> = ({
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleBrowse,
  loading,
}) => {
  return (
    <>
      <Card
        className="h-[236px] border-dashed border-2 border-sky-500 shadow-none rounded-lg bg-gray-100 flex flex-col space-y-3 items-center justify-center text-base font-semibold text-primary"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <Loader className="w-16 h-16 animate-spin text-gray" />
          </div>
        )}
        <UploadBulkOrderSVG />
        <p>Drag and Drop file here</p>
        <p>-OR-</p>
        <Button className="relative font-normal" disabled={loading}>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".csv"
            onChange={(e) => {
              handleBrowse(e);
            }}
            onClick={(e) => (e.currentTarget.value = "")}
          />
          Browse File
        </Button>
      </Card>
      <p className="ml-4 space-y-1 text-xs">Upload Excel or CSV file size less than 100mb</p>
    </>
  );
};
