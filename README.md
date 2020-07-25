# react-date-range-picker

> React date range picker

[![NPM](https://img.shields.io/npm/v/react-date-range-picker.svg)](https://www.npmjs.com/package/react-date-range-picker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save op-react-date-range-picker
```

## Usage

```tsx
import React from 'react'

import { DateRangePicker } from 'react-date-range-picker'

function Example() {
  return (
      <DateRangePicker
        open={true}
        onChange={(dateRange) => console.log(dateRange)}
      />
  )
}
```

## License

MIT © [laithyounes](https://github.com/laithyounes)
