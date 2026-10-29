import { atom, read, update } from 'claude-code'
import type { Register, StateDollar } from 'claude-code'

import type { PixelSize, Sprite } from '../types'

const SKIN = '#f2c5a0'
const EYE = '#111827'

// 예시 친구들. /crew 로 내 친구를 넣으면 그 친구들만 나온다
const EXAMPLES: Sprite[] = [
  {
    name: 'CLAUDE',
    palette: { H: '#1f2937', R: '#dc2626', O: '#d97757', k: EYE },
    small: [
      '..HHHH..',
      '..HHHH..',
      '.HHHHHH.',
      '.OOOOOO.',
      'OOkOOkOO',
      'OOOOOOOO',
      '.OOOOOO.',
      '.O.O.O.O',
    ],
    big: [
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....HHHHHH.....',
      '.....RRRRRR.....',
      '...HHHHHHHHHH...',
      '...OOOOOOOOOO...',
      '...OOOOOOOOOO...',
      '...OOkkOOkkOO...',
      '.OOOOkkOOkkOOOO.',
      '.OOOOOOOOOOOOOO.',
      '...OOOOOOOOOO...',
      '...OOOOOOOOOO...',
      '...OOOOOOOOOO...',
      '...O.O....O.O...',
      '...O.O....O.O...',
      '................',
    ],
    idle: [
      '뭐든 물어봐!',
      '오늘은 뭐 만들까?',
      '모자 어때? 잘 어울려?',
      '심심하면 아무 말이나 걸어봐',
      '오늘 컨디션 어때?',
      '이 모자 사실 빌린 거야 🎩',
      '궁금한 거 쌓아두지 마',
      '나 오늘 일할 맛 나',
    ],
    busy: [
      '음... 생각 중이야 🤔',
      '잠깐만, 거의 다 됐어',
      '머리 굴리는 중',
      '모자 고쳐 쓰고 집중 중',
      '조금만 기다려줘',
    ],
  },
  {
    name: 'MUSK',
    palette: { D: '#3b2a1e', S: SKIN, k: EYE, b: '#3b2a1e', n: '#d9a37e', m: '#9a4a3a', W: '#ffffff', B: '#111111' },
    small: [
      '..DDDD..',
      '.DDSSDD.',
      '.SkSSkS.',
      '.SSSSSS.',
      '.SWWWWS.',
      '..SSSS..',
      '.BWBWBB.',
      'BBBWBBBB',
    ],
    big: [
      '................',
      '....DDDDDDDD....',
      '...DDDDDDDDDD...',
      '...DDSSDDDDDD...',
      '...DSSSSSSSSD...',
      '...SSSSSSSSSS...',
      '..SSbbbSSbbbSS..',
      '..SSSkSSSSkSSS..',
      '...SSSSnnSSSS...',
      '...SSSSSSSSSS...',
      '....SmWWWWmS....',
      '.....SSSSSS.....',
      '......SSSS......',
      '...BBBWBBWBBB...',
      '..BBBBBWWBBBBB..',
      '.BBBBBWBBWBBBBB.',
    ],
    idle: [
      '이거 화성에서도 돌아가?',
      '첫 원칙부터 다시 생각해봐',
      '더 빨리 출시하자 🚀',
      '목표는 크게, 일정은 짧게',
      '이거 자동화하면 안 돼?',
      '회의 줄이고 만들자',
      '불가능해 보이면 일단 해봐',
      '다음 발사는 언제야?',
    ],
    busy: [
      '계산 중... 로켓보단 쉽네',
      '일단 다 지우고 다시 짜보자',
      '부품 하나 빼볼까?',
      '발사 카운트다운 중 🚀',
      '물리 법칙만 안 어기면 돼',
    ],
  },
  {
    name: 'JOBS',
    palette: { D: '#3f3f46', S: SKIN, k: EYE, b: '#3f3f46', G: '#27272a', n: '#d9a37e', d: '#a8a29e', m: '#9a4a3a', B: '#111111' },
    small: [
      '..DDDD..',
      '.DSSSSD.',
      '.kkSSkk.',
      '.SSSSSS.',
      '.SdddS..',
      '..dddd..',
      '.BBBBBB.',
      'BBBBBBBB',
    ],
    big: [
      '................',
      '................',
      '.....DDDDDD.....',
      '...DDSSSSSSDD...',
      '...DSSSSSSSSD...',
      '..SSbbbSSbbbSS..',
      '..SGGGGSSGGGGS..',
      '..GGkkGGGGkkGG..',
      '..SGGGGSSGGGGS..',
      '...SSSSnnSSSS...',
      '...dSSSSSSSSd...',
      '....ddmmmmdd....',
      '.....dddddd.....',
      '....BBBBBBBB....',
      '..BBBBBBBBBBBB..',
      '.BBBBBBBBBBBBBB.',
    ],
    idle: [
      'One more thing...',
      'Stay hungry, stay foolish.',
      '단순한 게 제일 어려워',
      '버튼 하나로 줄여봐',
      '디자인은 보이는 게 다가 아니야',
      '아니라고 말하는 게 집중이야',
      '점들은 나중에 이어져',
      '이거 다시 해. 더 좋게',
    ],
    busy: [
      '더 단순하게 안 되나?',
      '디테일까지 보는 중이야',
      '모서리 둥글리는 중',
      '터틀넥 입고 집중 중',
      '천 번 아니라고 하는 중',
    ],
  },
  {
    name: 'KANYE',
    palette: { d: '#1c1917', S: '#8d5524', K: '#000000', g: '#9ca3af', n: '#6f4220', m: '#4a2c1a', B: '#111111' },
    small: [
      '..dddd..',
      '.dSSSSd.',
      'KKKKKgKK',
      '.SSSSSS.',
      '.SSSSSS.',
      '..SSSS..',
      '.BBBBBB.',
      'BBBBBBBB',
    ],
    big: [
      '................',
      '................',
      '....BBBBBBBB....',
      '...BBddddddBB...',
      '..BBSSSSSSSSBB..',
      '..BSSSSSSSSSSB..',
      '.BKKKKKKKKKKKKB.',
      '.BKgKKKKKKKgKKB.',
      '.BSKKKKSSKKKKSB.',
      '.BSSSSSnnSSSSSB.',
      '.BBSSSSSSSSSSBB.',
      '..BBSSmmmmSSBB..',
      '...BBSSSSSSBB...',
      '..BBBBBBBBBBBB..',
      '.BBBBBBBBBBBBBB.',
      'BBBBBBBBBBBBBBBB',
    ],
    idle: [
      '이건 걸작이 될 거야',
      '난 지금 창작 모드야 🕶️',
      '평범한 건 재미없잖아',
      '오늘 영감 넘친다',
      '내 선글라스는 안 벗어',
      '무대 준비됐어?',
      '모두가 뮤즈야',
      '크게 생각해, 더 크게',
    ],
    busy: [
      '비트 만드는 중...',
      '천재는 기다리게 하는 법',
      '앨범 또 미루는 중',
      '사운드 다듬는 중 🎧',
      '이건 역사에 남을 거야',
    ],
  },
  {
    name: 'VIRGIL',
    palette: { d: '#1c1917', S: '#7c4a2a', k: EYE, b: '#1c1917', n: '#5f3820', m: '#3a2015', W: '#f5f5f4', B: '#111111', O: '#f97316' },
    small: [
      '..dddd..',
      '.dSSSSd.',
      '.SkSSkS.',
      '.SSSSSS.',
      '.dSddSd.',
      '..dddd..',
      '.WBWBWO.',
      'WBWBWBWB',
    ],
    big: [
      '................',
      '................',
      '.....dddddd.....',
      '....dddddddd....',
      '...dSSSSSSSSd...',
      '...SSSSSSSSSS...',
      '..SSbbbSSbbbSS..',
      '..SSSkSSSSkSSS..',
      '...SSSSnnSSSS...',
      '...dSSSSSSSSd...',
      '...dddddddddd...',
      '....ddmmmmdd....',
      '.....dddddd.....',
      '...WWWWWWWWWW...',
      '..WBBWWBBWWBBWO.',
      '.WWWBBWWBBWWBBWO',
    ],
    idle: [
      '"질문" 해봐',
      '3%만 바꿔도 새로워져',
      '"아이디어"',
      '기본에서 살짝 비틀어봐',
      '"여기에 따옴표"',
      '17살 나한테 보여줄 거 만들자',
      '스트리트도 예술이야',
      '"마음에 들어?"',
    ],
    busy: [
      '"작업 중"',
      '케이블타이 묶는 중 🧡',
      '"거의 다 됨"',
      '줄무늬 맞추는 중',
      '3% 고치는 중',
    ],
  },
  {
    name: 'FUJIWARA',
    palette: { L: '#b8bcc2', S: '#f1d3b3', K: '#000000', g: '#9ca3af', n: '#d9b08c', m: '#a0604a', W: '#f5f5f4', B: '#27272a' },
    small: [
      '.LLLLLL.',
      'LLLSSLLL',
      'LKKgKKKL',
      'LSSSSSSL',
      'L.SmmS.L',
      '..SSSS..',
      '.BBWBBB.',
      'BBBBWBBB',
    ],
    big: [
      '................',
      '.....LLLLLL.....',
      '...LLLLLLLLLL...',
      '..LLLLLSSLLLLL..',
      '..LLLSSSSSSLLL..',
      '..LLSSSSSSSSLL..',
      '..LKKKKKKKKKKL..',
      '..LKgKKKKKgKKL..',
      '..LSKKKSSKKKSL..',
      '..LLSSSnnSSSLL..',
      '..LLSSmmmmSSLL..',
      '..LLLSSSSSSLLL..',
      '..LLL.SSSS.LLL..',
      '...BBBBBWBBWBB..',
      '..BBBBBWWBWWBBB.',
      '.BBBBBBWBBWBBBBB',
    ],
    idle: [
      '좋은 건 조용히 퍼지는 법이야',
      '콜라보 해볼까? ⚡',
      '유행은 따라가는 게 아니야',
      '적게 만들고 오래 가자',
      '진짜는 설명 안 해도 알아',
      '오늘 고른 거 괜찮네',
      '도쿄 날씨 좋다',
      '천천히, 근데 확실하게',
    ],
    busy: [
      '취향 고르는 중... ⚡',
      '조용히 만드는 중',
      '번개 두 개 그리는 중',
      '선글라스 고쳐 쓰는 중',
      '한정판 준비 중',
    ],
  },
]

