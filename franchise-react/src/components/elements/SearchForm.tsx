import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

interface SearchFormProps {
  placeholder?: string;
  [key: string]: any;
}

export default function SearchForm({ placeholder = "Enter Text . . .", ...rest }: SearchFormProps) {
  return (
    <div className="flex ml-4">
      <Icon icon="lucide:search" width="1rem" height="1rem" className="z-0 self-center text-gray-800" />
      <Input type="search" placeholder={placeholder} className={`w-48 md:w-64  max-w-lg pl-10 -ml-8`} {...rest} />
    </div>
  );
}
