/**
 * Created by guoq on 16/12/12.
 */
import  React, { Component } from 'react';
import Client from '../../Client';
import { Form, Checkbox, Divider, Button, Modal, Header, Image} from 'semantic-ui-react';
import barcode from '../../../res/barcode.png';

const  END_TIME = 21;

class CompanyNewOrder extends  Component {


    state = { formData: {} };

    constructor(props) {
        super(props);


        Client.getCompanyMenuList(1, 1).then((list) => {
            console.log(list);
            this.setState(
                {
                    value: '' + list[0].id,
                    menulist: list
                });
        });

        var day = new Date().getHours();
        this.state = {
            value: '',
            menulist: [],
            phoneno: '',
            formData: {},
            open: false,
            enabled: (day <= END_TIME)
        }

    }

    checkMobile(str) {
        if(str==""){
            alert("手机号不能为空！");
        }
        else{
            var re = /^1\d{10}$/
            if (re.test(str)) {
                return true;
            } else {
                if(str.length < 11) {
                    alert("长度不够");
                }
                else {
                    alert("手机号格式错误！");
                }

            }
        }

        return false;
    }

    handleChange = (e, { value }) => this.setState({ value:value });

    handlephoneChange = (e) => {

        this.setState({
            phoneno: e.target.value
        });
    };


    handleResult () {
        console.log("result is called");
        this.setState({phoneno:''});
    }

    handleSubmit = (e, { formData }) => {
        e.preventDefault();
        console.log({formData});

        if(this.checkMobile(this.state.phoneno + '')) {
            console.log(this.state);
            var result = Client.postCompanyOrder(1, 1, this.state.phoneno+'', this.state.value);


            if(result.statues == 'error') {
                alert('没有提交成功');
            }
            else {
                this.setState({open: true});
            }

            this.handleResult();
        }

    };

    close() {
        this.setState({open:false});
    }



    render() {

        var today = new Date();

        today.setDate(today.getDate() + 1);

        var timestr = (today.getMonth() + 1) + "月" + today.getDate() + '日';

        var str = '';
        if(today.getHours() < END_TIME) {
            str = '谢谢,请在21:00之前下单';
        }
        else {
            str = '抱歉, 已过21:00, 请明天下单';
        }

        return (

            <div className="App">
                <div className="ui text container">
                    <table className='ui unstackable  centered structured large table'>
                        <thead>
                        <tr>
                            <th colSpan="3" className="center aligned">
                                HIGO 营养餐 <font color = 'red'>{timestr} </font> 菜单 ({str})
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <Form size="large" widths='equal'  onSubmit={this.handleSubmit}>
                                    {this.state.menulist.map((item) => {
                                        return (
                                            <Form.Field key={'' + item.id}>
                                                <Form.Checkbox
                                                    radio
                                                    label={item.values}
                                                    name='submenuno'
                                                    value={'' + item.id}
                                                    checked={this.state.value === ('' + item.id)}
                                                    onChange={this.handleChange}
                                                >

                                                </Form.Checkbox>
                                            </Form.Field>
                                        )
                                    })}
                                    <Divider />
                                    <Form.Field label='手机号' name="phoneno" control='input'
                                                placeholder='请输入您的手机号'
                                                value = {this.state.phoneno}
                                                onChange = {this.handlephoneChange}
                                    />
                                    <Button primary fluid type="submit" disabled={!this.state.enabled}>确 定 选 择</Button>
                                </Form>
                            </td>
                        </tr>
                        <tr>
                            <td>
                            <Modal open={this.state.open}>
                                <Modal.Header>预定完毕</Modal.Header>
                                <Modal.Content image>
                                    <Image wrapped size='medium' src={barcode}/>
                                    <Modal.Description>
                                        <Header>微信支付</Header>
                                        <p>亲,请现在支付.</p>
                                        <p>谢谢对厨房支持! </p>
                                        <p>加霞姐微信 <font color = 'orange' size="5">18600971728 </font> 有 <font color="red" size="5">红包 </font></p>
                                    </Modal.Description>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button  content='关 闭' onClick={this.close.bind(this)} />
                                </Modal.Actions>
                            </Modal>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export  default CompanyNewOrder;
