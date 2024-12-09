import { badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";

export type DataTableRequestBody = {
  limit: number;
  page: number;
  sortBy?: string;
  sortOrder?: string;
  filter: Record<
    string,
    {
      option: string;
      value?: string;
    }
  >;
  sort: Record<string, string>;
};

export type DataTableQueryParams = {
  currentParameters: { limit: number; page: number; sortBy?: string; sortOrder?: string; filters?: string };
};

type badgeVariantsOptions = VariantProps<typeof badgeVariants>["variant"];

type CommonColumnType = {
  title: string;
  slug: string;
  sortable: boolean;
};

type APIColumnTypeText = CommonColumnType & {
  type: "text";
  options: {
    bold: boolean;
  };
};

type APIColumnTypeGroup = CommonColumnType & {
  type: "group";
  options: {
    group: APIColumnType[];
  };
};

type APIColumnTypeAction = CommonColumnType & {
  type: "action";
  options: {
    open_in_new_tab: boolean;
  };
};

type APIColumnTypeBadge = CommonColumnType & {
  type: "badge";
  options: {
    default_color: badgeVariantsOptions;
    color: Record<string, badgeVariantsOptions>;
  };
};

type APIColumnTypeTag = CommonColumnType & {
  type: "tag";
  options: {
    tags: Record<string, string>;
    color?: Record<string, badgeVariantsOptions>;
    default_color: badgeVariantsOptions;
  };
};

type APIColumnTypeRedirect = CommonColumnType & {
  type: "redirect";
  options: {
    open_in_new_tab: boolean;
    bold: boolean;
  };
};

export type APIColumnType =
  | APIColumnTypeText
  | APIColumnTypeGroup
  | APIColumnTypeAction
  | APIColumnTypeBadge
  | APIColumnTypeTag
  | APIColumnTypeRedirect;
