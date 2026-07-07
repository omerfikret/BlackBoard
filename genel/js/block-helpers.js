// ── BLOCK HELPERS ──
function MakeBlock(type) {
    const blockId = Date.now() + Math.random();
    if (type==='text') return {type:'text', id:blockId, content:''};
    if (type==='checklist') return {type:'checklist', id:blockId, items:[{id:Date.now(),text:'',done:false}]};
    if (type==='steps') return {type:'steps', id:blockId, items:[{id:Date.now(),text:''}]};
    if (type==='code') return {type:'code', id:blockId, lang:'python', content:''};
    if (type==='link') return {type:'link', id:blockId, url:'', label:''};
    return null;
}
function EnsureBlocks(note) {
    if (!note.blocks) {
        note.blocks = [];
        if (note.content) note.blocks.push({type:'text',id:Date.now(),content:note.content||''});
        delete note.content;
    }
    if (note.blocks.length === 0) note.blocks.push(MakeBlock('text'));
}
