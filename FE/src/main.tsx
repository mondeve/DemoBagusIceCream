import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';
import App from './App.tsx';
import { AppWrapper } from './components/common/PageMeta.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

// Seed localStorage from src/data/noo_dummy_10.json when empty or when ?seed=1 is present
async function seedIfEmpty() {
  try {
    const params = new URLSearchParams(window.location.search);
    const force = params.get('seed') === '1';
    // NOO seeding
    const nooRaw = localStorage.getItem('noo_entries');
    const nooEmpty = !nooRaw || (Array.isArray(JSON.parse(nooRaw)) && JSON.parse(nooRaw).length === 0);
    if (nooEmpty || force) {
      const res = await fetch('/src/data/noo_dummy_10.json');
      if (res.ok) {
        const data = await res.json();
        const existing = JSON.parse(localStorage.getItem('noo_entries') || '[]');
        const merged = [...existing, ...data];
        localStorage.setItem('noo_entries', JSON.stringify(merged));
        window.dispatchEvent(new Event('noo_entries_updated'));
        console.info(`Seeder: added ${data.length} NOO entries (force=${force})`);
      } else {
        console.warn('Seeder: failed to fetch noo dummy JSON', res.status);
      }
    }

    // RO seeding
    const roRaw = localStorage.getItem('ro_entries');
    const roEmpty = !roRaw || (Array.isArray(JSON.parse(roRaw)) && JSON.parse(roRaw).length === 0);
    if (roEmpty || force) {
      const rres = await fetch('/src/data/ro_dummy_10.json');
      if (rres.ok) {
        const rdata = await rres.json();
        const existingRo = JSON.parse(localStorage.getItem('ro_entries') || '[]');
        const mergedRo = [...existingRo, ...rdata];
        localStorage.setItem('ro_entries', JSON.stringify(mergedRo));
        window.dispatchEvent(new Event('ro_entries_updated'));
        console.info(`Seeder: added ${rdata.length} RO entries (force=${force})`);
      } else {
        console.warn('Seeder: failed to fetch ro dummy JSON', rres.status);
      }
    }
  } catch (err) {
    // don't break app on seeder errors
    // eslint-disable-next-line no-console
    console.warn('Seeder error:', err);
  }
}

(async () => {
  await seedIfEmpty();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  );
})();
