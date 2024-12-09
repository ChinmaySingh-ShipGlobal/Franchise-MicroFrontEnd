import { cn } from "@/lib/utils";

interface TextGroupProps {
  title: string;
  value?: string | number;
  valuenextline?: string;
  subValueClass?: string;
  divClass?: string;
  valuenextlineClass?: string | undefined;
  titleClass?: string;
  icon?: any;
}

const TextGroup: React.FC<TextGroupProps> = ({
  title,
  value,
  subValueClass,
  divClass,
  valuenextline,
  valuenextlineClass,
  icon,
  titleClass,
}) => {
  return (
    <div className={cn("text-sm font-normal", divClass)}>
      <p className={cn("text-gray-800", titleClass)}>{title}</p>
      <p className={cn("mt-1 font-medium", subValueClass)}>{value}</p>
      <div className="flex flex-row gap-x-1">
        <p className={cn("mt-1", valuenextlineClass)}>{valuenextline}</p>
        {icon}
      </div>
    </div>
  );
};

export default TextGroup;
