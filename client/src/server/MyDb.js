/**
 * Created by dev01 on 16/10/13.
 */
const fs            = require('fs');
const sqlite        = require('sql.js');

const filebuffer    = fs.readFileSync('./db/usda-nnd.sqlite3');

const db            = new sqlite.Database(filebuffer);

const Buffer        = require('buffer').Buffer;

const COLUMNS_MENU = [
    'id',
    'name'
];
/**
 * 根据开始和结束时间，获取在指定时间范围吃饭的订单的数量。
 * @param startTime
 * @param endTime
 * @returns {number}
 */
function get_count_from_db(startTime, endTime) {
    var result = 0;
    var sqlstr = 'select count(*) from orders where eattime > ' + startTime + ' and eattime < ' + endTime;

    const r = db.exec(sqlstr);

    if (r[0]) {
        result = r[0].values[0][0];

    }

    return  result;
}

/**
 * 获取菜单详细内容。
 * @returns {*}
 */
function get_menu_list() {
    const r = db.exec(`
        select ${COLUMNS_MENU.join(', ')} from menu
        where active = 1
        `);

    var result = [];
    if (r[0]) {

        result = r[0].values.map((entry) => {
            const e = {};
            COLUMNS_MENU.forEach((c, idx) => {
                e[c] = entry[idx];
            });
            return e;
        });

    }
    return  result;
}

/**
 * 获取订单数量
 * @returns {number}
 */
function get_orders_num() {

    var result  =   0;

    const r = db.exec('select count(*) from orders');

    if( r[0] ) {
        result = r[0].values[0][0];
    }

    return result;
}

/**
 * orders表结构说明
 * id  唯一标识符
 * ordertime  下单时间
 * eattime    吃饭时间
 * comment    用户备注
 * status     订单状况（0：还没有开始做   1：完成）
 * orderno    订单发生当天的序号，就是该订单是当天的第几单。
 * @param ordertime   订餐的时间
 * @param dinnertime  用餐的时间
 * @param memo     订单的备注
 * @param orderno  当日订单的编号
 */
function  insert_order_list(ordertime, dinnertime, memo, orderno) {
    var sqlStr  =   'INSERT INTO orders(ordertime, eattime, comment, status, orderno) VALUES(' +
        ordertime + ', ' +
        dinnertime + ', ' +
        '"' + memo + '"' + ', 0 ,' +
        orderno +
        ');';

    db.run(sqlStr);

    sqlStr = 'select id from orders where ordertime = ' + ordertime;
    const r  = db.exec(sqlStr);

    var   result =  -1;
    if(r[0]) {
        result  = r[0].values[0][0];
    }

    return result;
}

/**
 * orderDetail表结构说明
 * orderid  订单id
 * itemid   菜品id
 * id       自增长id
 * status   订单中菜品的状态
 * count    菜品的数量
 * 把菜单的详细信息写入到数据库中
 * @param itemid
 * @param orderid
 * @param count
 * @param name
 */
function insert_order_detail(itemid, orderid, count, name) {
    var sqlStr  = 'INSERT INTO orderdetail(itemid, orderid, count, status, singlename) VALUES(' +
            itemid + ', ' + orderid + ', ' + count + ', 0 , "' + name + '" );';

    db.run(sqlStr);

}

/**
 *  把数据库数据保存到物理存储。
 */
function save_db() {

    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync('./db/usda-nnd.sqlite3', buffer);

}

/**
 * 获取要炒的菜的列表
 */
function get_cook_list() {

    var today     = new Date();

    today.setHours(0,0,0);

    var beginTime = today.getTime();

    today.setDate(today.getDate() + 1);

    var endTime   = today.getTime();


    var querystr  = 'select orders.id, detail.itemid, detail.count, detail.singlename, orders.eattime, orders.orderno from orderdetail ' +
        'as detail, orders  where detail.orderid = orders.id and detail.status = 0 and detail.orderid in ( ' +
        'select id from orders where orders.eattime > '+ beginTime +' and eattime < ' + endTime +') order by orders.eattime;';

    var r = db.exec(querystr);

    var keys = {};
    var cooklist = [];
    if(r[0]) {
        console.log(r[0]);
        r[0].values.map((entry) => {
            var itemid = entry[1];

            //如果没有这个菜，在做饭列表立增加
            console.log("itemid " + keys[itemid]);
            if(typeof (keys[itemid]) == "undefined") {
                var length = cooklist.length;
                keys[itemid] = length;
                cooklist[length] = {foodid:entry[1], foodname:entry[3], foodcount:parseInt(entry[2])};
                cooklist[length].orderdetail = [{orderid:entry[0], orderno:entry[5], eattime:entry[4]}];
            }
            //如果有这个菜，在列表里增加一个
            else {
                var length = keys[itemid];
                cooklist[length].foodcount = cooklist[length].foodcount + parseInt(entry[2]);
            }
        });
    }
    console.log(keys);
    console.log(cooklist);
    return cooklist;

}

exports.get_menu_list       =   get_menu_list;

exports.get_count_from_db   =   get_count_from_db;

exports.get_orders_num      =   get_orders_num;

exports.insert_order_list   =   insert_order_list;

exports.insert_order_detail =   insert_order_detail;

exports.save_db             =   save_db;

exports.get_cook_list       =   get_cook_list;