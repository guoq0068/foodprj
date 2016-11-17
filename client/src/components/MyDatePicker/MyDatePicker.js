/**
 * Created by guoq on 16/10/7.
 */
import React, { Component } from 'react';
import {Dropdown} from 'semantic-ui-react';



const beginTime = {hour : 9, minute: 0};

const endTime   = {hour : 22, minute: 30};

const step       = {hour : 0, minute: 10};

const interHour =   1;

var option_days = []
var option_time = []
var option_tomorrow_time = []

class MyDatePicker extends Component {


    constructor(props) {
        super(props);
        this.state = {
            handleChangeValue: props.handleChangeValue,
            day : '0',
            time : 0,
            optionday: [],
            optiontime: []
        }

        this.initOptions();

        this.props.handleChangeValue(option_time[0].value);
    }


    getUtcTime(day, hour, min) {
        var date = new Date();

        date.setDate(date.getDate() + parseInt(day));

        date.setHours(hour, min, 0, 0);

        return date.getTime();

    }


    setOptionsByBeginHour(day, beginHour, beginMinute) {
        let options = [];
        let hourTemp;
        let minuteStartTemp;
        let minuteEndTemp;

        for (hourTemp = beginHour; hourTemp <= endTime.hour; hourTemp ++) {

            if (hourTemp == beginHour && hourTemp != endTime.hour) {

                minuteStartTemp = beginMinute;
                minuteEndTemp = 60;
            }
            else if (hourTemp == endTime.hour){

                minuteStartTemp = 0;
                minuteEndTemp = endTime.minute;
            } else {
                minuteStartTemp = 0;
                minuteEndTemp = 60;
            }
            console.log("minuteStartTemp " + minuteStartTemp  + " minuteEndTemp " + minuteEndTemp);
            for(;minuteStartTemp < minuteEndTemp; minuteStartTemp += step.minute) {

                let strHourTemp;
                let strMinTemp;
                if(hourTemp < 10) {
                    strHourTemp = '0' + hourTemp;
                }
                else {
                    strHourTemp = '' + hourTemp;
                }
                if (minuteStartTemp == 0 ) {
                    strMinTemp = '00';
                }
                else {
                    strMinTemp = minuteStartTemp + '';
                }

                options = [
                    ...options.slice(0, options.length),
                    {text : strHourTemp + ':' + strMinTemp,
                        value : this.getUtcTime(day , hourTemp, minuteStartTemp)}
                ];

            }

        }
        return options;

    }


    /**
     * 初始化天和时间的数组，时间从当天现在开始。
     */
    initOptions() {
        var date = new Date();

        var hour = date.getHours();

        var minute = date.getMinutes();

        minute = parseInt( minute / step.minute ) * step.minute;

        hour  =  hour  +  interHour;

        console.log("hour " + hour  + " minute " + minute);
        //大于截止时间，那么只显示明天
        if (hour > endTime.hour || (hour == endTime.hour && minute > endTime.minute) || hour < beginTime.hour) {

            hour = beginTime.hour;
            minute = 0;
            this.state.day = '1';
            option_days = [{ text: '明天', value: '1' }];
        }
        else {
            this.state.day = '0';
            option_days = [
                { text: '今天', value: '0' },
                { text: '明天', value: '1' },
            ];
        }

        this.state.optionday = option_days;


        option_time = this.setOptionsByBeginHour(0, hour, minute);


        option_tomorrow_time = this.setOptionsByBeginHour(1, beginTime.hour, beginTime.minute);

        this.state.optiontime = option_time;

        this.state.time = option_time[0].value;

    }


    changeDayOptions(value) {
        let timeTemp;
        if(value == '0') {
            timeTemp = option_time[0].value;
            this.setState({
                day: value,
                optiontime: option_time,
                time: timeTemp
            });
        }
        else {
            timeTemp = option_tomorrow_time[0].value;
            this.setState({
                day: value,
                optiontime: option_tomorrow_time,
                time: timeTemp
            });

        }

        this.state.time = timeTemp;
        this.props.handleChangeValue(timeTemp);
    }

    chanageTimeValue(value) {
        this.setState(
            {time: value}
        );
        this.props.handleChangeValue(value);
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
                                options={this.state.optionday}
                                selection
                                selectOnBlur
                                placeholder='天'
                                ref="dropdown"
                                value={this.state.day}
                                onChange={(e, {value})=>{this.changeDayOptions(value)}}
                            />
                        </td>
                        <td colSpan="2">
                            <Dropdown
                                fluid
                                options={this.state.optiontime}
                                selection
                                selectOnBlur
                                placeholder='小时'
                                ref="dropdown"
                                value={this.state.time}
                                onChange={(e, {value})=>{this.chanageTimeValue(value);}}
                            />
                        </td>
                    </tr></tbody>

                </table>
            </div>
        );
    }
}

export default MyDatePicker;