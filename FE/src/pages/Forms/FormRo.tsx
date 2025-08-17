import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
// import ComponentCard from '../../components/common/ComponentCard.tsx';
import Label from '../../components/form/Label.tsx';
import Input from '../../components/form/input/InputField.tsx';
import Button from '../../components/ui/button/Button';

type RoEntry = {
  kodeToko: string;
  nomorNota?: string;
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
  tanggalPengiriman?: string; // empty initially
  driver?: string; // empty initially
  status?: string; // default 'belum terkirim'
  createdAt?: string;
};

export default function FormRo() {
  const [nooEntries, setNooEntries] = useState<any[]>([]);

  // form state
  const [kodeToko, setKodeToko] = useState('');
  const [nomorNota, setNomorNota] = useState('');
  const [namaToko, setNamaToko] = useState('');
  const [alamatToko, setAlamatToko] = useState('');
  const [titikMaps, setTitikMaps] = useState('');
  const [salesOrder, setSalesOrder] = useState('');
  const [tanggalOrder, setTanggalOrder] = useState(() => new Date().toISOString().slice(0, 10));

  const [p1, setP1] = useState<number | ''>(0);
  const [p2, setP2] = useState<number | ''>(0);
  const [p3, setP3] = useState<number | ''>(0);
  const [p4, setP4] = useState<number | ''>(0);
  const [p5, setP5] = useState<number | ''>(0);

  useEffect(() => {
    const loadNoo = () => {
      try {
        const raw = localStorage.getItem('noo_entries') || '[]';
        const parsed = JSON.parse(raw) as any[];
        setNooEntries(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        setNooEntries([]);
      }
    };
    loadNoo();
    const onUpdate = () => loadNoo();
    window.addEventListener('noo_entries_updated', onUpdate);
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'noo_entries') loadNoo();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('noo_entries_updated', onUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // keep form fields in sync if kodeToko or nooEntries change
  useEffect(() => {
    if (!kodeToko) {
      setNamaToko('');
      setAlamatToko('');
      setTitikMaps('');
      // generate a fallback nomorNota when no kode selected
      setNomorNota(`RO-${String(Date.now()).slice(-6)}`);
      // set tanggal order to today when kode kosong
      setTanggalOrder(new Date().toISOString().slice(0, 10));
      return;
    }
    const found = nooEntries.find((n) => n && n.kodeToko === kodeToko);
    if (found) {
      setNamaToko(found.namaToko || found.namaOutlet || '');
      setAlamatToko(found.alamatToko || found.alamatLengkapOutlet || found.alamat || '');
      setTitikMaps(found.koordinat || found.latitude || found.lonlat || '');
      // generate nomorNota using kodeToko + short timestamp to make it readable and unique
      setNomorNota(`${kodeToko}-${String(Date.now()).slice(-6)}`);
      // ensure tanggal order reflects today when selecting kodeToko
      setTanggalOrder(new Date().toISOString().slice(0, 10));
    } else {
      setNamaToko('');
      setAlamatToko('');
      setTitikMaps('');
      setNomorNota(`RO-${String(Date.now()).slice(-6)}`);
      setTanggalOrder(new Date().toISOString().slice(0, 10));
    }
  }, [kodeToko, nooEntries]);

  const resetForm = () => {
    setKodeToko('');
    setNomorNota('');
    setNamaToko('');
    setAlamatToko('');
    setTitikMaps('');
    setSalesOrder('');
    setTanggalOrder(new Date().toISOString().slice(0, 10));
    setP1(0);
    setP2(0);
    setP3(0);
    setP4(0);
    setP5(0);
  };

  const total = [p1 || 0, p2 || 0, p3 || 0, p4 || 0, p5 || 0].reduce((s, v) => s + Number(v), 0);

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (!kodeToko) {
      // eslint-disable-next-line no-alert
      alert('Pilih kodeToko dari daftar NOO terlebih dahulu');
      return;
    }

    const entry: RoEntry = {
      kodeToko,
      nomorNota,
      namaToko,
      alamatToko,
      titikMaps,
      salesOrder,
      tanggalOrder,
      p1: typeof p1 === 'number' ? p1 : undefined,
      p2: typeof p2 === 'number' ? p2 : undefined,
      p3: typeof p3 === 'number' ? p3 : undefined,
      p4: typeof p4 === 'number' ? p4 : undefined,
      p5: typeof p5 === 'number' ? p5 : undefined,
      total,
      tanggalPengiriman: '',
      driver: '',
      status: 'belum terkirim',
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('ro_entries') || '[]');
      existing.push(entry);
      localStorage.setItem('ro_entries', JSON.stringify(existing));
      try {
        window.dispatchEvent(new Event('ro_entries_updated'));
      } catch (_) {}
      // eslint-disable-next-line no-alert
      alert('Data RO tersimpan. Buka halaman Tables untuk melihat.');
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save RO entry', err);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageMeta title="Form RO" description="Form RO" />
      <PageBreadcrumb pageTitle="Form Penjualan Product" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div>
              <Label htmlFor="kodeToko">Kode Toko</Label>
              <select
                id="kodeToko"
                aria-label="Pilih Kode Toko"
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={kodeToko}
                onChange={(e: any) => {
                  const val = e.target.value;
                  setKodeToko(val);
                  const found = nooEntries.find((n) => n.kodeToko === val);
                  if (found) {
                    setNamaToko(found.namaToko || '');
                    setAlamatToko(found.alamatToko || '');
                    setTitikMaps(found.koordinat || '');
                  }
                }}
              >
                <option value="">-- Pilih Kode Toko --</option>
                {nooEntries.map((n, i) => (
                  <option key={i} value={n.kodeToko}>
                    {n.kodeToko} - {n.namaToko}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-3">
              <div>
                <Label htmlFor="namaToko">Nama Toko</Label>
                <Input type="text" id="namaToko" value={namaToko} onChange={(e: any) => setNamaToko(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="alamatToko">Alamat Toko</Label>
                <Input type="text" id="alamatToko" value={alamatToko} onChange={(e: any) => setAlamatToko(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="titikMaps">Titik Koordinat Maps</Label>
                <Input type="text" id="titikMaps" value={titikMaps} onChange={(e: any) => setTitikMaps(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="salesOrder">Sales Order</Label>
                <Input type="text" id="salesOrder" value={salesOrder} onChange={(e: any) => setSalesOrder(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p1">P1</Label>
                <Input type="number" id="p1" value={p1 as any} onChange={(e: any) => setP1(e.target.value === '' ? 0 : Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="p2">P2</Label>
                <Input type="number" id="p2" value={p2 as any} onChange={(e: any) => setP2(e.target.value === '' ? 0 : Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="p3">P3</Label>
                <Input type="number" id="p3" value={p3 as any} onChange={(e: any) => setP3(e.target.value === '' ? 0 : Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="p4">P4</Label>
                <Input type="number" id="p4" value={p4 as any} onChange={(e: any) => setP4(e.target.value === '' ? 0 : Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="p5">P5</Label>
                <Input type="number" id="p5" value={p5 as any} onChange={(e: any) => setP5(e.target.value === '' ? 0 : Number(e.target.value))} />
              </div>
            </div>
            {/* <div className="mt-4">
              <Label>Total</Label>
              <div className="text-lg font-semibold">{total}</div>
            </div> */}
            <div className="mt-6 flex justify-end">
              <Button size="md" variant="primary" onClick={handleSubmit}>
                Kirim
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
