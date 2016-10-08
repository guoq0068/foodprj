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
    { text:'08', value: '0'},
    { text:'09', value: '1'},
    { text:'10', value: '2'},
    { text:'11', value: '3'},
    { text:'12', value: '4'},
    { text:'13', value: '5'},
    { text:'14', value: '6'},
    { text:'15', value: '7'},
    { text:'16', value: '8'},
    { text:'17', value: '9'},
    { text:'18', value: 'a'},
    { text:'19', value: 'b'},
    { text:'20', value: 'c'},
    { text:'21', value: 'd'},
];

const options_minute = [
    { text:'10', value: '0'},
    { text:'20', value: '1'},
    { text:'30', value: '2'},
    { text:'40', value: '3'},
    { text:'50', value: '4'},
];

class MyDatePicker extends Component {


    constructor(props) {
        super(props);
        this.state = {
            day     : '0',
            hour    : '1',
            minute  : '1',
        }
    }

    componentDidMount() {

    }

    handleChangeDay(e, {value}) {
        this.setState({day: value});
    }

    render() {

        return (
        <div id='date-picker'>

            <table className='ui selectable structured large table'>
                <tbody>
                <tr>
                    <td>
                        <Dropdown
                            fluid
                            options={options}
                            selection
                            placeholder='日期'
                            ref="dropdown"
                            value={this.state.day}
                            onChange={this.handleChangeDay.bind(this)}
                        />
                    </td>
                    <td>
                        <Dropdown
                            fluid
                            options={options_hour}
                            selection
                            placeholder='小时'
                            ref="dropdown"
                            value={this.state.hour}
                            onChange={(e, {value}) => (this.setState({hour:value}))}
                        />
                    </td>
                    <td>
                        <Dropdown
                            fluid
                            options={options_minute}
                            selection
                            placeholder='分钟'
                            ref="dropdown"
                            value={this.state.minute}
                            onChange={(e, {value}) => (this.setState({minute:value}))}
                        />
                    </td>
                </tr></tbody>

            </table>
        </div>
        );
    }
}

export default MyDatePicker;