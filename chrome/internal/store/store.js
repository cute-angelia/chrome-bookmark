import eventEmitter from '../eventEmitter'

class store extends eventEmitter {
  constructor() {
    super()

    this.defaultConfigData = {
      username: "",
      token: "",
      server: "http://192.168.3.36:38112",
    }

    this.on('init', this.init.bind(this))
    this.on('get', this.get.bind(this))
    this.on('set', this.set.bind(this))
    this.on('save', this.save.bind(this))
    this.on('getDefaultConfig', this.getDefaultConfig.bind(this))
    this.on('clear', this.clear.bind(this))

    // 初始化配置数据
    this.trigger('init')
  }

  init() {
    chrome.storage.local.get(null, (items) => {
      var configData = Object.assign({}, this.defaultConfigData, items)
      this.save(configData)
      console.log("init.this.configData", configData)
    })
  }

  getDefaultConfig() {
    return this.defaultConfigData
  }

  get(key = null) {
    if (key) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], function (result) {
          console.log("get:", key, result[key]);
          resolve(result[key])
        });
      });
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (items) => {
          var configData = Object.assign({}, this.defaultConfigData, items)
          resolve(configData)
        })
      })
    }
  }

  set(key, value) {
    console.log("store.js set", key, value);
    if (value == undefined) {
      return
    }
    chrome.storage.local.set({
      [key]: value
    }, () => {
      //console.log('chrome local set: %s, %v', key, value)
    })
  }

  save(configData) {
    for (const key in configData) {
      chrome.storage.local.set({
        [key]: configData[key]
      }, () => {
        console.log('chrome local set: %s, %s', key, configData[key])
      })
    }
  }

  clear() {
    chrome.storage.local.clear()
    // this.trigger('updateView', this.configData)
  }
}

export default new store()