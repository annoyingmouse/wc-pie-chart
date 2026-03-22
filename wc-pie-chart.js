function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function slicePath(cx, cy, outerR, innerR, startAngle, sweepAngle) {
  // Full circle needs the two-arc technique (start === end point breaks single arc)
  if (sweepAngle >= 359.9) {
    const outer =
      `M ${cx - outerR} ${cy} ` +
      `A ${outerR} ${outerR} 0 1 1 ${cx + outerR} ${cy} ` +
      `A ${outerR} ${outerR} 0 1 1 ${cx - outerR} ${cy} Z`
    if (innerR <= 0) return outer
    const inner =
      `M ${cx - innerR} ${cy} ` +
      `A ${innerR} ${innerR} 0 1 1 ${cx + innerR} ${cy} ` +
      `A ${innerR} ${innerR} 0 1 1 ${cx - innerR} ${cy} Z`
    return `${outer} ${inner}`
  }

  const endAngle = startAngle + sweepAngle
  const p1 = polarToCartesian(cx, cy, outerR, startAngle)
  const p2 = polarToCartesian(cx, cy, outerR, endAngle)
  const large = sweepAngle > 180 ? 1 : 0

  if (innerR <= 0) {
    return (
      `M ${cx} ${cy} ` +
      `L ${p1.x} ${p1.y} ` +
      `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y} Z`
    )
  }

  const p3 = polarToCartesian(cx, cy, innerR, endAngle)
  const p4 = polarToCartesian(cx, cy, innerR, startAngle)
  return (
    `M ${p1.x} ${p1.y} ` +
    `A ${outerR} ${outerR} 0 ${large} 1 ${p2.x} ${p2.y} ` +
    `L ${p3.x} ${p3.y} ` +
    `A ${innerR} ${innerR} 0 ${large} 0 ${p4.x} ${p4.y} Z`
  )
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

const PATTERNS = {
  stripes: (id, color) =>
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">` +
    `<rect width="8" height="8" fill="${color}"/>` +
    `<rect width="4" height="8" fill="rgba(0,0,0,0.25)"/>` +
    `</pattern>`,
  dots: (id, color) =>
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8">` +
    `<rect width="8" height="8" fill="${color}"/>` +
    `<circle cx="4" cy="4" r="2.5" fill="rgba(0,0,0,0.3)"/>` +
    `</pattern>`,
  crosshatch: (id, color) =>
    `<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8">` +
    `<rect width="8" height="8" fill="${color}"/>` +
    `<path d="M0 0 L8 8 M8 0 L0 8" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>` +
    `</pattern>`,
}

class WCPieChart extends HTMLElement {
  static get observedAttributes() {
    return ['width', 'duration', 'delay', 'thickness']
  }

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  get width() { return Number(this.getAttribute('width')) || 150 }
  get duration() { return Number(this.getAttribute('duration')) || 2000 }
  get delay() { return Number(this.getAttribute('delay')) || 500 }
  get thickness() { return Number(this.getAttribute('thickness')) || 0.2 }

  connectedCallback() {
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img')
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0')
    this.render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) this.render()
  }

  render() {
    if (!this.isConnected) return
    cancelAnimationFrame(this._raf)
    this._raf = requestAnimationFrame(() => this._doRender())
  }

  _doRender() {
    const segments = [...this.querySelectorAll('wc-pie-slice')]
    if (!segments.length) return

    const total = segments.reduce((sum, s) => sum + Number(s.getAttribute('value')), 0)
    const cx = this.width / 2
    const cy = this.width / 2
    const outerR = this.width / 2
    const innerR = Math.max(0, outerR - this.thickness * this.width)

    // Auto aria-label
    const currentLabel = this.getAttribute('aria-label')
    if (!currentLabel || currentLabel === this._generatedLabel) {
      const parts = segments.map((s) => {
        const pct = ((Number(s.getAttribute('value')) / total) * 100).toFixed(1)
        const label = s.getAttribute('label')
        return label ? `${label} ${pct}%` : `${pct}%`
      })
      this._generatedLabel = `Pie chart with ${segments.length} slice${segments.length !== 1 ? 's' : ''}: ${parts.join(', ')}`
      this.setAttribute('aria-label', this._generatedLabel)
    }

    // Assign stable random colours to unlabelled slices
    segments.forEach((s) => {
      if (!s.getAttribute('color') && !s._assignedColor) {
        s._assignedColor = this._randomColor()
      }
    })

    let defs = ''
    let pathsHtml = ''
    let startAngle = 0

    const sliceData = segments.map((s, i) => {
      const value = Number(s.getAttribute('value'))
      const sweepAngle = (value / total) * 360
      const color = s.getAttribute('color') || s._assignedColor
      const patternKey = s.getAttribute('pattern')
      const isFullCircle = sweepAngle >= 359.9

      let fill
      if (patternKey && PATTERNS[patternKey]) {
        const patId = `pat-${i}`
        defs += PATTERNS[patternKey](patId, color)
        fill = `url(#${patId})`
      } else {
        fill = color
      }

      // Initialise each path with a near-zero sweep; animation grows it to full
      pathsHtml +=
        `<path d="${slicePath(cx, cy, outerR, innerR, startAngle, 0.001)}"` +
        ` fill="${fill}"` +
        (isFullCircle && innerR > 0 ? ` fill-rule="evenodd"` : '') +
        `/>`

      const sa = startAngle
      startAngle += sweepAngle
      return { startAngle: sa, sweepAngle, isFullCircle }
    })

    this.shadow.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        :host(:focus-visible) {
          outline: 2px solid ButtonText;
          outline-offset: 3px;
          border-radius: 50%;
        }
        svg { display: block; }
      </style>
      <svg width="${this.width}" height="${this.width}"
           viewBox="0 0 ${this.width} ${this.width}"
           aria-hidden="true">
        <defs>${defs}</defs>
        ${pathsHtml}
      </svg>`

    this._animateSlices(sliceData, cx, cy, outerR, innerR)
  }

  _animateSlices(sliceData, cx, cy, outerR, innerR) {
    const pathEls = [...this.shadow.querySelectorAll('svg > path')]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      sliceData.forEach(({ startAngle, sweepAngle, isFullCircle }, i) => {
        pathEls[i].setAttribute('d', slicePath(cx, cy, outerR, innerR, startAngle, sweepAngle))
        if (isFullCircle && innerR > 0) pathEls[i].setAttribute('fill-rule', 'evenodd')
      })
      return
    }

    // Per-slice timing: each slice's duration is proportional to its sweep
    let durationTotal = this.delay
    const animations = sliceData.map(({ startAngle, sweepAngle, isFullCircle }) => {
      const duration = (sweepAngle / 360) * this.duration
      const anim = { startAngle, sweepAngle, isFullCircle, delay: durationTotal, duration }
      durationTotal += duration
      return anim
    })

    // Cancellation token: if render() is called again this token goes stale
    const token = Symbol()
    this._animToken = token
    const startTime = performance.now()

    const tick = (now) => {
      if (this._animToken !== token) return

      let anyActive = false
      animations.forEach(({ startAngle, sweepAngle, isFullCircle, delay, duration }, i) => {
        const elapsed = now - startTime - delay
        if (elapsed < 0) { anyActive = true; return }
        if (elapsed >= duration) {
          pathEls[i].setAttribute('d', slicePath(cx, cy, outerR, innerR, startAngle, sweepAngle))
          return
        }
        anyActive = true
        const sweep = easeInOut(elapsed / duration) * sweepAngle
        pathEls[i].setAttribute('d', slicePath(cx, cy, outerR, innerR, startAngle, sweep))
      })

      if (anyActive) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }

  _randomColor() {
    const letters = '0123456789ABCDEF'
    return '#' + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join('')
  }
}

class WCPieSlice extends HTMLElement {
  static get observedAttributes() {
    return ['value', 'color', 'label', 'pattern']
  }

  connectedCallback() {
    this._chart = this.closest('wc-pie-chart')
    this._chart?.render()
  }

  disconnectedCallback() {
    this._chart?.render()
    this._chart = null
  }

  attributeChangedCallback() {
    this.closest('wc-pie-chart')?.render()
  }

  get value() { return Number(this.getAttribute('value')) }
  get color() { return this.getAttribute('color') }
  get label() { return this.getAttribute('label') }
  get pattern() { return this.getAttribute('pattern') }
}

window.customElements.define('wc-pie-chart', WCPieChart)
window.customElements.define('wc-pie-slice', WCPieSlice)
