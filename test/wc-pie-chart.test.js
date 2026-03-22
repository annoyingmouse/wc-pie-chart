import { fixture, html, expect, nextFrame } from '@open-wc/testing'
import '../wc-pie-chart.js'

// Fixture helper that also waits for the debounced rAF render to fire.
async function chart(template) {
  const el = await fixture(template)
  await nextFrame()
  return el
}

// ─── Host element ─────────────────────────────────────────────────────────────

describe('host element', () => {
  it('sets role="img"', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('role')).to.equal('img')
  })

  it('sets tabindex="0"', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('tabindex')).to.equal('0')
  })

  it('does not override a consumer-provided role', async () => {
    const el = await chart(html`
      <wc-pie-chart role="presentation">
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('role')).to.equal('presentation')
  })

  it('does not override a consumer-provided tabindex', async () => {
    const el = await chart(html`
      <wc-pie-chart tabindex="-1">
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('tabindex')).to.equal('-1')
  })
})

// ─── aria-label ───────────────────────────────────────────────────────────────

describe('aria-label', () => {
  it('generates a label with slice labels and percentages', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" label="A" color="red"></wc-pie-slice>
        <wc-pie-slice value="3" label="B" color="blue"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('aria-label')).to.equal('Pie chart with 2 slices: A 25.0%, B 75.0%')
  })

  it('generates a label without slice labels', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
        <wc-pie-slice value="1" color="blue"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('aria-label')).to.equal('Pie chart with 2 slices: 50.0%, 50.0%')
  })

  it('uses singular "slice" for a single slice', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" label="Only" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('aria-label')).to.equal('Pie chart with 1 slice: Only 100.0%')
  })

  it('respects a consumer-provided aria-label', async () => {
    const el = await chart(html`
      <wc-pie-chart aria-label="Custom label">
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.getAttribute('aria-label')).to.equal('Custom label')
  })

  it('updates the label when a slice label changes', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" label="Before" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    el.querySelector('wc-pie-slice').setAttribute('label', 'After')
    await nextFrame()
    expect(el.getAttribute('aria-label')).to.equal('Pie chart with 1 slice: After 100.0%')
  })
})

// ─── SVG structure ────────────────────────────────────────────────────────────

describe('SVG structure', () => {
  it('renders an SVG in the shadow DOM', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelector('svg')).to.exist
  })

  it('SVG has aria-hidden="true"', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelector('svg').getAttribute('aria-hidden')).to.equal('true')
  })

  it('uses the default width of 150', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    const svg = el.shadowRoot.querySelector('svg')
    expect(svg.getAttribute('width')).to.equal('150')
    expect(svg.getAttribute('height')).to.equal('150')
  })

  it('SVG dimensions match the width attribute', async () => {
    const el = await chart(html`
      <wc-pie-chart width="300">
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    const svg = el.shadowRoot.querySelector('svg')
    expect(svg.getAttribute('width')).to.equal('300')
    expect(svg.getAttribute('height')).to.equal('300')
  })

  it('renders one path per slice', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
        <wc-pie-slice value="2" color="blue"></wc-pie-slice>
        <wc-pie-slice value="3" color="green"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelectorAll('svg > path').length).to.equal(3)
  })

  it('re-renders when the width attribute changes', async () => {
    const el = await chart(html`
      <wc-pie-chart width="200">
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    el.setAttribute('width', '400')
    await nextFrame()
    const svg = el.shadowRoot.querySelector('svg')
    expect(svg.getAttribute('width')).to.equal('400')
    expect(svg.getAttribute('height')).to.equal('400')
  })

  it('re-renders when the thickness attribute changes', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    const pathBefore = el.shadowRoot.querySelector('svg > path').getAttribute('d')
    el.setAttribute('thickness', '0.5')
    await nextFrame()
    const pathAfter = el.shadowRoot.querySelector('svg > path').getAttribute('d')
    expect(pathAfter).to.not.equal(pathBefore)
  })
})

// ─── Patterns ─────────────────────────────────────────────────────────────────

describe('patterns', () => {
  for (const pattern of ['stripes', 'dots', 'crosshatch']) {
    it(`creates a <pattern> in <defs> for pattern="${pattern}"`, async () => {
      const el = await chart(html`
        <wc-pie-chart>
          <wc-pie-slice value="1" color="red" pattern="${pattern}"></wc-pie-slice>
        </wc-pie-chart>
      `)
      expect(el.shadowRoot.querySelector('defs pattern')).to.exist
    })
  }

  it('sets path fill to url(#pat-0) when a pattern is used', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red" pattern="stripes"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelector('svg > path').getAttribute('fill')).to.equal('url(#pat-0)')
  })

  it('sets the correct pat-N index for each patterned slice', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"   pattern="stripes"></wc-pie-slice>
        <wc-pie-slice value="1" color="blue"  pattern="dots"></wc-pie-slice>
        <wc-pie-slice value="1" color="green" pattern="crosshatch"></wc-pie-slice>
      </wc-pie-chart>
    `)
    const paths = el.shadowRoot.querySelectorAll('svg > path')
    expect(paths[0].getAttribute('fill')).to.equal('url(#pat-0)')
    expect(paths[1].getAttribute('fill')).to.equal('url(#pat-1)')
    expect(paths[2].getAttribute('fill')).to.equal('url(#pat-2)')
  })

  it('sets path fill to the color directly when no pattern is used', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelector('svg > path').getAttribute('fill')).to.equal('red')
  })

  it('does not create a <pattern> in <defs> for solid-colour slices', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelector('defs pattern')).to.not.exist
  })

  it('only the crosshatch <path> is excluded from svg > path selection', async () => {
    // Regression: querySelectorAll('path') used to pick up the <path> inside the
    // crosshatch <pattern> definition, shifting animation indices by one.
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"   pattern="stripes"></wc-pie-slice>
        <wc-pie-slice value="1" color="blue"  pattern="dots"></wc-pie-slice>
        <wc-pie-slice value="1" color="green" pattern="crosshatch"></wc-pie-slice>
        <wc-pie-slice value="1" color="gold"></wc-pie-slice>
      </wc-pie-chart>
    `)
    expect(el.shadowRoot.querySelectorAll('svg > path').length).to.equal(4)
  })
})

// ─── Dynamic slice management ─────────────────────────────────────────────────

describe('dynamic slice management', () => {
  it('re-renders when a slice is added', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
      </wc-pie-chart>
    `)
    const slice = document.createElement('wc-pie-slice')
    slice.setAttribute('value', '1')
    slice.setAttribute('color', 'blue')
    el.appendChild(slice)
    await nextFrame()
    expect(el.shadowRoot.querySelectorAll('svg > path').length).to.equal(2)
  })

  it('re-renders when a slice is removed', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" color="red"></wc-pie-slice>
        <wc-pie-slice value="1" color="blue"></wc-pie-slice>
      </wc-pie-chart>
    `)
    el.querySelector('wc-pie-slice').remove()
    await nextFrame()
    expect(el.shadowRoot.querySelectorAll('svg > path').length).to.equal(1)
  })

  it('updates the aria-label when a slice value changes', async () => {
    const el = await chart(html`
      <wc-pie-chart>
        <wc-pie-slice value="1" label="A" color="red"></wc-pie-slice>
        <wc-pie-slice value="3" label="B" color="blue"></wc-pie-slice>
      </wc-pie-chart>
    `)
    el.querySelector('wc-pie-slice').setAttribute('value', '3')
    await nextFrame()
    expect(el.getAttribute('aria-label')).to.equal('Pie chart with 2 slices: A 50.0%, B 50.0%')
  })
})

// ─── wc-pie-slice ─────────────────────────────────────────────────────────────

describe('wc-pie-slice', () => {
  it('value getter returns a number', async () => {
    const el = await fixture(html`<wc-pie-slice value="42" color="red"></wc-pie-slice>`)
    expect(el.value).to.equal(42)
  })

  it('label getter returns the attribute string', async () => {
    const el = await fixture(html`<wc-pie-slice value="1" label="Test" color="red"></wc-pie-slice>`)
    expect(el.label).to.equal('Test')
  })

  it('label getter returns null when no label is set', async () => {
    const el = await fixture(html`<wc-pie-slice value="1" color="red"></wc-pie-slice>`)
    expect(el.label).to.be.null
  })

  it('color getter returns the attribute string', async () => {
    const el = await fixture(html`<wc-pie-slice value="1" color="#abc123"></wc-pie-slice>`)
    expect(el.color).to.equal('#abc123')
  })

  it('pattern getter returns the attribute string', async () => {
    const el = await fixture(html`<wc-pie-slice value="1" color="red" pattern="dots"></wc-pie-slice>`)
    expect(el.pattern).to.equal('dots')
  })

  it('pattern getter returns null when no pattern is set', async () => {
    const el = await fixture(html`<wc-pie-slice value="1" color="red"></wc-pie-slice>`)
    expect(el.pattern).to.be.null
  })
})
