// ── DB ──
const DB_NAME = 'BlackBoardDB_v2';
const DB_VERSION = 1;
const STORE_NAME = 'appData';
let db = null;

// ── DB ──
function InitDB() {
    return new Promise((res,rej)=>{
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onerror=()=>rej(req.error);
        req.onsuccess=()=>{db=req.result;res();};
        req.onupgradeneeded=(e)=>{if(!e.target.result.objectStoreNames.contains(STORE_NAME)) e.target.result.createObjectStore(STORE_NAME);};
    });
}
async function SaveToDB() {
    if(!db) return;
    const data={fikirler,projeler,aktifTip,aktifId,aktifModulId,trashBin,nextFikirId,nextProjeId,nextModulId,nextNoteId,nextTrashId,nextConnectionId,connections,lineColors,lineWidths};
    const tx=db.transaction(STORE_NAME,'readwrite');
    tx.objectStore(STORE_NAME).put(data,'mainData');
    MarkSaved();
}
async function LoadFromDB() {
    if(!db) return;
    const tx=db.transaction(STORE_NAME,'readonly');
    return new Promise((res)=>{
        const req=tx.objectStore(STORE_NAME).get('mainData');
        req.onsuccess=()=>{
            const d=req.result;
            if(d){
                fikirler=d.fikirler||[]; projeler=d.projeler||[];
                aktifTip=d.aktifTip||null; aktifId=d.aktifId||null; aktifModulId=d.aktifModulId||null;
                trashBin=d.trashBin||[]; connections=d.connections||[];
                lineColors=d.lineColors||{}; lineWidths=d.lineWidths||{};
                nextFikirId=d.nextFikirId||1; nextProjeId=d.nextProjeId||1;
                nextModulId=d.nextModulId||1; nextNoteId=d.nextNoteId||100;
                nextTrashId=d.nextTrashId||1; nextConnectionId=d.nextConnectionId||1;
            } else CreateInitialData();
            res();
        };
        req.onerror=()=>{CreateInitialData();res();};
    });
}
function CreateInitialData() {
    const note1 = { id:nextNoteId++, title:"Mobil Uygulama Fikri", type:"text", blocks:[{type:"text",id:1,content:"Kullanıcı dostu arayüz ile hızlı not alma"}], left:80, top:70, bgColor:"#1e293b" };
    fikirler=[{id:nextFikirId++, name:"Mobil Uygulama", notes:[note1]}];
    const note2 = { id:nextNoteId++, title:"Başlangıç Adımları", type:"steps", blocks:[{type:"steps",id:1,items:[{id:1,text:"Gereksinimleri belirle"},{id:2,text:"Prototip yap"},{id:3,text:"Test et"}]}], left:100, top:80, bgColor:"#1e293b" };
    const note3 = { id:nextNoteId++, title:"Kontrol Listesi", type:"checklist", blocks:[{type:"checklist",id:1,items:[{id:1,text:"PID kontrol",done:false},{id:2,text:"Sensor füzyonu",done:true}]}], left:420, top:130, bgColor:"#1e3a4d" };
    const modul1={id:nextModulId++, name:"Ana Modül", notes:[note2]};
    const modul2={id:nextModulId++, name:"Algoritmalar", notes:[note3]};
    projeler=[{id:nextProjeId++, name:"Drone Projesi", modules:[modul1,modul2]}];
    aktifTip='fikir'; aktifId=fikirler[0].id; aktifModulId=null;
    connections=[]; lineColors={}; lineWidths={};
}
