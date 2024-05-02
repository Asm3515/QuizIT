import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let data = localStorage.getItem('user');
    setUser(JSON.parse(data));
  }, []);

  return (
    <Outlet context={[user, setUser]} />
  );
}

export default App;
