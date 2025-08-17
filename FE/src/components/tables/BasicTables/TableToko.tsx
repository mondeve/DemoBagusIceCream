import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import { Dropdown } from '../../ui/dropdown/Dropdown';
import { DropdownItem } from '../../ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../../../icons';

export default function TableToko() {
  const [isOpenToggle, setIsOpen] = useState(false);
  const [rows, setRows] = useState<Array<any>>([]);

  function toggleDropdown() {
    setIsOpen(!isOpenToggle);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  useEffect(() => {
    const load = () => {
      try {
        const rawNoo = localStorage.getItem('noo_entries') || '[]';
        const noo = JSON.parse(rawNoo) as any[];
        const rawRo = localStorage.getItem('ro_entries') || '[]';
        const ro = JSON.parse(rawRo) as any[];

        const computed = (Array.isArray(noo) ? noo : []).map((n) => {
          const kode = n.kodeToko || '';
          // Only count NOO ice-cream quantities if its statusIceCream is 'terkirim'
          const nooIceTerkirim = typeof n.statusIceCream === 'string' && n.statusIceCream.toLowerCase() === 'terkirim';
          const base = {
            p1: nooIceTerkirim ? Number(n.p1) || 0 : 0,
            p2: nooIceTerkirim ? Number(n.p2) || 0 : 0,
            p3: nooIceTerkirim ? Number(n.p3) || 0 : 0,
            p4: nooIceTerkirim ? Number(n.p4) || 0 : 0,
            p5: nooIceTerkirim ? Number(n.p5) || 0 : 0,
          };

          // only include RO entries that have status 'terkirim'
          const roForToko = (Array.isArray(ro) ? ro : []).filter((r) => r.kodeToko === kode && typeof r.status === 'string' && r.status.toLowerCase() === 'terkirim');
          const roSum = roForToko.reduce(
            (acc, r) => {
              return {
                p1: acc.p1 + (Number(r.p1) || 0),
                p2: acc.p2 + (Number(r.p2) || 0),
                p3: acc.p3 + (Number(r.p3) || 0),
                p4: acc.p4 + (Number(r.p4) || 0),
                p5: acc.p5 + (Number(r.p5) || 0),
              };
            },
            { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 }
          );

          const p1 = base.p1 + roSum.p1;
          const p2 = base.p2 + roSum.p2;
          const p3 = base.p3 + roSum.p3;
          const p4 = base.p4 + roSum.p4;
          const p5 = base.p5 + roSum.p5;
          const total = p1 + p2 + p3 + p4 + p5;

          return {
            kodeToko: kode,
            namaToko: n.namaToko || '',
            namaPemilik: n.namaPemilik || '',
            nikKtp: n.nikKtp || '',
            ktpDataUrl: n.ktpDataUrl || n.ktpFileName || '',
            alamatToko: n.alamatToko || '',
            kecamatan: n.kecamatan || '',
            desa: n.desa || '',
            koordinat: n.koordinat || '',
            dayaListrik: n.dayaListrik || '',
            outletDataUrl: n.outletDataUrl || n.outletFileName || '',
            p1,
            p2,
            p3,
            p4,
            p5,
            total,
          };
        });

        setRows(Array.isArray(computed) ? computed : []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load toko data', err);
        setRows([]);
      }
    };

    load();

    const onNoo = () => load();
    const onRo = () => load();
    window.addEventListener('noo_entries_updated', onNoo);
    window.addEventListener('ro_entries_updated', onRo);
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'noo_entries' || ev.key === 'ro_entries') load();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('noo_entries_updated', onNoo);
      window.removeEventListener('ro_entries_updated', onRo);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tabel Toko</h3>
          <div className="relative inline-block">
            <button aria-label="More actions" className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpenToggle} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem onClick={() => {}} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                wait
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="max-w-[1000px] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-h-[500px] overflow-auto overflow-x-auto max-w-full custom-scrollbar">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Pemilik
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    NIK KTP
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    KTP
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Alamat Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kecamatan
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Desa
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Titik Koordinat Maps
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Daya Listrik
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Outlet
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    P1
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    P2
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    P3
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    P4
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    P5
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-4 text-center text-sm text-gray-500">Tidak ada data.</TableCell>
                  </TableRow>
                ) : (
                  rows.map((r, i) => (
                    <TableRow key={r.kodeToko || i}>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{i + 1}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kodeToko}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaToko}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaPemilik}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.nikKtp}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        {r.ktpDataUrl && typeof r.ktpDataUrl === 'string' && (r.ktpDataUrl.startsWith('data:') || r.ktpDataUrl.startsWith('http') || r.ktpDataUrl.includes('/')) ? (
                          <img src={r.ktpDataUrl} alt={`KTP-${r.nikKtp || r.kodeToko || ''}`} className="max-h-20 max-w-[120px] object-contain rounded-md" />
                        ) : r.ktpDataUrl ? (
                          r.ktpDataUrl
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.alamatToko}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kecamatan}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.desa}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.koordinat}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.dayaListrik}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        {r.outletDataUrl && typeof r.outletDataUrl === 'string' && (r.outletDataUrl.startsWith('data:') || r.outletDataUrl.startsWith('http') || r.outletDataUrl.includes('/')) ? (
                          <img src={r.outletDataUrl} alt={`Outlet-${r.namaToko || r.kodeToko || ''}`} className="max-h-20 max-w-[120px] object-contain rounded-md" />
                        ) : r.outletDataUrl ? (
                          r.outletDataUrl
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p1}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p2}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p3}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p4}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p5}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs font-semibold">{r.total}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