// 그림 크기 (/pixel 로 8 <-> 16)
const size = atom({ plugin: 'hat-clawd', key: 'size' } as const, 16 as PixelSize)
// 지금 말 거는 친구와 대사 번호 (질문할 때마다 새로 뽑는다)
const who = atom({ plugin: 'hat-clawd', key: 'who' } as const, 0)
const line = atom({ plugin: 'hat-clawd', key: 'line' } as const, 0)
// 내가 고른 친구들. 세션이 끝나도 남도록 $.store 에도 같이 적는다
const crew = atom({ plugin: 'hat-clawd', key: 'crew' } as const, [] as Sprite[])

const lineup = async ($: StateDollar) => {
  const mine = await read($, crew)
  return mine.length > 0 ? mine : EXAMPLES
}

const pick = async ($: StateDollar) => {
  const count = (await lineup($)).length
  const current = await read($, who)
  // 같은 사람이 연달아 안 나오게
  const next = count < 2 ? 0 : (current + 1 + Math.floor(Math.random() * (count - 1))) % count
  await update($, who, () => next)
  await update($, line, () => Math.floor(Math.random() * 100))
}

const saveCrew = async ($: StateDollar, list: Sprite[]) => {
  await update($, crew, () => list)
  await $.store.set('crew', list)
  await pick($)
}

