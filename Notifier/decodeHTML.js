//Part of Meishuu's 'slash' script to decode HTML

const entities = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

module.exports = {
	decodeHTMLEntities(s) {
		return (s
			.replace(/<\/?[^<>]*>/gi, '')
			.replace(/&#(\d+);?/g, (_, code) => String.fromCharCode(code))
			.replace(/&#[xX]([A-Fa-f0-9]+);?/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
			.replace(/&([^;\W]+;?)/g, (m, e) => entities[e.replace(/;$/, '')] || m)
		)
	}
}
