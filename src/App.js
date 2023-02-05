import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from "react";

function App(props) {

  const [text, setText] = useState("Text 1");

  const click = () => {
    setText("Text 2");
  }

  // Acciones justo despues de actualizar un estado 
	useEffect(() => {
		console.log("Estado actualizado")
	}, [text]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={click}>Press</button>
        {text}
      </header>
    </div>
  );
}

export default App;
