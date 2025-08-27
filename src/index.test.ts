import assert from 'node:assert'
import { describe, it } from 'node:test'
import { by, Order } from './index.ts'

interface User {
	name: string
	age: number
	address: {
		city: string
		zip: number
	}
	joined: Date
	logins: number | null
	active: boolean
}

const users = () =>
	[
		{
			name: 'Alice',
			age: 30,
			address: { city: 'New York', zip: 10001 },
			joined: new Date('2022-01-15'),
			logins: 10,
			active: true
		},
		{
			name: 'Bob',
			age: 25,
			address: { city: 'Los Angeles', zip: 90001 },
			joined: new Date('2021-11-20'),
			logins: 25,
			active: false
		},
		{
			name: 'Charlie',
			age: 30,
			address: { city: 'Chicago', zip: 60601 },
			joined: new Date('2023-03-10'),
			logins: null,
			active: true
		},
		{
			name: 'David',
			age: 28,
			address: { city: 'New York', zip: 10002 },
			joined: new Date('2022-01-15'),
			logins: 5,
			active: false
		}
	] satisfies User[]

describe(by.name, () => {
	it('sorts by a single string property', () => {
		const sorted = users().sort(by('name'))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'Bob', 'Charlie', 'David']
		)
	})

	it('sorts by a single string property in ascending order', () => {
		const sorted = users().sort(by('name', Order.Asc))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'Bob', 'Charlie', 'David']
		)
	})

	it('sorts by a single string property in descending order', () => {
		const sorted = users().sort(by('name', Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['David', 'Charlie', 'Bob', 'Alice']
		)
	})

	it('sorts by a single number property in descending order', () => {
		const sorted = users().sort(by('age', Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => u.age),
			[30, 30, 28, 25]
		)
	})

	it('sorts by multiple nested properties', () => {
		const sorted = users().sort(by(['address.city', 'name']))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Charlie', 'Bob', 'Alice', 'David']
		)
	})

	it('sorts by multiple properties in descending order', () => {
		const sorted = users().sort(by(['age', 'name'], Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Charlie', 'Alice', 'David', 'Bob']
		)
	})

	it('sorts by a selector function', () => {
		const sorted = users().sort(by(u => u.joined))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Bob', 'Alice', 'David', 'Charlie']
		)
	})

	it('sorts by date', () => {
		const sorted = users().sort(by('joined'))
		assert.deepStrictEqual(
			sorted.map(u => u.joined.getFullYear()),
			[2021, 2022, 2022, 2023]
		)
	})

	it('handles null and undefined values', () => {
		const sorted = users().sort(by('logins'))
		assert.deepStrictEqual(
			sorted.map(u => u.logins),
			[null, 5, 10, 25]
		)
	})

	it('handles null and undefined values for asc', () => {
		const sorted = users().sort(by('logins', Order.Asc))
		assert.deepStrictEqual(
			sorted.map(u => u.logins),
			[null, 5, 10, 25]
		)
	})

	it('handles null and undefined values for desc', () => {
		const sorted = users().sort(by('logins', Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => u.logins),
			[25, 10, 5, null]
		)
	})

	it('supports boolean values', () => {
		const sorted = users().sort(by('active'))
		assert.deepStrictEqual(
			sorted.map(u => u.active),
			[false, false, true, true]
		)
	})
})

describe('README.md', () => {
	it('Usage: sort by name alphabetically', () => {
		const list = [
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 25 },
			{ name: 'Charlie', age: 30 }
		]
		const sorted = list.sort(by('name'))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'Bob', 'Charlie']
		)
	})

	it('Sorting by Different Orders: age descending', () => {
		const list = [
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 25 },
			{ name: 'Charlie', age: 30 }
		]
		const sorted = list.sort(by('age', Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => `${u.name}:${u.age}`),
			['Alice:30', 'Charlie:30', 'Bob:25']
		)
	})

	it('Sorting by Nested Properties: address.city', () => {
		const list = [
			{ name: 'Alice', address: { city: 'New York' } },
			{ name: 'Bob', address: { city: 'Los Angeles' } },
			{ name: 'Charlie', address: { city: 'Chicago' } }
		]
		const sorted = list.sort(by('address.city'))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Charlie', 'Bob', 'Alice']
		)
	})

	it('Sorting with a Custom Selector: name length ascending', () => {
		const list = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]
		const sorted = list.sort(by((u: { name: string }) => u.name.length))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Bob', 'Alice', 'Charlie']
		)
	})

	it('Sorting with a Custom Selector: case-insensitive by normalized key', () => {
		const list = [{ name: 'bob' }, { name: 'Alice' }, { name: 'charlie' }]
		const sorted = list.sort(by((u: { name: string }) => u.name.toLocaleLowerCase()))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'bob', 'charlie']
		)
	})

	it('Sorting by Multiple Criteria: age desc then name desc', () => {
		const list = [
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 25 },
			{ name: 'Charlie', age: 30 }
		]
		const sorted = list.sort(by(['age', 'name'], Order.Desc))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Charlie', 'Alice', 'Bob']
		)
	})

	it('Sorting by Multiple Criteria: multiple selectors evaluated in order', () => {
		const list = [
			{ name: 'Alice', age: 30 },
			{ name: 'Bob', age: 25 },
			{ name: 'Charlie', age: 30 }
		]
		const sorted = list.sort(by(['age', 'name']))
		assert.deepStrictEqual(
			sorted.map(u => `${u.age}:${u.name}`),
			['25:Bob', '30:Alice', '30:Charlie']
		)
	})

	it('Handling null and undefined: always sorted to beginning (asc)', () => {
		const items = [{ value: 10 }, { value: null }, { value: 5 }]
		const sorted = items.sort(by('value'))
		assert.deepStrictEqual(
			sorted.map(i => i.value),
			[null, 5, 10]
		)
	})

	it('Handling null and undefined: nulls first even with desc in docs, but code keeps nulls last on desc', () => {
		const items = [{ value: 10 }, { value: null }, { value: 5 }]
		const sorted = items.sort(by('value', Order.Desc))
		// current implementation sorts nulls first on asc, last on desc
		assert.deepStrictEqual(
			sorted.map(i => i.value),
			[10, 5, null]
		)
	})
})
