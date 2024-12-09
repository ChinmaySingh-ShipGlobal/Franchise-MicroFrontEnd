import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle?: string;
  parent?: string;
  parentLink?: string;
  subParent?: string;
  subParentLink?: string;
  title?: string;
  titleLink?: string;
  tabName?: string;
  className?: string;
}
export function BreadcrumbNav({
  parent,
  title,
  tabName,
  parentLink,
  titleLink,
  pageTitle,
  subParent,
  subParentLink,
  className,
}: BreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <>
      <CardTitle className={cn("mb-1 font-medium", className)}>
        {pageTitle ? pageTitle : title}
        <CardDescription className="py-2 font-normal">
          <Breadcrumb>
            <BreadcrumbList className="text-gray-800 cursor-pointer">
              {parent && (
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate(`${parentLink ? parentLink : "#"}`)}>{parent}</BreadcrumbLink>
                </BreadcrumbItem>
              )}
              {subParent && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className={`${!title && !tabName && "text-black"}`}>
                    <BreadcrumbLink onClick={() => navigate(`${subParentLink ? subParentLink : "#"}`)}>
                      {subParent}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {title && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem className={`${!tabName && "text-black"}`}>
                    <BreadcrumbLink onClick={() => navigate(`${titleLink ? titleLink : "#"}`)}>{title}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              {tabName && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="">{tabName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </CardDescription>
      </CardTitle>
    </>
  );
}
