/* eslint func-call-spacing: ["error", "always"] */
const { create, env } = require ('sanctuary')
const $ = require ('sanctuary-def')
const S = create ({ checkTypes: true, env })

const $DateString = $.NullaryType ('$DateString') ('') ([$.String]) (
  S.compose (S.isJust) (S.parseDate))

module.exports = {
  $DateString,
}
