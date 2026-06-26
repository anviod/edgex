# ArcoDesign Color

ArcoDesign Color Utils. 

根据给定颜色通过算法生成指定包含十个颜色的梯度色板，也可生成暗色模式下包含十个颜色的色板。

## Usage

```bash
npm i @arco-design/color
```

```js
import { generate, presetColor } from '@arco-design/color';

console.log(generate('#123456'));

console.log(presetColor);
// {
//   red: {...},
//   orangered: {...},
//   orange: {...},
//   gold: {...},
//   yellow: {...},
//   lime: {...},
//   green: {...},
//   cyan: {...},
//   blue: {...},
//   arcoblue: {...},
//   purple: {...},
//   pinkpurple: {...},
//   magenta: {...},
//   gray: {...}
// }
```

## API

### generate(color: string, options: Object);

#### options.index {number | 1-10}

生成 10 个梯度色中的第几个颜色。

#### options.list {boolean}

生成包含十个颜色的梯度颜色数组。

#### options.dark

生成暗色色板的颜色。

#### options.format {'hex' | 'rgb' | 'hsl'}

生成颜色的格式。

### getPresetColors {Function}

包含了预设的 14 组颜色，包括一组中性灰。

* `red`
* `orangered`
* `orange`
* `gold`
* `yellow`
* `lime`
* `green`
* `cyan`
* `blue`
* `arcoblue`
* `purple`
* `pinkpurple`
* `magenta`
* `gray`

```js
const { red } = getPresetColors();

console.log(red.light);
console.log(red.dark);
console.log(red.primary);
```

### getRgbStr(color: string)

获得指定颜色的三通道 r, g, b 字符串。

```js
getRgbStr('#F53F3F') // 245,63,63
```
