import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import NewOrder from './src/components/NewOrder';
import CookList from './src/components/CookList';
import OrderList from './src/components/OrderList';
import CompanyNewOrder from './src/components/CompanyNewOrder';
import CompanyOrderList from './src/components/CompanyOrders';
import './src/index.css';
import './src/semantic-ui/semantic.min.css';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={OrderList} />
        <Route path="/neworder/:id" component={NewOrder} />
        <Route path="/cooklist" component={CookList} />
        <Route path="/orderlist" component={OrderList} />
        <Route path="/company/neworder" component={CompanyNewOrder} />
        <Route path="/company/orderlist" component={CompanyOrderList} />
        <Route path="/higo" component={CompanyNewOrder} />
     </Router>,
    document.getElementById('react-container')
);
