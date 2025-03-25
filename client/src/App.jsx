import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import AdminSignUp from './pages/AdminSignUp';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Tasks from './pages/Tasks';

import AdminSignIn from './pages/AdminSignIn';
import StudentsList from './pages/StudentsList';
import CreateStudent from './pages/CreateStudent';
import AssignTask from './pages/AssignTask';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin-signIn' element={<AdminSignIn />} />
        <Route path='/sign-up' element={<AdminSignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path='/task' element={<Tasks />} />
          <Route path='/list' element={<StudentsList />} />
          <Route path='/createStudent' element={<CreateStudent />} />
          <Route path='/assignTask/:id' element={<AssignTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App