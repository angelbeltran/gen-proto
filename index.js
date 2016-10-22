#!/usr/bin/env node
'use strict'


module.exports = function generateProtobuf (protoDef, cb) {
  let file = []

  if (!protoDef.filename || typeof protoDef.filename !== 'string') {
    throw new Error('filename must be defined')
  }

  // syntax statement
  switch (protoDef.syntax) {
    case (2):
      file.push('syntax = "proto2";')
      break
    case (3):
    case (undefined):
      file.push('syntax = "proto3";')
      break
    default:
      throw new Error('Syntax must be 2 or 3')
  }

  // package name
  if (!protoDef.package) {
    throw new Error('Package name required')
  }

  file.push('package ' + protoDef.package + ';')
  file.push('')

  // option statements
  if (protoDef.options) {
    if (Object.keys(protoDef.options).length) {
      Object.keys(protoDef.options).forEach((opt) => {
        file.push('option ' + opt + ' = "' + protoDef.options[opt] + '";')
      })
      file.push('')
    }
  }

  // import statements
  if (protoDef.imports) {
    protoDef.imports.forEach((imp) => {
      file.push('import ' + (imp.public ? 'public ' : '') + '"' + imp.filename + '";')
    })
    file.push('')
  }

  // messages
  if (protoDef.messages) {
    protoDef.messages.forEach((msg) => {
      if (msg.description) {
        file.push('// ' + msg.description)
      }
      file.push('message ' + msg.name + ' {')
      if (msg.schema) {
        msg.schema.forEach((field, i) => {
          file.push('  ' + (field.repeated ? 'repeated ' : '') + field.type + ' ' + field.name + ' = ' + (field.key ? field.key : (i + 1)) + ';')
        })
      }
      file.push('}')
      file.push('')
    })
  }

  // service
  if (protoDef.services && protoDef.services.length) {
    protoDef.services.forEach((service) => {
      file.push('service ' + service.name + ' {')
      if (service.methods) {
        service.methods.forEach((method) => {
          file.push('  rpc ' + method.name + '(' + method.req + ') returns (' + method.res + ');')
        })
      }
      file.push('}')
      file.push('')
    })
  }

  // write file
  console.log('filename:', protoDef.filename)
  console.log('__dirname:', __dirname)
  if (typeof cb === 'function') {
    require('fs').writeFile(protoDef.filename, file.join('\n'), cb)
  } else {
    require('fs').writeFileSync(protoDef.filename, file.join('\n'))
  }
}
