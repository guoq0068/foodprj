/**
 * Created by guoq on 16/12/10.
 */
import  React, { Component } from 'react';
import  {Client} from '../../Client';


class Company extends Component {

    constructor(props) {
        super(props);

        this.state = {
            companylist: []
        }
        Client.getCompanyList('1').then(
            (companylist) => {
                this.state.companylist = companylist;
            }
        )
    }




    render() {

    }
}

export default Company;