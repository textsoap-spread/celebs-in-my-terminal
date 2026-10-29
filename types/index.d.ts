export type PixelSize = 8 | 16

// 픽셀 그림. 글자 한 칸에 위아래 두 픽셀을 ▀ (글자색=위, 배경색=아래)로 그린다
// small 은 8x8 (4줄), big 은 16x16 (8줄). '.' 은 투명
// idle 은 평소 대사, busy 는 작업 중 대사
export type Sprite = {
  name: string
  palette: Record<string, string>
  small: string[]
  big: string[]
  idle: string[]
  busy: string[]
}

declare module 'claude-code' {
  interface PluginState {
    // crew 는 /crew 로 고른 친구들. 비어 있으면 예시 친구들이 나온다
    'hat-clawd': { size: PixelSize; who: number; line: number; crew: Sprite[] }
  }
}
