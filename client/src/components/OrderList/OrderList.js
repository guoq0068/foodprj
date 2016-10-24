/**
 * Created by guoq on 2016/10/21.
 */
import  React, {Component} from 'react';
import {withRouter} from 'react-router';


class OrderList extends Component {

    constructor(props) {
        super(props);

    }


    handleClick() {

        console.log("handle click is called");
        console.log(this.props.router);
        this.props.router.push("/newOrder");
    }

    render() {
        return (
          <div className="App">
              <div className="ui text container">
                    <button className="ui left floated button" onClick={this.handleClick.bind(this)}>新订单</button>
              </div>
          </div>
        );
    }
}

export  default withRouter(OrderList);
