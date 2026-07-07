// ── RENDER MODULE TABS ──
function RenderModuleTabs() {
    moduleTabsContainer.innerHTML='';
    if(aktifTip!=='proje') return;
    const proje=projeler.find(p=>p.id===aktifId); if(!proje) return;
    proje.modules.forEach(m=>{
        const btn=document.createElement('button'); btn.className='module-tab';
        if(aktifModulId===m.id) btn.classList.add('active-tab');
        btn.innerHTML=`${EscapeHtml(m.name)}<button class="delete-module-btn" data-id="${m.id}">✕</button>`;
        btn.onclick=(e)=>{ if(!e.target.classList.contains('delete-module-btn')) SetActiveModul(m.id); };
        btn.querySelector('.delete-module-btn').addEventListener('click',(e)=>{ e.stopPropagation(); DeleteModule(m.id); });
        moduleTabsContainer.appendChild(btn);
    });
    const addBtn=document.createElement('button'); addBtn.className='add-module-btn'; addBtn.innerHTML='+ Modül ekle';
    addBtn.onclick=()=>AddNewModule();
    moduleTabsContainer.appendChild(addBtn);
}
