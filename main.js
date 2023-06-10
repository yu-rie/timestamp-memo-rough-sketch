'use strict';
const defaultTime = '19:00:03';
const id = (id) => document.getElementById(id);
let clipboad = '';

id('reference-time').value = localStorage.getItem('reference') || defaultTime;
id('memo').value = localStorage.getItem('memo') || '';
id('memo').scrollTop = id('memo').scrollHeight;

let referenceDate = getReferenceDate(id('reference-time').value);

function timeElapsed(){
    const now = new Date();
    const elapse = now > referenceDate ? now - referenceDate : now - referenceDate + 86_400_000_000;
    return msToString(elapse);
}

function getReferenceDate(referenceTime){
    let referenceDate = new Date();
    const [h, m, s] = referenceTime.split(':');
    referenceDate.setHours(h, m, s);
    if (referenceDate > Date.now()) {
        referenceDate.setDate(referenceDate.getDate());
    }
    return referenceDate;
} 

id('comment').addEventListener('keydown', (e) => {
    if (id('timestamp').value === '' ) id('timestamp').value = timeElapsed();
    if (e.isComposing) return;
    if (e.code != 'Enter') return;
    if (id('comment').value === "") {
        id('timestamp').value = timeElapsed();
    } else {
        const content = id('memo').value;
        id('memo').value = `${content}* ${id('timestamp').value} ${id('comment').value}\n`
        id('memo').scrollTop = id('memo').scrollHeight - 1;
        id('timestamp').value = '';
        id('comment').value = '';
        save();
    } 
})

id('reference-time').addEventListener('change', () => {
    referenceDate = getReferenceDate(id('reference-time').value);
    save();
});

function save() {
    localStorage.setItem('reference', id('reference-time').value);
    localStorage.setItem('memo', id('memo').value);
}

id('now').addEventListener('click', () => {
    const now = Date.now() + 32_400_000;
    id('reference-time').value = msToString(now);
    referenceDate = getReferenceDate(id('reference-time').value);
    save();
})

id('reset').addEventListener('click',() => {
    localStorage.removeItem('reference');
    localStorage.removeItem('memo');
    id('memo').value = '';
    id('comment').value = '';
    id('reference-time').value = defaultTime;
    referenceDate = getReferenceDate(id('reference-time').value);
})

id('title').addEventListener('focus', () => {
    if (id('url').value != '') return;
    navigator.clipboard.readText().then(
        (clipText) => {
            id('url').value = clipText;
        });
});

id('title').addEventListener('keydown', (e) => {
    if (e.isComposing) return;
    if (id('url').value === '') return;
    if (e.code != 'Enter') return;
    if (id('title').value === '') return;
        const content = id('memo').value;
        id('memo').value = `${content}    * [${id('title').value}](${id('url').value})\n`
        id('memo').scrollTop = id('memo').scrollHeight;
        navigator.clipboard.writeText('').then(() => {
            id('title').value = '';
            id('url').value = '';
        });
        id('comment').focus();
        save();
    });

function msToString(ms) {
    const sec = Math.floor(ms / 1000);
    const h = ('00' + Math.floor(sec % 86400 / 3600)).slice( -2 );
    const m = ('00' + Math.floor(sec % 3600 / 60)).slice( -2 );
    const s = ('00' + (sec % 60)).slice( -2 );
    return `${h}:${m}:${s}`;
}