import { useLocation } from "react-router-dom";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface PageTitleProps {
  tabName?: string;
  title?: string;
  parent?: string;
}

export default function PageTitle({ tabName, title, parent }: PageTitleProps) {
  const { pathname } = useLocation();
  function titleCase(str: string) {
    console.log("str", str);
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  const baseTitle = titleCase(pathname.split("/").filter(Boolean).pop() || "Orders");
  const displayTitle = tabName
    ? `${title ? title : baseTitle} > ${titleCase(tabName)}`
    : `${title ? title : baseTitle}`;

  return (
    <CardTitle>
      {title ? title : baseTitle}
      <CardDescription className="py-2 font-normal">
        {parent ? parent : "Dashboard"} {">"} {displayTitle}
      </CardDescription>
    </CardTitle>
  );
}
