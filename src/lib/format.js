/**
 * @param {number} amount 
 * @param {string} currency 
 * @param {number} maximumFractionDigits 
 * @param {string} currencyDisplay 
 * @returns {string} formatted number
 */
export function formatCurrency(amount, currency, maximumFractionDigits=2, currencyDisplay='code') {
  if (amount === undefined) return ''
  return Intl.NumberFormat('default', {
              style:'currency', 
              currency: currency, 
              // @ts-ignore
              currencyDisplay,
              notation: 'standard',
              useGrouping: true,
              maximumFractionDigits: maximumFractionDigits
          }).format(amount)
}

/**
 * @param {number} number 
 * @returns {string} formatted number
 */
export function formatNumber(number) {
  if (number === undefined) return ''
  return Intl.NumberFormat('default', {
            style:'decimal', 
            notation: 'standard',
            useGrouping: true,
            maximumFractionDigits: 2
          }).format(number)
}

/**
 * @param {number} number 
 * @returns {string|undefined} formatted number in %
 */
export function formatPercent(number) {
  if (number === undefined || Number.isNaN(number)) return undefined
  return Intl.NumberFormat('default', {
            style:'percent', 
            minimumFractionDigits: 2
          }).format(number)
}

/**
 * @param {number} timestamp - timestamp in epoch format or js
 * @param {string} [type='js'] type of timestamp: epoch or js
 * @returns {string} formatted date
 */
export function formatDateTime(timestamp, type='js') {
  if (timestamp === undefined) return ''
  // console.log(`trying to format date/time ${timestamp}`)
  let date
  if (type === 'js') {
    date = new Date(timestamp)  //setUTCMilliseconds(timestamp)
  } else if (type === 'epoch') {
    date = new Date(1000*timestamp) //setUTCSeconds(timestamp)
  }
  return Intl.DateTimeFormat('default', { 
            dateStyle:'long',
            timeStyle: 'short',
          }).format(date)
}

/**
 * @param {number|Date} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (date === undefined) return ''
  return Intl.DateTimeFormat('default', { 
            day:'numeric',
            month: 'numeric',
            year:'numeric', 
          }).format(date)
}