
import 'whatwg-fetch';

function search(query) {
  return fetch(`/api/food?q=${query}`, {
    accept: 'application/json',
  }).then(checkStatus)
    .then(parseJSON);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
  }
}

function parseJSON(response) {
  var result = response.json();
  return result;
}

/**
 * 获取菜单内容的接口
 * @returns {*|Promise.<TResult>}
 */
function getItems(kitchenid, menukind) {

  var body = 'kitchenid=' + kitchenid + '&menukind=' + menukind;

  return fetch(`/kittchen/getmenulist`, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body,
    accept: 'application/json'
  }).then(parseJSON);
}

/**
 * 获取订单数量
 * @returns {*|Promise.<TResult>}
 */
function getOrderNos(kitchenid, menukind) {

  var body = 'kitchenid=' + kitchenid + '&menukind=' + menukind;
  return fetch(`/kittchen/getordernums`, {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body,
    accept: 'application/json'
  }).then(parseJSON);
}

/**
 * 向服务器端提交选定的菜。
 * @param query
 */
function postSelectFood(query) {


  var body = 'memo=' + query.memo + '&data=' + JSON.stringify(query.data);

  body  = body + "&ordertime=" + query.ordertime;
  body  = body + "&dinnertime=" + query.dinnertime;
  body  = body + "&orderno=" + query.orderno;
  body  = body + "&kitchenid=" + query.kitchenid;
  body  = body + "&menukind="  + query.menukind;

  console.log(body);
  fetch('/kittchen/postselectdata', {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body
  }).then(checkStatus);
}

/**
 *  获取要做的菜的列表
 */
function getCookList() {
  return fetch(`/kittchen/getcooklist`, {
    accept: 'application/json'
  }).then(parseJSON);
}


function getTommorrowCookList() {
  return fetch(`/kittchen/gettomorrowcooklist`, {
    accept: 'application/json'
  }).then(parseJSON);

}
/**
 * 菜做好了，通知服务器端。
 * @param data
 */
function postCookOver(data, foodname) {

  var body = 'data=' + JSON.stringify(data) + '&name=' + foodname;
  console.log(body);
  fetch('/kittchen/postcookover', {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body
  }).then(checkStatus);
}

const Client = { search, getItems, postSelectFood, getOrderNos, getCookList,
                 postCookOver, getTommorrowCookList};


export default Client;