// 모델이 그린 그림이 규칙에 맞는지 본다. 맞지 않으면 이유를 돌려준다
const check = (s: Sprite): string | undefined => {
  if (!s || typeof s.name !== 'string' || !s.name) return 'name 이 없다'
  if (!s.palette || typeof s.palette !== 'object') return 'palette 가 없다'
  for (const [key, color] of Object.entries(s.palette)) {
    if (key.length !== 1 || key === '.') return `palette 키 "${key}" 는 '.' 이 아닌 한 글자여야 한다`
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) return `palette 색 "${color}" 는 #rrggbb 여야 한다`
  }
  for (const [field, n] of [['small', 8], ['big', 16]] as const) {
    const rows = s[field]
    if (!Array.isArray(rows) || rows.length !== n) return `${field} 는 ${n}줄이어야 한다`
    for (const row of rows) {
      if (typeof row !== 'string' || row.length !== n) return `${field} 의 각 줄은 정확히 ${n}글자여야 한다: "${row}"`
      for (const c of row) {
        if (c !== '.' && !(c in s.palette)) return `${field} 에 palette 에 없는 글자 "${c}" 가 있다`
      }
    }
  }
  for (const field of ['idle', 'busy'] as const) {
    const said = s[field]
    if (!Array.isArray(said) || said.length === 0 || said.some(w => typeof w !== 'string' || !w)) {
      return `${field} 는 대사 문자열 목록이어야 한다`
    }
  }
  return undefined
}

