# ArcoDesign Color

ArcoDesign Color Utils. 

For a given color, a gradient swatch containing ten colors is generated with an algorithm. This works for both light and dark modes.

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

Index (starting from 1) of the gradient colors to be generated.

#### options.list {boolean}

Whether to generate color array containing the ten colors.

#### options.dark

Whether to generate colors for dark mode.

#### options.format {'hex' | 'rgb' | 'hsl'}

Color format.
### getPresetColors {Function}

Contains 14 preset sets of colors.

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

For a given color, get the r, g, b value in string

```js
getRgbStr('#F53F3F') // 245,63,63
```
