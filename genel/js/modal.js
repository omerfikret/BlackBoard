// ── MODAL ──
function ShowModal(title, placeholder, onConfirm, defaultValue="", confirmLabel="Ekle") {
    const modal=document.createElement('div'); modal.className='modal-overlay';
    modal.innerHTML=`<div class="modal-container"><h3>${title}</h3><input type="text" class="modal-input" id="MI" placeholder="${placeholder}" value="${EscapeHtml(defaultValue)}"><div class="modal-buttons"><button class="modal-btn modal-btn-cancel" id="MC">İptal</button><button class="modal-btn modal-btn-confirm" id="MK">${confirmLabel}</button></div></div>`;
    document.body.appendChild(modal);
    const inp=modal.querySelector('#MI'); inp.focus(); inp.select();
    modal.querySelector('#MC').onclick=()=>modal.remove();
    modal.querySelector('#MK').onclick=()=>{const v=inp.value.trim();if(v){onConfirm(v);}modal.remove();};
    inp.addEventListener('keypress',(e)=>{if(e.key==='Enter')modal.querySelector('#MK').click();});
}
