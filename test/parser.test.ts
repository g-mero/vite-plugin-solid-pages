import { expect, it } from 'vitest'
import { filePathToRoute } from '~/files'

it('normal route', () => {
  expect(filePathToRoute('src/pages/index.tsx', 'src/pages')).toBe('/')
  expect(filePathToRoute('src/pages/about.tsx', 'src/pages')).toBe('about')
})

it('dynamic route', () => {
  expect(filePathToRoute('src/pages/[id].tsx', 'src/pages')).toBe(':id')
  expect(filePathToRoute('src/pages/[...id].tsx', 'src/pages')).toBe('*id')
  expect(filePathToRoute('src/pages/[...rest].tsx', 'src/pages')).toBe('*rest')
})

it('nested route', () => {
  expect(filePathToRoute('src/pages/nested/index.tsx', 'src/pages')).toBe('nested')
  expect(filePathToRoute('src/pages/nested/about.tsx', 'src/pages')).toBe('nested/about')
})
