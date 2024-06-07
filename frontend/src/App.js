import { BrowserRouter, Route, Routes } from "react-router-dom";
import Compiler from "./Components/Compiler/Compiler";
import Login from "./Components/Login/Login";


function App() {
  return (
 
    <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/' element={<Compiler/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
