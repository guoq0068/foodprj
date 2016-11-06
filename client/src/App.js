import React, { Component } from 'react';
import Client from './Client';
import io from 'socket.io-client';
import MyDatePicker from './MyDatePicker';
import {withRouter} from 'react-router';
import Configfile from './ConfigFile';


const LATERENCE_FOR_EATTIME = 45 //吃饭时间距离下单时间一般是45分钟之后 

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
      commment : '',
      kitchenid: Configfile.KittchenId,
      menukind : this.props.params.id,
    };

    this.initState();

    Client.getOrderNos(this.state.kitchenid, this.state.menukind).then((orders) => {
      this.setState({ordersNums:orders});
    });
  }

  /**
   * 初始化状态数据
   */
   initState() {
     var today  = new Date();
     var time = today.getTime();

     time = time + LATERENCE_FOR_EATTIME * 60 * 1000; //时间增加45分钟

     today.setTime(time);

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

     if(hour < 8) {
       hour = 8;
     }

    if(hour > 22) {
      hour = 22;
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

    /*
     在列表中找到是否食物已经在选中列表中，如果在，把索引记录下来。
     */
    this.state.selectedFoods.map((selectfood, idx) => {
      if (selectfood.id == food.id) {
        index = idx;
        tempfood = selectfood;
      }
    });

    /*
     如果索引为-1，说明是新加的菜，把菜品添加到列表尾部，否则在之前的菜的数量加1。
     */
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
      memo: this.state.commment,
      data: this.state.selectedFoods,
      ordertime : ordertime,
      dinnertime : this.state.dinnerTime.utcValue,
      orderno :  this.state.ordersNums[this.state.currentSelectDay],  //是今天还是明天的订单号。
      kitchenid: this.state.kitchenid,
      menukind : this.state.menukind
    }

    Client.postSelectFood(params);

    this.props.router.push("/");
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


  /**
   * 处理输入框文字变化的事件，更新控件状态。
   * @param e
     */
  handleInputChange(e) {
    this.setState(
        {
          commment: e.target.value,
        }
    );
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
                  onChangeVaule = {this.handleInputChange.bind(this)}
              />
              <ItemList
                  onFoodSelect= {this.handleItemClick.bind(this)}
                  kitchenid = {this.state.kitchenid}
                  menukind  = {this.state.menukind}
              />
          </div>

      </div>
    );
  }
}


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
    Client.getItems(this.props.kitchenid, this.props.menukind).then((foods) => (
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
          <table className='ui unstackable selectable structured large table'>
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
        <table className='ui unstackable selectable structured large table'>
          <thead>
          <tr>
            <th colSpan='1'>
              <h3>用户订餐 &nbsp;&nbsp;(&nbsp;&nbsp;今天第 {this.props.ordersNums[this.props.currentSelectDay]} 单，加油！)</h3>
            </th>
            <th>
              <button className="ui right floated button"
              onClick={(e) => this.props.onConfimClick(e)}>确定</button>
            </th>
          </tr>

          <tr>
            <th colSpan="2">
            <div className="ui fluid icon input">
              <input type="text" placeholder="请输入备注" onChange={(e) => {this.props.onChangeVaule(e)}}/>
            </div>
              </th>
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

export default withRouter(App);
