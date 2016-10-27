/**
 * Created by guoq on 2016/10/21.
 */
import  React, { Component } from 'react';
import  Client from '../../Client';
import io from 'socket.io-client';
import Audio from 'react-howler';
import sound from '../../../res/alert.mp3';


const IP = '192.168.1.104';
const PORT = 3000;




class CookList extends Component {

    initSocket() {
        var socket = io('http://' + IP + ':' + PORT);
        socket.on('neworder', this.getNewOrder.bind(this));
        socket.emit('cooklist', 'hello');
    }

    getNewOrder() {

        Client.getCookList().then((cooklist) => {

            this.setState({
                cookList:cooklist,
                playing: true
            });
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            cookList:[],
            playing: true
        };
        this.initSocket();
        this.getNewOrder();
    }

    handleClick(idx, food) {
        this.setState({
            cookList: [
                ...this.state.cookList.slice(0, idx),
                ...this.state.cookList.slice(idx+1, this.state.cookList.length)
            ],
            playing: false,
        });
        Client.postCookOver(food.orderdetail, food.foodname);
    }

    render() {
        return (
            <div className="App">
                <div className="ui text container">
                    <table className='ui unstackable selectable structured large table'>
                        <thead className=" two column">
                        <tr>
                            <th>菜名</th>
                            <th>份数</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.cookList.map((cook, idx) => (
                                <tr key={idx}
                                    onClick = {()=>(this.handleClick(idx, cook))}
                                >
                                    <td>{cook.foodname}</td>
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
