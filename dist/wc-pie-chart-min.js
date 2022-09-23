!function(){"use strict";class t extends HTMLElement{static get observedAttributes(){return["width","duration","delay","thickness"]}get style(){return`\n      <style>\n        :host {\n          --width: ${this.width} \n        }\n        * {\n          box-sizing: border-box;\n        }\n        div {\n          width: calc(var(--width)*1px);\n          height: calc(var(--width)*1px);\n          position: relative;\n        }\n      </style>`}constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.shadow.innerHTML=`${this.style}<div></div>`;try{window.CSS.registerProperty({name:"--p",syntax:"<number>",inherits:!0,initialValue:0})}catch(t){if("InvalidModificationError"===t.name)return;console.warn("Browser does not support animated conical gradients",t.name)}}render(){if(Array.isArray(this.segments)){const t=[...this.segments],e=t.reduce(((t,e)=>t+Number(e.getAttribute("value"))),0);let i=this.delay,n=0;const r=360/e;t.forEach((t=>{const s=Number(t.getAttribute("value")),a=r*s,o=a/(360/Number(this.duration));t.setAttribute("thickness",this.thickness*this.width),t.setAttribute("end",s/e*100),t.setAttribute("rotate",n),t.setAttribute("delay",i),t.setAttribute("duration",o),t.setAttribute("width",this.width),n+=a,i+=o,this.div.append(t)}))}}connectedCallback(){this.div=this.shadow.querySelector("div"),this.segments=[...this.querySelectorAll("wc-pie-slice")],this.render()}attributeChangedCallback(t,e,i){i!==e&&(this.shadow.innerHTML=`${this.style}<div></div>`,this.div=this.shadow.querySelector("div"),this.render())}get width(){return Number(this.getAttribute("width"))||150}get duration(){return Number(this.getAttribute("duration"))||2e3}get delay(){return Number(this.getAttribute("delay"))||500}get thickness(){return Number(this.getAttribute("thickness"))||.2}}class e extends HTMLElement{static get observedAttributes(){return["width","duration","delay","color","thickness","rotate"]}get style(){return`\n      <style>\n        * {\n          box-sizing: border-box;\n        }\n        div {\n          --p: ${this.end};\n          width: ${this.width}px;\n          aspect-ratio: 1;\n          margin: 0;\n          position: absolute;\n          left: 50%;\n          top: 50%;\n          animation-name: p;\n          animation-fill-mode: both;\n          animation-timing-function: ease-in-out;\n          transform: translate(-50%, -50%);\n          animation-duration: ${this.duration}ms;\n          animation-delay: ${this.delay}ms;\n        }\n        div:before {\n          content: "";\n          position: absolute;\n          border-radius: 50%;\n          inset: 0;\n          background: conic-gradient(from ${this.rotate}deg, ${this.specifiedColour} calc(var(--p)*1%), transparent 0);\n          -webkit-mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));\n          mask: radial-gradient(farthest-side, transparent calc(99% - ${this.thickness}px), #000 calc(100% - ${this.thickness}px));\n        }\n        @keyframes p {\n          from {\n            --p: 0;\n          }\n        }\n      </style>\n    `}constructor(){super(),this.shadow=this.attachShadow({mode:"closed"}),this.specifiedColour=this.color}render(){this.shadow.innerHTML=`${this.style}<div></div>`}connectedCallback(){this.render()}attributeChangedCallback(t,e,i){this.render()}get width(){return Number(this.getAttribute("width"))}get duration(){return Number(this.getAttribute("duration"))}get delay(){return Number(this.getAttribute("delay"))}get color(){return this.getAttribute("color")||this.getRandomColor}get thickness(){return Number(this.getAttribute("thickness"))}get rotate(){return Number(this.getAttribute("rotate"))}get end(){return Number(this.getAttribute("end"))}get getRandomColor(){let t="#";for(let e=0;e<6;e++)t+="0123456789ABCDEF"[Math.floor(16*Math.random())];return t}}window.customElements.define("wc-pie-chart",t),window.customElements.define("wc-pie-slice",e)}();
//# sourceMappingURL=wc-pie-chart-min.js.map
