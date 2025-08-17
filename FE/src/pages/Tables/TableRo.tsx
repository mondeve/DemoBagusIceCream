import { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
import { Modal } from '../../components/ui/modal';
import { useModal } from '../../hooks/useModal';
import Button from '../../components/ui/button/Button';
import Input from '../../components/form/input/InputField';
import DatePicker from '../../components/form/date-picker';
import { Dropdown } from '../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../components/ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../../icons';

type RoEntry = {
  kodeToko: string;
  namaToko?: string;
  alamatToko?: string;
  titikMaps?: string;
  salesOrder?: string;
  tanggalOrder?: string;
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
  p5?: number;
  total?: number;
  tanggalPengiriman?: string;
  driver?: string;
  status?: string;
  createdAt?: string;
};

export default function TableRo() {
  const [entries, setEntries] = useState<RoEntry[]>([]);

  const [isOpenToggle, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpenToggle);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // modal for detail/edit
  const { isOpen, openModal, closeModal } = useModal(false);
  const [editingEntry, setEditingEntry] = useState<RoEntry | null>(null);

  // pengiriman modal state
  const { isOpen: isShipOpen, openModal: openShipModal, closeModal: closeShipModal } = useModal(false);
  const [shipKodeToko, setShipKodeToko] = useState('');
  const [shipTanggal, setShipTanggal] = useState<string>('');
  const [shipDriver, setShipDriver] = useState<string>('');

  const openDetail = (idx: number) => {
    setEditingEntry(entries[idx]);
    openModal();
  };

  const handleFieldChange = (field: keyof RoEntry, value: any) => {
    setEditingEntry((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const saveEdit = () => {
    if (!editingEntry) return;
    try {
      const raw = localStorage.getItem('ro_entries') || '[]';
      const parsed = JSON.parse(raw) as RoEntry[];
      const idx = parsed.findIndex((r) => r.kodeToko === editingEntry.kodeToko && r.createdAt === editingEntry.createdAt);
      if (idx >= 0) {
        parsed[idx] = editingEntry;
      } else {
        // fallback: try by kodeToko only
        const idx2 = parsed.findIndex((r) => r.kodeToko === editingEntry.kodeToko);
        if (idx2 >= 0) parsed[idx2] = editingEntry;
      }
      localStorage.setItem('ro_entries', JSON.stringify(parsed));
      setEntries(Array.isArray(parsed) ? parsed : []);
      window.dispatchEvent(new Event('ro_entries_updated'));
      closeModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save edited RO entry', err);
    }
  };

  const deleteEntry = () => {
    if (!editingEntry) return;
    try {
      const raw = localStorage.getItem('ro_entries') || '[]';
      const parsed = JSON.parse(raw) as RoEntry[];
      const filtered = parsed.filter((r) => r.kodeToko !== editingEntry.kodeToko || r.createdAt !== editingEntry.createdAt);
      localStorage.setItem('ro_entries', JSON.stringify(filtered));
      setEntries(filtered);
      window.dispatchEvent(new Event('ro_entries_updated'));
      closeModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete RO entry', err);
    }
  };

  const submitPengiriman = () => {
    if (!shipKodeToko) {
      // eslint-disable-next-line no-alert
      alert('Pilih kode toko terlebih dahulu');
      return;
    }
    if (!shipTanggal) {
      // eslint-disable-next-line no-alert
      alert('Tanggal pengiriman wajib diisi');
      return;
    }

    try {
      const raw = localStorage.getItem('ro_entries') || '[]';
      const parsed = JSON.parse(raw) as RoEntry[];

      // find the most recent entry for this kodeToko
      let idx = -1;
      for (let i = parsed.length - 1; i >= 0; i -= 1) {
        if (parsed[i].kodeToko === shipKodeToko) {
          idx = i;
          break;
        }
      }

      if (idx < 0) {
        // eslint-disable-next-line no-alert
        alert('Kode Toko tidak ditemukan di RO');
        return;
      }

      parsed[idx] = {
        ...parsed[idx],
        tanggalPengiriman: shipTanggal || new Date().toISOString().slice(0, 10),
        driver: shipDriver || '',
        status: 'terkirim',
      };

      localStorage.setItem('ro_entries', JSON.stringify(parsed));
      // refresh list and notify
      const normalized = Array.isArray(parsed) ? parsed.slice() : [];
      normalized.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
      setEntries(normalized);
      window.dispatchEvent(new Event('ro_entries_updated'));
      closeShipModal();
      // reset ship form
      setShipKodeToko('');
      setShipTanggal('');
      setShipDriver('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit pengiriman for RO', err);
    }
  };

  useEffect(() => {
    const loadEntries = () => {
      try {
        const raw = localStorage.getItem('ro_entries') || '[]';
        const parsed = JSON.parse(raw) as RoEntry[];

        // sort entries: newest first by createdAt, fallback to tanggalOrder
        const toDate = (e: RoEntry) => {
          if (e && e.createdAt) return new Date(e.createdAt);
          if (e && e.tanggalOrder) {
            const d = new Date(e.tanggalOrder);
            if (!isNaN(d.getTime())) return d;
          }
          return new Date(0);
        };

        const normalized = Array.isArray(parsed) ? parsed.slice() : [];
        normalized.sort((a, b) => toDate(b).getTime() - toDate(a).getTime());

        setEntries(normalized);
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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tabel Penjualan Product</h3>
          <div className="relative inline-block">
            <button aria-label="More actions" className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpenToggle} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onClick={() => {
                  setShipKodeToko('');
                  setShipTanggal('');
                  setShipDriver('');
                  openShipModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Pengiriman
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="max-w-[1000px] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto custom-scrollbar">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Order
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Alamat Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Titik Koordinat Maps
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Sales Order
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
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Pengiriman
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Driver
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
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
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggalOrder || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kodeToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.alamatToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.titikMaps || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.salesOrder || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p1 ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p2 ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p3 ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p4 ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p5 ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.total ?? 0}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggalPengiriman || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.driver || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.status || 'belum terkirim'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openDetail(idx)}>
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Detail modal for RO */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="p-6 max-h-[70vh] overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Detail RO</h3>
          {editingEntry ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-theme-xs block mb-1">Kode Toko</label>
                <Input value={editingEntry.kodeToko} onChange={(e: any) => handleFieldChange('kodeToko', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Nama Toko</label>
                <Input value={editingEntry.namaToko || ''} onChange={(e: any) => handleFieldChange('namaToko', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Alamat Toko</label>
                <Input value={editingEntry.alamatToko || ''} onChange={(e: any) => handleFieldChange('alamatToko', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Titik Koordinat</label>
                <Input value={editingEntry.titikMaps || ''} onChange={(e: any) => handleFieldChange('titikMaps', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Tanggal Order</label>
                <DatePicker
                  id="edit-tanggalOrder"
                  defaultDate={editingEntry.tanggalOrder}
                  onChange={(_sd: any, dateStr?: string) => {
                    if (typeof dateStr === 'string') handleFieldChange('tanggalOrder', dateStr);
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-theme-xs block mb-1">P1</label>
                  <Input value={editingEntry.p1 ?? 0} onChange={(e: any) => handleFieldChange('p1', Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">P2</label>
                  <Input value={editingEntry.p2 ?? 0} onChange={(e: any) => handleFieldChange('p2', Number(e.target.value))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-theme-xs block mb-1">P3</label>
                  <Input value={editingEntry.p3 ?? 0} onChange={(e: any) => handleFieldChange('p3', Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">P4</label>
                  <Input value={editingEntry.p4 ?? 0} onChange={(e: any) => handleFieldChange('p4', Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="text-theme-xs block mb-1">P5</label>
                <Input value={editingEntry.p5 ?? 0} onChange={(e: any) => handleFieldChange('p5', Number(e.target.value))} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Tanggal Pengiriman</label>
                <DatePicker
                  id="edit-tanggalPengiriman"
                  defaultDate={editingEntry.tanggalPengiriman}
                  onChange={(_sd: any, dateStr?: string) => {
                    if (typeof dateStr === 'string') handleFieldChange('tanggalPengiriman', dateStr);
                  }}
                />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Driver</label>
                <Input value={editingEntry.driver || ''} onChange={(e: any) => handleFieldChange('driver', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Status</label>
                <Input value={editingEntry.status || 'belum terkirim'} onChange={(e: any) => handleFieldChange('status', e.target.value)} />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={saveEdit}>
                  Save
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 ring-red-200 hover:bg-red-50" onClick={deleteEntry}>
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div>Tidak ada data</div>
          )}

          {/* Pengiriman Modal placeholder moved below */}
        </div>
      </Modal>

      {/* Pengiriman Modal (separate) */}
      <Modal isOpen={isShipOpen} onClose={closeShipModal} className="max-w-[480px] m-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Form Pengiriman</h3>

          <div className="mb-3">
            <label htmlFor="ship-kodeToko" className="block text-sm font-medium mb-1">
              Kode Toko
            </label>
            <select id="ship-kodeToko" aria-label="Kode Toko" className="w-full border rounded px-2 py-1" value={shipKodeToko} onChange={(e) => setShipKodeToko(e.target.value)}>
              <option value="">-- Pilih Kode Toko --</option>
              {entries.map((r) => (
                <option key={`${r.kodeToko}-${r.createdAt}`} value={r.kodeToko}>
                  {r.kodeToko} - {r.namaToko}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Tanggal Pengiriman</label>
            <DatePicker
              id="ship-tanggal"
              defaultDate={shipTanggal || undefined}
              onChange={(_sd: any, dateStr?: string) => {
                if (typeof dateStr === 'string') setShipTanggal(dateStr);
              }}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Driver</label>
            <Input value={shipDriver} onChange={(e: any) => setShipDriver(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                closeShipModal();
              }}
            >
              Batal
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                submitPengiriman();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
