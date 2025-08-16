import { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../components/ui/table';
// Badge not used here
import { Modal } from '../../components/ui/modal';
import { useModal } from '../../hooks/useModal';
import Button from '../../components/ui/button/Button';
import Input from '../../components/form/input/InputField';
import DatePicker from '../../components/form/date-picker';
import { Dropdown } from '../../components/ui/dropdown/Dropdown';
import { DropdownItem } from '../../components/ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../../icons';

type NooEntry = {
  tanggal?: string;
  kodeToko?: string;
  namaSales?: string;
  idSales?: string;
  areaSales?: string;
  namaToko?: string;
  kontakToko?: string;
  namaPemilik?: string;
  nikKtp?: string;
  ktpFileName?: string;
  ktpDataUrl?: string;
  alamatToko?: string;
  kecamatan?: string;
  desa?: string;
  koordinat?: string;
  dayaListrik?: string;
  outletFileName?: string;
  outletDataUrl?: string;
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  createdAt?: string;
  idnFreezer?: string;
  tipeFreezer?: string;
  noPemadam?: string;
  statusFreezer?: string;
  tanggalFreezer?: string;
  driverFreezer?: string;
  statusIceCream?: string;
  tanggalIceCream?: string;
  driverIceCream?: string;
};

export default function TableNoo() {
  const [entries, setEntries] = useState<NooEntry[]>([]);

  // shipping/pengiriman modal state
  const { isOpen: isShipOpen, openModal: openShipModal, closeModal: closeShipModal } = useModal(false);
  // quick 'terkirim' modal state
  const { isOpen: isTerkirimOpen, openModal: openTerkirimModal, closeModal: closeTerkirimModal } = useModal(false);
  const [shipKodeToko, setShipKodeToko] = useState<string>('');
  const [shipStatus, setShipStatus] = useState<string>('');
  const [shipDriver, setShipDriver] = useState<string>('');
  const [shipType, setShipType] = useState<'freezer' | 'icecream' | null>(null);
  // terkirim quick action state
  const [terKodeToko, setTerKodeToko] = useState<string>('');
  const [terTanggal, setTerTanggal] = useState<string>('');
  const [terDriver, setTerDriver] = useState<string>('');
  const [terType, setTerType] = useState<'freezer' | 'icecream' | null>(null);
  // freezer specific
  const [shipIdnFreezer, setShipIdnFreezer] = useState<string>('');
  const [shipTipeFreezer, setShipTipeFreezer] = useState<string>('');
  const [shipNoPemadam, setShipNoPemadam] = useState<string>('');
  const [shipStatusFreezer, setShipStatusFreezer] = useState<string>('');
  // ice cream product counts
  const [shipP1, setShipP1] = useState<string>('0');
  const [shipP2, setShipP2] = useState<string>('0');
  const [shipP3, setShipP3] = useState<string>('0');
  const [shipP4, setShipP4] = useState<string>('0');
  const [shipP5, setShipP5] = useState<string>('0');

  useEffect(() => {
    const loadEntries = () => {
      try {
        const raw = localStorage.getItem('noo_entries') || '[]';
        const parsed = JSON.parse(raw) as NooEntry[];

        // migrate older entries: ensure kodeToko and tanggal exist
        let mutated = false;
        const normalized = (Array.isArray(parsed) ? parsed : []).map((e) => {
          const next = { ...e } as NooEntry;
          if (!next.kodeToko) {
            next.kodeToko = next.namaToko ? next.namaToko.replace(/\s+/g, '').slice(0, 6).toUpperCase() + '-' + String(Date.now()).slice(-4) : 'KT-' + String(Date.now()).slice(-6);
            mutated = true;
          }
          if (!next.tanggal) {
            next.tanggal = next.tanggal || (next.createdAt ? new Date(next.createdAt).toLocaleDateString() : new Date().toLocaleDateString());
            mutated = true;
          }
          return next;
        });

        if (mutated) {
          try {
            localStorage.setItem('noo_entries', JSON.stringify(normalized));
          } catch (err) {
            // ignore storage set errors
          }
        }

        // sort: put entries whose date is today first, then by newest date
        const toDate = (e: NooEntry) => {
          if (e.createdAt) return new Date(e.createdAt);
          if (e.tanggal) {
            const d = new Date(e.tanggal);
            if (!isNaN(d.getTime())) return d;
          }
          return new Date(0);
        };

        const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
        const today = new Date();

        normalized.sort((a, b) => {
          const da = toDate(a);
          const db = toDate(b);
          const aToday = isSameDay(da, today) ? 1 : 0;
          const bToday = isSameDay(db, today) ? 1 : 0;
          if (aToday !== bToday) return bToday - aToday; // today first
          return db.getTime() - da.getTime(); // newest first
        });

        setEntries(normalized);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to load noo_entries from localStorage', err);
        setEntries([]);
      }
    };

    // initial load
    loadEntries();

    // listen for updates from FormNoo so table refreshes immediately
    const handleUpdate = () => loadEntries();
    window.addEventListener('noo_entries_updated', handleUpdate);

    // also listen to storage events (in case another tab updated localStorage)
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'noo_entries') loadEntries();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('noo_entries_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const [isOpenToggle, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpenToggle);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // modal state
  const { isOpen, openModal, closeModal } = useModal(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingEntry, setEditingEntry] = useState<NooEntry | null>(null);

  const openDetail = (idx: number) => {
    setEditingIndex(idx);
    setEditingEntry(entries[idx]);
    openModal();
  };

  const handleFieldChange = (field: keyof NooEntry, value: any) => {
    setEditingEntry((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const submitPengiriman = () => {
    if (!shipKodeToko) {
      // require kodeToko
      // eslint-disable-next-line no-alert
      alert('Kode Toko wajib diisi');
      return;
    }

    try {
      const raw = localStorage.getItem('noo_entries') || '[]';
      const parsed = JSON.parse(raw) as NooEntry[];

      // find by kodeToko only — submissions must update an existing row
      const idx = parsed.findIndex((e) => e.kodeToko === shipKodeToko);

      if (shipType === 'freezer') {
        // validate freezer required fields
        if (!shipIdnFreezer || !shipTipeFreezer || !shipNoPemadam) {
          // eslint-disable-next-line no-alert
          alert('IDN Freezer, Tipe Freezer, dan No Pemadam wajib diisi.');
          return;
        }

        const payload: NooEntry = {
          idnFreezer: shipIdnFreezer,
          tipeFreezer: shipTipeFreezer,
          noPemadam: shipNoPemadam,
          statusFreezer: shipStatusFreezer || 'belum terkirim',
          driverFreezer: shipDriver || '',
          kodeToko: shipKodeToko,
          createdAt: new Date().toISOString(),
        };

        if (idx >= 0) {
          parsed[idx] = { ...parsed[idx], ...payload };
        } else {
          // require existing kodeToko — do not create new rows from pengiriman
          // eslint-disable-next-line no-alert
          alert('Kode Toko tidak ditemukan di tabel. Pilih kodeToko yang tersedia.');
          return;
        }
      } else {
        const p1 = shipP1 || '0';
        const p2 = shipP2 || '0';
        const p3 = shipP3 || '0';
        const p4 = shipP4 || '0';
        const p5 = shipP5 || '0';

        const payload: NooEntry = {
          p1,
          p2,
          p3,
          p4,
          p5,
          statusIceCream: shipStatus || 'belum terkirim',
          driverIceCream: shipDriver || '',
          kodeToko: shipKodeToko,
          createdAt: new Date().toISOString(),
        };

        if (idx >= 0) {
          parsed[idx] = { ...parsed[idx], ...payload };
        } else {
          // require existing kodeToko — do not create new rows from pengiriman
          // eslint-disable-next-line no-alert
          alert('Kode Toko tidak ditemukan di tabel. Pilih kodeToko yang tersedia.');
          return;
        }
      }

      localStorage.setItem('noo_entries', JSON.stringify(parsed));
      setEntries(Array.isArray(parsed) ? parsed : []);
      window.dispatchEvent(new Event('noo_entries_updated'));
      closeShipModal();
      // reset ship form (clear all fields)
      setShipKodeToko('');
      setShipStatus('');
      setShipDriver('');
      setShipType(null);
      // freezer
      setShipIdnFreezer('');
      setShipTipeFreezer('');
      setShipNoPemadam('');
      setShipStatusFreezer('');
      // ice cream
      setShipP1('0');
      setShipP2('0');
      setShipP3('0');
      setShipP4('0');
      setShipP5('0');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit pengiriman', err);
    }
  };

  const submitTerkirim = () => {
    if (!terKodeToko) {
      // eslint-disable-next-line no-alert
      alert('Pilih kode toko terlebih dahulu');
      return;
    }

    if (!terTanggal) {
      // eslint-disable-next-line no-alert
      alert('Tanggal pengiriman wajib diisi');
      return;
    }

    try {
      const raw = localStorage.getItem('noo_entries') || '[]';
      const parsed = JSON.parse(raw) as NooEntry[];
      const idx = parsed.findIndex((e) => e.kodeToko === terKodeToko);
      if (idx < 0) {
        // eslint-disable-next-line no-alert
        alert('Kode Toko tidak ditemukan');
        return;
      }

      if (terType === 'freezer') {
        parsed[idx] = {
          ...parsed[idx],
          tanggalFreezer: terTanggal,
          driverFreezer: terDriver || '',
          statusFreezer: 'terkirim',
        };
      } else if (terType === 'icecream') {
        parsed[idx] = {
          ...parsed[idx],
          tanggalIceCream: terTanggal,
          driverIceCream: terDriver || '',
          statusIceCream: 'terkirim',
        };
      }

      localStorage.setItem('noo_entries', JSON.stringify(parsed));
      setEntries(Array.isArray(parsed) ? parsed : []);
      window.dispatchEvent(new Event('noo_entries_updated'));
      closeTerkirimModal();
      // reset
      setTerKodeToko('');
      setTerTanggal('');
      setTerDriver('');
      setTerType(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to submit terkirim', err);
    }
  };

  const saveEdit = () => {
    if (editingIndex == null || !editingEntry) return;
    try {
      const raw = localStorage.getItem('noo_entries') || '[]';
      const parsed = JSON.parse(raw) as NooEntry[];
      parsed[editingIndex] = editingEntry;
      localStorage.setItem('noo_entries', JSON.stringify(parsed));
      // notify updates and reload
      window.dispatchEvent(new Event('noo_entries_updated'));
      closeModal();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save edited entry', err);
    }
  };

  return (
    <>
      <PageMeta title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template" description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tabel Penjualan (PO)</h3>
          <div className="relative inline-block">
            <button aria-label="More actions" className="dropdown-toggle" onClick={toggleDropdown}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown isOpen={isOpenToggle} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                onClick={() => {
                  setShipType('freezer');
                  openShipModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Pengiriman Freezer
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setTerType('freezer');
                  openTerkirimModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Freezer Terkirim
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setShipType('icecream');
                  openShipModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Pengiriman Ice Cream
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  setTerType('icecream');
                  openTerkirimModal();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Ice Cream Terkirim
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* <div className="px-6 pb-4 flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setShipType('freezer');
              openShipModal();
            }}
          >
            Pengiriman Freezer
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTerType('freezer');
              openTerkirimModal();
            }}
          >
            Freezer Terkirim
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setShipType('icecream');
              openShipModal();
            }}
          >
            Pengiriman Ice Cream
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setTerType('icecream');
              openTerkirimModal();
            }}
          >
            Ice Cream Terkirim
          </Button>
        </div> */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Input
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kode Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Nama Pemilik Toko
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Kontak Toko
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
                    Nama Lengkap Sales
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    ID Sales
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Area Sales
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    IDN Freezer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tipe Freezer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    No Pemadam
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status Freezer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Pengiriman Freezer
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Driver Freezer
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
                    Status Ice Cream
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Tanggal Pengiriman Ice Cream
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Driver Ice Cream
                  </TableCell>
                </TableRow>
              </TableHeader>
              {/* Table Body: render saved entries */}
              <TableBody>
                {entries.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-5 py-4 text-center text-sm text-gray-500">Tidak ada data. Silakan isi Form NOO terlebih dahulu.</TableCell>
                  </TableRow>
                ) : (
                  entries.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggal || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kodeToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaPemilik || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kontakToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.nikKtp || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        {r.ktpDataUrl ? <img src={r.ktpDataUrl} alt={`KTP-${r.nikKtp || ''}`} className="max-h-20 max-w-[120px] object-contain rounded-md" /> : r.ktpFileName || '-'}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.alamatToko || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.kecamatan || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.desa || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.koordinat || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.dayaListrik || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        {r.outletDataUrl ? <img src={r.outletDataUrl} alt={`Outlet-${r.namaToko || ''}`} className="max-h-20 max-w-[120px] object-contain rounded-md" /> : r.outletFileName || '-'}
                      </TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.idSales || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.namaSales || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.areaSales || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.idnFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tipeFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.noPemadam || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.statusFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggalFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.driverFreezer || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p1 || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p2 || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p3 || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p4 || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.p5 || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.statusIceCream || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.tanggalIceCream || '-'}</TableCell>
                      <TableCell className="px-5 py-3 text-start text-theme-xs">{r.driverIceCream || '-'}</TableCell>

                      <TableCell className="px-5 py-3 text-start text-theme-xs">
                        <Button size="sm" variant="outline" onClick={() => openDetail(idx)}>
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* Pengiriman modal */}
      <Modal isOpen={isShipOpen} onClose={closeShipModal} className="max-w-[500px] m-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Pengiriman {shipType === 'freezer' ? 'Freezer' : 'Ice Cream'}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-theme-xs mb-1">Pilih Kode Toko</label>
              <select aria-label="Pilih Kode Toko" className="w-full rounded-md border px-3 py-2" value={shipKodeToko} onChange={(e) => setShipKodeToko(e.target.value)}>
                <option value="">-- Pilih Kode Toko --</option>
                {entries.map((en, i) => (
                  <option key={i} value={en.kodeToko}>
                    {en.kodeToko} - {en.namaToko}
                  </option>
                ))}
              </select>
            </div>

            {shipType === 'freezer' && (
              <>
                <div>
                  <label className="block text-theme-xs mb-1">IDN Freezer</label>
                  <Input value={shipIdnFreezer} onChange={(e: any) => setShipIdnFreezer(e.target.value)} />
                </div>
                <div>
                  <label className="block text-theme-xs mb-1">Tipe Freezer</label>
                  <Input value={shipTipeFreezer} onChange={(e: any) => setShipTipeFreezer(e.target.value)} />
                </div>
                <div>
                  <label className="block text-theme-xs mb-1">No Pemadam</label>
                  <Input value={shipNoPemadam} onChange={(e: any) => setShipNoPemadam(e.target.value)} />
                </div>
              </>
            )}

            {shipType === 'icecream' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-theme-xs mb-1">P1</label>
                    <Input value={shipP1} onChange={(e: any) => setShipP1(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-theme-xs mb-1">P2</label>
                    <Input value={shipP2} onChange={(e: any) => setShipP2(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-theme-xs mb-1">P3</label>
                    <Input value={shipP3} onChange={(e: any) => setShipP3(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-theme-xs mb-1">P4</label>
                    <Input value={shipP4} onChange={(e: any) => setShipP4(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-theme-xs mb-1">P5</label>
                    <Input value={shipP5} onChange={(e: any) => setShipP5(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={closeShipModal}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={submitPengiriman}>
                Kirim
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Terkirim quick modal */}
      <Modal isOpen={isTerkirimOpen} onClose={closeTerkirimModal} className="max-w-[420px] m-4">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">{terType === 'freezer' ? 'Freezer Terkirim' : 'Ice Cream Terkirim'}</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-theme-xs mb-1">Pilih Kode Toko</label>
              <select aria-label="Pilih Kode Toko Terkirim" value={terKodeToko} onChange={(e) => setTerKodeToko(e.target.value)} className="w-full rounded-md border px-3 py-2">
                <option value="">-- Pilih Kode Toko --</option>
                {entries.map((en, i) => (
                  <option key={i} value={en.kodeToko}>
                    {en.kodeToko} - {en.namaToko}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-theme-xs mb-1">Tanggal Pengiriman</label>
              <DatePicker
                id="ter-tanggal"
                defaultDate={terTanggal || undefined}
                onChange={(selectedDates: any) => {
                  const d = Array.isArray(selectedDates) ? selectedDates[0] : selectedDates;
                  if (d instanceof Date) setTerTanggal(d.toISOString().slice(0, 10));
                }}
              />
            </div>
            <div>
              <label className="block text-theme-xs mb-1">Driver</label>
              <Input value={terDriver} onChange={(e: any) => setTerDriver(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={closeTerkirimModal}>
                Batal
              </Button>
              <Button size="sm" variant="primary" onClick={submitTerkirim}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      {/* Detail modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="p-6 max-h-[70vh] overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Detail</h3>
          {editingEntry && (
            <div className="text-theme-xs text-gray-500 mb-4">
              <div>
                Kode Toko: <strong className="text-gray-700">{editingEntry.kodeToko || '-'}</strong>
              </div>
              <div>
                Tanggal Input: <strong className="text-gray-700">{editingEntry.tanggal || '-'}</strong>
              </div>
            </div>
          )}
          {editingEntry ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-theme-xs block mb-1">Nama Lengkap Sales</label>
                <Input value={editingEntry.namaSales || ''} onChange={(e: any) => handleFieldChange('namaSales', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">ID Sales</label>
                <Input value={editingEntry.idSales || ''} onChange={(e: any) => handleFieldChange('idSales', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Nama Toko</label>
                <Input value={editingEntry.namaToko || ''} onChange={(e: any) => handleFieldChange('namaToko', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Kontak Toko</label>
                <Input value={editingEntry.kontakToko || ''} onChange={(e: any) => handleFieldChange('kontakToko', e.target.value)} />
              </div>

              <div>
                <label className="text-theme-xs block mb-1">Nama Pemilik</label>
                <Input value={editingEntry.namaPemilik || ''} onChange={(e: any) => handleFieldChange('namaPemilik', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Alamat Toko</label>
                <Input value={editingEntry.alamatToko || ''} onChange={(e: any) => handleFieldChange('alamatToko', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Koordinat</label>
                <Input value={editingEntry.koordinat || ''} onChange={(e: any) => handleFieldChange('koordinat', e.target.value)} />
              </div>

              <div>
                <label className="text-theme-xs block mb-1">Kecamatan</label>
                <Input value={editingEntry.kecamatan || ''} onChange={(e: any) => handleFieldChange('kecamatan', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Desa</label>
                <Input value={editingEntry.desa || ''} onChange={(e: any) => handleFieldChange('desa', e.target.value)} />
              </div>

              <div>
                <label className="text-theme-xs block mb-1">NIK KTP</label>
                <Input value={editingEntry.nikKtp || ''} onChange={(e: any) => handleFieldChange('nikKtp', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <label className="text-theme-xs block mb-1">KTP (preview)</label>
                  {editingEntry.ktpDataUrl ? <img src={editingEntry.ktpDataUrl} alt="ktp" className="max-h-40 object-contain rounded-md" /> : <div className="text-theme-xs text-gray-500">{editingEntry.ktpFileName || 'Tidak ada file'}</div>}
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">Outlet (preview)</label>
                  {editingEntry.outletDataUrl ? (
                    <img src={editingEntry.outletDataUrl} alt="outlet" className="max-h-48 object-contain rounded-md" />
                  ) : (
                    <div className="text-theme-xs text-gray-500">{editingEntry.outletFileName || 'Tidak ada file'}</div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-theme-xs block mb-1">Daya Listrik</label>
                <Input value={editingEntry.dayaListrik || ''} onChange={(e: any) => handleFieldChange('dayaListrik', e.target.value)} />
              </div>
              <div>
                <label className="text-theme-xs block mb-1">Tanggal Input</label>
                <Input value={editingEntry.tanggal || ''} onChange={(e: any) => handleFieldChange('tanggal', e.target.value)} />
              </div>

              <hr className="my-3" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">IDN Freezer</label>
                  <Input value={editingEntry.idnFreezer || ''} onChange={(e: any) => handleFieldChange('idnFreezer', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">Tipe Freezer</label>
                  <Input value={editingEntry.tipeFreezer || ''} onChange={(e: any) => handleFieldChange('tipeFreezer', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">No Pemadam</label>
                  <Input value={editingEntry.noPemadam || ''} onChange={(e: any) => handleFieldChange('noPemadam', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">Driver Freezer</label>
                  <Input value={editingEntry.driverFreezer || ''} onChange={(e: any) => handleFieldChange('driverFreezer', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">Tanggal Pengiriman Freezer</label>
                  <Input value={editingEntry.tanggalFreezer || ''} onChange={(e: any) => handleFieldChange('tanggalFreezer', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">Status Freezer</label>
                  <Input value={editingEntry.statusFreezer || ''} onChange={(e: any) => handleFieldChange('statusFreezer', e.target.value)} />
                </div>
              </div>

              <hr className="my-3" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">P1</label>
                  <Input value={editingEntry.p1 || ''} onChange={(e: any) => handleFieldChange('p1', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">P2</label>
                  <Input value={editingEntry.p2 || ''} onChange={(e: any) => handleFieldChange('p2', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">P3</label>
                  <Input value={editingEntry.p3 || ''} onChange={(e: any) => handleFieldChange('p3', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">P4</label>
                  <Input value={editingEntry.p4 || ''} onChange={(e: any) => handleFieldChange('p4', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">P5</label>
                  <Input value={editingEntry.p5 || ''} onChange={(e: any) => handleFieldChange('p5', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">Status Ice Cream</label>
                  <Input value={editingEntry.statusIceCream || ''} onChange={(e: any) => handleFieldChange('statusIceCream', e.target.value)} />
                </div>
                <div>
                  <label className="text-theme-xs block mb-1">Tanggal Pengiriman Ice Cream</label>
                  <Input value={editingEntry.tanggalIceCream || ''} onChange={(e: any) => handleFieldChange('tanggalIceCream', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-theme-xs block mb-1">Driver Ice Cream</label>
                  <Input value={editingEntry.driverIceCream || ''} onChange={(e: any) => handleFieldChange('driverIceCream', e.target.value)} />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={saveEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 ring-red-200 hover:bg-red-50"
                  onClick={() => {
                    // delete by kodeToko for safety
                    if (!editingEntry || !editingEntry.kodeToko) return;
                    const kode = editingEntry.kodeToko;
                    const raw = localStorage.getItem('noo_entries') || '[]';
                    const parsed = JSON.parse(raw) as NooEntry[];
                    const filtered = parsed.filter((p) => p.kodeToko !== kode);
                    try {
                      localStorage.setItem('noo_entries', JSON.stringify(filtered));
                    } catch (err) {
                      // ignore storage write errors
                    }
                    setEntries(filtered);
                    setEditingIndex(null);
                    setEditingEntry(null);
                    window.dispatchEvent(new Event('noo_entries_updated'));
                    closeModal();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div>Tidak ada data</div>
          )}
        </div>
      </Modal>
    </>
  );
}
