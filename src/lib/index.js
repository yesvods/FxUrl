import 'whatwg-fetch';

function show(msg){
  document.getElementById('msg').innerHTML = msg;
}

function copyToClipboard(text){
  var input = document.getElementById('hidden-url');
  input.value = text;
  input.select();

  document.execCommand('copy', false, null);
}

function fetchShortUrl(url){
  const api = 'http://dwz.cn/create.php';
  var data = new FormData()
  data.append('url', url)
  fetch(api, {
    method: 'post',
    body: data
  }).then(res => res.json())
  .then(json => {
    const {status, err_msg, tinyurl} = json;
    console.log(json)
    console.log('fetch', status)
    if(status!=0) return show(err_msg);
    show(`${tinyurl} (已复制到剪切板)`);
    copyToClipboard(tinyurl);
  });
}

window.onload = function() {
  console.log('onload')
  chrome.tabs.getSelected(null, function(tab) {
    fetchShortUrl(tab.url);
    // shortUrl.fetch(tab.url);
    console.log(document.getElementById('qrcode'))
    let qrcode = new QRCode(document.getElementById('qrcode'), tab.url)
  });
}