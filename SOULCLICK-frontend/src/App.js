// export default App
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import HomeLayout from './components/HomeLayout';
import CreateUserForm from './features/users/CreateUserForm'
import PersistLogin from './features/auth/PersistLogin';
import Prefetch from './features/auth/Prefetch';
import useTitle from './hooks/useTitle';
import Welcome from './features/auth/Welcome/Welcome';
import RequireAuth from './features/auth/RequireAuth';
import SuccessCreationPage from './UtilityPage/SuccessCreation';
import Chat from './features/chat/Chat';

function App() {
  useTitle('SOULCLICK: Meet your truly HERE')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="signup" element={<CreateUserForm />} />
        <Route path="success-creation" element={<SuccessCreationPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Prefetch />}>
              <Route path="/" element={<HomeLayout />}>
                <Route path="discover" element={<Welcome />} />
                <Route path="messages" element={<Chat />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;