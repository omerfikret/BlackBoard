// ── RENDER BLOCK ──
function RenderBlockElement(block, note, isExpand) {
    const wrapper = document.createElement('div');
    wrapper.className = 'block';
    wrapper.setAttribute('data-block-id', block.id);

    // FIX: delete button rendered FIRST so float:right places it top-right
    const delBtn = document.createElement('button');
    delBtn.className = 'block-delete-btn';
    delBtn.title = 'Bloğu sil';
    delBtn.innerHTML = '✕';
    delBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        pushUndo();
        note.blocks = note.blocks.filter(b=>b.id!==block.id);
        if(note.blocks.length===0) note.blocks.push(MakeBlock('text'));
        DebounceSave();
        if(isExpand) return;
        RenderBoard();
    });
    wrapper.appendChild(delBtn);

    if (block.type==='text') {
        wrapper.classList.add('block-text');
        const ta = document.createElement('textarea');
        ta.value = block.content||'';
        ta.placeholder = 'Notunu yaz...';
        ta.style.userSelect = 'text';
        ta.addEventListener('input', ()=>{ block.content=ta.value; DebounceSave(); });
        ta.addEventListener('mousedown', e=>e.stopPropagation());
        wrapper.appendChild(ta);
    }
    else if (block.type==='checklist') {
        wrapper.classList.add('block-checklist');
        const renderItems = () => {
            // Remove all children except delBtn
            Array.from(wrapper.children).forEach(c=>{ if(c!==delBtn) c.remove(); });
            block.items.forEach((item,idx)=>{
                const row=document.createElement('div'); row.className='checklist-item';
                const cb=document.createElement('input'); cb.type='checkbox'; cb.className='checklist-cb'; cb.checked=item.done;
                cb.addEventListener('change',()=>{ item.done=cb.checked; renderItems(); DebounceSave(); });
                cb.addEventListener('mousedown',e=>e.stopPropagation());
                const lbl=document.createElement('input'); lbl.type='text'; lbl.className='checklist-label'+(item.done?' done':'');
                lbl.style.userSelect='text'; lbl.value=item.text;
                lbl.placeholder='Liste maddesi...';
                lbl.addEventListener('input',()=>{ item.text=lbl.value; DebounceSave(); });
                lbl.addEventListener('mousedown',e=>e.stopPropagation());
                lbl.addEventListener('keydown',(e)=>{
                    if(e.key==='Enter'){ e.preventDefault(); block.items.splice(idx+1,0,{id:Date.now(),text:'',done:false}); renderItems(); DebounceSave(); setTimeout(()=>{ const inputs=wrapper.querySelectorAll('.checklist-label'); if(inputs[idx+1]) inputs[idx+1].focus(); },50); }
                    if(e.key==='Backspace'&&lbl.value===''&&block.items.length>1){ e.preventDefault(); block.items.splice(idx,1); renderItems(); DebounceSave(); }
                });
                const dl=document.createElement('button'); dl.className='checklist-del'; dl.innerHTML='✕';
                dl.addEventListener('click',()=>{ block.items.splice(idx,1); if(block.items.length===0) block.items.push({id:Date.now(),text:'',done:false}); renderItems(); DebounceSave(); });
                row.appendChild(cb); row.appendChild(lbl); row.appendChild(dl);
                wrapper.appendChild(row);
            });
            const addBtn=document.createElement('button'); addBtn.className='add-checklist-item'; addBtn.innerText='+ Madde ekle';
            addBtn.addEventListener('click',()=>{ block.items.push({id:Date.now(),text:'',done:false}); renderItems(); DebounceSave(); });
            addBtn.addEventListener('mousedown',e=>e.stopPropagation());
            wrapper.appendChild(addBtn);
        };
        renderItems();
    }
    else if (block.type==='steps') {
        wrapper.classList.add('block-steps');
        const renderSteps = () => {
            Array.from(wrapper.children).forEach(c=>{ if(c!==delBtn) c.remove(); });
            block.items.forEach((item,idx)=>{
                const row=document.createElement('div'); row.className='step-item';
                const num=document.createElement('div'); num.className='step-num'; num.innerText=idx+1;
                const ta=document.createElement('textarea'); ta.className='step-text';
                ta.style.userSelect='text'; ta.value=item.text; ta.placeholder='Adım açıklaması...'; ta.rows=1;
                ta.addEventListener('input',()=>{ item.text=ta.value; ta.style.height='auto'; ta.style.height=ta.scrollHeight+'px'; DebounceSave(); });
                ta.addEventListener('mousedown',e=>e.stopPropagation());
                ta.addEventListener('keydown',(e)=>{
                    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); block.items.splice(idx+1,0,{id:Date.now(),text:''}); renderSteps(); DebounceSave(); setTimeout(()=>{ const tas=wrapper.querySelectorAll('.step-text'); if(tas[idx+1]) tas[idx+1].focus(); },50); }
                });
                const dl=document.createElement('button'); dl.className='step-del'; dl.innerHTML='✕';
                dl.addEventListener('click',()=>{ block.items.splice(idx,1); if(block.items.length===0) block.items.push({id:Date.now(),text:''}); renderSteps(); DebounceSave(); });
                row.appendChild(num); row.appendChild(ta); row.appendChild(dl);
                wrapper.appendChild(row);
            });
            const addBtn=document.createElement('button'); addBtn.className='add-step-item'; addBtn.innerText='+ Adım ekle';
            addBtn.addEventListener('click',()=>{ block.items.push({id:Date.now(),text:''}); renderSteps(); DebounceSave(); });
            addBtn.addEventListener('mousedown',e=>e.stopPropagation());
            wrapper.appendChild(addBtn);
        };
        renderSteps();
    }
    else if (block.type==='code') {
        wrapper.classList.add('block-code');
        const bar=document.createElement('div'); bar.className='code-lang-bar';
        const langs=['python','javascript','c','cpp','rust','go','bash','json','yaml','other'];
        const sel=document.createElement('select'); sel.className='code-lang-select';
        langs.forEach(l=>{ const o=document.createElement('option'); o.value=l; o.text=l; if(l===block.lang) o.selected=true; sel.appendChild(o); });
        sel.addEventListener('change',()=>{ block.lang=sel.value; DebounceSave(); });
        sel.addEventListener('mousedown',e=>e.stopPropagation());
        const copyBtn=document.createElement('button'); copyBtn.className='code-copy-btn'; copyBtn.innerText='Kopyala';
        copyBtn.addEventListener('mousedown',e=>e.stopPropagation());
        bar.appendChild(sel); bar.appendChild(copyBtn);
        const ta=document.createElement('textarea');
        ta.style.userSelect='text'; ta.value=block.content||''; ta.placeholder='// Kodunu buraya yaz...';
        ta.addEventListener('input',()=>{ block.content=ta.value; DebounceSave(); });
        ta.addEventListener('mousedown',e=>e.stopPropagation());
        ta.addEventListener('keydown',(e)=>{ if(e.key==='Tab'){ e.preventDefault(); const s=ta.selectionStart,en=ta.selectionEnd; ta.value=ta.value.substring(0,s)+'    '+ta.value.substring(en); ta.selectionStart=ta.selectionEnd=s+4; } });
        copyBtn.addEventListener('click',()=>{ navigator.clipboard.writeText(ta.value).then(()=>ShowToast("Kod kopyalandı",900)).catch(()=>{ const tmp=document.createElement('textarea'); tmp.value=ta.value; document.body.appendChild(tmp); tmp.select(); document.execCommand('copy'); tmp.remove(); ShowToast("Kod kopyalandı",900); }); });
        wrapper.appendChild(bar); wrapper.appendChild(ta);
    }
    else if (block.type==='link') {
        wrapper.classList.add('block-link');
        const urlInp=document.createElement('input'); urlInp.type='url'; urlInp.className='link-url-inp';
        urlInp.style.userSelect='text'; urlInp.value=block.url||''; urlInp.placeholder='https://...';
        urlInp.addEventListener('input',()=>{ block.url=urlInp.value; DebounceSave(); });
        urlInp.addEventListener('mousedown',e=>e.stopPropagation());
        const lblInp=document.createElement('input'); lblInp.type='text'; lblInp.className='link-label-inp';
        lblInp.style.userSelect='text'; lblInp.value=block.label||''; lblInp.placeholder='Bağlantı açıklaması...';
        lblInp.addEventListener('input',()=>{ block.label=lblInp.value; DebounceSave(); });
        lblInp.addEventListener('mousedown',e=>e.stopPropagation());
        if (block.url) {
            const openBtn=document.createElement('a'); openBtn.href=block.url; openBtn.target='_blank';
            openBtn.style.cssText='display:block;font-size:0.68rem;color:#60a5fa;margin-top:5px;text-decoration:none;';
            openBtn.innerText='↗ Aç';
            wrapper.appendChild(urlInp); wrapper.appendChild(lblInp); wrapper.appendChild(openBtn);
        } else {
            wrapper.appendChild(urlInp); wrapper.appendChild(lblInp);
        }
    }

    return wrapper;
}
