import FranchisePage from "@/layouts/FranchisePage";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/elements/data-table-d";
import { BreadcrumbNav } from "@/components/elements/BreadcrumbNav";

export default function BulkReport() {
  return (
    <FranchisePage className="h-full min-h-screen">
      {/* <BreadcrumbNav parent="Bulk report" pageTitle="Bulk Report" /> */}
      <BreadcrumbNav pageTitle="Bulk Report" />
      <Card className="m-0 shadow-none">
        <DataTable APIEndpoint="/bulk-action/list-jobs" />
      </Card>
    </FranchisePage>
  );
}
