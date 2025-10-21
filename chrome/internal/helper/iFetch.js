import { notify } from "./chrome.js";

class iFetch {

  constructor(baseUrl, token = "") {
    this.baseUrl = baseUrl
    this.token = token
  }

  get(route, data = {}) {
    var headers = {}
    const params = new URLSearchParams();
    // 遍历对象,添加每个键值对
    for (let key in data) {
      params.append(key, data[key]);
    }
    const queryString = params.toString(); // 'a=1&b=2'

    var url = new URL(route, this.baseUrl);
    url = url + `?${queryString}`;

    return new Promise(function (resolve, reject) {
      if (token != '') {
        headers['Authorization'] = 'Bearer ' + token
      }

      fetch(url, {
        headers: headers,
      })
        .then(response => response.json())
        .then(data => resolve(data)).catch((error) => {
          reject(error)
        });
    });
  }

  post(route, data = {}, headers = {
    'Content-Type': "application/json"
  }) {
    var that = this;
    return new Promise(function (resolve, reject) {
      const token = that.token
      var url = new URL(route, that.baseUrl);
      // token
      if (token != '') {
        headers['Authorization'] = 'Bearer ' + token
      }
      // 处理 body
      var body = "";
      // 把一个参数对象格式化为一个字符串
      if (headers['Content-Type'].indexOf('application/x-www-form-urlencoded') >= 0) {
        let ret = ''
        for (const it in data) {
          ret +=
            encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        body = ret.substring(0, ret.length - 1)
      } else if (headers['Content-Type'] === 'multipart/form-data;charset=UTF-8') {
        body = data
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify(data)
      }

      fetch(url, {
        method: 'POST',
        credentials: "same-origin",
        headers: headers,
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Network response was not ok 1");
            throw new Error("Network response was not ok");
          }
          return response.json();
        }).then(data => {
          console.log("Network response was ok => return json", data);
          return resolve(data);
        })
        .catch((error) => {
          console.log("Network response was not ok 3", error);
          notify("通知", "服务异常，无法访问服务:" + baseUrl)
          return reject(error)
        });
    })
  }
}

export default iFetch