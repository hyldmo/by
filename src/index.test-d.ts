import { expectType } from 'tsd'
import { by, type ComparablePaths, type Selector } from './index.ts'

interface User {
	name: string
	age: number
	active: boolean
	joined: Date
	tags: string[]
	score: number | null
	address: {
		city: string
		zip: number
	}
	metadata: {
		nested: {
			deep: string
		}
	}
}

// ComparablePaths should allow primitive paths
expectType<ComparablePaths<User>>('name')
expectType<ComparablePaths<User>>('age')
expectType<ComparablePaths<User>>('active')
expectType<ComparablePaths<User>>('joined')
expectType<ComparablePaths<User>>('tags')
expectType<ComparablePaths<User>>('score')

// ComparablePaths should allow nested primitive paths
expectType<ComparablePaths<User>>('address.city')
expectType<ComparablePaths<User>>('address.zip')
expectType<ComparablePaths<User>>('metadata.nested.deep')

// ComparablePaths should NOT allow object paths
// @ts-expect-error - 'address' is an object, not comparable
expectType<ComparablePaths<User>>('address')
// @ts-expect-error - 'metadata' is an object, not comparable
expectType<ComparablePaths<User>>('metadata')
// @ts-expect-error - 'metadata.nested' is an object, not comparable
expectType<ComparablePaths<User>>('metadata.nested')

// by() should accept valid selectors
by<User>('name')
by<User>('age')
by<User>('address.city')
by<User>('tags')
by<User>(u => u.name.length)
by<User>(u => u.joined)

// by() should reject invalid selectors
// @ts-expect-error - 'address' is an object, not comparable
by<User>('address')
// @ts-expect-error - 'metadata' is an object, not comparable
by<User>('metadata')
// @ts-expect-error - invalid path
by<User>('nonexistent')

// Selector function should return Comparable
expectType<Selector<User>>((u: User) => u.name)
expectType<Selector<User>>((u: User) => u.age)
expectType<Selector<User>>((u: User) => u.tags)
expectType<Selector<User>>((u: User) => u.joined)
expectType<Selector<User>>((u: User) => null)
expectType<Selector<User>>((u: User) => undefined)

// Selector function should NOT return objects
// @ts-expect-error - returns object, not comparable
expectType<Selector<User>>((u: User) => u.address)
// @ts-expect-error - returns object, not comparable
expectType<Selector<User>>((u: User) => u.metadata)