const ASK = `너는 터미널에 나오는 8비트 도트 캐릭터를 그린다.
요청한 인물을 그 사람의 머리 모양, 피부색, 안경, 옷 같은 특징이 한눈에 보이게 그려라.
아래 JSON 하나만 답해라. 설명이나 코드 블록 표시는 쓰지 마라.

{
  "name": "인물 이름. 영어 대문자, 짧게 (예: MUSK, JOBS)",
  "palette": { "한 글자": "#rrggbb", ... },
  "small": [8x8 그림. 8글자짜리 문자열 8개],
  "big": [16x16 그림. 16글자짜리 문자열 16개],
  "idle": [평소에 하는 말 8개],
  "busy": [작업을 기다리는 동안 하는 말 5개]
}

규칙:
- 그림의 각 글자는 palette 의 키이거나 '.' (투명) 이다. palette 키는 '.' 이 아닌 한 글자다.
- small 은 얼굴과 어깨, big 은 머리부터 어깨까지 그린다.
- 대사는 그 인물다운 짧은 말이다. 한국어 반말로, 20자 안팎. 이모지는 가끔만.

예시 (MUSK):
`

const draw = async ($: StateDollar, person: string): Promise<Sprite | string> => {
  const sample = EXAMPLES.find(s => s.name === 'MUSK')
  let prompt = `${ASK}${JSON.stringify(sample)}\n\n그릴 인물: ${person}`
  let problem = '답이 비었다'
  // 규칙에 안 맞으면 이유를 알려주고 한 번 더 그리게 한다
  for (let i = 0; i < 2; i++) {
    const r = await $.model.complete({ model: 'sonnet', prompt, maxTokens: 4000 })
    if (!r.isAnswered) return '그림을 못 받았어. 잠시 뒤에 다시 해봐.'
    const start = r.text.indexOf('{')
    const end = r.text.lastIndexOf('}')
    try {
      const s = JSON.parse(r.text.slice(start, end + 1)) as Sprite
      problem = check(s) ?? ''
      if (!problem) return { ...s, name: s.name.toUpperCase() }
    } catch {
      problem = 'JSON 으로 읽을 수 없다'
    }
    prompt = `${prompt}\n\n지난 답:\n${r.text}\n\n문제: ${problem}. 고쳐서 JSON 만 다시 답해라.`
  }
  return `그림이 규칙에 안 맞아서 못 넣었어 (${problem}). 다시 해봐.`
}

