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
import 'react-date-range-picker/dist/index.css'

function Example() {
  return (
      <DateRangePicker
        theme={theme}
        open={true}
        elevation={3}
        maxDate={addDays(new Date(), -1)}
        past={true}
        initialDateRange={{
          startDate: addDays(new Date(), -4),
          endDate: addDays(new Date(), -3)
        }}
        onChange={(dateRange) => console.log(dateRange)}
      />
  )
}
```

## License

MIT © [laithyounes](https://github.com/laithyounes)
