export const mergeOptions = (def: any, custom: any) => {
  for (const key in custom) {
    if (!def[key] || key !== 'modules') {
      def[key] = custom[key]
    } else {
      mergeOptions(def[key], custom[key])
    }
  }
  return def
}
