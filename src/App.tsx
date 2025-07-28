
import './App.css'
import * as Comp from "./components";

const App = () => {

  return (
    <>
      <Comp.Topbar />
      <div className='flex'>
      <Comp.Sidebar />
      <Comp.Dashboard />
      </div>
    </>
  )
}

export default App
