import { expect, test } from 'claude-code/testing'

const row = (n: number, c: string) => c.repeat(n)

const LISA = {
  name: 'lisa',
  palette: { H: '#111111', S: '#f2c5a0' },
  small: Array.from({ length: 8 }, (_, y) => row(8, y < 3 ? 'H' : 'S')),
  big: Array.from({ length: 16 }, (_, y) => row(16, y < 6 ? 'H' : 'S')),
  idle: ['안녕'],
  busy: ['잠깐만'],
}

// 엔진 대신 대답하는 훅들. 저장소는 실제처럼 값을 들고 있는다
const engine = (on: Parameters<Parameters<typeof test>[1]>[1], replies: string[]) => {
  const store: Record<string, unknown> = {}
  on('command.register', (_, e) => ({ value: { command: e.name } }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('store.get', (_, e) => ({ value: store[e.key] }))
  on('store.set', (_, e) => {
    store[e.key] = e.value
    return { value: undefined }
  })
  on('ui.toast', () => ({ value: undefined }))
  on('model.complete', () => ({
    value: { isAnswered: true, text: replies.shift() ?? '', usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
  }))
  return store
}

test('예시 친구를 넣고 빼고 되돌린다', async ($, on) => {
  const store = engine(on, [])
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  expect((await $.command.run({ command: 'crew', args: '' })).text).toContain('예시 친구들이 나와')
  expect((await $.command.run({ command: 'crew', args: 'add jobs' })).text).toContain('새 친구 추가: JOBS')
  expect((await $.command.run({ command: 'crew', args: 'add JOBS' })).text).toContain('이미 있는 친구야')
  expect((store.crew as { name: string }[]).map(s => s.name)).toEqual(['JOBS'])
  expect((await $.command.run({ command: 'crew', args: 'remove jobs' })).text).toContain('예시 친구들이 다시 나와')
  expect(store.crew).toEqual([])
})

test('AI가 그린 친구는 규칙을 어기면 한 번 더 그린다', async ($, on) => {
  const store = engine(on, ['엉망', `여기 있어\n${JSON.stringify(LISA)}`])
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  expect((await $.command.run({ command: 'crew', args: 'add Lisa' })).text).toContain('새 친구 추가: LISA')
  expect((store.crew as { name: string }[]).map(s => s.name)).toEqual(['LISA'])
})

test('두 번 다 규칙을 어기면 넣지 않는다', async ($, on) => {
  const bad = { ...LISA, small: ['HHH'] }
  const store = engine(on, [JSON.stringify(bad), JSON.stringify(bad)])
  await $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

  expect((await $.command.run({ command: 'crew', args: 'add Lisa' })).text).toContain('못 넣었어')
  expect(store.crew).toBeUndefined()
})
