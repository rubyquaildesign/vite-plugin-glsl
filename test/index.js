import * as WGSL from './wgsl/main.wgsl';

const app = document.getElementById('app');
console.log(WGSL)
app.style.backgroundColor = '#222222';
app.style.fontFamily = 'monospace';
app.style.whiteSpace = 'pre-wrap';

app.style.color = '#bbbbbb';
app.style.padding = '16px';


app.textContent += '----- WGSL: -----\n\n';
app.textContent += WGSL.defintions;

// console.info(`WGSL Shader Length: ${WGSL.length} characters.`);
