/**
 * Created by guoq on 2016/10/21.
 */
import  React, { Component } from 'react';
import  Client from '../../Client';
import io from 'socket.io-client';
import Audio from 'react-howler';
import sound from '../../../res/alert.mp3';
import ConfigFile from '../../ConfigFile';



const PORT = 3000;




class CookList extends Component {

    initSocket() {
        var socket = io('http://' + ConfigFile.IPAddr + ':' + ConfigFile.Port);
        socket.on('neworder', this.getNewOrder.bind(this));
        socket.emit('cooklist', 'hello');
    }

    getNewOrder() {

        Client.getCookList().then((cooklist) => {

            this.setState({
                cookList:cooklist,
                playing:true
            });
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            cookList:[],
            tomorrowCookList: [],
            playing: true,
            beShowTomorrow: false
        };
        this.initSocket();
        this.getNewOrder();
    }

    /**
     * 列表元素点击处理函数
     * @param idx
     * @param food
     */
    handleClick(idx, food) {
        if(typeof(food) == 'underfined') {
            return;
        }
        this.setState({
            cookList: [
                ...this.state.cookList.slice(0, idx),
                ...this.state.cookList.slice(idx+1, this.state.cookList.length)
            ],
            playing: false
        });
        Client.postCookOver(food.orderdetail, food.foodname).then(this.getNewOrder);
    }

    /**
     * 根据订单情况，输出订单的时间
     * @param orders
     * @returns {string}
     */
    printTime(orders) {
        var result = '';
        var date =  new Date();


        orders.map((order, idx) => {
            date.setTime(order.eattime);
            result = result + date.getHours() + '时' + date.getMinutes() + '分' + ',';
        });

        return result;
    }

    /**
     * 处理明天菜单按钮的点击事件。
     */
    handleTomorrowButtonClick() {
        this.setState({beShowTomorrow: !this.state.beShowTomorrow});
        
        Client.getTommorrowCookList().then(
            (cooklist) => {
                this.setState(
                    {
                        tomorrowCookList: cooklist,
                        playing:false
                    });
            }
        )
    }

    render() {
        return (
            <div className="App">
                <div className="ui text container">
                    <div>
                        <div className="ui raised center aligned orange inverted massive segment "
                        onClick = {()=>(this.handleClick(0, this.state.cookList[0]))}>
                            {this.state.cookList[0] ? this.state.cookList[0].foodname : '请先休息一下吧'}
                        </div>
                    </div>
                    <table className='ui unstackable selectable structured large table'>
                        <thead>
                            <tr>
                                <th colSpan="3" className="left aligned">
                                    将要做的菜
                                </th>
                            </tr>

                        </thead>
                        <tbody>
                        {
                            this.state.cookList.map((cook, idx) => (
                                <tr key={idx}
                                    onClick = {() => (this.handleClick(idx, cook))}
                                >
                                    <td>{cook.foodname}

                                    </td>
                                    <td>
                                        {this.printTime(cook.orderdetail)}
                                    </td>
                                    <td>{cook.foodcount}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <table className="ui  unstackable selectable structured  table">
                        <thead>
                        <tr>
                            <th colSpan="3" className="left aligned"
                            onClick = {this.handleTomorrowButtonClick.bind(this)}>
                                {this.state.beShowTomorrow?'隐藏明天的菜':'显示明天的菜的列表'}
                            </th>
                        </tr>
                        </thead>
                        <tbody hidden={!this.state.beShowTomorrow}>
                        {
                            this.state.tomorrowCookList.map((cook, idx) => (
                                <tr key={idx} className="disabled"
                                >
                                    <td>{cook.foodname}

                                    </td>
                                    <td>
                                        {this.printTime(cook.orderdetail)}
                                    </td>
                                    <td>{cook.foodcount}</td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                    <Audio
                        src = {sound}
                        playing = {this.state.playing}
                    />
                </div>
            </div>
        );
    }
}

export  default CookList;
