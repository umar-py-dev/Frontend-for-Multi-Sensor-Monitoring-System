import './app.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/login'
import Dashboard from './pages/dashboard'
import AlertsDetails from './pages/alerts'
import Debug from './pages/debug'
import Reports from './pages/reports'
import DeviceDetails from './pages/deviceDetail'



function App() {

  return(
    <>
    <Router>   
      <Routes> 
        <Route path='/' element={<ProtectedRoute><Navigate to='/Dashboard' /></ProtectedRoute>}></Route>
        <Route path='/login' element={<Login/>}></Route>

        <Route path='/Dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>}></Route>
          
        <Route path='/devices/:id/:type' element={
          <ProtectedRoute>
            <DeviceDetails />
          </ProtectedRoute>}></Route>

        <Route path='/alerts' element={
          <ProtectedRoute>
            <AlertsDetails/>
          </ProtectedRoute>}></Route>

        <Route path='/debug' element={
          <ProtectedRoute>
            <Debug />
          </ProtectedRoute>}></Route>

        <Route path='/reports' element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>}></Route>
          
        


        
      </Routes>
    </Router>
    </>
  )

}

export default App
