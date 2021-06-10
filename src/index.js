import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

let loadingDoneTimeout;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('stream-root'),
  function(){
    clearTimeout( loadingDoneTimeout );
    loadingDoneTimeout = setTimeout(function(){
      document.getElementById('stream-root').classList.remove('loading')
    }, 500 );    
  }
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
