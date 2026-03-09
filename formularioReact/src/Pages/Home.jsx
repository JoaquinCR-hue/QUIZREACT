import FormUsuarios from '../Components/FormUsuarios'
import Navar from '../Components/Navar'
import FormAdmi from '../Components/FormAdmi'

import '../Styles/Home.css'

function Home() {
  return (
    <div className="home-container">
      <Navar />

      <div className="formularios-container">
        <div className="formulario-wrapper">
          <FormUsuarios />
        </div>
        <div className="formulario-wrapper">
          <FormAdmi />
        </div>
      </div>
    </div>
  )
}
export default Home