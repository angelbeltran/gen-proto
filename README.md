# gen-proto
A tool for generating protobuf files from json descriptions

## Installation

```
npm install -g gen-proto
```

## Usage
```
gen-proto some/json/file.json
```

or

```javascript
require('gen-proto')('some/json/file.json')
```

## File Format

```
{
  filename: String,           // file name
  syntax: Number,             // by default 3 (should be protobuf version 2 or 3)
  package: String,            // package name
  options: {},                // string to string mapping of options
  imports: [                  // all the import statements
    {
      filename: String,
      public: Boolean         // public import?
    },
    ...
  ],
  messages: [                 // TODO: allow for nesting of message types later
    {
      name: String,           // name of message type
      description: String,    // comment to write above the message type definition
      schema: [               // message type definition
        {
          type: String,       // type of data
          name: String,       // name of field
          key: Number,        // number of field (otherwise default enumeration)
          repeated: Boolean,  // array?
        },
        ...
      ],
      messages: [
        // nested message types of the same form as above. Arbitrary levels of nesting permitted.
      ]
    },
    ...
  ],
  services: [                 // services to include
    {
      name: String,           // name of service
      methods: [              // methods to include in service
        {
          name: String,       // name of rpc method
          req: String,        // name of request message type
          res: String,        // name of response message type
        },
        ...
      ]
    },
    ...
  ]
}
```

## Example

### Input

```json
{
  "filename": "test/test-output.proto",
  "syntax": 2,
  "package": "some.package",
  "options": {
    "some_option": "some_string/some_string"
  },
  "imports": [
    {
      "filename": "some/path/to/a/publicly/imported/file",
      "public": true
    },
    {
      "filename": "some/path/to/an/imported/file"
    }
  ],
  "messages": [
    {
      "name": "SomeMessageType",
      "description": "A simple description of the message type below",
      "schema": [
        {
          "type": "string",
          "name": "field1"
        },
        {
          "type": "int32",
          "name": "field2",
          "repated": true
        },
        {
          "type": "some_type",
          "name": "field3",
          "repated": true
        },
        {
          "type": "another_type",
          "name": "field4",
          "key": 777
        }
      ]
    }
  ],
  "services": [
    {
      "name": "SomeService",
      "methods": [
        {
          "name": "SomeMethod",
          "req": "SomeMessageType",
          "res": "AnotherMessageType"
        }
      ]
    },
    {
      "name": "AnotherService",
      "methods": [
        {
          "name": "AnotherMethod",
          "req": "CrazyMessageType",
          "res": "CrazierMessageType"
        },
        {
          "name": "LastMethod",
          "req": "CraziestMessageType",
          "res": "CraziesterMessageType"
        }
      ]

    }
  ]
}
```

### Output

```protobuf
syntax = "proto2";
package some.package;

option some_option = "some_string/some_string";

import public "some/path/to/a/publicly/imported/file";
import "some/path/to/an/imported/file";

// A simple description of the message type below
message SomeMessageType {
  string field1 = 1;
  int32 field2 = 2;
  some_type field3 = 3;
  another_type field4 = 777;
}

service SomeService {
  rpc SomeMethod(SomeMessageType) returns (AnotherMessageType);
}

service AnotherService {
  rpc AnotherMethod(CrazyMessageType) returns (CrazierMessageType);
  rpc LastMethod(CraziestMessageType) returns (CraziesterMessageType);
}
```
