import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";

/**
 * Reusable Icon Button
 */

interface ButtonWithIconProps {
  text?: string;
  iconName?: string;
  className?: string;
  [key: string]: any;
}

export default function ButtonWithIcon({ text, iconName, className = "", ...props }: ButtonWithIconProps) {
  const isMobile = useMediaQuery("(max-width: 450px)");

  return (
    <>
      {isMobile ? (
        <Button className={className} {...props}>
          {iconName ? <Icon icon={iconName} /> : text}
        </Button>
      ) : (
        <Button className={className} {...props}>
          {iconName && <Icon icon={iconName} width={"1.25rem"} height={"1.25rem"} />}
          <span className="ml-2">{text}</span>
        </Button>
      )}
    </>
  );
}
