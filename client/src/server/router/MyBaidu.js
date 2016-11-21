/**
 * Created by guoq on 2016/11/18.
 */
var express     = require("express");

var router      = express.Router();

var fetch       =   require('node-fetch');


var accesstoken = '';

router.get('/text2audio', (req, res) =>{

    var body = 'tex=' + req.query.content + '&lan=zh&cuid=' + req.query.cuid + '&ctp=1&tok=' + accesstoken;
    console.log(body);
    fetch('http://tsn.baidu.com/text2audio', {
        method: "POST",
        body: body
    }).then((response)=> {

        var datas = response.headers._headers;
        for(var key in datas) {
            console.log(key + ":" + datas[key]);
            res.setHeader(key, datas[key]);
        }

        response.body.pipe(res)
    });
});


function getOauthToken() {
    var body = 'grant_type=client_credentials&client_id=Qs8OOWVobE0AHar3V3FLXwyB'
        + '&client_secret=1611817afa8f2383704e8e5ec8c1176f&';
    console.log(body);

    fetch('https://openapi.baidu.com/oauth/2.0/token', {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: body
    }).then(function(response){
        return response.json();
    }).then(function(json) {
        console.log(json);
        accesstoken = json.access_token;
        console.log(accesstoken);

    });
};




module.exports = router;

module.exports.getOauthToken  = getOauthToken;