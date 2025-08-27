# by

A tiny, powerful sorting utility for arrays of objects in TypeScript and JavaScript. `@hyldmo/by` provides a flexible and intuitive way to sort complex data structures.

## Features

-   **Type-Safe**: Written in TypeScript for robust type checking.
-   **Flexible Selectors**: Sort by property keys, nested paths, or custom accessor functions.
-   **Multi-Criteria Sorting**: Easily define multiple sorting rules with different orders.
-   **Intuitive API**: A single function `by` that is easy to learn and use.
-   **Handles Complex Types**: Properly sorts strings, numbers, booleans, Dates, and handles `null`/`undefined` values gracefully.

## Installation

```bash
yarn add @hyldmo/by
```

or

```bash
npm install @hyldmo/by
```

## Usage

Import the `by` function and use it with `Array.prototype.sort`.

```typescript
import { by } from '@hyldmo/by'

const users = [
	{ name: 'Alice', age: 30 },
	{ name: 'Bob', age: 25 },
	{ name: 'Charlie', age: 30 }
]

// Sort by name alphabetically
users.sort(by('name'))
// => [ { name: 'Alice', ... }, { name: 'Bob', ... }, { name: 'Charlie', ... } ]
```

### Sorting by Different Orders

Use the `Order` enum for ascending or descending order.

```typescript
import { by, Order } from '@hyldmo/by'

// Sort by age in descending order
users.sort(by('age', Order.Desc))
// => [ { name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 25 } ]
```

### Sorting by Nested Properties

Use dot-path strings to sort by nested properties. Paths are type-safe via `type-fest` `Paths<T>`.

```typescript
const users = [
	{ name: 'Alice', address: { city: 'New York' } },
	{ name: 'Bob', address: { city: 'Los Angeles' } },
	{ name: 'Charlie', address: { city: 'Chicago' } }
]

users.sort(by('address.city'))
// => [ { name: 'Charlie', ... }, { name: 'Bob', ... }, { name: 'Alice', ... } ]
```

### Sorting with a Custom Selector

Provide a function to sort by a derived value (e.g., name length, case-insensitive key, normalized text). Dates are already supported without a custom selector.

```typescript
const users = [
	{ name: 'Alice' },
	{ name: 'Bob' },
	{ name: 'Charlie' }
]

// Sort by name length (shortest first)
users.sort(by(u => u.name.length))
// => [ { name: 'Bob' }, { name: 'Alice' }, { name: 'Charlie' } ]

// Case-insensitive name sort using a normalized key
users.sort(by(u => u.name.toLocaleLowerCase()))
```

### Sorting by Multiple Criteria

Pass an array of selectors to sort by multiple properties. Earlier selectors have higher priority. Optionally pass a single `Order` that applies to all selectors.

```typescript
import { by, Order } from '@hyldmo/by'

const users = [
	{ name: 'Alice', age: 30 },
	{ name: 'Bob', age: 25 },
	{ name: 'Charlie', age: 30 }
]

// 1) by age descending, 2) then by name descending
users.sort(by(['age', 'name'], Order.Desc))
// => [ { name: 'Charlie', age: 30 }, { name: 'Alice', age: 30 }, { name: 'Bob', age: 25 } ]

// Multiple selectors evaluated in order
users.sort(by(['age', 'name']))
```

### Handling `null` and `undefined`

`null` and `undefined` values are always sorted to the beginning of the array, regardless of the sort order.

```typescript
const items = [{ value: 10 }, { value: null }, { value: 5 }]

items.sort(by('value'))
// => [ { value: null }, { value: 5 }, { value: 10 } ]
import { Order } from '@hyldmo/by'
items.sort(by('value', Order.Desc))
// => [ { value: null }, { value: 10 }, { value: 5 } ]
```

## API

### Automatically handled data types

The comparator automatically handles: `string`, `number`, `boolean`, `Date`, and sorts `null`/`undefined` to the beginning, regardless of order. Use a custom selector only for derived values or normalization.

### `by<T>(selector, order?)`

-   **`selector`**: `Selector<T>`
    -   A property path of `T` (supports dot-paths via `Paths<T>`).
    -   A function that receives an object and returns a sortable value.
-   **`order`**: `Order` (optional, defaults to `Order.Asc`)

### `by<T>(selectors, order?)`

-   **`selectors`**: `Selector<T>[]`
    -   An array of selectors evaluated in order until a difference is found.
-   **`order`**: `Order` (optional, defaults to `Order.Asc`)

### Types

```ts
import type { Paths } from 'type-fest'

export enum Order {
	Asc = 1,
	Desc = -1
}

export type Selector<T> =
	| Paths<T>
	| ((obj: T) => string | number | Date | null | undefined | boolean)
```
