import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';

export default function Freezer() {
  return (
    <>
      <PageMeta title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template" description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <PageBreadcrumb pageTitle="Freezer" />
      <div className="space-y-6">
        <ComponentCard title="Data Freezer">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Nama MD
                    </TableCell>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
