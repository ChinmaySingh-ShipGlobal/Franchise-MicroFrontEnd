import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { downloadFiles } from "@/lib/utils";

interface DocumentDetailsFieldProps {
  title: string;
  value: string;
  fileIds: string[] | any;
  className?: string;
}

export default function DocumentDetailsField({ title, value, fileIds }: DocumentDetailsFieldProps) {
  return (
    <div className={"flex items-center justify-between md:grid text-xs font-normal"}>
      <div>
        <p className="text-sm text-gray-800">{title}</p>
        <p className="mt-1 text-sm font-normal">{value}</p>
      </div>
      <div className="flex gap-x-1">
        <p className="text-gray-800">
          <Button
            variant="link"
            className="flex h-8 p-0 text-sm font-normal text-gray-800 hover:cursor-pointer gap-x-2"
            onClick={() => downloadFiles(fileIds)}
          >
            Download
            <Download className="w-6 h-6 p-1" />
          </Button>
        </p>
      </div>
    </div>
  );
}
