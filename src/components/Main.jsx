import '../styles/Main.scss'
import '../styles/Index.scss'
import Formulario from './Formulario'

const Main = () => {
  return (
    <section className='cg-main flex'>
        <div className='c-img'>
            <img src="/background.png" alt="" />
        </div>
        <Formulario />
    </section>
  )
}

export default Main