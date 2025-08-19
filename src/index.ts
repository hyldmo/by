import type { Paths } from 'type-fest'

export type Order = 'asc' | 'desc'

export type Selector<T> = Paths<T> | ((obj: T) => any)

const get = <T>(obj: T, selector: Selector<T>): any => {
	if (typeof selector === 'function') {
		return selector(obj)
	}

	if (typeof selector === 'string' && selector.includes('.')) {
		return selector.split('.').reduce((acc: any, key) => acc?.[key], obj)
	}

	return (obj as any)[selector]
}

export const compare = (a: any, b: any): number => {
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

export function by<T>(selector: Selector<T>, order?: Order): (a: T, b: T) => number
export function by<T>(selectors: Selector<T>[]): (a: T, b: T) => number
export function by<T>(selectors: Selector<T> | Selector<T>[], order: Order = 'asc'): (a: T, b: T) => number {
	if (Array.isArray(selectors)) {
		return (a: T, b: T) => {
			for (const selector of selectors) {
				const valueA = get(a, selector)
				const valueB = get(b, selector)

				const result = compare(valueA, valueB)

				if (result !== 0) {
					return result
				}
			}

			return 0
		}
	}

	const direction = order === 'asc' ? 1 : -1

	return (a: T, b: T) => {
		const valueA = get(a, selectors)
		const valueB = get(b, selectors)
		return compare(valueA, valueB) * direction
	}
}
