const csrf = require('koa-csrf')

const middleware = new csrf()

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

let firstThrow = true
let currentToken = undefined

let ctx = {
  session: {},
  state: {},
  request: {
    body: {}
  },
  get: () => currentToken,
  throw: (err) => {
    if (!firstThrow) console.log(`Invalid token, \x1b[31m${currentToken}\x1b[0m. Error: ${err}`)
    firstThrow = false
  }
}

const test = middleware(ctx, () => {})

test.then((r) => {
  console.log(`The koa-csrf created the following token \x1b[32m${ctx.state._csrf}\x1b[0m,`
    + `which was created with the following secret \x1b[32m${ctx.session.secret}\x1b[0m`)
  
  const writeTestAToken = () => process.stdout.write(`Test a token: `)
  writeTestAToken()
  
  rl.on('line', (line) => {
    if (line === 'stop') {
      process.exit(0)
    }
    currentToken = line
    middleware(ctx, () => { console.log(`Valid token, \x1b[32m${line}\x1b[0m`)})
    writeTestAToken()
  })
})


