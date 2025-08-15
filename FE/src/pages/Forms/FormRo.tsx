import React, { useState } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard.tsx';
import Label from '../../components/form/Label.tsx';
import Input from '../../components/form/input/InputField.tsx';
import DatePicker from '../../components/form/date-picker.tsx';
import Button from '../../components/ui/button/Button';
import Halochoco from '../../../public/images/product/halochoco.png';
import Chococone from '../../../public/images/product/23chococone.png';
import JoycapCokelat from '../../../public/images/product/jaycapcokelat.png';
import FantasyAlmond from '../../../public/images/product/fantasyalmond.png';
import FantasyCaramelMalt from '../../../public/images/product/fantasycaramelmalt.png';

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

export default function FormRo() {
  // form state
  const [namaMD, setNamaMD] = useState('');
  const [kodeToko, setKodeToko] = useState('');
  const [idFreezer, setIdFreezer] = useState('');
  const [namaOutlet, setNamaOutlet] = useState('');
  const [noHpOutlet, setNoHpOutlet] = useState('');
  const [tanggalPengiriman, setTanggalPengiriman] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [alamatLengkapOutlet, setAlamatLengkapOutlet] = useState('');
  const [kecamatanOutlet, setKecamatanOutlet] = useState('');
  const [titikMaps, setTitikMaps] = useState('');

  // products
  const [halococo, setHalococo] = useState<number | ''>('');
  const [joycupCokelat, setJoycupCokelat] = useState<number | ''>('');
  const [chocoChone, setChocoChone] = useState<number | ''>('');
  const [fantasyAlmondQty, setFantasyAlmondQty] = useState<number | ''>('');
  const [fantasyCaramelMaltQty, setFantasyCaramelMaltQty] = useState<number | ''>('');

  const resetForm = () => {
    setNamaMD('');
    setKodeToko('');
    setIdFreezer('');
    setNamaOutlet('');
    setNoHpOutlet('');
    setTanggalPengiriman('');
    setKeterangan('');
    setAlamatLengkapOutlet('');
    setKecamatanOutlet('');
    setTitikMaps('');
    setHalococo('');
    setJoycupCokelat('');
    setChocoChone('');
    setFantasyAlmondQty('');
    setFantasyCaramelMaltQty('');
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    const entry: RoEntry = {
      namaMD,
      kodeToko,
      idFreezer,
      namaOutlet,
      noHpOutlet,
      alamatLengkapOutlet,
      kecamatanOutlet,
      titikMaps,
      halococo: typeof halococo === 'number' ? halococo : undefined,
      joycupCokelat: typeof joycupCokelat === 'number' ? joycupCokelat : undefined,
      chocoChone: typeof chocoChone === 'number' ? chocoChone : undefined,
      fantasyAlmond: typeof fantasyAlmondQty === 'number' ? fantasyAlmondQty : undefined,
      fantasyCaramelMalt: typeof fantasyCaramelMaltQty === 'number' ? fantasyCaramelMaltQty : undefined,
      tanggalPengiriman,
      keterangan,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('ro_entries') || '[]');
      existing.push(entry);
      localStorage.setItem('ro_entries', JSON.stringify(existing));
      // notify TableRo
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
      <PageMeta title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template" description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <PageBreadcrumb pageTitle="Form RO" />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Kolom Kiri */}
        <div className="space-y-6">
          <ComponentCard title="Form 1">
            <div>
              <Label htmlFor="namaSales">Nama MD</Label>
              <Input type="text" id="namaSales" value={namaMD} onChange={(e: any) => setNamaMD(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kodeToko">Kode Toko</Label>
              <Input type="text" id="kodeToko" value={kodeToko} onChange={(e: any) => setKodeToko(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="idFrezeer">ID Freezer</Label>
              <Input type="text" id="idFrezeer" value={idFreezer} onChange={(e: any) => setIdFreezer(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nnamaOutlet">Nama Outlet</Label>
              <Input type="text" id="namaOutlet" value={namaOutlet} onChange={(e: any) => setNamaOutlet(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="noHpOutlet">No HP Outlet</Label>
              <Input type="text" id="noHpOutlet" value={noHpOutlet} onChange={(e: any) => setNoHpOutlet(e.target.value)} />
            </div>
            <div>
              <DatePicker
                id="date-picker"
                label="Tanggal Kirim Freezer"
                placeholder="Select a date"
                onChange={(_dates, currentDateString) => {
                  setTanggalPengiriman(currentDateString || '');
                }}
              />
            </div>
          </ComponentCard>
        </div>
        {/* Kolom Kanan */}
        <div className="space-y-6">
          <ComponentCard title="Form 2">
            <div>
              <Label htmlFor="alamatLengkapOutlet">Alamat Lengkap Outlet</Label>
              <Input type="text" id="alamatLengkapOutlet" value={alamatLengkapOutlet} onChange={(e: any) => setAlamatLengkapOutlet(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kecamtanOutlet">Kecamatan Outlet</Label>
              <Input type="text" id="kecamtanOutlet" value={kecamatanOutlet} onChange={(e: any) => setKecamatanOutlet(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="titikMaps">Titik Lat Long Maps</Label>
              <Input type="text" id="titikMaps" value={titikMaps} onChange={(e: any) => setTitikMaps(e.target.value)} />
            </div>
          </ComponentCard>
        </div>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Product">
          <div className="flex justify-between">
            <div>
              <DatePicker
                id="date-picker-2"
                label="Tanggal Kirim Freezer"
                placeholder="Select a date"
                onChange={(_dates, currentDateString) => {
                  setTanggalPengiriman(currentDateString || '');
                }}
              />
            </div>
            <div>
              <Label htmlFor="keterangan">Keterangan (hasil Visit Outlet)</Label>
              <Input type="text" id="keterangan-2" value={keterangan} onChange={(e: any) => setKeterangan(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div>
              <div className="relative">
                <div className="overflow-hidden">
                  <img src={Halochoco} alt="Cover" className="w-50 border border-gray-200 rounded-xl dark:border-gray-800" />
                </div>
              </div>
              <Label htmlFor="halococo">Halococo</Label>
              <Input type="number" id="halococo" value={halococo} onChange={(e: any) => setHalococo(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <div className="relative">
                <div className="overflow-hidden">
                  <img src={JoycapCokelat} alt="Cover" className="w-50 border border-gray-200 rounded-xl dark:border-gray-800" />
                </div>
              </div>
              <Label htmlFor="joycupCokelat">Joycup Cokelat</Label>
              <Input type="number" id="joycupCokelat" value={joycupCokelat} onChange={(e: any) => setJoycupCokelat(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <div className="relative">
                <div className="overflow-hidden">
                  <img src={Chococone} alt="Cover" className="w-50 border border-gray-200 rounded-xl dark:border-gray-800" />
                </div>
              </div>
              <Label htmlFor="chocoChone">23 Choco Cone</Label>
              <Input type="number" id="chocoChone" value={chocoChone} onChange={(e: any) => setChocoChone(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <div className="relative">
                <div className="overflow-hidden">
                  <img src={FantasyAlmond} alt="Cover" className="w-50 border border-gray-200 rounded-xl dark:border-gray-800" />
                </div>
              </div>
              <Label htmlFor="fantasyAlmond">fantasy Almond</Label>
              <Input type="number" id="fantasyAlmond" value={fantasyAlmondQty} onChange={(e: any) => setFantasyAlmondQty(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <div>
              <div className="relative">
                <div className="overflow-hidden">
                  <img src={FantasyCaramelMalt} alt="Cover" className="w-50 border border-gray-200 rounded-xl dark:border-gray-800" />
                </div>
              </div>
              <Label htmlFor="fantasyCaramelMalt">Fantasy Caramel Malt</Label>
              <Input type="number" id="fantasyCaramelMalt" value={fantasyCaramelMaltQty} onChange={(e: any) => setFantasyCaramelMaltQty(e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
          </div>
        </ComponentCard>
        <div>
          <Button size="md" variant="primary" onClick={handleSubmit}>
            Kirim
          </Button>
        </div>
      </div>
    </div>
  );
}
