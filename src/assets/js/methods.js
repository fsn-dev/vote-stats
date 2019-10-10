const config = require('@s/config')
export default {
  config: config,
  smallToBigSort () {
    return (a, b) => {
      for (let obj in arguments) {
        if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
          return 1
        }
      }
      return -1
    }
  },
  bigToSmallSort () {
    return (a, b) => {
      for (let obj in arguments) {
        if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
          return -1
        }
      }
      return 1
    }
  }
}