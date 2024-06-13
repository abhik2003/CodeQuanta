import { BrowserRouter, Route, Routes } from "react-router-dom";
import Compiler from "./Components/Compiler/Compiler";
import Login from "./Components/Login/Login";
import Problem from "./Components/Problem/Problem";
import Register from "./Components/Register/Register";
import Loader from "./Components/Loader/Loader";
import AllProblemsList from "./Components/AllProblemsList/AllProblemsList";
import ProfilePage from "./Components/Profile/ProfilePage";
import AdminPanel from "./Components/Admin/AdminPanel";


function App() {
  return (
 
    <BrowserRouter>
    <Routes>
      <Route exact path='/login' element={<Login/>} />
      <Route exact path='/register' element={<Register/>} />
      <Route exact path='/problems' element={<AllProblemsList/>} />
      <Route exact path='/profile' element={<ProfilePage/>} />
      <Route exact path='/admin' element={<AdminPanel/>} />

      
      <Route exact path='/compiler' element={<Compiler/>}/>
      <Route exact path='/problem/:id' element={<Problem/>}/>
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
