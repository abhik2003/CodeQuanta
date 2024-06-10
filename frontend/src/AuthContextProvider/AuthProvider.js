import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState([false]);

  const login = (data) => {
    console.log(data)
    localStorage.setItem('CQ_token',data.user.token)
    setIsAuthenticated([true, {name:data.user.name,email:data.user.email}]);
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
      }).catch((error) => {
        console.log(error.response.data)
      })

    }
  }
  useEffect(() => {
    fetchdatalogin()
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };