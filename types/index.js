module.exports = {
  // standard types
  $: require('sanctuary-def'),
  F$: require('fluture-sanctuary-types'),

  // types
  ...require('./PrintableString'),
  ...require('./DateString'),
  ...require('./UrlString'),

  // type constructors
  ...require('./ClassType'), // ∷ Constructor → Type
  ...require('./DaggyType'), // ∷ DaggyTypeRepresntative → Type
  ...require('./HexString'),
  /**
   * $HexString ∷ { bit ∷ NonNegativeInteger
   *              , letter ∷ LetterCase
   *              , prefix ∷ Boolean } → Type
   */
}
