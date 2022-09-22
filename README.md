# <wc-pie-chart>

This web component to display simple pie- or donut-charts

## Usage

<!--
```
<custom-element-demo>
  <template>
    <wc-pie-chart id="existing" thickness="0.1">
      <wc-pie-slice value="5"
                    color="#E64C65"/>
      <wc-pie-slice value="5"
                    color="#11A8AB"/>
      <wc-pie-slice value="5"
                    color="#394264"/>
    </wc-pie-chart>
    <script type="module"
            src="https://unpkg.com/wc-pie-chart/wc-pie-chart.js"></script>
  </template>
</custom-element-demo>
```
-->

```html
<wc-pie-chart id="existing"
              thickness="0.1">
  <wc-pie-slice value="5"
                color="#E64C65"/>
  <wc-pie-slice value="5"
                color="#11A8AB"/>
  <wc-pie-slice value="5"
                color="#394264"/>
</wc-pie-chart>
<script type="module"
        src="https://unpkg.com/wc-pie-chart/wc-pie-chart.js"></script>
```


## Configuration

The chart's appearance and behaviour can be changed using attributes.

Adding `width` will change the dimension of the chart from the default of 150px.

Adding `duration` will alter the overall duration of the animation in supported browsers (currently only Chrome and Edge) from the default of 2000ms (2 seconds)

Adding `delay` will delay the start of the animation in supported browsers from the default of 500ms (half a second) 

Adding `thickness` will alter the width of the slices from the default of 20% of the width of the overall chart (setting this to 0.5 will create a pie-chart).

## Data

The chart relies upon one or more compulsory `<wc-pie-slices>`s; these have to have a `value` and optionally can have a `color` attribute (a random colour will be assigned if no colour is provided)


