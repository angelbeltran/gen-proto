#!/usr/bin/env node
'use strict'

let jsonFileName = process.argv[2] // TODO make sure this works in all cases

if (!jsonFileName) {
  throw new Error('A file must be provided')
}

require('..')(require(require('path').resolve(jsonFileName)))
