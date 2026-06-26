[![Travis](https://img.shields.io/travis/PengJiyuan/b-validate.svg)](https://travis-ci.org/PengJiyuan/b-validate)
[![npm](https://img.shields.io/npm/v/b-validate.svg)](https://www.npmjs.com/package/b-validate)
[![npm](https://img.shields.io/npm/l/b-validate.svg)](https://www.npmjs.com/package/b-validate)
[![codecov.io](https://codecov.io/github/PengJiyuan/b-validate/coverage.svg?branch=master)](https://codecov.io/github/PengJiyuan/b-validate?branch=master)

# b-validate

Javascript type validate.

## Highlight

- chainable api
- support custom validator
- support schema validate
- support async validate

## Usage

```bash
npm i b-validate
```

```js
import bv from 'b-validate';

bv(123)
  .number.min(2)
  .max(10)
  .collect((error) => {
    console.log(error); // { value: 123, type: 'number', message: '123 is not less than 10' }
    // if no error, error equal to null
  });

// or get error message like this:

const error = bv('b-validate').string.isRequired.match(/Validator/).end;
// { value: 'b-validate', type: 'string', message: '`b-validate` is not match pattern /Validator/' }
```

### Schema

```js
import { Schema } from 'b-validate';

const schema = new Schema({
  name: [
    {
      type: 'string',
      required: true,
      message: '必填字段',
    },
    {
      type: 'string',
      maxLength: 10,
      message: '最大长度是10',
    },
  ],
  age: [
    {
      type: 'number',
      min: 2,
      max: 5,
      message: '在2和5之间',
    },
  ],
  email: [
    {
      type: 'email',
      message: '邮箱格式不对',
    },
  ],
  ip: [
    {
      type: 'ip',
      message: 'ip格式不对',
    },
  ],
  url: [
    {
      type: 'url',
      message: 'url格式不对',
    },
  ],
  custom: [
    {
      validator: (value, callback) => {
        if (value > 10) {
          callback('不能大于10！');
        }
      },
    },
  ],
  // Async validate
  async: [
    {
      validator: async (value, callback) => {
        if (value > 10) {
          callback('不能大于10！');
        }
      },
    },
  ],
});

schema.validate(
  {
    name: 'pengjiyuan is a nice boy',
    age: 24,
    email: 'pengjiyuan@bytedance.com',
    ip: '127.0.0.1',
    url: 'https://bytedancecom',
    custom: 20,
    async: 20,
  },
  (errors) => {
    console.log(errors);
    /*
     * {
     *  value: 'pengjiyuan is a nice boy', type: 'string', message: '最大长度是10' },
     *  age: { value: 24, type: 'number', message: '在2和5之间' },
     *  url: { value: 'https://bytedancecom', type: 'url', message: 'url格式不对' },
     *  custom: { value: 20, type: 'custom', message: '不能大于10！' }
     * }
     */
  }
);
```

### Validate Messages

Customize the validate messages by `options.validateMessages` or `(new schema({})).messages` / `bv.setGlobalConfig({ validateMessages: {} })`.

```
import bv from 'b-validate';

// set validateMessages for specific validator
const error = bv('', {validateMessages: {required: '必须有值'}}).string.isRequired.end.message;
// output: 必须有值

```

```
import bv from 'b-validate';

// set global validatemessages
bv.setGlobalConfig({ validateMessages: {required: '必须有值'} });

const error = bv('').string.isRequired.end.message;
// output: 必须有值
```

```
import bv from 'b-validate';

const error = bv('', {validateMessages: {required: '必须有值'}}).string.isRequired.end.message;
// output: 必须有值
```

```
import { Schema } from 'b-validate';
import zhCN from 'b-validate/es/locale/zh-CN';

const schema = new Schema({
  name: [{ type: 'string', length: 4 }],
});

schema.messages(zhCN);

schema.validate({name: 'aaa'}, errors => {
  console.log(errors);
  // {name: { message: '字符数必须是 4' }}
})
```

## Api

### String

#### .maxLength(length: number)

Validate string's max length.

#### .minLength(length: number)

Validate string's min length.

#### .length(length: number)

Validate string's length

#### .match(pattern: regexPattern)

Validate whether string is match regex pattern.

#### .uppercase

Validate whether string is uppercase.

#### .lowercase

Validate whether string is lowercase.

#### Demo

```js
bv('vvvv').string.isRequired.minLength(2).maxLength(10).lowercase.end; // pass
```

### Number

#### .min(num: number)

Minimum value.

#### .max(num: number)

Maximum value.

#### .equal(num: number)

Equal to number.

#### .range(min: number, max: number)

In range min ~ max.

#### .positive

Is it a positive number?

#### .negative

Is it a negative number?

#### Demo

```js
bv(123).number.min(2).max(250).positive.end; // pass
```

### Array

#### .length(length: number)

Validate array's length

#### .includes(arrays: any[])

Whether array includes some array.

#### .deepEqual(other: any[])

Deep equal to other array

#### Demo

```js
bv([1, 2, 3]).array.length(3).includes([1, 2]).deepEqual([1, 2, 3]).end; // pass
```

### Object

#### .hasKeys(keys: string[])

Object has some keys?

#### .deepEqual(obj: object)

Deep equal to other object.

#### .empty

Empty object.

#### Demo

```js
bv({ a: 1, b: 2 }).object.hasKeys(['a', 'b']).deepEqual({ a: 1, b: 2 }).not.empty.end; // pass
```

### Type

#### .email

```js
bv('abc@qq.com').type.email.end; // pass
```

#### .url

```js
bv('https://baidu.com').type.url.end; // pass
```

#### .ip

```js
bv('127.0.0.1').type.ip.end; // pass
```

### Custom validator

```js
bv('xxxxxx').custom.validate(
  (value, callback) => {
    if (value !== 'x') {
      callback(`Expect x but got ${value}`);
    }
  },
  (error) => {
    console.log(error); // { value: 'xxxxxx', type: 'string', message: 'Expect x but got xxxxxx' }
  }
);
```

### Async validate

```js
bv('xxxxxx').custom.validate(
  async (value, callback) => {
    const apiValue = api.getValue();
    if (value !== apiValue) {
      callback(`Expect x but got ${apiValue}`);
    }
  },
  (error) => {
    console.log(error);
  }
);
```

## LICENSE

[MIT](./LICENSE) © [PengJiyuan](https://github.com/PengJiyuan)
