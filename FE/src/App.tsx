import { BrowserRouter as Router, Routes, Route } from 'react-router';
// import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from './pages/OtherPage/NotFound';
// import UserProfiles from "./pages/UserProfiles";
import Videos from './pages/UiElements/Videos';
import Images from './pages/UiElements/Images';
import Alerts from './pages/UiElements/Alerts';
import Badges from './pages/UiElements/Badges';
import Avatars from './pages/UiElements/Avatars';
import Buttons from './pages/UiElements/Buttons';
import LineChart from './pages/Charts/LineChart';
import BarChart from './pages/Charts/BarChart';
import Calendar from './pages/Calendar';
import Blank from './pages/Blank';
import AppLayout from './layout/AppLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import Home from './pages/Dashboard/Home';
import FormNoo from './pages/Forms/FormNoo';
import FormRo from './pages/Forms/FormRo';
import TableNoo from './pages/Tables/TableNoo';
import TableRo from './pages/Tables/TableRo';
import Tables from './pages/Tables/Tables';
import Dashboard from './pages/Dashboard/dashboard';

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/eco" element={<Home />} />
            <Route index path="/" element={<Dashboard />} />

            {/* Others Page */}
            {/* <Route path="/profile" element={<UserProfiles />} /> */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            {/* <Route path="/form-elements" element={<FormElements />} /> */}
            <Route path="/form-noo" element={<FormNoo />} />
            <Route path="/form-ro" element={<FormRo />} />

            {/* Tables */}
            {/* <Route path="/basic-tables" element={<BasicTables />} />
            <Route path="/freezer" element={<Freezer />} /> */}
            <Route path="/table-noo" element={<TableNoo />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/table-ro" element={<TableRo />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          {/* <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
