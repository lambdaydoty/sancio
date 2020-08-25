/* eslint func-call-spacing: ["error", "always"] */
/* eslint no-multi-spaces: ["error", { ignoreEOLComments: true }] */

/**
 *
 * `Parse, dont't validate`
 *
 */

class ParseError extends Error {
  constructor (message) {
    super (message)
    this.name = 'ParseError'
  }
}

const S0 = require ('sanctuary')
const $ = require ('sanctuary-def')
const V = require ('folktale/validation')
const F = require ('fluture')
const F$ = require ('fluture-sanctuary-types')

const $Validation = $.NullaryType ('$Validation') ('https://folktale.origamitower.com/api/v2.3.0/en/folktale.validation.html') ([]) (x => V.hasInstance (x))
const env = [...S0.env, ...F$.env, $Validation]
const S = S0.create ({ checkTypes: true, env })
const def = $.create ({ checkTypes: true, env })

// ∷ Type → Type
const $Optional = $.UnaryType ('Optional') ('') ([]) (_ => true) (x => x === undefined ? [] : [x])

// ∷ Type → Type
const $EmptyStringOr = $.UnaryType ('EmptyStringOr') ('') ([]) (_ => true) (x => x === '' ? [] : [x])

const printType = type => type === undefined
  ? ''
  : type.name + ' ' + printType (type.types.$1)

// ∷ Pair String Type → a → Boolean
const fieldTest = S.pair (field => fieldType => value => S.is (fieldType) (value)
  ? V.Success ()
  : V.Failure ([`Invalid ${field}: \`${value}\` ∷ ${printType (fieldType)}`]))

// ∷ StrMap a → StrMap (Pair String a)
//                      key  ^^^^^^
const injectKeys = S.pipe ([
  S.pairs,
  S.map (S.extend (S.pair (S.Pair))),
  S.fromPairs,
])

/**
 * Schema = StrMap Type
 *
 * examples:
 * {
 *   foo: $.String,
 *   bar: $Optional ($.NonEmpty ($.Array ($.Integer))),
 * }
 *
 */

// ∷ Schema → Object → Validation a b
const objectTest = schema => S.pipe ([
  S.concat (S.map (S.K (undefined)) (schema)),
  S.unchecked.ap (S.map (fieldTest) (injectKeys (schema))),
  S.reduce (S.concat) (V.Success ()),
])

// ∷ Schema → Type
const $Interface = schema => {
  // console.log ('@Interface', { schema })
  const validationToBoolean = v => v.matchWith ({ Success: S.K (true), Failure: S.K (false) })
  const type = $.NullaryType ('Interface') ('') ([$.Object]) (
    S.compose (validationToBoolean) (objectTest (schema)),
  )
  Object.assign (type, { schema })
  return type
}

/* Parse, dont't validate */

// ∷ InterfaceType → a → Future Error a
const validate = iType => _obj => {
  // const BadInput = Error
  // const ParseError = Error

  const rejectNonObject = F.reject (new ParseError (`Not an object: ${_obj}`))
  const rejectParse = ({ value }) => F.reject (new ParseError (value))

  return S.pipe ([
    S.filter (S.is ($.Object)),            // ∷ Maybe Object
    S.maybe (rejectNonObject) (F.resolve), // ∷ Future Error Object
    S.map (objectTest (iType.schema)),     // ∷ Future Error (Validation c d)
    S.chain (v => v.matchWith ({
      Success: _ => F.resolve (_obj),
      Failure: rejectParse,
    })),                                   // ∷ Future Error a
  ]) (S.Just (_obj))
}

// ∷ InterfaceType → Object → a
const parse = iType => def ('parse') ({}) ([$.Object, iType]) (x => x)

Object.assign (V, {
  ParseError,
  $Validation,
  $EmptyStringOr, // ∷ Type → Type
  $Optional,      // ∷ Type → Type
  $Interface,     // ∷ (StrMap Type) → Type
  validate,       // ∷ InterfaceType → a → Future Error a
  parse,          // ∷ InterfaceType → Object → a
  _demo,
})

module.exports = V

/* example */

function _demo (V) {
  const $ = require ('sanctuary-def')
  const F = require ('fluture')
  const { $Optional, $Interface, validate, parse } = V

  const $Id = $.NonEmpty ($.String) // TODO
  const $Name = $.NonEmpty ($.String) // TODO
  const $Uri = $Optional ($.NonEmpty ($.String)) // TODO
  const $Inception = $Optional ($.NonEmpty ($.String)) // TODO
  const $Expiration = $Optional ($.NonEmpty ($.String)) // TODO

  const $Info = $Interface ({
    id: $Id,
    name: $Name,
    uri: $Uri,
    inception: $Inception,
    expiration: $Expiration,
  })

  validate ($Info) ({ id: 'x', name: 'alice', uri: 2323, inception: {} })
    .pipe (F.map (parse ($Info)))
    .pipe (F.fork (console.error) (console.log))

  validate ($Info) ({ id: 'x', name: 'alice', uri: 'http' })
    .pipe (F.map (parse ($Info)))
    .pipe (F.fork (console.error) (console.log))
}
