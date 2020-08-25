/* eslint func-call-spacing: ["error", "always"] */
const $ = require ('sanctuary-def')
const { create } = require ('sanctuary')
const { $ClassType } = require ('./ClassType')

const S = create ({
  checkTypes: true,
  env: $.env.concat ([$ClassType (URL)]),
})

const $UrlString = $.NullaryType ('$UrlString') ('') ([$.String]) (
  S.compose (S.isRight) (S.encase (x => new URL (x))))

module.exports = { $UrlString }
