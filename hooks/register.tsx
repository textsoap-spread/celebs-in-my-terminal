import { atom, read, update } from 'claude-code'
import type { Register, StateDollar } from 'claude-code'

import type { PixelSize } from '../types'

// 픽셀 그림. 글자 한 칸에 위아래 두 픽셀을 ▀ (글자색=위, 배경색=아래)로 그린다
// small 은 8x8 (4줄), big 은 16x16 (8줄). '.' 은 투명
// idle 은 평소 대사, busy 는 작업 중 대사
type Sprite = {
  name: string
  palette: Record<string, string>
  small: string[]
  big: string[]
  idle: string[]
  busy: string[]
}

const SKIN = '#f2c5a0'
const EYE = '#111827'

const CREW: Sprite[] = [
  {
    name: '클로드',
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
    name: '머스크',
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
    name: '잡스',
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
    name: '칸예',
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
    name: '버질',
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
    name: '후지와라',
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

const pick = async ($: StateDollar) => {
  const current = await read($, who)
  // 같은 사람이 연달아 안 나오게
  const next = (current + 1 + Math.floor(Math.random() * (CREW.length - 1))) % CREW.length
  await update($, who, () => next)
  await update($, line, () => Math.floor(Math.random() * 100))
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'pixel',
      description: '입력창 위 친구 그림 크기 바꾸기 (8x8 <-> 16x16)',
    })
    await pick($)

    return next(e)
  })

  on('command.run', { command: 'pixel' }, async $ => {
    const now = await update($, size, s => (s === 16 ? 8 : 16))

    return { text: `친구를 ${now}x${now}로 바꿨어.` }
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
    const sprite = CREW[(await read($, who)) % CREW.length]
    const said = e.props.isWorking ? sprite.busy : sprite.idle
    const words = said[(await read($, line)) % said.length]
    const rows = px === 16 ? sprite.big : sprite.small

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
        <Box flexDirection="row" width="100%" justifyContent="center">
          <Box flexDirection="column" alignItems="center" width={px + 2}>
            {Array.from({ length: lines }, (_, y) => row(y))}
            <Text dimColor wrap="truncate">{sprite.name}</Text>
          </Box>
          {/* 말풍선: 그림 가운데 높이에 꼬리 */}
          <Box flexDirection="column" marginTop={Math.max(0, lines / 2 - 1)}>
            <Box flexDirection="row">
              <Box flexDirection="column">
                <Text> </Text>
                <Text dimColor>◀</Text>
              </Box>
              <Box borderStyle="round" borderDimColor paddingX={1}>
                <Text wrap="truncate">{words}</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  })
}
