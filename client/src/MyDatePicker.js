/**
 * Created by guoq on 16/10/7.
 */
import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';


const options = [
    { text: '今天', value: '0' },
    { text: '明天', value: '1' },
];

class MyDatePicker extends Component {



    componentDidMount() {
        this.refs.dropdown.setState({currentValue: '1'});
    }

    render() {

        return (
        <div id='date-picker'>
            <Dropdown
                fluid
                options={options}
                selection
                placeholder='Add Users'
                ref="dropdown"
                value="1"
            />
            <table className='ui selectable structured large table'>
                <tbody>
                <tr>
                    <td>
                        <div className="ui selection dropdown">
                            <input type="hidden" name="gender" />
                                <i className="dropdown icon"></i>
                                <div className="default text">Gender</div>
                                <div className="menu">
                                    <div className="item" data-value="1">Male</div>
                                    <div className="item" data-value="0">Female</div>
                                </div>
                        </div>
                    </td>
                    <td>
                        <div className="ui selection dropdown">
                            <input type="hidden" name="gender" />
                            <i className="dropdown icon"></i>
                            <div className="default text">Gender</div>
                            <div className="menu">
                                <div className="item" data-value="1">Male</div>
                                <div className="item" data-value="0">Female</div>
                            </div>
                        </div>

                    </td>
                    <td>
                        <div className="ui selection dropdown">
                            <input type="hidden" name="gender" />
                            <i className="dropdown icon"></i>
                            <div className="default text">Gender</div>
                            <div className="menu">
                                <div className="item" data-value="1">Male</div>
                                <div className="item" data-value="0">Female</div>
                            </div>
                        </div>
                    </td>
                </tr></tbody>

            </table>
        </div>
        );
    }
}

export default MyDatePicker;