(function(){
// Try to capture pattern: A op B (last binary op)
const pretty = toPretty(exp);
const m = pretty.match(/(.+)([+\-×÷])(?!.*[+\-×÷])(.*)$/);
if(!m) return null;
return { op: m[2], rhs: m[3].trim() };
}


function repeat(){
if(!lastEqual) return;
let base = lastResult;
const op = lastEqual.op.replace('×','*').replace('÷','/');
const rhs = lastEqual.rhs;
try{
const val = safeEval(`${base}${op}${toEngine(rhs)}`);
lastResult = formatNumber(val);
pushHistory(`${toPretty(base+op+rhs)}`, lastResult);
updateDisplay();
}catch{ shake(); }
}


function formatNumber(n){
const s = Number(n.toPrecision(12)).toString();
// Add thousand separators if not scientific
if(/e/i.test(s)) return s;
const [a,b] = s.split('.');
const int = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return b? `${int}.${b}` : int;
}


function shake(){
const el = document.querySelector('.calc');
el.animate([
{ transform: 'translateX(0)' },
{ transform: 'translateX(-6px)' },
{ transform: 'translateX(6px)' },
{ transform: 'translateX(0)' },
], { duration: 180 });
}


// Event wiring
document.querySelectorAll('.btn').forEach(b=>{
b.addEventListener('click', ()=>{
const action = b.dataset.action;
const val = b.dataset.value;
if(action === 'clear') return clearAll();
if(action === 'backspace') return backspace();
if(action === 'equals') return equals();
if(action === 'plusminus') return toggleSign();
if(action === 'repeat') return repeat();
if(val) insert(val);
})
});


// Keyboard support
window.addEventListener('keydown', (e)=>{
const k = e.key;
if(/^[0-9]$/.test(k)) return insert(k);
if(['+','-','*','/','%','(',')','.'].includes(k)) return insert(k);
if(k === 'Enter' || k === '='){ e.preventDefault(); return equals(); }
if(k === 'Backspace'){ return backspace(); }
if(k === 'Escape' || k === 'Delete'){ return clearAll(); }
});


// Controls
themeBtn.addEventListener('click', ()=>{
const now = app.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
app.setAttribute('data-theme', now);
});


historyBtn.addEventListener('click', ()=>{
historyBox.classList.toggle('show');
});


copyBtn.addEventListener('click', async ()=>{
try{
await navigator.clipboard.writeText(resultEl.textContent);
copyBtn.textContent = '✅';
setTimeout(()=> copyBtn.textContent = '📋', 900);
}catch{
copyBtn.textContent = '❌';
setTimeout(()=> copyBtn.textContent = '📋', 900);
}
});


// Init
updateDisplay();
})();