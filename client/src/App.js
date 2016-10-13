import React, { Component } from 'react';
import Client from './Client';
import io from 'socket.io-client';
import MyDatePicker from './MyDatePicker';


const IP = 'localhost';
const PORT = 3000;

class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      selectedFoods: [],
      dinnerTime: {
        day     : '0',
        hour    : '08',
        minute  : '10',
        utcValue   :  0
      },
      ordersNums : [],
      currentSelectDay : 0,
    };

    this.initState();

    Client.getOrderNos().then((orders) => {
      this.setState({ordersNums:orders});
    });
  }

  /**
   * 初始化状态数据
   */
   initState() {
     var today  = new Date();
     var minute = today.getMinutes();

     minute     = (parseInt(minute / 10) + 1) * 10;
     minute = minute % 60;


     today.setMinutes(minute, 0, 0);

     var strHour    = '0';
     var strMinute  = '';
     var hour = today.getHours();



     if(minute == 0) {
       strMinute = '00';
       hour = hour + 1;
     }
     else {
       strMinute = strMinute + minute;
     }

     if(hour < 10) {
       strHour = strHour + hour;
     }
     else {
       strHour = ''  + hour;
     }
     this.state.dinnerTime.hour    = strHour;
     this.state.dinnerTime.minute  = strMinute;
     this.state.dinnerTime.utcValue = today.getTime();

   }


  handleSelectedFoodClick(idx) {
    var selectfood = this.state.selectedFoods[idx];

    if(selectfood.count > 1) {

      this.state.selectedFoods.splice(idx, 1, {
        name: selectfood.name,
        id: selectfood.id,
        count: selectfood.count - 1
      })

      this.setState(this.state.selectedFoods);

    }
    else {
      this.setState({
        selectedFoods: [
          ...this.state.selectedFoods.slice(0, idx),
          ...this.state.selectedFoods.slice(
              idx + 1, this.state.selectedFoods.length
          ),
        ],
      });
    }


  }

  /**
   * 单击菜名,该菜进入到订单中. 如果已经有这道菜, 则数字加1.
   * @param food
     */
  handleItemClick(food) {
    var index = -1;
    var tempfood = {};
    this.state.selectedFoods.map((selectfood, idx) => {
      if (selectfood.id == food.id) {
        index = idx;
        tempfood = selectfood;
      }
    });

    if(index != -1) {

      this.state.selectedFoods.splice(index, 1, {
        name: food.name,
        id: food.id,
        count: tempfood.count + 1
      })
    }
    else {
      this.state.selectedFoods = this.state.selectedFoods.concat({
        name:food.name,
        id: food.id,
        count:1});

    }

    this.setState({
      selectedFoods: this.state.selectedFoods
    });
  }


  /**
   * 提交菜单信息
   */
  handleSubmit() {
     if(this.state.selectedFoods.length == 0) {
       alert("忘了选择订单了吧");
       return;
     }
    console.log(JSON.stringify(this.state.selectedFoods));
    console.log(this.state.dinnerTime);

    var ordertime = new Date().getTime();

    var params = {
      memo:"不要辣",
      data: this.state.selectedFoods,
      ordertime : ordertime,
      dinnertime : this.state.dinnerTime.utcValue,
      orderno :  this.state.ordersNums[this.state.currentSelectDay]
    }

    Client.postSelectFood(params);
  }


  /**
   * 当时间变化的时候记录一下
   * @param type
   * @param value
   */
  handleChangeDateValue(value) {
      var date = new Date();

      //设置日期
      if(value.day == '1') {
        date.setDate(date.getDate() + 1);
      }

      date.setHours(value.hour, value.minute, 0, 0);

      this.state.dinnerTime.hour      = value.hour;
      this.state.dinnerTime.minute    = value.minute;
      this.state.dinnerTime.utcValue  = date.getTime();

      this.setState(
          {currentSelectDay: parseInt(value.day)});
  }

  render() {
    return (
      <div className='App'>
          <div className="ui text container">
              <MyDatePicker
                  handleChangeValue = {this.handleChangeDateValue.bind(this)}
                  dinnerTime = {this.state.dinnerTime}
              />
              <SelectedItems
                  foods = {this.state.selectedFoods}
                  onFoodRemove={this.handleSelectedFoodClick.bind(this)}
                  onConfimClick={this.handleSubmit.bind(this)}
                  ordersNums = {this.state.ordersNums}
                  currentSelectDay = {this.state.currentSelectDay}
              />
              <ItemList
                  onFoodSelect= {this.handleItemClick.bind(this)}
              />
          </div>

      </div>
    );
  }
}

