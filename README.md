[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/wc-pie-chart)

# <wc-pie-chart>

Web component for displaying pie-charts and donut-charts. SVG-based, zero dependencies.

Demo here: https://codepen.io/annoyingmouse/pen/XWqOeqw

## Usage

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="index.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
<wc-pie-chart thickness="0.1">
  <wc-pie-slice value="5" label="Red"  color="#E64C65"></wc-pie-slice>
  <wc-pie-slice value="5" label="Teal" color="#11A8AB"></wc-pie-slice>
  <wc-pie-slice value="5" label="Navy" color="#394264"></wc-pie-slice>
</wc-pie-chart>
<script type="module"
        src="https://unpkg.com/wc-pie-chart/dist/wc-pie-chart.min.js"></script>
```


## Configuration

The chart's appearance and behaviour can be changed using attributes on `<wc-pie-chart>`.

| Attribute | Default | Description |
|---|---|---|
| `width` | `150` | Dimension of the chart in px |
| `duration` | `2000` | Total animation duration in ms |
| `delay` | `500` | Delay before animation starts in ms |
| `thickness` | `0.2` | Slice width as a proportion of the radius (0–1). `0.5` produces a full pie chart |

## Data

Each `<wc-pie-slice>` child defines one segment.

| Attribute | Required | Description |
|---|---|---|
| `value` | Yes | Numeric value used to calculate the slice's proportion |
| `color` | No | Any valid CSS colour. A random colour is assigned if omitted |
| `label` | No | Human-readable name for the slice, included in the auto-generated `aria-label` |
| `pattern` | No | Texture overlay: `stripes`, `dots`, or `crosshatch` |

```html
<wc-pie-chart>
  <wc-pie-slice value="5" label="Sales"     color="#E64C65" pattern="stripes"></wc-pie-slice>
  <wc-pie-slice value="3" label="Support"   color="#11A8AB" pattern="dots"></wc-pie-slice>
  <wc-pie-slice value="2" label="Marketing" color="#394264" pattern="crosshatch"></wc-pie-slice>
</wc-pie-chart>
```

## Accessibility

- `role="img"` and an `aria-label` are set automatically. The label summarises the chart data (e.g. `"Pie chart with 3 slices: Sales 50.0%, Support 30.0%, Marketing 20.0%"`). Supply your own `aria-label` on `<wc-pie-chart>` to override it.
- The chart is keyboard-focusable by default (`tabindex="0"`). A focus indicator is shown for keyboard users; set `tabindex="-1"` to opt out.
- Animations respect the `prefers-reduced-motion` OS/browser setting — slices appear immediately at full size when reduced motion is preferred.
- Use the `pattern` attribute to give each slice a distinct texture, so slices can be told apart without relying on colour alone.
