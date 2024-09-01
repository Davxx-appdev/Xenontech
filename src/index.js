import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Protected from './components/Protected';
import Videos from './pages/Videos';
import WorkForms from './pages/WorkForms';
import FeedBack from './pages/FeedBack';
import AppLayout from './components/AppLayout';
import Guides from './pages/Guides';
import Staff from './pages/Staff';
import Help from './pages/Help';
import Schools from './pages/Schools';
import StaffDetails from './pages/StaffDetails';
import SchoolDetails from './pages/SchoolDetails';
import Bookmarks from './pages/Bookmarks';
import ToDoList from './pages/ToDoList';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AppLayout><Home /></AppLayout>} />
          <Route path="login" element={<Login />} />
          <Route element={<Protected />}>
            <Route path="bookmarks" element={<AppLayout><Bookmarks /></AppLayout>} />
            <Route path="todolist" element={<AppLayout><ToDoList /></AppLayout>} />
            <Route path="videos" element={<AppLayout><Videos /></AppLayout>} />
            <Route path="workforms" element={<AppLayout><WorkForms /></AppLayout>} />
            <Route path="FeedBack" element={<AppLayout><FeedBack /></AppLayout>} />
            <Route path="guides" element={<AppLayout><Guides /></AppLayout>} />
            <Route path="help" element={<AppLayout><Help /></AppLayout>} />
            <Route path="staff/:staffId" element={<AppLayout><StaffDetails /></AppLayout>} />
            <Route path="staff" element={<AppLayout><Staff /></AppLayout>} />
            <Route path="schools" element={<AppLayout><Schools /></AppLayout>} />
            <Route path="schools/:schoolId" element={<AppLayout><SchoolDetails /></AppLayout>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();


