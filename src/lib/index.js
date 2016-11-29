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
  const api = 'http://api.t.sina.com.cn/short_url/shorten.json?source=2787150331&url_long=' + url;
  var data = new FormData()
  fetch(api).then(res => res.json())
  .then(json => {
    const {url_short, error} = json[0];
    console.log(json)
    if(error) return show(error);
    show(`${url_short} (已复制到剪切板)`);
    copyToClipboard(url_short);
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