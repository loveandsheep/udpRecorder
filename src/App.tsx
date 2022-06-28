import React, { useState } from 'react';
import { Tabs, Tab, Typography } from '@mui/material';

import Menu from './Menu';
import Spliter from './Spliter';

const divStyle = {
  display: 'flex', 
  // flexDirection: 'column',
  overflow: 'none', 
  width: '100%', 
}

function App() {
  const [value, setTab] = React.useState(0);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  }

  return (
    <>
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Splitter"/>
        <Tab label="Recorder"/>
      </Tabs>
      <div style={divStyle as React.CSSProperties}>
        
        <Spliter index={value}/>
        <Menu index={value}/>
      </div>
    </>
    
  );
}

export default App;
