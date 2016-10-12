/**
 * Created by dev01 on 16/10/12.
 */
var express = require("express");

var router = express.Router();

var myutil = require('../myutil');

const fs        = require('fs');
const sqlite    = require('sql.js');

const filebuffer = fs.readFileSync('db/usda-nnd.sqlite3');

const db        = new sqlite.Database(filebuffer);

const COLUMNS_MENU = [
    'id',
    'name'
];

router.get('/getordernums', (req, res) => {
    var result = [];

    result  = myutil.get_order_no();

    res.json(result);
});

/**
 * 获取厨房的菜单
 */
router.get('/getmenulist', (req, res, next) => {

    const r = db.exec(`
        select ${COLUMNS_MENU.join(', ')} from menu
        where active = 1
        `);

    if (r[0]) {
        res.json(
            r[0].values.map((entry) => {
                const e = {};
                COLUMNS_MENU.forEach((c, idx) => {
                    e[c] = entry[idx];
                });
                return e;
            }),
        );
    } else {
        res.json([]);
    }
});

router.post('/postselectdata', (req, res, next)  => {
    var jsonStr = '';
    try {
        jsonStr = JSON.parse(req.body.data);
        console.log(jsonStr);
    } catch (err) {
        jsonStr = null;
    }
    jsonStr ? res.send({"status":"success"}) : res.send({"status":"error"});

})



module.exports = router;