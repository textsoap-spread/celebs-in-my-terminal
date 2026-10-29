export type PixelSize = 8 | 16

declare module 'claude-code' {
  interface PluginState {
    'hat-clawd': { size: PixelSize; who: number; line: number }
  }
}
