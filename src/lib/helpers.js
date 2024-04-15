/** 
 * @param {string} input
*/
export function capitalize(input) {
  if (!input) {
    return ''
  } else if (input.length===1) {
    return input.toUpperCase()
  } else {
    return input.slice(0,1).toUpperCase() + input.slice(1)
  }
}

/** 
 * @param {string} csv
*/
export function parseCsv(csv) {
  const lines = csv.trim().split(/\n/) // split at line endings
  if (lines.length>1) {
    let headers = lines[0].trim().split(',')
    headers = headers.map(header => header.replace(/^"/, '').replace(/"$/, '').replace(/ /g,'-').toLowerCase())
    const data = lines.slice(1)
    return data.map(row => {
      // replace commas outside quotation marks with semicolon
      let regex = new RegExp('(,)(?=(?:[^"]|"[^"]*")*$)','g')
      let fields = row.replace(regex,';;;!').split(';;;!')
      /** @type {Object.<string, string>} */
      let record = {}
      for (const [index,key] of headers.entries()) {
        record[key] = fields[index].replace(/^"/, '').replace(/"$/, '').trim()
      }
      return record
    })
  }

}