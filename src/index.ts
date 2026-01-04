import type { Paths } from 'type-fest'

/**
 * Sorting order for the `by` function.
 */
export enum Order {
	/** Sort in ascending order (smallest to largest, A to Z) */
	Asc = 1,
	/** Sort in descending order (largest to smallest, Z to A) */
	Desc = -1
}

/**
 * A selector used to extract a sortable value from an object.
 *
 * Can be:
 * - A property key of `T` (e.g., `'name'`)
 * - A dot-path string for nested properties (e.g., `'address.city'`)
 * - A function that returns a sortable value (e.g., `(obj) => obj.name.length`)
 */
export type Selector<T> = Paths<T> | ((obj: T) => string | number | Date | null | undefined | boolean | unknown[])

function get<T>(obj: T, selector: Selector<T>): any {
	if (typeof selector === 'function') {
		return selector(obj)
	}

	if (typeof selector === 'string' && selector.includes('.')) {
		return selector.split('.').reduce((acc: any, key) => acc?.[key], obj)
	}

	return (obj as any)[selector]
}

/**
 * Compares two values for sorting.
 *
 * Handles `string`, `number`, `boolean`, `Date`, and arrays (by length) automatically.
 * `null` and `undefined` values are sorted to the beginning.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns Negative if `a < b`, positive if `a > b`, or `0` if equal
 *
 * @example
 * ```ts
 * compare(1, 2)           // -1
 * compare('b', 'a')       // 1
 * compare(null, 5)        // -1
 * compare([1, 2], [1])    // 1 (longer array)
 * ```
 */
export function compare(a: any, b: any): number {
	if (a === b) {
		return 0
	}
	if (a === null || typeof a === 'undefined') {
		return -1
	}
	if (b === null || typeof b === 'undefined') {
		return 1
	}

	if (typeof a === 'number' && typeof b === 'number') {
		return a - b
	}

	if (typeof a === 'string' && typeof b === 'string') {
		return a.localeCompare(b)
	}

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() - b.getTime()
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length - b.length
	}

	if (a < b) {
		return -1
	}
	if (a > b) {
		return 1
	}

	return 0
}

/**
 * Creates a comparator function for sorting arrays of objects.
 *
 * Supports sorting by property keys, nested dot-paths, or custom accessor functions.
 * Automatically handles `string`, `number`, `boolean`, `Date`, arrays (by length), `null`, and `undefined`.
 *
 * @param selectors - A selector or array of selectors to extract sortable values.
 *   - Property key: `'name'`
 *   - Nested path: `'address.city'`
 *   - Accessor function: `(obj) => obj.name.length`
 * @param order - Sort order: `Order.Asc` (default) or `Order.Desc`
 * @returns A comparator function for use with `Array.prototype.sort`
 *
 * @example
 * ```ts
 * // Sort by property
 * users.sort(by('name'))
 *
 * // Sort descending
 * users.sort(by('age', Order.Desc))
 *
 * // Sort by nested property
 * users.sort(by('address.city'))
 *
 * // Sort by derived value
 * users.sort(by(u => u.name.length))
 *
 * // Sort by array property (compares by length)
 * users.sort(by('tags'))
 *
 * // Multi-criteria sort (age first, then name)
 * users.sort(by(['age', 'name']))
 * ```
 */
export function by<T>(selectors: Selector<T> | Selector<T>[], order: Order = Order.Asc): (a: T, b: T) => number {
	if (Array.isArray(selectors)) {
		return (a: T, b: T) => {
			for (const selector of selectors) {
				const valueA = get(a, selector)
				const valueB = get(b, selector)

				const result = compare(valueA, valueB)

				if (result !== 0) {
					return result * order
				}
			}

			return 0
		}
	}

	return (a: T, b: T) => {
		const valueA = get(a, selectors)
		const valueB = get(b, selectors)
		return compare(valueA, valueB) * order
	}
}
