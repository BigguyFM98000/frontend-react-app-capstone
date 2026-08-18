import { Fragment } from "react"
import './App.css'
import { Routes, Route } from 'react-router'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from "./pages/DashboardPage"
import AddExpensePage from "./pages/AddExpensePage"
import UpdateExpensePage from "./pages/UpdateExpensePage"
import HelpPage from "./pages/HelpPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProfilePage from "./pages/ProfilePage"

function App() {

  return (
    <Fragment>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/add' element={<AddExpensePage />} />
        <Route path='/update' element={<UpdateExpensePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Fragment>
  )
}

export default App
