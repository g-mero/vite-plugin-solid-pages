// uno.config.ts
import { defineConfig, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      'stroke1': 'var(--jg-stroke1)',
      'fg1': 'var(--jg-fg1)',
      'fg2': 'var(--jg-fg2)',
      'fg3': 'var(--jg-fg3)',
      'fg4': 'var(--jg-fg4)',
      'fg-link': 'var(--jg-fg-link)',
      'bg1': 'var(--jg-bg1)',
      'bg2': 'var(--jg-bg2)',
      'bg3': 'var(--jg-bg3)',
      'bg3-hover': 'var(--jg-bg3-hover)',
      'bg4': 'var(--jg-bg4)',
      'bg5': 'var(--jg-bg5)',
      'bg6': 'var(--jg-bg6)',
      'bg-inverted': 'var(--jg-bg-inverted)',
      't-body': 'var(--jg-t-body)',
      't-hl': 'var(--jg-t-hl)',
      't-hover': 'var(--jg-t-hover)',
      't-bg1': 'var(--jg-t-bg1)',
      't-bg2': 'var(--jg-t-bg2)',
      't-bg3': 'var(--jg-t-bg3)',
      't-bg4': 'var(--jg-t-bg4)',
      't-bg5': 'var(--jg-t-bg5)',
      't-bg6': 'var(--jg-t-bg6)',
      't-border': 'var(--jg-t-border)',
    },
  },
  rules: [
    // 添加一个规则来重置 input 元素的样式
    ['reset-input', {
      'all': 'unset',
      'box-sizing': 'border-box',
      'appearance': 'none',
      '-webkit-appearance': 'none',
      'outline': 'none',
    }],
    [/^shadow-(\d+)$/, ([,d]) => ({
      'box-shadow': `var(--jg-shadow${d})`,
    })],
  ],
  variants: [
    // 通用变体处理器
    (matcher: any) => {
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const regex = /^data-([\w-]+)=?(\w*):/
      const match = matcher.match(regex)

      // 如果没有匹配到 data-xxx: 前缀，返回原始 matcher
      if (!match)
        return matcher

      // 提取 data- 后的属性名和可选的值部分
      const attribute = match[1]
      const value = match[2] ? match[2].trim() : null

      // 返回修改后的 matcher 和 selector
      return {
        matcher: matcher.replace(regex, ''),
        selector: s => value
          ? `${s}[data-${attribute}="${value}"]` // 匹配指定属性名和值
          : `${s}[data-${attribute}]`, // 仅匹配指定属性名
      }
    },
  ],
  presets: [presetUno(), presetIcons()],
})
