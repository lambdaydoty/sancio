/* eslint func-call-spacing: ["error", "always"] */
const $ = require ('sanctuary-def')
const S = require ('sanctuary')

const $Options = $.RecordType ({
  bit: $.NonNegativeInteger, // 0 for any number of bit
  prefix: $.Boolean,
  letter: $.EnumType ('LetterCase') ('') (['lower', 'upper', 'any']),
})

const def = $.create ({
  checkTypes: true,
  env: $.env.concat ([$Options]),
})

const $HexString = def ('$HexString') ({}) ([$Options, $.Type]) (opts => {
  const { bit, prefix, letter } = opts

  const n = Math.ceil (bit / 4)
  const len = n === 0 ? '{1,}' : `{${n}}`

  /* eslint operator-linebreak: ["error", "after"] */
  const regex =
    (prefix && letter === 'lower') ? RegExp (`^0x([a-f0-9]${len})$`) :
      (prefix && letter === 'upper') ? RegExp (`^0X([A-F0-9]${len})$`) :
        (prefix && letter === 'any') ? RegExp (`^(0x|0X)([a-fA-F0-9]${len})$`) :
          (!prefix && letter === 'lower') ? RegExp (`^([a-f0-9]${len})$`) :
            (!prefix && letter === 'upper') ? RegExp (`^([A-F0-9]${len})$`) :
              (!prefix && letter === 'any') ? RegExp (`^([a-fA-F0-9]${len})$`) :
                /* otherwise */ new Error ({ prefix, letter })

  return $.NullaryType (`${bit || 'any'}bit-${letter}case-HexString`) ('https://') ([$.NonEmpty ($.String)]) (S.test (regex))
})

/**
 * $HexString ∷ { bit ∷ NonNegativeInteger
 *              , letter ∷ LetterCase
 *              , prefix ∷ Boolean } -> Type
 *
 * Examples:
 *
 * 256-bit hex string: $HexString ({ bit: 256, prefix: false, letter: 'any' })
 * Any-bit hex string: $HexString ({ bit: 0, prefix: true, letter: 'upper' })
 * const $EthAddress = $HexString ({ bit: 160, prefix: true, letter: 'lower' })
 *
 */

module.exports = { $HexString }
