import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";

/**
 * Reusable Icon Button
 */

interface LoadingIconButtonProps {
  text?: string;
  iconName?: string;
  className?: string;
  loading?: boolean;
  [key: string]: any;
}

export default function LoadingIconButton({
  text,
  iconName,
  className = "",
  loading = false,
  ...props
}: LoadingIconButtonProps) {
  const isMobile = useMediaQuery("(max-width: 450px)");

  return (
    <>
      {isMobile ? (
        <Button className={className} {...props} disabled={props.disabled || loading}>
          {loading ? <Icon icon="lucide:loader" /> : iconName ? <Icon icon={iconName} /> : text}
        </Button>
      ) : (
        <Button className={className} {...props} disabled={loading || props.disabled}>
          {loading ? (
            <Icon icon="lucide:loader" className={"self-center animate-spin"} width={"1.25rem"} height={"1.25rem"} />
          ) : (
            iconName && <Icon icon={iconName} width={"1.25rem"} height={"1.25rem"} />
          )}
          {<span className="ml-2">{text}</span>}
          {/* check loading state !loading && <span className="ml-2">{text}</span>*/}
        </Button>
      )}
    </>
  );
}