const HELP = [
  '/crew               지금 나오는 친구 보기',
  '/crew add 이름      친구 넣기 (예시 친구 이름이면 그대로, 아니면 AI가 그려줌)',
  '/crew remove 이름   친구 빼기',
  '/crew reset         내 친구 다 지우고 예시 친구로 돌아가기',
].join('\n')

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'pixel',
      description: '입력창 위 친구 그림 크기 바꾸기 (8x8 <-> 16x16)',
    })
    await $.command.register({
      name: 'crew',
      description: '입력창 위에 나올 친구 고르기 (add 이름 / remove 이름 / reset)',
    })
    const stored = await $.store.get('crew')
    if (Array.isArray(stored)) {
      await update($, crew, () => (stored as Sprite[]).filter(s => !check(s)))
    }
    await pick($)

    return next(e)
  })

  on('command.run', { command: 'pixel' }, async $ => {
    const now = await update($, size, s => (s === 16 ? 8 : 16))

    return { text: `친구를 ${now}x${now}로 바꿨어.` }
  })

  on('command.run', { command: 'crew' }, async ($, e) => {
    const [action = '', ...rest] = e.args.trim().split(/\s+/)
    const name = rest.join(' ')
    const mine = await read($, crew)
    const same = (s: Sprite) => s.name.toUpperCase() === name.toUpperCase()

    if (action === 'add' && name) {
      if (mine.some(same)) return { text: `이미 있는 친구야: ${name.toUpperCase()}` }
      const example = EXAMPLES.find(same)
      let sprite: Sprite | string
      if (example) {
        sprite = example
      } else {
        await $.ui.toast(`${name} 그리는 중... 30초쯤 걸려`)
        sprite = await draw($, name)
      }
      if (typeof sprite === 'string') return { text: sprite }
      await saveCrew($, [...mine, sprite])
      return { text: `새 친구 추가: ${sprite.name}. 이제 내 친구 ${mine.length + 1}명만 나와.` }
    }

    if (action === 'remove' && name) {
      if (!mine.some(same)) return { text: `내 친구 목록에 없어: ${name.toUpperCase()}` }
      const left = mine.filter(s => !same(s))
      await saveCrew($, left)
      return { text: left.length > 0 ? `친구 뺌: ${name.toUpperCase()}` : `친구 뺌: ${name.toUpperCase()}. 내 친구가 없어서 예시 친구들이 다시 나와.` }
    }

    if (action === 'reset') {
      await saveCrew($, [])
      return { text: '내 친구를 다 지웠어. 예시 친구들이 다시 나와.' }
    }

    const now = mine.length > 0
      ? `내 친구: ${mine.map(s => s.name).join(', ')}`
      : `지금은 예시 친구들이 나와: ${EXAMPLES.map(s => s.name).join(', ')}`
    return { text: `${now}\n\n${HELP}` }
  })

  on('prompt.submit', async ($, e, next) => {
    await pick($)

    return next(e)
  })

  // 입력창 바로 위에 친구 한 명이 나와서 말을 건다. 작업 중이면 대사가 바뀐다
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const px = await read($, size)
    const lines = px / 2
    // 그림 + 이름 1줄이 입력창 몫을 빼고도 남을 때만
    if (e.props.hasSurvey || e.props.maxRows < lines + 6) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const list = await lineup($)
    const sprite = list[(await read($, who)) % list.length]
    const said = e.props.isWorking ? sprite.busy : sprite.idle
    const words = said[(await read($, line)) % said.length]
    // 위아래 빈 줄은 잘라서 캐릭터마다 여백이 같게. 홀수 줄이면 아래에 빈 줄 하나
    const drawn = px === 16 ? sprite.big : sprite.small
    const filled = (r: string) => [...r].some(c => sprite.palette[c])
    const first = drawn.findIndex(filled)
    const last = drawn.length - 1 - [...drawn].reverse().findIndex(filled)
    const rows = first < 0 ? ['.'.repeat(px)] : drawn.slice(first, last + 1)
    if (rows.length % 2) rows.push('.'.repeat(px))
    const height = rows.length / 2

    // 말풍선 색: 그림에서 제일 많이 쓴 진한 색 (밝은 피부색·흰색은 건너뛴다)
    const used: Record<string, number> = {}
    for (const r of rows) for (const c of r) if (sprite.palette[c]) used[c] = (used[c] ?? 0) + 1
    const dark = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
      return 0.299 * r + 0.587 * g + 0.114 * b < 170
    }
    const accentKey = Object.keys(used)
      .filter(c => dark(sprite.palette[c]))
      .sort((a, b) => used[b] - used[a])[0]
    const accent = accentKey ? sprite.palette[accentKey] : undefined

    const row = (y: number) => {
      const top = rows[y * 2]
      const bottom = rows[y * 2 + 1]
      const cells = []
      for (let x = 0; x < px; x++) {
        const up = sprite.palette[top[x]]
        const down = sprite.palette[bottom[x]]
        if (up && down) {
          cells.push(<Text key={x} color={up} backgroundColor={down}>▀</Text>)
        } else if (up) {
          cells.push(<Text key={x} color={up}>▀</Text>)
        } else if (down) {
          cells.push(<Text key={x} color={down}>▄</Text>)
        } else {
          cells.push(<Text key={x}> </Text>)
        }
      }
      return <Text key={y}>{cells}</Text>
    }

    return (
      <Box flexDirection="column">
        {await next(e)}
        {/* 가운데 정렬 (엔진 노드가 안 들어간 상자라 width 를 줘도 된다) */}
        <Box flexDirection="row" width="100%" justifyContent="center" marginTop={1}>
          <Box flexDirection="column" alignItems="center" width={px + 2}>
            {Array.from({ length: height }, (_, y) => row(y))}
            <Text bold color={accent} wrap="truncate">{sprite.name}</Text>
          </Box>
          {/* 말풍선: 그림 가운데 높이에 꼬리, 테두리와 꼬리는 캐릭터 색 */}
          <Box flexDirection="column" marginTop={Math.max(0, Math.floor((height + 1) / 2) - 1)}>
            <Box flexDirection="row">
              <Box flexDirection="column">
                <Text> </Text>
                <Text color={accent}>◀</Text>
              </Box>
              <Box borderStyle="round" borderColor={accent} paddingX={1}>
                <Text wrap="truncate" italic={e.props.isWorking}>{words}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  })
}
