/**
 * Created by guoq on 2016/11/17.
 */
import React, { Component } from 'react';
import Client from '../../Client';
import MyDatePicker from '../MyDatePicker';
import {withRouter} from 'react-router';
import Configfile from '../../ConfigFile';



class NewOrder extends Component {


    constructor(props) {
        super(props);

        this.state = {
            selectedFoods: [],
            selectedFoodKeys : [],
            dinnerTime: {
                utcValue   :  0
            },
            ordersNums : [],
            currentSelectDay : 0,
            commment : '',
            kitchenid: Configfile.KittchenId,
            menukind : this.props.params.id
        };



        Client.getOrderNos(this.state.kitchenid, this.state.menukind).then((orders) => {
            this.setState({ordersNums:orders});
        });
    }



    handleSelectedFoodClick(idx) {
        var selectfood = this.state.selectedFoods[idx];

        if(selectfood.count > 1) {

            this.state.selectedFoods.splice(idx, 1, {
                name: selectfood.name,
                id: selectfood.id,
                count: selectfood.count - 1
            });

            this.setState(this.state.selectedFoods);

        }
        else {
            this.setState({
                selectedFoods: [
                    ...this.state.selectedFoods.slice(0, idx),
                    ...this.state.selectedFoods.slice(
                        idx + 1, this.state.selectedFoods.length
                    )
                ]
            });
        }

        this.state.selectedFoodKeys[selectfood.name] = selectfood.count - 1;
        this.setState({
            selectedFoodKeys: this.state.selectedFoodKeys
        })


    }

    /**
     * 单击菜名,该菜进入到订单中. 如果已经有这道菜, 则数字加1.
     * @param food
     */
    handleItemClick(food) {
        var index = -1;
        var tempfood = {};

        var count = 0;
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
            });

            count = tempfood.count + 1;
        }
        else {
            this.state.selectedFoods = this.state.selectedFoods.concat({
                name:food.name,
                id: food.id,
                count:1});

            count  = 1;

        }

        this.state.selectedFoodKeys[food.name] = count;

        this.setState({
                selectedFoodKeys: this.state.selectedFoodKeys
            }
        );

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
        };

        Client.postSelectFood(params);

        this.props.router.push("/");
    }


    /**
     * 当时间变化的时候记录一下
     * @param value
     */
    handleChangeDateValue(value) {

        console.log('new utc value is ' + value);
        this.state.dinnerTime.utcValue  = value;


    }


    /**
     * 处理输入框文字变化的事件，更新控件状态。
     * @param e
     */
    handleInputChange(e) {
        this.setState(
            {
                commment: e.target.value
            }
        );
    }


    render() {
        return (
            <div className='App'>
                <div className="ui text container">
                    <MyDatePicker
                        handleChangeValue = {this.handleChangeDateValue.bind(this)}
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
                        foods = {this.state.selectedFoodKeys}
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
            showRemoveIcon: false
        };

        this.dealFoods = this.dealFoods.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchCancel = this.handleSearchCancel.bind(this);
        Client.getItems(this.props.kitchenid, this.props.menukind).then(this.dealFoods);
    }

    dealFoods(foods) {
        foods.map((food) => {

            this.props.foods[food.name] = 0;
        });

        this.setState({
            matchingFoods: foods,
            showRemoveIcon: true
        })
    }

    handleSearchChange() {
        const query = this.refs.search.value;

        if (query === '') {
            this.setState({
                matchingFoods: [],
                showRemoveIcon: false
            });
        } else {
            Client.search(query).then((foods) => (
                this.setState({
                    matchingFoods: foods.slice(0, MATCHING_ITEM_LIMIT),
                    showRemoveIcon: true
                })
            ));
        }
    }


    handleSearchCancel() {
        this.setState({
            allItems: [],
            showRemoveIcon: false
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
                        <th colSpan="2">全部菜</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.matchingFoods.map((item, idx) => (
                            <tr
                                key={idx}
                                onClick={() => this.props.onFoodSelect(item)}
                                className = {this.props.foods[item.name]?'positive':''}
                            >
                                <td>{item.name}</td>
                                <td>{this.props.foods[item.name]?this.props.foods[item.name]:''}</td>
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

export default withRouter(NewOrder);
