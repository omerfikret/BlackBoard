// ── SELECT ──
function SelectCard(cardEl, noteId) {
    if(isConnectingMode && connectingFromCard) {
        if(connectingFromCard!==noteId){ AddConnection(connectingFromCard,noteId); }
        else { ShowToast("Aynı nota bağlantı yapamazsınız",800); }
        isConnectingMode=false; connectingFromCard=null;
        document.querySelectorAll('.connector-btn').forEach(b=>b.classList.remove('active-connector'));
        document.querySelectorAll('.idea-card').forEach(c=>c.classList.remove('selected-card'));
        selectedNoteIds.clear(); return;
    }
    document.querySelectorAll('.idea-card').forEach(c=>c.classList.remove('selected-card'));
    selectedNoteIds.clear();
    cardEl.classList.add('selected-card');
    selectedNoteIds.add(noteId);
}

function StartConnecting(noteId) {
    isConnectingMode=true; connectingFromCard=noteId;
    document.querySelectorAll('.connector-btn').forEach(b=>b.classList.remove('active-connector'));
    const btn=document.querySelector(`.connector-btn[data-connect-id='${noteId}']`);
    if(btn) btn.classList.add('active-connector');
    ShowToast("Bağlanmak istediğiniz nota tıklayın",1500);
}
