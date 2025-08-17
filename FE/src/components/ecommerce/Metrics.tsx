import { useEffect, useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from '../../icons';
import Badge from '../ui/badge/Badge';

export default function Metrics() {
  const [tokoCount, setTokoCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);

  useEffect(() => {
    const compute = () => {
      try {
        const rawNoo = localStorage.getItem('noo_entries') || '[]';
        const noo = JSON.parse(rawNoo) as any[];
        const rawRo = localStorage.getItem('ro_entries') || '[]';
        const ro = JSON.parse(rawRo) as any[];

        const kodeSet = new Set<string>();
        let totalProduct = 0;

        (Array.isArray(noo) ? noo : []).forEach((n) => {
          if (n && n.kodeToko) kodeSet.add(n.kodeToko);
          if (n && typeof n.statusIceCream === 'string' && n.statusIceCream.toLowerCase() === 'terkirim') {
            totalProduct += Number(n.p1) || 0;
            totalProduct += Number(n.p2) || 0;
            totalProduct += Number(n.p3) || 0;
            totalProduct += Number(n.p4) || 0;
            totalProduct += Number(n.p5) || 0;
          }
        });

        (Array.isArray(ro) ? ro : []).forEach((r) => {
          if (r && typeof r.status === 'string' && r.status.toLowerCase() === 'terkirim') {
            totalProduct += Number(r.p1) || 0;
            totalProduct += Number(r.p2) || 0;
            totalProduct += Number(r.p3) || 0;
            totalProduct += Number(r.p4) || 0;
            totalProduct += Number(r.p5) || 0;
          }
        });

        setTokoCount(kodeSet.size);
        setProductCount(totalProduct);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to compute metrics', err);
        setTokoCount(0);
        setProductCount(0);
      }
    };

    compute();
    const onUpdate = () => compute();
    window.addEventListener('noo_entries_updated', onUpdate);
    window.addEventListener('ro_entries_updated', onUpdate);
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'noo_entries' || ev.key === 'ro_entries') compute();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('noo_entries_updated', onUpdate);
      window.removeEventListener('ro_entries_updated', onUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Toko</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{tokoCount.toLocaleString()}</h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Product</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{productCount.toLocaleString()}</h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
