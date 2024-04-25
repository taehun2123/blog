import { useEffect } from 'react';
import './App.css';
import Router from "./Router";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Include AOS CSS styles

function App() {
  useEffect(() => {
    AOS.init({
      // AOS options here
    });
  }, []);
  
  return (
    <>
      <Router/>
    </>
  );
}

export default App