# sortby

A tiny, powerful sorting utility for arrays of objects in TypeScript and JavaScript. `sortBy` provides a flexible and intuitive way to sort complex data structures.

## Features

-   **Type-Safe**: Written in TypeScript for robust type checking.
-   **Flexible Selectors**: Sort by property keys, nested paths, or custom accessor functions.
-   **Multi-Criteria Sorting**: Easily define multiple sorting rules with different orders.
-   **Intuitive API**: A single function `by` that is easy to learn and use.
-   **Handles Complex Types**: Properly sorts strings, numbers, Dates, and handles `null`/`undefined` values gracefully.

## Installation

```bash
yarn add sortby
```

or

```bash
npm install sortby
```

## Usage

Import the `by` function and use it with `Array.prototype.sort`.

```typescript
import { by } from 'sortby'

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

You can specify `'asc'` (ascending) or `'desc'` (descending) order.

```typescript
// Sort by age in descending order
users.sort(by('age', 'desc'))
// => [ { name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 25 } ]
```

### Sorting by Nested Properties

Use an array of keys to sort by a nested property.

```typescript
const users = [
	{ name: 'Alice', address: { city: 'New York' } },
	{ name: 'Bob', address: { city: 'Los Angeles' } },
	{ name: 'Charlie', address: { city: 'Chicago' } }
]

users.sort(by(['address', 'city']))
// => [ { name: 'Charlie', ... }, { name: 'Bob', ... }, { name: 'Alice', ... } ]
```

### Sorting with a Selector Function

For complex sorting logic, provide a function as the selector.

```typescript
const users = [
	{ name: 'Alice', joined: new Date('2023-01-15') },
	{ name: 'Bob', joined: new Date('2022-11-20') }
]

users.sort(by(user => user.joined.getTime()))
// => [ { name: 'Bob', ... }, { name: 'Alice', ... } ]
```

### Sorting by Multiple Criteria

Pass an array of criteria objects to sort by multiple properties. The array is sorted by each criterion in order.

```typescript
const users = [
	{ name: 'Alice', age: 30 },
	{ name: 'Bob', age: 25 },
	{ name: 'Charlie', age: 30 }
]

users.sort(
	by([
		{ selector: 'age', order: 'desc' }, // 1. by age descending
		{ selector: 'name', order: 'asc' } // 2. then by name ascending
	])
)
// => [ { name: 'Alice', age: 30 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 25 } ]
```

The selectors within the criteria array can also be nested paths or functions.

### Handling `null` and `undefined`

`null` and `undefined` values are always sorted to the beginning of the array, regardless of the sort order.

```typescript
const items = [{ value: 10 }, { value: null }, { value: 5 }]

items.sort(by('value'))
// => [ { value: null }, { value: 5 }, { value: 10 } ]

items.sort(by('value', 'desc'))
// => [ { value: null }, { value: 10 }, { value: 5 } ]
```

## API

### `by<T>(selector, order?)`

-   **`selector`**: `keyof T | (string | number)[] | ((obj: T) => any)`
    -   A property key of `T`.
    -   An array representing a path to a nested property.
    -   A function that receives an object and returns a value to sort by.
-   **`order`**: `'asc' | 'desc'` (optional, defaults to `'asc'`)

### `by<T>(criteria)`

-   **`criteria`**: `Array<{ selector: Selector<T>, order?: 'asc' | 'desc' }>`
    -   An array of criterion objects.
