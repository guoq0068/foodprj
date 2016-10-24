import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './src/App';
import CookList from './src/components/CookList';
import OrderList from './src/components/OrderList';
import './src/index.css';
import './src/semantic-ui/semantic.min.css';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={OrderList} />
        <Route path="/neworder" component={App} />
        <Route path="/cooklist" component={CookList} />
        <Route path="/orderlist" component={OrderList} />
    </Router>,
    document.getElementById('react-container')
);
