import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import fetchMock from 'fetch-mock';
import FakeRest from 'fakerest';

const data = {
  patients: [
    { id: 1, name: 'Tomasz', email: 'tsubik@gmail.com', gender: 'M' },
    { id: 2, name: 'Edyta', email: 'edyta@example.com', gender: 'F' }
  ],
  scans: [
    { id: 1, patient_id: 1, title: 'My first scan' },
    { id: 2, patient_id: 1, title: 'My second scan' },
    { id: 3, patient_id: 1, title: 'My third scan' },
    { id: 4, patient_id: 1, title: 'My third scan' },
    { id: 5, patient_id: 1, title: 'My third scan' },
    { id: 6, patient_id: 1, title: 'My third scan' },
    { id: 7, patient_id: 1, title: 'My third scan' },
    { id: 8, patient_id: 1, title: 'My third scan' },
    { id: 9, patient_id: 1, title: 'My third scan' },
    { id: 10, patient_id: 1, title: 'My third scan' },
  ]
};

// initialize fake REST server
const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.toggleLogging();
restServer.init(data);
fetchMock.mock('begin:http://localhost:3000', restServer.getHandler());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
