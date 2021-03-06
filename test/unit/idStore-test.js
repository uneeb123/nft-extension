var assert = require('assert')
var IdentityStore = require('../../app/scripts/lib/idStore')

describe('IdentityStore', function() {

  describe('#createNewVault', function () {
    let idStore
    let password = 'password123'
    let entropy = 'entripppppyy duuude'
    let seedWords
    let accounts = []
    let originalKeystore

    before(function(done) {
      window.localStorage = {} // Hacking localStorage support into JSDom

      idStore = new IdentityStore({
        addAccount(acct) { accounts.push(acct) },
      })

      idStore.createNewVault(password, entropy, (err, seeds) => {
        seedWords = seeds
        originalKeystore = idStore._idmgmt.keyStore
        done()
      })
    })

    describe('#recoverFromSeed', function() {
      let newAccounts = []

      before(function() {
        window.localStorage = {} // Hacking localStorage support into JSDom

        idStore = new IdentityStore({
          addAccount(acct) { newAccounts.push(acct) },
        })
      })

      it('should return the expected keystore', function (done) {

        idStore.recoverFromSeed(password, seedWords, (err) => {
          assert.ifError(err)

          let newKeystore = idStore._idmgmt.keyStore
          assert.equal(newAccounts[0], accounts[0])
          done()
        })
      })
    })
  })

  describe('#recoverFromSeed BIP44 compliance', function() {
    let seedWords =  'picnic injury awful upper eagle junk alert toss flower renew silly vague'
    let firstAccount = '0x5d8de92c205279c10e5669f797b853ccef4f739a'

    let password = 'secret!'
    let accounts = []
    let idStore

    before(function() {
      window.localStorage = {} // Hacking localStorage support into JSDom

      idStore = new IdentityStore({
        addAccount(acct) {
          accounts.push(acct)
        },
      })
    })

    it('should return the expected first account', function (done) {

      idStore.recoverFromSeed(password, seedWords, (err) => {
        assert.ifError(err)

        let newKeystore = idStore._idmgmt.keyStore
        assert.equal(accounts[0], firstAccount)
        done()
      })
    })
  })
})
