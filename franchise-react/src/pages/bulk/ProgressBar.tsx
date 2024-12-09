import { FileUploadSVG } from "@/assets/BulkOrderSVG";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  file: File | null;
  progress: number;
}

const ProgressBar = ({ file, progress }: ProgressBarProps) => {
  return (
    <Card className="flex mt-5 bg-gray-100 shadow-none h-14">
      <div className="w-10 mr-3">
        <FileUploadSVG />
      </div>
      <div className="w-11/12 ">
        <div className="flex justify-between pb-2 text-xs text-gray-800">
          <p>{file ? file.name : " "} File Uploading</p>
        </div>
        <Progress value={progress} className="w-full bg-gray-800" />
      </div>
    </Card>
  );
};

export default ProgressBar;
