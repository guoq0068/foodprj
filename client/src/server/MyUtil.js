/**
 * Created by dev01 on 16/10/11.
 */
const MyDb = require('./MyDb');

/**
 *   获取今天和明天的订单号
 */
function get_order_no(kitchenid, menukind)
{

    var result = [0, 0];
    var startTime;
    var endTime;
    var today = new Date();

    today.setHours(0, 0, 0, 0);
    startTime = today.getTime();


    today.setDate(today.getDate() + 1);
    endTime   = today.getTime();

    result[0] = MyDb.get_count_from_db(startTime, endTime, kitchenid, menukind) + 1;

    startTime = endTime;

    today.setDate(today.getDate() + 1);
    endTime = today.getTime();

    result[1] = MyDb.get_count_from_db(startTime, endTime, kitchenid, menukind) + 1;
    return result;
}



exports.get_order_no = get_order_no;