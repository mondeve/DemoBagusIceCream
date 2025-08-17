import Metrics from '../../components/ecommerce/Metrics';
import Penjualan from '../../components/ecommerce/Penjualan';
// import StatisticsChart from '../../components/ecommerce/StatisticsChart';
import PageMeta from '../../components/common/PageMeta';

export default function Dashboard() {
  return (
    <>
      <PageMeta title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template" description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <Metrics />

          <Penjualan />
        </div>

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}
      </div>
    </>
  );
}
