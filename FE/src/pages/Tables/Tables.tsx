import PageMeta from '../../components/common/PageMeta';
import TableToko from '../../components/tables/BasicTables/TableToko';
// import TableGudang from '../../components/tables/BasicTables/TableGudang';

export default function Tables() {
  return (
    <>
      <PageMeta title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template" description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <TableToko />
        </div>
        {/* <div className="col-span-12">
          <TableGudang />
        </div> */}
      </div>
    </>
  );
}
