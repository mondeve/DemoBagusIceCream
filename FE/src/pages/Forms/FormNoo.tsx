import React, { useState, useRef } from 'react';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import ComponentCard from '../../components/common/ComponentCard.tsx';
import Label from '../../components/form/Label.tsx';
import Input from '../../components/form/input/InputField.tsx';
import FileInput from '../../components/form/input/FileInput';
import Button from '../../components/ui/button/Button';
import Select from '../../components/form/Select';

export default function FormNoo() {
  const optionsDayaListrik = [
    { value: '450', label: '450 VA' },
    { value: '900', label: '900 VA' },
    { value: '1300', label: '1300 VA' },
    { value: '2200', label: '2200 VA' },
  ];
  // form state
  const [namaSales, setNamaSales] = useState('');
  const [idSales, setIdSales] = useState('');
  const [areaSales, setAreaSales] = useState('');
  const [namaToko, setNamaToko] = useState('');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [kontakToko, setKontakToko] = useState('');
  const [nikKtp, setNikKtp] = useState('');
  const [ktpFileName, setKtpFileName] = useState('');
  const [ktpDataUrl, setKtpDataUrl] = useState('');
  const [alamatToko, setAlamatToko] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [koordinat, setKoordinat] = useState('');
  const [dayaListrik, setDayaListrik] = useState('');
  const [outletFileName, setOutletFileName] = useState('');
  const [outletDataUrl, setOutletDataUrl] = useState('');

  // refs to clear native file inputs
  const ktpInputRef = useRef<HTMLInputElement | null>(null);
  const outletInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectChange = (value: string) => {
    setDayaListrik(value);
  };

  // read file and set filename + dataUrl for storage/preview
  const handleKtpFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setKtpFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setKtpDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleOutletFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setOutletFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setOutletDataUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setNamaSales('');
    setIdSales('');
    setAreaSales('');
    setNamaToko('');
    setNamaPemilik('');
    setKontakToko('');
    setNikKtp('');
    setKtpFileName('');
    setAlamatToko('');
    setKecamatan('');
    setDesa('');
    setKoordinat('');
    setDayaListrik('');
    setOutletFileName('');
    setKtpDataUrl('');
    setOutletDataUrl('');

    // clear native file input values so the file pickers become empty
    if (ktpInputRef.current) ktpInputRef.current.value = '';
    if (outletInputRef.current) outletInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    // generate kodeToko when not provided: use namaToko (letters) + short timestamp
    const kodeGenerated = namaToko ? namaToko.replace(/\s+/g, '').slice(0, 6).toUpperCase() + '-' + String(Date.now()).slice(-4) : 'KT-' + String(Date.now()).slice(-6);

    const entry = {
      namaSales,
      idSales,
      areaSales,
      namaToko,
      namaPemilik,
      kontakToko,
      // set tanggal (Tanggal Input) to today's date
      tanggal: new Date().toLocaleDateString(),
      kodeToko: kodeGenerated,
      nikKtp,
      ktpFileName,
      ktpDataUrl,
      alamatToko,
      kecamatan,
      desa,
      koordinat,
      dayaListrik,
      outletFileName,
      outletDataUrl,
      createdAt: new Date().toISOString(),
    } as const;

    try {
      const existing = JSON.parse(localStorage.getItem('noo_entries') || '[]');
      existing.push(entry);
      localStorage.setItem('noo_entries', JSON.stringify(existing));
      // notify other windows/components that noo_entries changed
      try {
        window.dispatchEvent(new Event('noo_entries_updated'));
      } catch (evErr) {
        // ignore if dispatch fails in some environments
      }
      // provide quick feedback and clear form
      // eslint-disable-next-line no-alert
      alert('Data tersimpan. Buka halaman Tables untuk melihat.');
      resetForm();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save entry', err);
    }
  };
  return (
    <div>
      <PageMeta title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template" description="This is React.js Form Elements Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template" />
      <PageBreadcrumb pageTitle="Form Penjualan (PO)" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Kolom Kiri */}
        <div className="space-y-6">
          {/* <InputFormNoo /> */}

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div>
              <Label htmlFor="namaSales">Nama Lengkap Sales</Label>
              <Input type="text" id="namaSales" value={namaSales} onChange={(e: any) => setNamaSales(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="idSales">ID Sales</Label>
              <Input type="text" id="idSales" value={idSales} onChange={(e: any) => setIdSales(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="areaSales">Area Sales</Label>
              <Input type="text" id="areaSales" value={areaSales} onChange={(e: any) => setAreaSales(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="namaToko">Nama Toko</Label>
              <Input type="text" id="namaToko" value={namaToko} onChange={(e: any) => setNamaToko(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="namaPemilik">Nama Pemilik Toko</Label>
              <Input type="text" id="namaPemilik" value={namaPemilik} onChange={(e: any) => setNamaPemilik(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kontakToko">Kontak Toko</Label>
              <Input type="text" id="kontakToko" value={kontakToko} onChange={(e: any) => setKontakToko(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="nikKtp">NIK KTP</Label>
              <Input type="text" id="nikKtp" value={nikKtp} onChange={(e: any) => setNikKtp(e.target.value)} />
            </div>
            <div>
              <Label>Upload KTP</Label>
              <FileInput ref={ktpInputRef} onChange={handleKtpFileChange} className="custom-class" ariaLabel="Upload KTP" />
              {ktpFileName ? <div className="mt-1 text-theme-xs text-gray-500">{ktpFileName}</div> : null}
            </div>
            {/* </div> */}
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div>
              <Label htmlFor="alamatToko">Alamat Toko</Label>
              <Input type="text" id="alamatToko" value={alamatToko} onChange={(e: any) => setAlamatToko(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="kecamatan">Kecamatan</Label>
              <Input type="text" id="kecamatan" value={kecamatan} onChange={(e: any) => setKecamatan(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="desa">Desa</Label>
              <Input type="text" id="desa" value={desa} onChange={(e: any) => setDesa(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="koordinat">Titik Koordinat Maps</Label>
              <Input type="text" id="koordinat" value={koordinat} onChange={(e: any) => setKoordinat(e.target.value)} />
            </div>
            <div>
              <Label>Daya Listrik</Label>
              <Select options={optionsDayaListrik} placeholder="Select an option" onChange={handleSelectChange} className="dark:bg-dark-900" defaultValue={dayaListrik} />
            </div>
            <div>
              <Label>Upload Outlet</Label>
              <FileInput ref={outletInputRef} onChange={handleOutletFileChange} className="custom-class" ariaLabel="Upload Outlet" />
              {outletFileName ? <div className="mt-1 text-theme-xs text-gray-500">{outletFileName}</div> : null}
            </div>
          </div>
          <div>
            <Button size="md" variant="primary" onClick={handleSubmit}>
              Kirim
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
