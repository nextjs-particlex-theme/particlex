import cached from '@/lib/cached'

test('cached_withSideEffect_invokeOnce', () => {

  class Test {
    invoked = 0

    @cached() wrapper(): number {
      const old = this.invoked
      this.invoked += 1
      return old
    }

  }

  const test = new Test()

  expect(test.wrapper()).toBe(0)
  expect(test.wrapper()).toBe(0)
  expect(test.wrapper()).toBe(0)
  expect(test.wrapper()).toBe(0)

  expect(test.invoked).toBe(1)
})

test('cached_invokePromise_invokeOnce', async () => {
  class Test {

    invoked = 0

    @cached() wrapper(): Promise<number> {
      return new Promise<number>(resolve => {
        const old = this.invoked
        this.invoked += 1
        resolve(old)
      })
    }

  }

  const test = new Test()
  expect(await test.wrapper()).toBe(0)
  expect(await test.wrapper()).toBe(0)
  expect(test.invoked).toBe(1)
})

test('cached_concurrentInvokePromise_dirtyData', async () => {

  class Test {

    invoked = 0

    @cached(() => 'key') wrapper(timeout: number): Promise<number> {
      return new Promise<number>(resolve => {
        setTimeout(() => {
          const old = this.invoked
          this.invoked += 1
          resolve(old)
        }, timeout)
      })
    }
  }

  const test = new Test()
  const [r1, r2] = await Promise.all([test.wrapper(1000), test.wrapper(3000)])
  expect(r1).toBe(0)
  expect(r2).toBe(1)
})