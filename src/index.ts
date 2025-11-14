import type { Paths } from 'type-fest'

export enum Order {
	Asc = 1,
	Desc = -1
}

export type Selector<T> = Paths<T> | ((obj: T) => string | number | Date | null | undefined | boolean)

function get<T>(obj: T, selector: Selector<T>): any {
	if (typeof selector === 'function') {
		return selector(obj)
	}

	if (typeof selector === 'string' && selector.includes('.')) {
		return selector.split('.').reduce((acc: any, key) => acc?.[key], obj)
	}

	return (obj as any)[selector]
}

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

	if (a < b) {
		return -1
	}
	if (a > b) {
		return 1
	}

	return 0
}

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
