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

    console.log(sqlstr);
    const r = db.exec(sqlstr);

    if (r[0]) {
        console.log(r[0]);
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
        console.log(r[0].values);
        result = r[0].values[0][0];
    }

    return result;
}

/**
 *
 * @param orderid     订单的唯一编号
 * @param ordertime   订餐的时间
 * @param dinnertime  用餐的时间
 * @param memo     订单的备注
 * @param orderno  当日订单的编号
 */
function  insert_order_list(orderid, ordertime, dinnertime, memo, orderno) {
    var sqlStr  =   'INSERT INTO orders VALUES(' +
        orderid + ', ' +
        ordertime + ', ' +
        dinnertime + ', ' +
        '"' + memo + '"' + ', 0 ,' +
        orderno +
        ');';

    db.run(sqlStr);
}

/**
 * 把菜单的详细信息写入到数据库中
 * @param itemid
 * @param orderid
 * @param count
 */
function insert_order_detail(itemid, orderid, count) {
    var sqlStr  = 'INSERT INTO orderdetail(itemid, orderid, count, status) VALUES(' +
            itemid + ', ' + orderid + ', ' + count + ', 0);';

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


exports.get_menu_list       =   get_menu_list;

exports.get_count_from_db   =   get_count_from_db;

exports.get_orders_num      =   get_orders_num;

exports.insert_order_list   =   insert_order_list;

exports.insert_order_detail =   insert_order_detail;

exports.save_db             =   save_db;