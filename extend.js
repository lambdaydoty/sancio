/* eslint func-call-spacing: ["error", "always"] */
/* eslint no-multi-spaces: ["error", { ignoreEOLComments: true }] */

const F = require ('fluture')
const FN = require ('fluture-node')

/*
 * Some helper functions to extend Sanctuary
 */
module.exports = s => {
  const B = s.compose

  return {
    maybeToFuture,   // ∷ a → Maybe b → Future a b
    eitherToFuture,  // ∷ Etiher a b → Future a b
    fromNullable,    // ∷ Nullable a → Maybe a
    repeat,          // ∷ a → Integer → [a]
    pick,            // ∷ [String] → (StrMap a) → (StrMap a)
    renameKey,       // ∷ String → String → Object → Object
    renameKeys,      // ∷ StrMap String → Object → Object
    imToOkJson,      // ∷ IncomingMessage → Future Error Json
  }

  function maybeToFuture (rej) {
    return s.maybe (F.reject (rej)) (F.resolve)
  }

  function eitherToFuture (e) {
    const fn = s.either (F.reject) (F.resolve)
    return fn (e)
  }

  function fromNullable (x) {
    const fn = s.compose (s.eitherToMaybe) (s.tagBy (x => x != null))
    return fn (x)
  }

  function repeat (x) {
    return function (n) {
      return s.unfoldr (i => i < n ? s.Just (s.Pair (x) (i + 1)) : s.Nothing) (0)
    }
  }

  function pick (ss) {
    const fn = s.pipe ([
      s.ap (s.zip) (B (repeat (s.I)) (s.size)), // ∷ Pair string (a → a)
      s.fromPairs,                              // ∷ strMap (a → a)
      s.ap,                                     // ∷ (strMap a) → (strMap a)
    ])
    return fn (ss)
  }

  // ∷ String → String → Object → Object
  function renameKey (oldKey) {
    return function (newKey) {
      return ({ [oldKey]: value, ...o }) => ({ ...o, [newKey]: value })
    }
  }

  // ∷ StrMap String → Object → Object
  // ∷ { a: 'b' } ⇒ { a: * } ⇒ { b: * }
  function renameKeys (map) {
    const fn = s.pipe ([
      s.pairs,                    // ∷ [Pair String String]
      s.map (s.pair (renameKey)), // ∷ [Object → Object]
      s.pipe,                     // ∷ Object → Object
    ])
    return fn (map)
  }

  // ∷ IncomingMessage → Future Error Json
  function imToOkJson (im) {
    const fn = s.pipe ([
      FN.acceptStatus (200),                // ∷ Future IM    IM
      F.chainRej (FN.responseToError),      // ∷ Future Error IM
      F.chain (FN.bufferResponse ('utf8')), // ∷ Future Error String
      F.chain (F.encase (JSON.parse)),      // ∷ Future Error Json
    ])
    return fn (im)
  }
}

/**
 * Egs:
 *
 * const opts = renameKeys ({
 *   HOST: 'host',
 *   KEY: 'private_key',
 * }) (process.env)
 *
 * let i = 2
 * const opts = renameKeys ({
 *   [i++]: 'param1',
 *   [i++]: 'param2',
 *   [i++]: 'param3',
 *   [i++]: 'param1', // overwrite!
 * }) (process.argv)
 */
