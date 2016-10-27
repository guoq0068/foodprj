/**
 * Created by guoq on 16/10/7.
 */
import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';


const options = [
    { text: '今天', value: '0' },
    { text: '明天', value: '1' },
];

const options_hour = [
    { text:'08', value: '08'},
    { text:'09', value: '09'},
    { text:'10', value: '10'},
    { text:'11', value: '11'},
    { text:'12', value: '12'},
    { text:'13', value: '13'},
    { text:'14', value: '14'},
    { text:'15', value: '15'},
    { text:'16', value: '16'},
    { text:'17', value: '17'},
    { text:'18', value: '18'},
    { text:'19', value: '19'},
    { text:'20', value: '20'},
    { text:'21', value: '21'},
];

const options_minute = [
    { text:'00', value: '00'},
    { text:'10', value: '10'},
    { text:'20', value: '20'},
    { text:'30', value: '30'},
    { text:'40', value: '40'},
    { text:'50', value: '50'},
];

class MyDatePicker extends Component {


    constructor(props) {
        super(props);
        this.state = {
            handleChangeValue : props.handleChangeValue,
            day     : this.props.dinnerTime.day,
            hour    : this.props.dinnerTime.hour,
            minute  : this.props.dinnerTime.minute,
        }
    }

    componentDidMount() {

    }

    handleChangeDay(e, {value}) {
        this.setState({day: value});
    }


    handleChangeValue(type, value) {

        switch(type) {
            case 'day':
                console.log("set is called");
                this.setState({day: value}, () => {
                    this.props.handleChangeValue(this.state);
                });
                break;
            case 'hour':
                this.setState({hour: value}, () => {
                    this.props.handleChangeValue(this.state);
                });
                break;

            case 'minute':
                this.setState({minute: value}, () => {
                    this.props.handleChangeValue(this.state);
                });
                break;
        }

    }
    /**
     * 获取当前的时间
     */
    getDateValue() {

        return this.state;
    }

    render() {

        return (
        <div id='date-picker'>

            <table className='ui unstackable selectable structured large table'>
                <tbody>
                <tr colSpan="3">
                    <td colSpan="1">
                        <Dropdown
                            fluid
                            options={options}
                            selection
                            placeholder='日期'
                            ref="dropdown"
                            value={this.state.day}
                            onChange={(e, {value})=>{this.handleChangeValue('day', value)}}
                        />
                    </td>
                    <td colSpan="1">
                        <Dropdown
                            fluid
                            options={options_hour}
                            selection
                            placeholder='小时'
                            ref="dropdown"
                            value={this.state.hour}
                            onChange={(e, {value})=>{this.handleChangeValue('hour',  value)}}
                        />
                    </td>
                    <td colSpan="1">
                        <Dropdown
                            fluid
                            options={options_minute}
                            selection
                            placeholder='分钟'
                            ref="dropdown"
                            value={this.state.minute}
                            onChange={(e, {value})=>{this.handleChangeValue('minute' , value)}}
                        />
                    </td>
                </tr></tbody>

            </table>
        </div>
        );
    }
}

export default MyDatePicker;