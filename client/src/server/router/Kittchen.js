/**
 * Created by dev01 on 16/10/12.
 */
var express     = require("express");

var router      = express.Router();

var MyUtil      = require('../MyUtil');

var MyDb        = require('../MyDb');


/**
 *  获取今天和明天的订单数量。
 */
router.get('/getordernums', (req, res) => {

    var result = MyUtil.get_order_no();

    res.json(result);
});

/**
 * 获取厨房的菜单
 */
router.get('/getmenulist', (req, res) => {

    const list = MyDb.get_menu_list();

    res.json(list);

});


/**
 * 来新订单，把新订单录入到数据库中
 */
router.post('/postselectdata', (req, res)  => {
    var jsonStr = '';

    var ordertime   =   req.body.ordertime;
    var dinnertime  =   req.body.dinnertime;
    var orderno     =   req.body.orderno;
    var memo        =   req.body.memo;

    //var orderNum     =   MyDb.get_orders_num();

    var orderId     = MyDb.insert_order_list(ordertime, dinnertime, memo, orderno);

    console.log("orderId is %s", orderId);
    try {
        jsonStr = JSON.parse(req.body.data);
        jsonStr.map((item, idx) => {
            MyDb.insert_order_detail(item.id, orderId, item.count, item.name);
        });


        console.log(jsonStr);
    } catch (err) {
        jsonStr = null;
    }

    MyDb.save_db();

    MyDb.get_cook_list();
    jsonStr ? res.send({"status":"success"}) : res.send({"status":"error"});
})



module.exports = router;