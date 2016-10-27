#!/usr/bin/env node
'use strict'


module.exports = function generateProtobuf (protoDef, cb) {
  let file = []

  if (!protoDef.filename || typeof protoDef.filename !== 'string') {
    throw new Error('filename must be defined')
  }

  // syntax statement
  writeSyntax(protoDef.syntax, file)

  // package name
  writePackageName(protoDef.package, file) && file.push('')

  // option statements
  protoDef.options && writeOptions(protoDef.options, file) && file.push('')

  // import statements
  protoDef.imports && writeImports(protoDef.imports, file) && file.push('')

  // messages
  // TODO: handle proto2 required and optional keywords
  protoDef.messages && writeMessages(protoDef.messages, file) && file.push('')

  // service
  protoDef.services && writeServices(protoDef.services, file) && file.push('')

  // write file
  writeToFile(protoDef.filename, file, cb)
}

/* Writes the syntax of a proto def to the file string array
 *
 */
function writeSyntax (syntax, file) {
  switch (syntax) {
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
}

/* Writes the package name of the proto def to the file string array
 *
 */
function writePackageName (packageName, file) {
  if (!packageName) {
    throw new Error('Package name required')
  }

  file.push('package ' + packageName + ';')
  return true
}

/* Writes the options of the proto def to the file string array
 *
 */
function writeOptions (options, file) {
  if (typeof options !== 'object') {
    throw new Error('options must be an object')
  }
  if (Object.keys(options).length) {
    Object.keys(options).forEach((opt) => {
      file.push('option ' + opt + ' = "' + options[opt] + '";')
    })
    return true
  }
}

/* Writes the imports of the proto def to the file string array
 *
 */
function writeImports (imports, file) {
  if (imports.length) {
    imports.forEach((imp) => {
      file.push('import ' + (imp.public ? 'public ' : '') + '"' + imp.filename + '";')
    })
    return true
  }
}

/* Writes the messages of a proto def to the file string array
 *
 */
function writeMessages (messages, file, level) {
  level = level || 0
  let padding = ''

  for (let i = 0; i < level; i++) {
    padding += '  '
  }

  if (messages.length) {
    messages.forEach((msg) => {
      if (msg.description) {
        file.push(padding + '// ' + msg.description)
      }
      file.push(padding + 'message ' + msg.name + ' {')
      if (msg.schema) {
        msg.schema.forEach((field, i) => {
          file.push(padding + '  ' + (field.repeated ? 'repeated ' : '') + field.type + ' ' + field.name + ' = ' + (field.key ? field.key : (i + 1)) + ';')
        })
      }

      if (msg.messages) {
        file.push('')
        writeMessages(msg.messages, file, level + 1)
      }

      file.push(padding + '}')
      file.push(padding)
    })

    file.pop()

    return true
  }
}

/* Writes the services of the proto def to the file string array
 *
 */
function writeServices (services, file) {
  if (services.length) {
    services.forEach((service) => {
      file.push('service ' + service.name + ' {')
      if (service.methods) {
        service.methods.forEach((method) => {
          file.push('  rpc ' + method.name + '(' + method.req + ') returns (' + method.res + ');')
        })
      }
      file.push('}')
      file.push('')
    })
    file.pop()
    return true
  }
}

/* Writes the file string array to file
 *
 */
function writeToFile (filename, file, cb) {
  cb = cb || function () {}
  if (typeof cb !== 'function') {
    throw new Error('callback must be a function')
  }

  require('fs').writeFile(filename, file.join('\n'), cb)
}
