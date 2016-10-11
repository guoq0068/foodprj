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

    var startTime;
    var endTime;
    var today = new Date();

    today.setHours(0, 0, 0, 0);
    startTime = today.getTime();

    console.log("start time is %d",startTime);

    today.setDate(today.getDate() + 1);
    endTime   = today.getTime();

    console.log("endTime time is %d",endTime);

    var sqlstr = 'select count(*) from orders where eattime >' + startTime + ' and eattime < ' + endTime;

    console.log(sqlstr);
    const r = db.exec(sqlstr);

    if (r[0]) {
        console.log(r[0]);
        return r[0].values[0][0];
    }
    return 0;
}


exports.get_order_no = get_order_no;