'use strict'
require('jsdom-global')()

global.screen = {}

const DPicker = require('../dist/dpicker.js')
let container

global.createDatePicker = function createDatePicker(opts = {}) {
  if (container) {
    try {
      document.body.removeChild(container)
    } catch(e) {}
  }

  container = document.createElement('div')
  container.setAttribute('id', 'dpicker')
  document.body.appendChild(container)
  opts.display = opts.display !== undefined ? opts.display : true
  return new DPicker(container, opts)
}

global.window.requestAnimationFrame = (cb) => cb()
