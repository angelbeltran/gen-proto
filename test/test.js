'use strict'

let fs = require('fs')
let path = require('path')
let expect = require('chai').expect
let genProto = require('..')
let protoDef = require('./proto.json')

describe('Protobuf Generator', function () {
  after(fs.unlink.bind(fs, path.resolve(__dirname, 'test-output.proto')))

  it('generates a test file perfectly', (done) => {
    genProto(protoDef, (err) => {
      if (err) {
        return done(err)
      }

      fs.readFile(path.resolve(__dirname, 'test-output.proto'), (err, data) => {
        if (err) {
          return done(err)
        }

        let output = data.toString()

        fs.readFile(path.resolve(__dirname, 'expected.proto'), (err, data) => {
          if (err) {
            return done(err)
          }

          let expectation = data.toString()

          expect(output).to.equal(expectation)
          done()
        })
      })
    })
  })
})
