import { useEffect, useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';

type RoEntry = {
  namaMD?: string;
  kodeToko?: string;
  idFreezer?: string;
  namaOutlet?: string;
  noHpOutlet?: string;
  alamatLengkapOutlet?: string;
  kecamatanOutlet?: string;
  titikMaps?: string;
  halococo?: number;
  joycupCokelat?: number;
  chocoChone?: number;
  fantasyAlmond?: number;
  fantasyCaramelMalt?: number;
  tanggalPengiriman?: string;
  keterangan?: string;
  createdAt?: string;
};

export default function TableRo() {
  const [entries, setEntries] = useState<RoEntry[]>([]);

  useEffect(() => {
    const loadEntries = () => {
      try {
        const raw = localStorage.getItem('ro_entries') || '[]';
        const parsed = JSON.parse(raw) as RoEntry[];
        setEntries(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load ro_entries from localStorage', err);
        setEntries([]);
      }
    };

    loadEntries();

    const handleUpdate = () => loadEntries();
    window.addEventListener('ro_entries_updated', handleUpdate);
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'ro_entries') loadEntries();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('ro_entries_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <>
      <PageMeta title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template" description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <PageBreadcrumb pageTitle="Tables" />
      <ComponentCard title="Tabel 2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama MD
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    ID Freezer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Outlet
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No Hp Outlet
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Alamat Lengkap Outlet
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kecamatan Outlet
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Titik Lat & Long Maps
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Halochoco
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Joycup Cokelat
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    23 Choco Cone
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Fantasy Almond
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Fantasy Caramel Malt
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Pengiriman
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Keterangan
                  </TableCell>
                </TableRow>
              </TableHeader>
              {/* Table Body */}
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-4 text-center text-sm text-gray-500">Tidak ada data RO. Silakan isi Form RO terlebih dahulu.</TableCell>
                  </TableRow>
                ) : (
                  entries.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaMD || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kodeToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.idFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaOutlet || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.noHpOutlet || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.alamatLengkapOutlet || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kecamatanOutlet || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.titikMaps || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.halococo ?? '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.joycupCokelat ?? '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.chocoChone ?? '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.fantasyAlmond ?? '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.fantasyCaramelMalt ?? '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggalPengiriman || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.keterangan || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
