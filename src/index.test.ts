import assert from 'node:assert'
import { describe, it } from 'node:test'
import { by } from './index.ts'

interface User {
	name: string
	age: number
	address: {
		city: string
		zip: number
	}
	joined: Date
	logins: number | null
}

const users = () =>
	[
		{
			name: 'Alice',
			age: 30,
			address: { city: 'New York', zip: 10001 },
			joined: new Date('2022-01-15'),
			logins: 10
		},
		{
			name: 'Bob',
			age: 25,
			address: { city: 'Los Angeles', zip: 90001 },
			joined: new Date('2021-11-20'),
			logins: 25
		},
		{
			name: 'Charlie',
			age: 30,
			address: { city: 'Chicago', zip: 60601 },
			joined: new Date('2023-03-10'),
			logins: null
		},
		{
			name: 'David',
			age: 28,
			address: { city: 'New York', zip: 10002 },
			joined: new Date('2022-01-15'),
			logins: 5
		}
	] satisfies User[]

describe('by', () => {
	it('sorts by a single string property', () => {
		const sorted = users().sort(by('name'))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'Bob', 'Charlie', 'David']
		)
	})

	it('sorts by a single number property in descending order', () => {
		const sorted = users().sort(by('age', 'desc'))
		assert.deepStrictEqual(
			sorted.map(u => u.age),
			[30, 30, 28, 25]
		)
	})

	it('sorts by a nested property', () => {
		const sorted = users().sort(by(['address', 'city']))
		assert.deepStrictEqual(
			sorted.map(u => u.address.city),
			['Chicago', 'Los Angeles', 'New York', 'New York']
		)
	})

	it('sorts by a selector function', () => {
		const sorted = users().sort(by(u => u.joined))
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Bob', 'Alice', 'David', 'Charlie']
		)
	})

	it('sorts by multiple criteria', () => {
		const sorted = users().sort(
			by([
				{ selector: 'age', order: 'desc' },
				{ selector: 'name', order: 'asc' }
			])
		)
		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Alice', 'Charlie', 'David', 'Bob']
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

	it('sorts correctly with multiple complex criteria', () => {
		const sorted = users().sort(
			by([
				{ selector: ['address', 'city'], order: 'asc' },
				{ selector: 'age', order: 'desc' }
			])
		)

		assert.deepStrictEqual(
			sorted.map(u => u.name),
			['Charlie', 'Bob', 'Alice', 'David']
		)
		assert.deepStrictEqual(
			sorted.map(u => u.address.city),
			['Chicago', 'Los Angeles', 'New York', 'New York']
		)
		assert.deepStrictEqual(
			sorted.map(u => u.age),
			[30, 25, 30, 28]
		)
	})
})
