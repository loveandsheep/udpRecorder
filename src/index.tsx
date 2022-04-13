import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { Box } from '@mui/system';
import './index.css';

export const myTheme = createTheme({
  palette: {
    // mode: 'light',
    primary: {
      main: '#5f0eab',//'#395664',
    },
    secondary: {
      main: '#eff759',
    },
    info: {
      main: '#333333',
    },
    error: {
      main: '#ff0051',
    },
    background: {
      default: '#eeeeee',
      paper: '#ffffff',
    },
  },
});

const boxStyle = {
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  margin: '0px',
  background: myTheme.palette.background.default,
}

ReactDOM.render(
  <React.StrictMode>
    <Box style={boxStyle}>
      <ThemeProvider theme={myTheme}>
        <App />
      </ThemeProvider>        
    </Box>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
