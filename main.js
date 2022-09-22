(()=>{
  setTimeout(() => {
    const test = document.getElementById('test')
    const segments = Math.floor(Math.random() * 10) + 5;
    const newPieChart = document.createElement('wc-pie-chart')
    newPieChart.setAttribute('width', '500')
    for(let i = 0; i < segments; i++){
      const newPieSlice = document.createElement('wc-pie-slice')
      newPieSlice.setAttribute('value', `${Math.floor(Math.random() * 100) + 1}`)
      newPieChart.append(newPieSlice)
    }
    test.append(newPieChart)

  }, 1000)
  const existing = document.getElementById('existing')
  setTimeout(() => {
    existing.setAttribute('width', '200')
    existing.removeAttribute('thickness')
  }, 2500)
  setTimeout(() => {
    existing.setAttribute('width', '250')
    existing.setAttribute('delay', '200')
  }, 5000)
  setTimeout(() => {
    existing.setAttribute('width', '300')
    existing.setAttribute('thickness', '0.5')
    existing.setAttribute('duration', '10000')

  }, 7200)
  setTimeout(() => {
    existing.removeAttribute('width')
    existing.removeAttribute('thickness')
    existing.removeAttribute('duration')
    existing.removeAttribute('delay')
  }, 17400)

  const greys = [
    '#000000',
    '#080808',
    '#101010',
    '#181818',
    '#202020',
    '#282828',
    '#303030',
    '#383838',
    '#404040',
    '#484848',
    '#505050',
    '#585858',
    '#606060',
    '#686868',
    '#696969',
    '#707070',
    '#787878',
    '#808080',
    '#888888',
    '#909090',
    '#989898',
    '#A0A0A0',
    '#A8A8A8',
    '#A9A9A9',
    '#B0B0B0',
    '#B8B8B8',
    '#BEBEBE',
    '#C0C0C0',
    '#C8C8C8',
    '#D0D0D0',
    '#D3D3D3',
    '#D8D8D8',
    '#DCDCDC',
    '#E0E0E0',
    '#E8E8E8',
    '#F0F0F0',
    '#F5F5F5',
    '#F8F8F8',
    '#FFFFFF'
  ]
  const greyChart = document.getElementById('grey')
  greys.forEach(grey => {
    const newPieSlice = document.createElement('wc-pie-slice')
    newPieSlice.setAttribute('value', `1`)
    newPieSlice.setAttribute('color', grey)
    greyChart.append(newPieSlice)
  })
})()