/* eslint func-call-spacing: ["error", "always"] */

/* common combinators */
// const I = x => x
const K = x => y => x
const S = f => g => x => f (x) (g (x))
// const A = f => x => f (x) // apply
// const T = x => f => f (x) // thrush
// const B = f => g => x => f (g (x)) // compose
// const Y = f => (g => g (g)) (g => f (x => g (g) (x))) // applicative Y
const tap = S (K) // :: g -> a -> a

/* curry and uncurry */
const uncurry =
  fn =>
    (...args) =>
      args.reduce (
        (f, x) => f (x),
        fn,
      )

const curryN =
  n =>
    fn =>
      (n === 0)
        ? fn ()
        : x => curryN (n - 1) (fn.bind (null, x))

const curry =
  fn =>
    curryN (fn.length) (fn)

const apply =
  f =>
    ar =>
      f (...ar)

const isNil =
  x =>
    x == null

const trampoline =
  fn =>
    (...args) => {
      let res = null
      for (
        res = fn (...args);
        typeof res === 'function';
        res = res () /* ! */
      );
      return res
    }

// :: (a -> String) -> (a -> b) -> a -> b
const memoize =
  (key = x => x) =>
    f => {
      const table = {}
      return (...args) => {
        const k = key (...args)
        if (table[k] === undefined) {
          table[k] = f (...args)
        }
        return table[k]
      }
    }

module.exports = {
  tap,
  uncurry,
  curryN,
  curry,
  apply,
  isNil,
  trampoline,
  memoize,
}
