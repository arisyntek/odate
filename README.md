**o***rganize***date** is lightweight pkg that converts timestamps (or `Date`) into clean, human-readable dates — including “a moment ago”, “Yesterday at 14:23”, etc. or full formatted dates with seconds.

## Install
```shell
npm i @arisyntek/odate
```

## Use
```typescript
import { formatDate } from '@arisyntek/odate';

formatDate(1763242535431);

// Example ouputs
// 
// just now
// a moment ago
// a minute ago
// 2 minutes ago
// Yesterday at 23:35
// Nov 9, 17:08
```

## Options
```typescript
Options = {
  /** Return full Date **/
  full: boolean;
  /** Whether to use 12-hour time (default to 24-hour time) **/
  hour12: boolean;
  /** Add "Today" prefix to time as "Today at 9:00", default just "9:00" for current day **/
  today: boolean;
}
```
