/**
 * Created by guoq on 2016/10/21.
 */
import  React, {Component} from 'react';
import {withRouter} from 'react-router';
import io from 'socket.io-client';
import {Table} from 'semantic-ui-react';
import ConfigFile from '../../ConfigFile';


class OrderList extends Component {

    constructor(props) {
        super(props);
        this.initSocket();

        this.state = {
            messages: []
        };
    }


    initSocket() {
        var socket = io('http://' + ConfigFile.IPAddr + ':' + ConfigFile.Port);
        socket.on('orderfinished', this.orderFinishedNotify.bind(this));
        socket.on('foodfinished', this.foodFinishedNotify.bind(this) );
        socket.emit('orderlist','hello' );
    }


    /**
     * 一道菜做完的通知
     * @param payload
     */
    foodFinishedNotify(payload) {
        console.log('foodfinished' + payload)
        var json = JSON.parse(payload);

        var foodname  = json.name;

        var menuname  = json.menuname;

        var datas    = JSON.parse(json.data);

        datas.map((data) => {
            var message = foodname + ' 做好了，请装在第 ' + data.orderno + ' 号订单袋中。 (' + menuname + ')';
            this.state.messages = [{content:message,  orderid:data.orderid, foodid:data.foodid},
                ...this.state.messages.slice(0, this.state.messages.length)];


        });

        this.setState({messages:this.state.messages});
        console.log(json);
    }

    /**
     *  接受做完菜的消息，
     * @param payload
     */
    orderFinishedNotify(payload) {
        console.log('orderfinished' + payload);
        var json = JSON.parse(payload);

        var message = json.menuname + '的第 ' + json.orderno  +  ' 订单做完了，请叫快递' ;
        this.state.messages = [
            {content:message, orderid:json.orderid, foodid:json.foodid},
            ...this.state.messages.slice(0, this.state.messages.length)
        ];
        this.setState({messages:this.state.messages});
    }

    handleClick(id) {

        this.props.router.push("/newOrder/" + id);
    }

    render() {
        return (
          <div className="App">
              <div className="ui text container">
                    <div className="ui top attached orange large buttons">
                        <button className="ui  button" onClick={(e)=>{this.handleClick(1)}}>大菜订单</button>
                        <div className="or"></div>
                        <button className="ui  button" onClick={(e)=>{this.handleClick(2)}}>小菜订单</button>
                    </div>
                  <Table celled unstackable>
                      <Table.Header>
                          <Table.Row>
                              <Table.HeaderCell> 要处理的消息 </Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                      <Table.Body>
                          {
                              this.state.messages.map(
                                  (message, idx) => (
                                    <Table.Row>
                                        <Table.Cell>
                                            {message.content}
                                        </Table.Cell>
                                    </Table.Row>
                                  )
                              )
                          }
                      </Table.Body>
                  </Table>
              </div>
          </div>
        );
    }
}

export  default withRouter(OrderList);
