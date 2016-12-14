/**
 * Created by guoq on 16/12/13.
 */
import  React, { Component } from 'react';
import Client from '../../Client';

class CompanyOrders extends  Component {

    constructor(props) {
        super(props);
        Client.getCompanyOrderList(1, 1).then((result)=> {
            console.log(result);
        })

    }

    render() {
        return (
            <div>
                Hello, CompanyOrder. GoGogo.
            </div>
        );
    }
};


export  default CompanyOrders;
