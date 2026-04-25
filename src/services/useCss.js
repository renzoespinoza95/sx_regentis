export function cssToObject(css) {
  const obj = {}

  css.split(';').forEach(rule => {
    const [key, value] = rule.split(':')
    if (key && value) {
      obj[key.trim()] = value.trim()
    }
  })

  return obj
} 
