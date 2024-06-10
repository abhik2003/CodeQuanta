import { BrowserRouter, Route, Routes } from "react-router-dom";
import Compiler from "./Components/Compiler/Compiler";
import Login from "./Components/Login/Login";
import Problem from "./Components/Problem/Problem";
import Register from "./Components/Register/Register";
import Loader from "./Components/Loader/Loader";


function App() {
  return (
 
    <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/register' element={<Register/>} />
      
      <Route exact path='/' element={<Compiler/>}/>
      <Route exact path='/problem/:id' element={<Problem/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
