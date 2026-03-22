class WCPieChart extends HTMLElement {
  static get observedAttributes() {
    return ['width', 'duration', 'delay', 'thickness']
  }
  get style() {
    return `
      <style>
        :host {
          --width: ${this.width};
          display: inline-block;
        }
        :host(:focus-visible) {
          outline: 2px solid ButtonText;
          outline-offset: 3px;
          border-radius: 50%;
        }
        * {
          box-sizing: border-box;
        }
        div {
          width: calc(var(--width)*1px);
          height: calc(var(--width)*1px);
          position: relative;
        }
      </style>`
  }
  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'open',
    })
    this.shadow.innerHTML = `${this.style}<div></div>`
    try {
      window.CSS.registerProperty({
        name: '--p',
        syntax: '<number>',
        inherits: true,
        initialValue: 0,
      })
    } catch (e) {
      if (e.name === 'InvalidModificationError') {
        return // We've already added it before!
      } else {
        console.warn(
          'Browser does not support animated conical gradients',
          e.name
        )
      }
    }
  }
  render() {
    if (Array.isArray(this.segments)) {
      const segments = [...this.segments]
      const total = segments.reduce(
        (p, c) => p + Number(c.getAttribute('value')),
        0
      )
      let durationTotal = this.delay
      let rotationTotal = 0
      const totalDegree = 360 / total
      const labelParts = []
      segments.forEach((segment) => {
        const value = Number(segment.getAttribute('value'))
        const currentRotation = totalDegree * value
        const animationDuration =
          currentRotation / (360 / Number(this.duration))
        segment.setAttribute('thickness', this.thickness * this.width)
        segment.setAttribute('end', (value / total) * 100)
        segment.setAttribute('rotate', rotationTotal)
        segment.setAttribute('delay', durationTotal)
        segment.setAttribute('duration', animationDuration)
        segment.setAttribute('width', this.width)
        rotationTotal += currentRotation
        durationTotal += animationDuration
        this.div.append(segment)
        const pct = ((value / total) * 100).toFixed(1)
        const label = segment.getAttribute('label')
        labelParts.push(label ? `${label} ${pct}%` : `${pct}%`)
      })
      const currentLabel = this.getAttribute('aria-label')
      if (!currentLabel || currentLabel === this._generatedLabel) {
        this._generatedLabel = `Pie chart with ${segments.length} slice${segments.length !== 1 ? 's' : ''}: ${labelParts.join(', ')}`
        this.setAttribute('aria-label', this._generatedLabel)
      }
    }
  }
  connectedCallback() {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'img')
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
    this.div = this.shadow.querySelector('div')
    this.segments = [...this.querySelectorAll('wc-pie-slice')]
    this.render()
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue !== oldValue) {
      this.shadow.innerHTML = `${this.style}<div></div>`
      this.div = this.shadow.querySelector('div')
      this.render()
    }
  }
  get width() {
    return Number(this.getAttribute('width')) || 150
  }
  get duration() {
    return Number(this.getAttribute('duration')) || 2000
  }
  get delay() {
    return Number(this.getAttribute('delay')) || 500
  }
  get thickness() {
    return Number(this.getAttribute('thickness')) || 0.2
  }
}

class WCPieSlice extends HTMLElement {
  static get observedAttributes() {
    return ['width', 'duration', 'delay', 'color', 'thickness', 'rotate', 'label']
  }
  get style() {
    return `
      <style>
        * {
          box-sizing: border-box;
        }
        div {
          --p: ${this.end};
          width: ${this.width}px;
          aspect-ratio: 1;
          margin: 0;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        div:before {
          content: "";
          position: absolute;
          border-radius: 50%;
          inset: 0;
          background: conic-gradient(from ${this.rotate}deg, ${this.specifiedColour} calc(var(--p)*1%), transparent 0);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
          mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));
        }
        @media (prefers-reduced-motion: no-preference) {
          div {
            animation-name: p;
            animation-fill-mode: both;
            animation-timing-function: ease-in-out;
            animation-duration: ${this.duration}ms;
            animation-delay: ${this.delay}ms;
          }
          @keyframes p {
            from {
              --p: 0;
            }
          }
        }
      </style>
    `
  }
  constructor() {
    super()
    this.shadow = this.attachShadow({
      mode: 'open',
    })
    this.specifiedColour = this.color
  }
  render() {
    this.shadow.innerHTML = `${this.style}<div></div>`
  }
  connectedCallback() {
    this.render()
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.render()
  }
  get width() {
    return Number(this.getAttribute('width'))
  }
  get duration() {
    return Number(this.getAttribute('duration'))
  }
  get delay() {
    return Number(this.getAttribute('delay'))
  }
  get color() {
    return this.getAttribute('color') || this.getRandomColor
  }
  get thickness() {
    return Number(this.getAttribute('thickness'))
  }
  get rotate() {
    return Number(this.getAttribute('rotate'))
  }
  get end() {
    return Number(this.getAttribute('end'))
  }
  get label() {
    return this.getAttribute('label')
  }
  get getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }
}

window.customElements.define('wc-pie-chart', WCPieChart)
window.customElements.define('wc-pie-slice', WCPieSlice)
