import type { ParserConfig } from '@swc/core'
import { parseSync, printSync } from '@swc/core'
import { strIsInclude } from './utils'

function jscParserConfig(ext: 'ts' | 'js' | 'tsx' | 'jsx'): ParserConfig {
  const res = {
  } as Record<string, any>
  const firstChar = ext[0]
  const lastChar = ext[ext.length - 1]
  const param = `${firstChar}sx`
  res.syntax = firstChar === 't' ? 'typescript' : 'ecmascript'
  res[param] = lastChar === 'x'

  return res as {
    syntax: 'typescript'
    tsx: boolean
  } | {
    syntax: 'ecmascript'
    jsx: boolean
  }
}

const styleFileExts = ['css', 'scss', 'sass', 'less', 'styl'] as const
function isStyleExt(ext?: string): ext is typeof styleFileExts[number] {
  return strIsInclude(styleFileExts, String(ext))
}

/**
 * 根据源代码和 pick 参数生成只包含 pick 的模块代码。
 * @param {string} sourceCode - 源代码字符串
 * @param {string[]} picks - 要保留的导出名称数组
 * @returns {string} - 生成的新模块代码
 */
export function filterExports(sourceCode: string, picks: string[], ext: 'ts' | 'js' | 'tsx' | 'jsx'): string {
  const jscParserConf = jscParserConfig(ext)
  const ast = parseSync(sourceCode, jscParserConf)

  const filteredBody = ast.body.filter((node) => {
    switch (node.type) {
      // export {a, b}
      case 'ExportNamedDeclaration':
        node.specifiers = node.specifiers.filter(spec =>
          spec.type === 'ExportSpecifier'
            ? picks.includes(spec.exported?.value ? spec.exported.value : spec.orig.value)
            : false,
        )
        return node.specifiers.length > 0

      case 'ExportDeclaration': {
        const type = node.declaration.type
        if (type === 'FunctionDeclaration') {
          return picks.includes(node.declaration.identifier.value)
        }
        else if (type === 'VariableDeclaration') {
          return node.declaration.declarations.some(decl =>
            decl.id.type === 'Identifier' ? picks.includes(decl.id.value) : false,
          )
        }
        break
      }

      case 'ExportDefaultDeclaration':
        // 处理默认导出
        return picks.includes('default')

      case 'ExportDefaultExpression':
        // 处理 export default expression 形式
        return picks.includes('default')

      case 'ImportDeclaration': {
        const specs = node.specifiers
        if (specs.length > 0)
          break
        const hasCss = picks.includes('style-imports')
        const hasSideEffects = picks.includes('side-effects')
        const ext = node.source.value.split('.').pop()
        if (isStyleExt(ext)) {
          return hasCss
        }
        return hasSideEffects
      }

      default:
        break
    }
    return true
  })

  // 创建新的 AST
  const newAst = {
    ...ast,
    body: filteredBody,
  }

  // 将新 AST 转换为代码
  const { code: newCode } = printSync(newAst)

  return newCode
}
