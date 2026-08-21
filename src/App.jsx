import { Fragment } from "react"
import './App.css'
import { Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from "./pages/DashboardPage"
import AddExpensePage from "./pages/AddExpensePage"
import UpdateExpensePage from "./pages/UpdateExpensePage"
import HelpPage from "./pages/HelpPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

function App() {

  return (
    <Fragment>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/reset" element={<ForgotPasswordPage/>} />
        <Route path='/dashboard' element={<ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>} />
        <Route path='/add' element={<ProtectedRoute><AddExpensePage /></ProtectedRoute>} />
        <Route path='/update/:id' element={<ProtectedRoute>
            <UpdateExpensePage />
          </ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='/help' element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  )
}

export default App
