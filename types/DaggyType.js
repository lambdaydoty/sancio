/* eslint func-call-spacing: ["error", "always"] */
const $ = require ('sanctuary-def')
const def = $.create ({ checkTypes: true, env: $.env })

const $DaggyTypeRep = $.NamedRecordType ('$DaggyTypeRep') ('https://github.com/fantasyland/daggy') ([]) ({
  toString: $.AnyFunction,
  is: $.AnyFunction,
  '@@type': $.String,
})

const $DaggyType = def ('$DaggyType') ({}) ([$DaggyTypeRep, $.Type]) (TypeRep =>
  $.NullaryType ('$DaggyType-' + TypeRep['@@type']) ('https://github.com/fantasyland/daggy') ([]) (x => TypeRep.is (x)))

module.exports = {
  $DaggyType, // ∷ DaggyTypeRepresntative → Type
}
