import { describe, expect, it } from 'vitest'
import { filePathToRoute } from '../src/files'

describe('pathToUrl', () => {
  it('should remove all (...) from the path', () => {
    expect(filePathToRoute('base/to/(file)/index', 'base')).toBe('to/')
  })
})
