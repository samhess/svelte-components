export function formatCurrency(
  amount: number | bigint,
  currency: string,
  maximumFractionDigits = 2
) {
  if (amount > 1000) {
    return Intl.NumberFormat('default', {
      currency,
      maximumFractionDigits: 1,
      notation: 'compact',
      useGrouping: true,
      style: 'currency'
    }).format(amount)
  } else {
    return Intl.NumberFormat('default', {
      currency,
      maximumFractionDigits,
      notation: 'compact',
      useGrouping: true,
      style: 'currency'
    }).format(amount)
  }
}

export function formatNumber(number: number | bigint, maximumFractionDigits = 2) {
  return Intl.NumberFormat('default', {
    maximumFractionDigits,
    notation: 'compact',
    style: 'decimal',
    useGrouping: true
  }).format(number)
}

export function formatPercent(
  number: number | bigint,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) {
  return Intl.NumberFormat('default', {
    minimumFractionDigits,
    maximumFractionDigits,
    style: 'percent'
  }).format(number)
}

export function formatDateTime(timestamp: string, type = 'js') {
  let date
  if (type === 'js') {
    date = new Date(parseInt(timestamp))
  } else if (type === 'epoch') {
    date = new Date(1000 * parseInt(timestamp))
  }
  return Intl.DateTimeFormat('default', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}

export function formatDate(date: Date | number) {
  return Intl.DateTimeFormat('default', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }).format(date)
}
