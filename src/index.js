import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import fetchMock from 'fetch-mock';
import FakeRest from 'fakerest';
import faker from 'faker';

let catId = 0;

function buildFakeCat() {
  catId = catId + 1;

  return {
    id: catId,
    name: faker.name.findName(),
    image: `http://placekitten.com/${200 + 3 * catId}/${200 + catId}`
  };
}

const data = {
  cats: [...Array(20)].map(buildFakeCat)
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
