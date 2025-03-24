import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

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
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/list' element={<StudentsList />} />
          <Route path='/createStudent' element={<CreateStudent />} />
          <Route path='/assignTask/:id' element={<AssignTask />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App