/**
 * Created by guoq on 2016/10/21.
 */
import  React, { Component } from 'react';
import  Client from '../../Client';
import io from 'socket.io-client';
import Audio from 'react-howler';
import sound from '../../../res/alert.mp3';
import ConfigFile from '../../ConfigFile';




var socket;

class CookList extends Component {



    initSocket() {
        socket = io('http://' + ConfigFile.IPAddr + ':' + ConfigFile.Port);
        socket.on('neworder', this.getNewOrder.bind(this));
        socket.on('connect', this.onConnect.bind(this));
    }

    onConnect() {
        //链接成功，向服务器端发注册消息。
        var message = {
            type : 'register',
            kittchenid : ConfigFile.KittchenId
        }

        var data = JSON.stringify(message)

        socket.emit('cooklist', data);
    }


    playSound(content) {


        //this.refs.audio.play();


        var str = 'http://' + ConfigFile.IPAddr+ ':' + ConfigFile.Port + '/baidu/text2audio?content=' + content  +
            '&cuid=768443e1-7347-45d9-99d4-3cf947242d84';

        console.log(str);

        this.setState({
            soundurl: str
        }, ()=>{
            console.log(this.refs.audio);
            this.refs.audio.load();
            this.refs.audio.play();});

    }
    notifyUser(orders) {
        var content = '亲，来新订单了！';
        orders.map((order,idx) => {
            content = content + order.name + order.count + "份。";
        });

        console.log(content);
        this.playSound(content);
    }


    getOrderlist() {
        Client.getCookList().then((cooklist) => {

            var content = '亲，现在要做的菜！';


            cooklist.map((cook, idx) => {
                content += cook.foodname + cook.foodcount + "份。";
                cook.orderdetail.map((order, idx) => {
                    if (order.comment != '') {
                        content += cook.count + "份要做成：" + cook.content + "。";
                    }
                });
            });


            this.setState({
                cookList: cooklist,
                playing: true
            });

            if(!this.state.hasNewOrder) {
                this.playSound(content);
            }
        });
    }


    getNewOrder(payload) {

        this.state.hasNewOrder = true;
        this.notifyUser(payload);
        this.getOrderlist();
    }



    constructor(props) {
        super(props);

        this.state = {
            cookList:[],
            tomorrowCookList: [],
            playing: true,
            beShowTomorrow: false,
            baidutoken : '',
            soundurl : '',
            hasNewOrder: false
        }
        ;
        this.initSocket();

    }

    componentDidMount() {
        this.getOrderlist();
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
        this.refs.audio.play();
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

    getComments(cook) {
        var orders = cook.orderdetail;
        var result = '';

        orders.map((order) => {
           if(order.comment) {
               result = (<div className = "ui big segment">
                   <font color="red">{order.count} </font>
                      份要做成
                   <font color="red">
                        &nbsp;{order.comment}
                    </font></div>);
           }
        });

        if(result != '') {
            result = (<div classname = "ui segments">  {result} </div>);
        }
        console.log('getComments' + result);
        return result;
    }

    /*



     <Audio
     src = {sound}
     playing = {this.state.playing}
     />
     */
    render() {
        return (
            <div className="App">
                <div className="ui text container">
                    <div>
                        <div className="ui segments">
                            <div className="ui raised left aligned orange inverted massive segment "
                            onClick = {()=>(this.handleClick(0, this.state.cookList[0]))}>
                                {this.state.cookList[0] ? this.state.cookList[0].foodname : '请先休息一下吧'}
                            </div>
                            <div className = 'ui segments'>
                                {
                                    this.state.cookList[0] ? this.getComments(this.state.cookList[0])
                                        : '辛苦了，大厨，请休息一下吧！'
                                }
                            </div>
                        </div>
                    </div>
                    <table className='ui unstackable  structured large table'>
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
                                idx == 0? '' : (
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
                            )))
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
                    <audio  ref='audio' autoPlay="autoplay" >
                        <source src ={this.state.soundurl}
                                type = 'audio/mp3'>
                        </source>
                    </audio>


                </div>
            </div>
        );
    }
}

export  default CookList;
