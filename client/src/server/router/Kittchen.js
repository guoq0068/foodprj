/**
 * Created by dev01 on 16/10/12.
 */
var express     = require("express");

var router      = express.Router();

var MyUtil      = require('../MyUtil');

var MyDb        = require('../MyDb');

var mySocket = { id: 0};
var cookListSocket = {id: 0};
/**
 *  获取今天和明天的订单数量。
 */
router.post('/getordernums', (req, res) => {

    var kitchenid = req.body.kitchenid;
    var menukind  = req.body.menukind;
    var result = MyUtil.get_order_no(kitchenid, menukind);

    res.json(result);
});

/**
 * 获取厨房的菜单
 */
router.post('/getmenulist', (req, res) => {

    var kitchenid = req.body.kitchenid;
    var menukind  = req.body.menukind;
    
    const list = MyDb.get_menu_list(kitchenid, menukind);

    res.json(list);

});

/**
 *  获取要做的菜的列表
 */
router.get('/getcooklist', (req, res) => {

    const list = MyDb.get_cook_list();
    

    res.json(list);
})


router.get('/gettomorrowcooklist', (req, res) => {
    const list = MyDb.get_tomorrow_cook_list();

    res.json(list);
})


/**
 * 来新订单，把新订单录入到数据库中
 */
router.post('/postselectdata', (req, res)  => {
    var jsonStr = '';

    var ordertime   =   req.body.ordertime;
    var dinnertime  =   req.body.dinnertime;
    var orderno     =   req.body.orderno;
    var memo        =   req.body.memo;
    var kitchenid   =   req.body.kitchenid;
    var menukind    =   req.body.menukind;

    //var orderNum     =   MyDb.get_orders_num();

    var orderId     = MyDb.insert_order_list(ordertime, dinnertime, memo, orderno, kitchenid, menukind);

    try {
        jsonStr = JSON.parse(req.body.data);
        jsonStr.map((item, idx) => {
            MyDb.insert_order_detail(item.id, orderId, item.count, item.name);
        });


    } catch (err) {
        jsonStr = null;
    }

    myemit(mySocket,'neworder',jsonStr );

    jsonStr ? res.send({"status":"success"}) : res.send({"status":"error"});

    MyDb.save_db();
})

/**
 * 厨师端菜做完的时候点击，服务器端根据订单情况进行单子配送。
 */
router.post('/postcookover', (req, res) => {

    var jsonStr;

    var data = req.body.data;

    var name  = req.body.name;

    var message = {data:data, name:name};

    try {
        var unfinishedCount = 0;
        
        var orderid = 0;
        jsonStr = JSON.parse(data);
        jsonStr.map((item, idx) => {

            var resultstr = '';

            MyDb.update_order_status(item);

            unfinishedCount = MyDb.get_unfinished_food_count(item.orderid);

            //所有的菜都炒完了。 通知客户端菜结束。
            if(unfinishedCount == 0) {

                var result = MyDb.update_order_list_status(item.orderid);

                resultstr = JSON.stringify(result);

                myemit(cookListSocket, 'orderfinished', resultstr);
            }
            
            orderid = item.orderid;
        });

        message.menuname = MyDb.get_menu_name(orderid);

        myemit(cookListSocket, 'foodfinished',  JSON.stringify(message));

    } catch (err) {
        jsonStr = null;
    }

    jsonStr ? res.send({"status":"success"}) : res.send({"status":"error"});

    MyDb.save_db();
});

router.setMySocket = (socket) => {
    mySocket   = socket;
}

router.setCookListSocket = (socket) => {
    cookListSocket = socket;
}

function myemit(socket, command, payload) {
    
    if(socket.id != 0) {

        socket.emit(command, payload);
    }
}

module.exports = router;