// ── EXPAND MODAL ──
function OpenExpandModal(note) {
    EnsureBlocks(note);
    const overlay=document.createElement('div'); overlay.className='expand-overlay';
    const typeLabels={text:'Metin',checklist:'Liste',steps:'Adımlar',code:'Kod',link:'Link',mixed:'Karma'};
    overlay.innerHTML=`
        <div class="expand-container">
            <div class="expand-header">
                <input class="expand-title-inp" value="${EscapeHtml(note.title)}" placeholder="Başlık..." style="user-select:text;">
                <span class="expand-type">${note.type||'Not'}</span>
                <button class="expand-close" id="ExCl">✕</button>
            </div>
            <div class="expand-body" id="ExBody"></div>
            <div id="ExAddBar"></div>
        </div>
    `;
    document.body.appendChild(overlay);
    const titleInp=overlay.querySelector('.expand-title-inp');
    titleInp.addEventListener('input',()=>{ note.title=titleInp.value; DebounceSave(); });
    const exBody=overlay.querySelector('#ExBody');
    RenderExpandBlocks(note, exBody);
    overlay.querySelector('#ExAddBar').appendChild(MakeAddBlockBar(note, true, exBody));
    overlay.querySelector('#ExCl').onclick=()=>{ overlay.remove(); RenderBoard(); };
    overlay.addEventListener('click',(e)=>{ if(e.target===overlay) { overlay.remove(); RenderBoard(); } });
}
