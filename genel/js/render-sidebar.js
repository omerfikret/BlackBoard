// ── RENDER SIDEBAR ──
function RenderSidebar() {
    fikirlerListDiv.innerHTML='';
    if(fikirler.length===0){ fikirlerListDiv.innerHTML='<div class="empty-message">Henüz fikir yok</div>'; }
    else fikirler.forEach(f=>{
        const div=document.createElement('div'); div.className='list-item';
        if(aktifTip==='fikir'&&aktifId===f.id) div.classList.add('active-item');
        const nameSpan=document.createElement('span'); nameSpan.className='item-name';
        nameSpan.innerHTML=`${EscapeHtml(f.name)}<span class="item-badge">${f.notes.length} not</span>`;
        const actions=document.createElement('div'); actions.className='item-actions';
        const convBtn=document.createElement('button'); convBtn.className='item-action-btn'; convBtn.title='Projeye dönüştür'; convBtn.innerHTML='→ Proje';
        convBtn.addEventListener('click',(e)=>{ e.stopPropagation(); ConvertFikirToProje(f.id); });
        const delBtn=document.createElement('button'); delBtn.className='item-action-btn danger'; delBtn.innerHTML='Sil';
        delBtn.addEventListener('click',(e)=>{ e.stopPropagation(); DeleteFikir(f.id); });
        actions.appendChild(convBtn); actions.appendChild(delBtn);
        div.appendChild(nameSpan); div.appendChild(actions);
        div.addEventListener('click',(e)=>{ if(!e.target.closest('.item-action-btn')) SetActiveFikir(f.id); });
        fikirlerListDiv.appendChild(div);
    });

    projelerListDiv.innerHTML='';
    if(projeler.length===0){ projelerListDiv.innerHTML='<div class="empty-message">Henüz proje yok</div>'; }
    else projeler.forEach(p=>{
        const div=document.createElement('div'); div.className='list-item';
        if(aktifTip==='proje'&&aktifId===p.id) div.classList.add('active-item');
        const toplamNot=p.modules.reduce((acc,m)=>acc+m.notes.length,0);
        const nameSpan=document.createElement('span'); nameSpan.className='item-name';
        nameSpan.innerHTML=`${EscapeHtml(p.name)}<span class="item-badge">${p.modules.length} modül · ${toplamNot} not</span>`;
        const actions=document.createElement('div'); actions.className='item-actions';
        const delBtn=document.createElement('button'); delBtn.className='item-action-btn danger'; delBtn.innerHTML='Sil';
        delBtn.addEventListener('click',(e)=>{ e.stopPropagation(); DeleteProje(p.id); });
        actions.appendChild(delBtn);
        div.appendChild(nameSpan); div.appendChild(actions);
        div.addEventListener('click',(e)=>{ if(!e.target.closest('.item-action-btn')) SetActiveProje(p.id); });
        projelerListDiv.appendChild(div);
    });
}
