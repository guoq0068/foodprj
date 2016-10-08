
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
  console.log('parseJson is called');
  var result = response.json();
  console.log(result);
  return result;
}

function getItems() {
  console.log('getItems is called');
  return fetch(`/kittchen/getmenulist`, {
    accept: 'application/json'
  }).then(parseJSON);
}


function postSelectFood(query) {
  var body = 'memo=' + query.memo + '&data=' + JSON.stringify(query.data);


  console.log('body %s', body);
  fetch('/kittchen/postselectdata', {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: body
  }).then(checkStatus);
}

const Client = { search, getItems, postSelectFood};
export default Client;