//add by guoq-s
class ChatButton extends Component {



  initSocket() {
    console.log("initSocket called");
    this.socket = io('http://' + IP + ':' + PORT);
    this.socket.on('connect', this.connect.bind(this));
    this.socket.on('disconnect', this.disconnect.bind(this));
  }

  connect() {
    console.log('Connected: %s', this.socket.id);

  }

  disconnect() {
    console.log('Disconnected: %s', this.socket.id);
    //this.setState({ status: 'disconnected' });
  }

  onError(err) {
    console.log('Error occups %s', err);
  }

  connectServer(){
    console.log("connectServer called  1");
    this.initSocket();

    console.log("connect server is called");
  }
  
  sendMessage() {
    console.log("send message is called id = %s", this.socket.id);
    this.socket.emit("message", "gogogo");
  }

  render() {

    return (
      <div id="connect_server">
        <button className="ui button"  onClick={this.connectServer.bind(this)}>Connect</button>
        <button className="ui button"  onClick={this.sendMessage.bind(this)}>Send Message</button>

      </div>
    );
  }
}
//add by guoq-e



/**
 *  菜单描画的类。
 */
class ItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      matchingFoods: [],
      showRemoveIcon: false,
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearchCancel = this.handleSearchCancel.bind(this);
    Client.getItems().then((foods) => (
        this.setState({
            matchingFoods: foods,
            showRemoveIcon: true,
        })
    ));
  }


  handleSearchChange() {
    const query = this.refs.search.value;

    if (query === '') {
      this.setState({
        matchingFoods: [],
        showRemoveIcon: false,
      });
    } else {
      Client.search(query).then((foods) => (
          this.setState({
            matchingFoods: foods.slice(0, MATCHING_ITEM_LIMIT),
            showRemoveIcon: true,
          })
      ));
    }
  }


  handleSearchCancel() {
    this.setState({
      allItems: [],
      showRemoveIcon: false,
    });
    this.refs.search.value = '';
  }



  /**
   *
   * @returns {XML}
     */
  render() {
    const removeIconStyle = (
        this.state.showRemoveIcon ? {} : { display: 'none' }
    );
    return (
        <div id='food-search'>
          <table className='ui selectable structured large table'>
            <thead>
            <tr  hidden="true">
              <th colSpan='5'>
                <div className='ui fluid search'>
                  <div className='ui icon input'>
                    <input
                        className='prompt'
                        type='text'
                        placeholder='Search foods...'
                        ref='search'
                        onChange={this.handleSearchChange}
                    />
                    <i className='search icon' />
                  </div>

                  <i
                      className='remove icon'
                      style={removeIconStyle}
                      onClick={this.handleSearchCancel}
                  />
                </div>
              </th>
            </tr>
            <tr>
                <th>全部菜</th>
            </tr>
            </thead>
            <tbody>
            {
              this.state.matchingFoods.map((item, idx) => (
                  <tr
                      key={idx}
                      onClick={() => this.props.onFoodSelect(item)}
                  >
                    <td>{item.name}</td>
                  </tr>
              ))
            }
            </tbody>
          </table>
        </div>
    );
  }
}


class SelectedItems extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return  (
        <table className='ui selectable structured large table'>
          <thead>
          <tr>
            <th colSpan='1'>
              <h3>用户订餐({this.props.ordersNums[this.props.currentSelectDay]}份)</h3>
            </th>
            <th>
              <button className="ui right floated button"
              onClick={this.props.onConfimClick}>确定</button>
            </th>
          </tr>
          <tr>
            <th>菜名</th>
            <th>份数</th>
          </tr>
          </thead>
          <tbody>
          {
            this.props.foods.map((food, idx) => (
                <tr
                    key={idx}
                    onClick={() => this.props.onFoodRemove(idx)}
                >
                  <td>{food.name}</td>
                  <td>{food.count}</td>
                </tr>
            ))
          }
          </tbody>
        </table>
    );
  }
}

export default App;
