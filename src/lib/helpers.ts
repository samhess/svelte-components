export function capitalize(input:string) {
  return input.replace(/^\w/,c=>c.toUpperCase())
}