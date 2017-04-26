export default function(babel) {
  const {types: t} = babel

  return {
    name: 'ast-transform', // not required
    visitor: {
      CallExpression(path) {
        if (
          !deepEqual(path, {
            node: {
              callee: {
                type: 'MemberExpression',
                object: {
                  name: 'console',
                },
              },
            },
          })
        ) {
          return
        }
        const parentFunction = path.findParent(t.isFunctionDeclaration)
        if (!parentFunction) {
          return
        }
        path.node.arguments.unshift(
          t.stringLiteral(parentFunction.node.id.name),
        )
      },
    },
  }
}

function deepEqual(a, b) {
  return (
    a &&
    b &&
    Object.keys(b).every(bKey => {
      const bVal = b[bKey]
      const aVal = a[bKey]
      if (typeof bVal === 'function') {
        return bVal(aVal)
      }
      return isPrimative(bVal) ? bVal === aVal : deepEqual(aVal, bVal)
    })
  )
}
function isPrimative(val) {
  return val == null || /^[sbn]/.test(typeof val)
}
