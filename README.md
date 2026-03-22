[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/wc-pie-chart)

# <wc-pie-chart>

This web component to display simple pie-charts or donut-charts
  
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
<wc-pie-chart id="existing"
              thickness="0.1">
  <wc-pie-slice value="5"
                color="#E64C65"></wc-pie-slice>
  <wc-pie-slice value="5"
                color="#11A8AB"></wc-pie-slice>
  <wc-pie-slice value="5"
                color="#394264"></wc-pie-slice>
</wc-pie-chart>
<script type="module"
        src="https://unpkg.com/wc-pie-chart/dist/wc-pie-chart.min.js"></script>
```


## Configuration

The chart's appearance and behaviour can be changed using attributes.

Adding `width` will change the dimension of the chart from the default of 150px.

Adding `duration` will alter the overall duration of the animation in supported browsers (currently only Chrome and Edge) from the default of 2000ms (2 seconds)

Adding `delay` will delay the start of the animation in supported browsers from the default of 500ms (half a second) 

Adding `thickness` will alter the width of the slices from the default of 20% of the width of the overall chart (setting this to 0.5 will create a pie-chart).

## Data

The chart relies upon one or more compulsory `<wc-pie-slice>`s; these have to have a `value` and optionally can have a `color` attribute (a random colour will be assigned if no colour is provided).

Adding a `label` attribute to each `<wc-pie-slice>` improves accessibility — the labels are included in the auto-generated description read by screen readers:

```html
<wc-pie-chart>
  <wc-pie-slice value="5" label="Sales"     color="#E64C65"></wc-pie-slice>
  <wc-pie-slice value="3" label="Support"   color="#11A8AB"></wc-pie-slice>
  <wc-pie-slice value="2" label="Marketing" color="#394264"></wc-pie-slice>
</wc-pie-chart>
```

## Accessibility

- `role="img"` and an `aria-label` are set automatically. The label summarises the chart data (e.g. `"Pie chart with 3 slices: Sales 50.0%, Support 30.0%, Marketing 20.0%"`). Supply your own `aria-label` on `<wc-pie-chart>` to override it.
- The chart is keyboard-focusable by default (`tabindex="0"`). A focus indicator is shown for keyboard users; set `tabindex="-1"` on the element to opt out.
- Animations respect the `prefers-reduced-motion` OS/browser setting — slices appear immediately at full size when reduced motion is preferred.
- Because colour is the only visual differentiator between slices, choose colours with sufficient contrast against one another and against the background. The `label` attribute and auto-generated `aria-label` cover assistive-technology users, but sighted colour-blind users depend on accessible colour choices.


