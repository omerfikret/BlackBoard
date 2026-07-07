// ── TRASH ──
function ShowTrashModal() {
    const modal=document.createElement('div'); modal.className='modal-overlay';
    if(trashBin.length===0){
        modal.innerHTML=`<div class="modal-container"><h3>🗑 Çöp Kutusu</h3><div class="empty-trash">Çöp kutusu boş</div><div class="modal-buttons"><button class="modal-btn modal-btn-cancel" id="CM">Kapat</button></div></div>`;
        document.body.appendChild(modal); modal.querySelector('#CM').onclick=()=>modal.remove(); return;
    }
    modal.innerHTML=`<div class="modal-container" style="width:580px;"><h3>🗑 Çöp Kutusu</h3><div class="trash-list" id="TL"></div><div class="modal-buttons" style="justify-content:space-between;"><div style="display:flex;gap:6px;"><button class="modal-btn modal-btn-cancel" id="SABtn">Tümünü Seç</button></div><div style="display:flex;gap:7px;"><button class="modal-btn modal-btn-confirm" id="RBtn">Geri Yükle</button><button class="modal-btn modal-btn-danger" id="DBtn">Kalıcı Sil</button><button class="modal-btn modal-btn-cancel" id="CBtn">Kapat</button></div></div></div>`;
    document.body.appendChild(modal);
    const listDiv=modal.querySelector('#TL');
    let selected=new Array(trashBin.length).fill(false);
    const typeBadge=(type)=>{ const map={'fikir':['tb-fikir','💡 Fikir'],'proje':['tb-proje','📁 Proje'],'modul':['tb-modul','📂 Modül'],'not':['tb-not','📝 Not']}; const [cls,lbl]=map[type]||['tb-not',type]; return `<span class="trash-type-badge ${cls}">${lbl}</span>`; };
    const renderList=()=>{
        listDiv.innerHTML='';
        trashBin.forEach((item,idx)=>{
            const div=document.createElement('div'); div.className='trash-item'; if(selected[idx]) div.classList.add('selected');
            div.innerHTML=`<input type="checkbox" class="trash-checkbox" ${selected[idx]?'checked':''}><div class="trash-info"><div class="trash-name">${EscapeHtml(item.name)}</div><div class="trash-meta">${typeBadge(item.type)}<span>${EscapeHtml(item.parentName)}</span><span>${new Date(item.deletedAt).toLocaleDateString('tr-TR')}</span></div></div>`;
            const chk=div.querySelector('.trash-checkbox');
            chk.onchange=(e)=>{selected[idx]=e.target.checked; div.classList.toggle('selected',e.target.checked);};
            div.onclick=(e)=>{if(e.target!==chk){chk.checked=!chk.checked;selected[idx]=chk.checked;div.classList.toggle('selected',chk.checked);}};
            listDiv.appendChild(div);
        });
    };
    renderList();
    modal.querySelector('#SABtn').onclick=()=>{selected.fill(true);renderList();};
    modal.querySelector('#RBtn').onclick=()=>{
        const idxs=selected.map((v,i)=>v?i:-1).filter(i=>i!==-1);
        if(idxs.length===0){ShowToast("Lütfen öğe seçin",1000);return;}
        RestoreFromTrash(idxs); modal.remove(); ShowToast(idxs.length+" öğe geri yüklendi",1500);
    };
    modal.querySelector('#DBtn').onclick=()=>{
        const idxs=selected.map((v,i)=>v?i:-1).filter(i=>i!==-1).reverse();
        if(idxs.length===0){ShowToast("Lütfen öğe seçin",1000);return;}
        if(confirm(idxs.length+" öğeyi kalıcı olarak silmek istiyor musunuz?")){ idxs.forEach(i=>trashBin.splice(i,1)); DebounceSave(); modal.remove(); ShowToast(idxs.length+" öğe kalıcı silindi",1500); }
    };
    modal.querySelector('#CBtn').onclick=()=>modal.remove();
}

function RestoreFromTrash(indices) {
    for(let i of indices.sort((a,b)=>b-a)){
        const item=trashBin[i];
        if(item.type==='fikir'){ const f={id:nextFikirId++,name:item.name,notes:item.originalData?.notes||[]}; f.notes.forEach(n=>{if(n.id>=nextNoteId)nextNoteId=n.id+1;}); fikirler.push(f); }
        else if(item.type==='proje'){ const p={id:nextProjeId++,name:item.name,modules:item.originalData?.modules||[]}; p.modules.forEach(m=>{if(m.id>=nextModulId)nextModulId=m.id+1; m.notes.forEach(n=>{if(n.id>=nextNoteId)nextNoteId=n.id+1;})}); projeler.push(p); }
        else if(item.type==='modul'){ const p=projeler.find(pp=>pp.id===item.parentId); if(p){ const m={id:nextModulId++,name:item.name,notes:item.originalData?.notes||[]}; m.notes.forEach(n=>{if(n.id>=nextNoteId)nextNoteId=n.id+1;}); p.modules.push(m); } }
        else if(item.type==='not'){
            if(item.parentType==='fikir'){ const f=fikirler.find(ff=>ff.id===item.parentId); if(f&&item.originalData){ f.notes.push({...item.originalData,id:nextNoteId++}); } }
            else if(item.parentType==='proje'&&item.modulId){ const p=projeler.find(pp=>pp.id===item.parentId); if(p){ const m=p.modules.find(mm=>mm.id===item.modulId); if(m&&item.originalData) m.notes.push({...item.originalData,id:nextNoteId++}); } }
        }
        trashBin.splice(i,1);
    }
    RenderSidebar(); RenderModuleTabs(); RenderBoard(); DebounceSave();
}
