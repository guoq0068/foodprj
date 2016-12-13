/**
 * Created by guoq on 16/12/10.
 */
var express     = require("express");

var myDb        =  require('../MyDb');

var router      = express.Router();

router.post('/getList', (req, res) => {

    var kitchenid = req.body.kitchenid;


});


router.post('/getMenuList', (req, res) => {


    var kitchenid = req.body.kitchenid;
    var companyid = req.body.companyid;
    

    var result = myDb.get_company_submenu_list(kitchenid, companyid);

    res.json(result);
});

router.post('/postCompanyOrder', (req,res) => {
    var companyid = req.body.companyid;

    var submenid = req.body.submenuid;

    var phoneno =   req.body.phoneno;

    myDb.inset_company_order(companyid, phoneno, submenid);

    myDb.save_db();

});


module.exports = router;