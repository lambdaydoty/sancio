/* eslint func-call-spacing: ["error", "always"] */
const $ = require ('sanctuary-def')
const def = $.create ({ checkTypes: true, env: $.env })

const $ClassType = def ('$ClassType') ({}) ([$.AnyFunction, $.Type]) (fn =>
  $.NullaryType ('$' + fn.name) ('https://') ([]) (x => x instanceof fn))

module.exports = {
  $ClassType, // ∷ Constructor → Type
}
