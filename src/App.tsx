import React from 'react';
import Menu from './Menu';
import Spliter from './Spliter';

const divStyle = {
  display: 'flex', 
  // flexDirection: 'column',
  overflow: 'none', 
  width: '100%', 
}

function App() {
  return (
    <div style={divStyle as React.CSSProperties}>
      <Spliter />
      {/* <Menu/> */}
    </div>
  );
}

export default App;
