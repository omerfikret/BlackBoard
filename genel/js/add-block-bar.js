// ── ADD BLOCK BAR ──
function MakeAddBlockBar(note, isExpand, container) {
    const bar = document.createElement('div');
    bar.className = isExpand ? 'expand-addbar' : 'card-addblock-bar';
    const types = [['text','📝 Metin'],['checklist','☑ Liste'],['steps','🔢 Adımlar'],['code','</> Kod'],['link','🔗 Link']];
    types.forEach(([t,label])=>{
        const btn=document.createElement('button'); btn.className='addblock-btn'; btn.innerText=label;
        btn.addEventListener('mousedown',e=>e.stopPropagation());
        btn.addEventListener('click',(e)=>{
            e.stopPropagation();
            pushUndo();
            const block=MakeBlock(t);
            note.blocks.push(block);
            DebounceSave();
            if(isExpand) {
                RenderExpandBlocks(note, container);
            } else {
                RenderBoard();
            }
        });
        bar.appendChild(btn);
    });
    return bar;
}

function RenderExpandBlocks(note, blocksContainer) {
    blocksContainer.innerHTML='';
    note.blocks.forEach(block=>{
        blocksContainer.appendChild(RenderBlockElement(block, note, true));
    });
}
