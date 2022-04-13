import React from 'react';
import Menu from './Menu';

const divStyle = {
  display: 'flex', 
  overflow: 'none', 
  width: '100%', 
}

function App() {
  return (
    <div style={divStyle}>
      <Menu/>
    </div>
  );
}

export default App;
