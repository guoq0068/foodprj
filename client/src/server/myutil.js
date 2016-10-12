/**
 * Created by dev01 on 16/10/11.
 */
const fs = require('fs');
const sqlite = require('sql.js');

const filebuffer = fs.readFileSync('./db/usda-nnd.sqlite3');

const db = new sqlite.Database(filebuffer);

/**
 *   获取今天和明天的订单号
 */
function get_order_no()
{

    var result = [0, 0];
    var startTime;
    var endTime;
    var today = new Date();

    today.setHours(0, 0, 0, 0);
    startTime = today.getTime();


    today.setDate(today.getDate() + 1);
    endTime   = today.getTime();

    result[0] = get_count_from_db(startTime, endTime) + 1;

    startTime = endTime;

    today.setDate(today.getDate() + 1);
    endTime = today.getTime();

    result[1] = get_count_from_db(startTime, endTime) + 1;
    return result;
}

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


exports.get_order_no = get_order_no;