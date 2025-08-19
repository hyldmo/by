export type Order = 'asc' | 'desc'
export type Selector<T> = keyof T | (string | number)[] | ((obj: T) => any)
export type Criterion<T> = {
	selector: Selector<T>
	order?: Order
}

const get = <T>(obj: T, selector: Selector<T>): any => {
	if (typeof selector === 'function') {
		return selector(obj)
	}

	if (Array.isArray(selector)) {
		return selector.reduce((acc: any, key) => acc?.[key], obj)
	}

	return obj[selector]
}

const compare = (a: any, b: any): number => {
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

export function by<T>(criteria: Criterion<T>[]): (a: T, b: T) => number
export function by<T>(selector: Selector<T>, order?: Order): (a: T, b: T) => number
export function by<T>(selectorOrCriteria: Selector<T> | Criterion<T>[], order: Order = 'asc'): (a: T, b: T) => number {
	if (Array.isArray(selectorOrCriteria)) {
		const criteria = selectorOrCriteria

		return (a: T, b: T) => {
			for (const criterion of criteria) {
				const direction = (criterion.order ?? 'asc') === 'asc' ? 1 : -1
				const valueA = get(a, criterion.selector)
				const valueB = get(b, criterion.selector)

				const result = compare(valueA, valueB) * direction

				if (result !== 0) {
					return result
				}
			}

			return 0
		}
	}

	const selector = selectorOrCriteria
	const direction = order === 'asc' ? 1 : -1

	return (a: T, b: T) => {
		const valueA = get(a, selector)
		const valueB = get(b, selector)
		return compare(valueA, valueB) * direction
	}
}
