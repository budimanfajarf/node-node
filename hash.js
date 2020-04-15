const bcrypt = require('bcrypt')

async function run() {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash('1234567', salt)
  console.log(salt)
  console.log(hashed)
}

run()

/*
kalo nyoba anoymous async function, require nya harus di dalem fungsi
(async function () {
  const bcrypt = require('bcrypt')  
  const salt = await bcrypt.genSalt(10)
  console.log(salt)
})()
*/