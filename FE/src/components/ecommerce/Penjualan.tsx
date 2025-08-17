import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
// import { Dropdown } from '../ui/dropdown/Dropdown';
// import { DropdownItem } from '../ui/dropdown/DropdownItem';
// import { MoreDotIcon } from '../../icons';
import { useEffect, useState } from 'react';

export default function Penjualan() {
  const weekdayLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const options: ApexOptions = {
    colors: ['#465fff'],
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: weekdayLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const [series, setSeries] = useState([{ name: 'Penjualan', data: [0, 0, 0, 0, 0, 0, 0] }]);
  // dropdown state removed (UI is commented out)

  useEffect(() => {
    const computeWeekdayTotals = () => {
      const totals = [0, 0, 0, 0, 0, 0, 0]; // Mon..Sun

      try {
        const rawNoo = localStorage.getItem('noo_entries') || '[]';
        const noo = JSON.parse(rawNoo) as any[];
        const rawRo = localStorage.getItem('ro_entries') || '[]';
        const ro = JSON.parse(rawRo) as any[];

        const addToTotals = (dateStr: string | undefined, p1: any, p2: any, p3: any, p4: any, p5: any) => {
          if (!dateStr) return;
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return;
          // JS getDay: 0=Sun,1=Mon,...6=Sat. Map to index 0=Mon..6=Sun
          const jsDay = d.getDay();
          const idx = jsDay === 0 ? 6 : jsDay - 1;
          const sum = (Number(p1) || 0) + (Number(p2) || 0) + (Number(p3) || 0) + (Number(p4) || 0) + (Number(p5) || 0);
          totals[idx] += sum;
        };

        (Array.isArray(noo) ? noo : []).forEach((n) => {
          const isTerkirim = n && typeof n.statusIceCream === 'string' && n.statusIceCream.toLowerCase() === 'terkirim';
          if (!isTerkirim) return;
          // use tanggalIceCream as the delivery date for NOO
          addToTotals(n.tanggalIceCream || n.tanggal || undefined, n.p1, n.p2, n.p3, n.p4, n.p5);
        });

        (Array.isArray(ro) ? ro : []).forEach((r) => {
          const isTerkirim = r && typeof r.status === 'string' && r.status.toLowerCase() === 'terkirim';
          if (!isTerkirim) return;
          addToTotals(r.tanggalPengiriman || r.tanggalOrder || undefined, r.p1, r.p2, r.p3, r.p4, r.p5);
        });

        setSeries([{ name: 'Penjualan', data: totals }]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to compute penjualan per weekday', err);
      }
    };

    computeWeekdayTotals();
    const onUpdate = () => computeWeekdayTotals();
    window.addEventListener('noo_entries_updated', onUpdate);
    window.addEventListener('ro_entries_updated', onUpdate);
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'noo_entries' || ev.key === 'ro_entries') computeWeekdayTotals();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('noo_entries_updated', onUpdate);
      window.removeEventListener('ro_entries_updated', onUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Penjualan Harian</h3>
        {/* <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              View More
            </DropdownItem>
            <DropdownItem onItemClick={closeDropdown} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
              Delete
            </DropdownItem>
          </Dropdown>
        </div> */}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
