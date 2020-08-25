/* eslint func-call-spacing: ["error", "always"] */
const { create, env } = require ('sanctuary')
const $ = require ('sanctuary-def')
const S = create ({ checkTypes: true, env })

const isprint = /^[\x20-\x7e]*$/

const $PrintableString = $.NullaryType ('$PrintableString') ('') ([$.String]) (
  S.test (isprint))

module.exports = {
  $PrintableString,
}

/*
 * reference: https://en.cppreference.com/w/cpp/string/byte/isprint
 *   space:         20
 *   punctuations:  21-2F !"#$%&'()*+,-./
 *   digit:         30-39 0123456789
 *   punctuations:  3A-40 :;<=>?@
 *   upper letters: 41-5A ABCDEFGHIJKLMNOPQRSTUVWXYZ
 *   punctuations:  5B-60 [\]^_`
 *   lower letters: 61-7A abcdefghijklmnopqrstuvwxyz
 *   punctuations:  7B-7E {|}~
 */
