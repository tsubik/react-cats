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
    { id: 2, patient_id: 1, title: 'My foot' },
    { id: 3, patient_id: 1, title: 'Nice hair' },
    { id: 4, patient_id: 1, title: 'Some stuff' },
    { id: 5, patient_id: 1, title: 'Shittty' },
    { id: 6, patient_id: 1, title: 'Another scan' },
    { id: 7, patient_id: 1, title: 'Supa' },
    { id: 8, patient_id: 1, title: 'My third scan' },
    { id: 9, patient_id: 1, title: 'My third scan' },
    { id: 10, patient_id: 1, title: 'My third scan' },
    { id: 11, patient_id: 1, title: 'My third scan' },
    { id: 12, patient_id: 1, title: 'My third scan' },
    { id: 13, patient_id: 1, title: 'My third scan' }
  ]
};

// initialize fake REST server
const restServer = new FakeRest.FetchServer('http://localhost:3000');
restServer.toggleLogging();
restServer.init(data);
restServer.addResponseInterceptor(function (response) {
  console.log('Response interceptor', response);
  return response;
});
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
