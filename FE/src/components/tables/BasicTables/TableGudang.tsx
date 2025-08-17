import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../ui/table';
import { Dropdown } from '../../ui/dropdown/Dropdown';
import { DropdownItem } from '../../ui/dropdown/DropdownItem';
import { MoreDotIcon } from '../../../icons';

export default function TableGudang() {
  const [isOpenToggle, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpenToggle);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 p-8 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Tabel Gudang</h3>
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
                    Nama Barang
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Saldo Awal
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Barang Masuk
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Total Bawa
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Total
                  </TableCell>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
