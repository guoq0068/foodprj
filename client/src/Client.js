
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
function getItems() {

  return fetch(`/kittchen/getmenulist`, {
    accept: 'application/json'
  }).then(parseJSON);
}


function getOrderNos() {
  return fetch(`/kittchen/getordernums`, {
    accept: 'application/json'
  }).then(parseJSON);
}

function postSelectFood(query) {


  var body = 'memo=' + query.memo + '&data=' + JSON.stringify(query.data);

  body  = body + "&ordertime=" + query.ordertime;
  body  = body + "&dinnertime=" + query.dinnertime;
  body  = body + "&orderno=" + query.orderno;

  console.log('body %s', body);

  fetch('/kittchen/postselectdata', {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body
  }).then(checkStatus);
}

const Client = { search, getItems, postSelectFood, getOrderNos};
export default Client;
