import { BrowserRouter, Route, Routes } from "react-router-dom";
import Compiler from "./Components/Compiler/Compiler";
import Login from "./Components/Login/Login";
import Problem from "./Components/Problem/Problem";


function App() {
  return (
 
    <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/' element={<Compiler/>}/>
      <Route exact path='/problem' element={<Problem/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
