// ── NOTE CARD ──
function RenderNoteCard(note) {
    EnsureBlocks(note);
    const card=document.createElement('div');
    card.className='idea-card';
    card.setAttribute('data-note-id', note.id);
    card.style.left=note.left+'px'; card.style.top=note.top+'px';
    card.style.backgroundColor=note.bgColor||'#141a24';
    if(selectedNoteIds.has(note.id)) card.classList.add('selected-card');

    // Titlebar
    const titlebar=document.createElement('div'); titlebar.className='card-titlebar';
    titlebar.innerHTML=`<span class="drag-area">::</span>`;
    const titleInp=document.createElement('input'); titleInp.type='text'; titleInp.className='card-title';
    titleInp.value=note.title||''; titleInp.placeholder='Başlık'; titleInp.style.userSelect='text';
    titleInp.addEventListener('change',()=>{ note.title=titleInp.value; DebounceSave(); RenderLines(); });
    titleInp.addEventListener('mousedown',e=>e.stopPropagation());
    const connBtn=document.createElement('button'); connBtn.className='connector-btn'; connBtn.setAttribute('data-connect-id',note.id); connBtn.title='Bağlantı kur'; connBtn.innerHTML='⊕';
    connBtn.addEventListener('click',(e)=>{ e.stopPropagation(); StartConnecting(note.id); });
    connBtn.addEventListener('mousedown',e=>e.stopPropagation());
    const delBtn=document.createElement('button'); delBtn.className='delete-card'; delBtn.innerHTML='✕'; delBtn.title='Notu sil';
    delBtn.addEventListener('click',(e)=>{ e.stopPropagation(); pushUndo(); DeleteNote(note.id); });
    delBtn.addEventListener('mousedown',e=>e.stopPropagation());
    titlebar.appendChild(titleInp); titlebar.appendChild(connBtn); titlebar.appendChild(delBtn);
    card.appendChild(titlebar);

    // Body
    const body=document.createElement('div'); body.className='card-body';
    const displayBlocks=note.blocks.slice(0,2);
    displayBlocks.forEach(block=>body.appendChild(RenderBlockElement(block, note, false)));
    if(note.blocks.length>2){
        const more=document.createElement('div'); more.style.cssText='color:#5a6e85;font-size:0.65rem;padding:4px 8px;';
        more.innerText=`+ ${note.blocks.length-2} blok daha...`;
        body.appendChild(more);
    }
    card.appendChild(body);

    card.appendChild(MakeAddBlockBar(note, false, null));

    // Footer
    const footer=document.createElement('div'); footer.className='card-footer';
    const colorSel=document.createElement('div'); colorSel.className='color-selector';
    colorPalette.forEach(color=>{
        const dot=document.createElement('div'); dot.className='color-option';
        dot.style.backgroundColor=color;
        dot.style.border=note.bgColor===color?'2px solid #fff':'1px solid rgba(255,255,255,0.2)';
        dot.addEventListener('mousedown',e=>e.stopPropagation());
        dot.addEventListener('click',(e)=>{
            e.stopPropagation();
            note.bgColor=color; card.style.backgroundColor=color;
            colorSel.querySelectorAll('.color-option').forEach(d=>d.style.border=d.style.backgroundColor===color?'2px solid #fff':'1px solid rgba(255,255,255,0.2)');
            DebounceSave();
        });
        colorSel.appendChild(dot);
    });
    const expandBtn=document.createElement('button'); expandBtn.className='expand-card-btn'; expandBtn.innerText='Genişlet ↗';
    expandBtn.addEventListener('mousedown',e=>e.stopPropagation());
    expandBtn.addEventListener('click',(e)=>{ e.stopPropagation(); OpenExpandModal(note); });
    footer.appendChild(colorSel); footer.appendChild(expandBtn);
    card.appendChild(footer);

    // Connection points
    ['top','bottom','left','right'].forEach(pos=>{
        const pt=document.createElement('div'); pt.className=`connection-point ${pos}`;
        pt.addEventListener('click',(e)=>{ e.stopPropagation(); StartConnecting(note.id); });
        card.appendChild(pt);
    });

    card.addEventListener('click',(e)=>{
        if(e.target.closest('.delete-card')||e.target.closest('.connector-btn')||e.target.closest('.color-option')||e.target.closest('.connection-point')||e.target.closest('.expand-card-btn')||e.target.closest('.addblock-btn')||e.target.closest('.block')) return;
        SelectCard(card, note.id);
    });
    card.addEventListener('mousedown',(e)=>{
        if(e.target.closest('.delete-card')||e.target.closest('.card-title')||e.target.closest('.block')||e.target.closest('.connector-btn')||e.target.closest('.connection-point')||e.target.closest('.color-option')||e.target.closest('.expand-card-btn')||e.target.closest('.addblock-btn')) return;
        e.preventDefault();
        StartDrag(e, card, note);
    });

    notesContainer.appendChild(card);
}
