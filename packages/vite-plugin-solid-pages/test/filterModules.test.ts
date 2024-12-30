import { expect, it } from 'vitest'
import { filterExports } from '../src/module'

function trimSpaces(str: string) {
  return str.replace(/\s/g, '')
}

const testCode = `
import 'style.css'
import 'xxx.js'
import outer from 'xxxx'
const dead_code = 1
export const a = 1
const b = 2
export { b,outer }
const c = 3
export { c as d }
export default c
`

it('filter css and default', () => {
  const result = filterExports(testCode, ['default', 'style-imports'], 'tsx')

  expect(trimSpaces(result)).toBe(trimSpaces(`
import 'style.css';
import outer from 'xxxx';
const dead_code = 1;
const b = 2;
const c = 3;
export default c;
    `))
})

it('filter named exports', () => {
  const result = filterExports(testCode, ['a', 'd', 'outer'], 'js')

  expect(trimSpaces(result)).toBe(trimSpaces(`
import outer from 'xxxx';
const dead_code = 1;
export const a = 1;
const b = 2;
export { outer };
const c = 3;
export { c as d };
    `))
})

it('filter side effects', () => {
  const result = filterExports(testCode, ['side-effects'], 'js')

  expect(trimSpaces(result)).toBe(trimSpaces(`
import 'xxx.js';
import outer from 'xxxx';
const dead_code = 1;
const b = 2;
const c = 3;
`))
})
