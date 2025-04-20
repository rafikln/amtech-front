import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Accueil from './assets/page/accueil';
import Login from './assets/page/login';
import './App.css';

const App = () => {
  const [tokens, setTokens] = useState({
    token: localStorage.getItem('token'),
  });

  return (
    <>
      {/* Définir les routes principales */}
      <Routes>
        <Route path="/" element={<Login setTokens={setTokens} />} />
        <Route
          path="/Accueil/:id"
          element={<Accueil tokens={tokens} setTokens={setTokens} />}
        />
      </Routes>

      {/* Notifications */}
      <Toaster />
    </>
  );
};

export default App;
