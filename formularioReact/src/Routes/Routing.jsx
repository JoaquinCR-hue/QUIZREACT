import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../Pages/Home'
import MostrarUsuarios from '../Components/MostrarUsuarios'
import MostrarAdmi from '../Components/MostrarAdmi'
import Productos from '../Pages/Productos'
import Perfil from '../Pages/Perfil'
import GestionTickets from '../Components/GestionTickets'




const Routing = () => {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Usuarios" element={<MostrarUsuarios />} />
        <Route path="/Administradores" element={<MostrarAdmi />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/Perfil" element={<Perfil />} />
        <Route path="/Tickets" element={<GestionTickets />} />
      </Routes>



    </Router>


  )
}

export default Routing