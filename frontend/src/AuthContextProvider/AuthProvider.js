import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState([false]);
  const [loaded,setLoaded]=useState(false)
  const login = (data) => {
    console.log(data)
    localStorage.setItem('CQ_token', data.user.token)
    setIsAuthenticated([true, { name: data.user.name, email: data.user.email, id: data.user.id, admin:data.user.admin, userName:data.user.userName }]);
  };

  const logout = () => {
    localStorage.removeItem('CQ_token')
    setIsAuthenticated([false]);
  };

  const fetchdatalogin = async () => {
    const token = localStorage.getItem('CQ_token')
    console.log(token)
    if (token) {
      const headers = {
        "Authorization": `Bearer ${token}`
      };
      await axios.post(`http://127.0.0.1:5000/login`, {}, { headers }).then((result) => {
        console.log(result.data)
        const { user } = result.data
        setIsAuthenticated([true, user])
        setLoaded(true)
      }).catch((error) => {
        console.log(error.response)
        setLoaded(true)
      })

    }
  }
  useEffect(() => {
    
  fetchdatalogin()
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout,loaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };