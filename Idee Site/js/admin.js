let contLogatGlobal = null; 
window.lang = localStorage.getItem('lang') || 'ro';

// --- TRADUCERI ADMIN ---
window.setLangAdmin = function(limba) {
    localStorage.setItem('lang', limba);
    window.lang = limba;
    
    const btnRo = document.getElementById('btn-lang-ro-admin');
    const btnHu = document.getElementById('btn-lang-hu-admin');
    if(btnRo && btnHu) {
        btnRo.style.background = limba === 'ro' ? '#34c759' : 'transparent';
        btnRo.style.color = limba === 'ro' ? 'black' : 'white';
        btnHu.style.background = limba === 'hu' ? '#34c759' : 'transparent';
        btnHu.style.color = limba === 'hu' ? 'black' : 'white';
    }

    const dict = {
        'ro': {
            't-logare': '🔐 Logare Panou Control',
            't-logout': 'Deconectare',
            't-rez-man': '📝 Adaugă Rezervare Manuală',
            't-rez-desc': '(Dacă e ocupată, sistemul blochează)',
            't-pt-ce-teren': 'Pentru ce teren?',
            't-nume': 'Nume Client (sau Telefon)',
            't-data-cal': 'Data calendaristică',
            't-ora': 'Ora',
            't-pret-incasat': 'Preț Încasat',
            't-btn-salv': '➕ Salvează',
            't-istoric-titlu': '📅 Lista Detaliată a Rezervărilor',
            't-istoric-btn': '🔄 Descarcă Rezervările',
            't-prog': '📋 Program & Disponibilitate',
            't-alege': 'Alege Terenul',
            't-data': 'Data Dorită',
            't-ora-th': 'Ora',
            't-status': 'Status',
            't-detalii': 'Client / Detalii',
            't-reincarca': '🔄 Reîncarcă Programul',
            't-inchis-admin': '⛔ Închis de Admin'
        },
        'hu': {
            't-logare': '🔐 Vezérlőpult Bejelentkezés',
            't-logout': 'Kijelentkezés',
            't-rez-man': '📝 Kézi Foglalás Hozzáadása',
            't-rez-desc': '(Ha foglalt, a rendszer blokkolja)',
            't-pt-ce-teren': 'Melyik pályára?',
            't-nume': 'Ügyfél neve (vagy Telefon)',
            't-data-cal': 'Naptári dátum',
            't-ora': 'Óra',
            't-pret-incasat': 'Beszedett Ár',
            't-btn-salv': '➕ Mentés',
            't-istoric-titlu': '📅 Foglalások Részletes Listája',
            't-istoric-btn': '🔄 Foglalások Letöltése',
            't-prog': '📋 Program és Elérhetőség',
            't-alege': 'Válassz Pályát',
            't-data': 'Kívánt Dátum',
            't-ora-th': 'Óra',
            't-status': 'Állapot',
            't-detalii': 'Ügyfél / Részletek',
            't-reincarca': '🔄 Program Újratöltése',
            't-inchis-admin': '⛔ Admin által Zárva'
        }
    };

    const currentDict = dict[limba] || dict['ro'];
    document.querySelectorAll('[data-trad]').forEach(el => {
        const key = el.getAttribute('data-trad');
        if (currentDict[key]) el.innerText = currentDict[key];
    });

    if(typeof window.incarcaTabelProgram === 'function') window.incarcaTabelProgram();
    if(typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin();
};

document.addEventListener('DOMContentLoaded', () => {
    window.setLangAdmin(window.lang);
});

// --- FUNCTII GLOBALE ---
window.comprimaImagine = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800; 
                let width = img.width;
                let height = img.height;
                if (width > MAX_WIDTH) {
                    height = Math.round((height * MAX_WIDTH) / width);
                    width = MAX_WIDTH;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/jpeg', 0.8);
                resolve(base64);
            };
        };
        reader.onerror = error => reject(error);
    });
};

window.initializeazaTabel = function(terenuriArray) {
    const select = document.getElementById('tabel-teren');
    select.innerHTML = '';
    
    if (terenuriArray.length === 0) {
        select.innerHTML = '<option value="">Niciun teren alocat</option>';
        return;
    }
    
    terenuriArray.forEach(t => {
        select.innerHTML += `<option value="${t}">${t}</option>`;
    });
    
    const dataInput = document.getElementById('tabel-data');
    if (!dataInput.value) {
        dataInput.value = new Date().toISOString().split('T')[0];
    }
    
    dataInput.addEventListener('change', window.incarcaTabelProgram);
    select.addEventListener('change', window.incarcaTabelProgram);
    window.incarcaTabelProgram();
};

window.incarcaTabelProgram = async function() {
    const terenAles = document.getElementById('tabel-teren').value;
    const dataInput = document.getElementById('tabel-data').value;
    const tbody = document.getElementById('tabel-corp-program');
    
    if (!terenAles || !dataInput) return;
    tbody.innerHTML = '<tr><td colspan="3" style="padding:15px; text-align:center;">Se încarcă datele... ⏳</td></tr>';

    const d = new Date(dataInput);
    const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
    const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

    const { data: rezervari, error } = await db.from('rezervari')
        .select('*')
        .eq('teren', terenAles)
        .eq('data_str', dataFormata)
        .neq('stare', 'anulata');

    let clientiAsociati = [];
    if (rezervari && rezervari.length > 0) {
        const emails = rezervari.map(r => r.email_client).filter(e => e !== 'Teren Blocat');
        if(emails.length > 0) {
            const { data: clientiDB } = await db.from('clienti').select('*').in('email', emails);
            if (clientiDB) clientiAsociati = clientiDB;
        }
    }

    let html = '';
    const ore = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];

    const txtLiber = window.lang === 'hu' ? 'SZABAD' : 'LIBER';
    const txtOcupat = window.lang === 'hu' ? 'FOGLALT' : 'OCUPAT';
    const txtBlocat = window.lang === 'hu' ? 'ZÁRVA' : 'BLOCAT';
    const txtDetaliiBlocat = window.lang === 'hu' ? '⛔ Admin által Zárva' : '⛔ Închis de Admin';

    ore.forEach(ora => {
        const rGasita = rezervari ? rezervari.find(r => r.ora === ora) : null;
        let badge = `<span style="background: #22c55e; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${txtLiber}</span>`;
        let detalii = '<span style="color:#888;">-</span>';
        let bg = 'transparent';

        if (rGasita) {
            if (rGasita.email_client === 'Teren Blocat') {
                badge = `<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${txtBlocat}</span>`;
                detalii = txtDetaliiBlocat;
                bg = 'rgba(239, 68, 68, 0.1)';
            } else {
                let infoClient = rGasita.email_client;
                let contClient = clientiAsociati.find(c => c.email === rGasita.email_client);
                
                if (contClient) {
                    let cNume = contClient.nume ? `👤 Nume: ${contClient.nume}<br>` : '';
                    let cTel = contClient.telefon ? `📞 Tel: ${contClient.telefon}<br>` : '';
                    let cMail = `✉️ Email: ${contClient.email}`;
                    infoClient = `${cNume}${cTel}${cMail}`;
                } else {
                    infoClient = `👤 Detalii (Manual): ${rGasita.email_client}`;
                }

                badge = `<span style="background: #f59e0b; color: black; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">${txtOcupat}</span>`;
                detalii = `<span style="color:white; font-size:13px; line-height:1.4;">${infoClient}</span> <br><span style="font-size:12px; color:#aaa; margin-top: 5px; display:inline-block;">💰 ${rGasita.pret_total}</span>`;
                bg = 'rgba(245, 158, 11, 0.05)';
            }
        }
        html += `<tr style="background: ${bg}; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 12px; border-right: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: #fff;">${ora}</td>
                <td style="padding: 12px; border-right: 1px solid rgba(255,255,255,0.05);">${badge}</td>
                <td style="padding: 12px;">${detalii}</td></tr>`;
    });
    tbody.innerHTML = html;
};

window.actualizeazaBifeTerenuri = async function() {
    const container = document.getElementById('container-checkbox-terenuri');
    if (!container) return;
    container.innerHTML = `
        <label><input type="checkbox" id="check-super-admin" value="ALL" style="margin-right: 5px;"> 👑 SUPER ADMIN (Acces Total)</label>
        <hr style="border-color: rgba(255,255,255,0.1); width: 100%; margin: 5px 0;">
    `;
    const { data } = await db.from('terenuri').select('nume, sport');
    if (data) {
        data.forEach(t => { container.innerHTML += `<label><input type="checkbox" class="check-teren-alocat" value="${t.nume}" style="margin-right: 5px;"> ${t.nume} (${t.sport})</label>`; });
    }
};

window.incarcaTerenuriAdmin = async function() {
    const container = document.getElementById('container-lista-terenuri');
    if (!container) return;
    container.innerHTML = "<p style='color: white;'>Se descarcă terenurile din cloud...</p>";
    
    const { data } = await db.from('terenuri').select('*');
    if (!data || data.length === 0) { container.innerHTML = "<p style='color: #ccc;'>Niciun teren adăugat.</p>"; return; }
    
    let html = "";
    data.forEach(t => {
        let textMinge = t.optiune_minge ? `Da (${t.pret_minge || 15} Lei)` : 'Nu';
        html += `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${t.poza || 'assets/imagini/default.png'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <h4 style="margin: 0 0 5px 0; color: #f59e0b;">${t.sport} - ${t.nume}</h4>
                        <p style="margin: 0; font-size: 13px; color: #ccc;">Preț: ${t.pret} Lei/oră | Minge: ${textMinge}</p>
                    </div>
                </div>
                <button onclick="stergeTerenAdmin(${t.id})" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 5px; cursor: pointer;">❌ Șterge</button>
            </div>
        `;
    });
    container.innerHTML = html;
};

window.stergeTerenAdmin = async function(id) {
    if (confirm("Ești sigur? Acest teren va dispărea definitiv de pe site!")) {
        await db.from('terenuri').delete().eq('id', id);
        window.incarcaTerenuriAdmin();
        window.actualizeazaBifeTerenuri();
    }
};

window.anuleazaRezervareAdmin = async function(id) {
    if (confirm("Ești sigur că vrei să anulezi rezervarea? Ea va apărea marcată cu roșu în istoric.")) {
        const { error } = await db.from('rezervari').update({ stare: 'anulata' }).eq('id', id);
        if (!error) {
            if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin();
            if (typeof window.incarcaTabelProgram === 'function') window.incarcaTabelProgram(); 
        }
        else if (error) alert("Eroare la anulare: " + error.message);
    }
};

// --- LOGICA PRINCIPALĂ A PAGINII ---
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('sectiune-login')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('login-admin-btn')?.click();
        }
    });

    document.getElementById('login-admin-btn')?.addEventListener('click', async () => {
        const parola = document.getElementById('login-parola').value.trim();
        if (!parola) return alert("Introdu o parolă!");

        const btn = document.getElementById('login-admin-btn');
        btn.innerText = "Se verifică...";
        
        const { data, error } = await db.from('users_admin').select('*').eq('parola', parola).single();
        
        if (data && !error) {
            contLogatGlobal = data;
            document.getElementById('sectiune-login').style.display = 'none';
            document.getElementById('sectiune-dashboard').style.display = 'flex';
            document.getElementById('text-rol-activ').innerText = window.lang === 'hu' ? `Bejelentkezve mint: ${contLogatGlobal.nume_admin}` : `Logat ca: ${contLogatGlobal.nume_admin}`;
            
            let terenuriPtTabel = []; 

            // NOUA LOGICĂ DE SHOW/HIDE PENTRU NOUL LAYOUT (Masonry / Flex)
            if (contLogatGlobal.is_super) {
                document.getElementById('panou-adauga-teren').style.display = 'flex';
                document.getElementById('panou-creeaza-cont').style.display = 'flex';
                document.getElementById('panou-rezervare-manuala').style.display = 'none';
                
                document.getElementById('grid-setari-si-istoric').style.display = 'grid';
                document.getElementById('container-panouri-multiple').style.display = 'none';

                window.incarcaTerenuriAdmin();
                window.actualizeazaBifeTerenuri(); 
                
                const { data: toate } = await db.from('terenuri').select('nume');
                if (toate) terenuriPtTabel = toate.map(t => t.nume);
                
            } else {
                document.getElementById('panou-adauga-teren').style.display = 'none';
                document.getElementById('panou-creeaza-cont').style.display = 'none';
                
                document.getElementById('panou-rezervare-manuala').style.display = 'flex';
                
                document.getElementById('grid-setari-si-istoric').style.display = 'grid'; 
                document.getElementById('container-panouri-multiple').style.display = 'contents'; 

                const listaTerenuriAlocate = contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : []; 
                terenuriPtTabel = listaTerenuriAlocate.filter(n => n); 

                const containerPanouri = document.getElementById('container-panouri-multiple');
                const selectManualTeren = document.getElementById('manual-teren');
                containerPanouri.innerHTML = ''; selectManualTeren.innerHTML = '';

                for (let numeT of listaTerenuriAlocate) {
                    if(!numeT) continue;
                    const { data: terenDB } = await db.from('terenuri').select('*').eq('nume', numeT).single();
                    if (terenDB) {
                        selectManualTeren.innerHTML += `<option value="${terenDB.nume}" data-sport="${terenDB.sport}">${terenDB.nume}</option>`;
                        
                        // Modificat margin-bottom să fie 0, lăsăm Grid-ul parent să dea distanțele
                        containerPanouri.innerHTML += `
                            <div class="modal-continut" style="position: static; border-color: #3b82f6; display: flex; flex-direction: column; justify-content: space-between; height: 100%; margin: 0;">
                                <div>
                                    <h2 class="titlu-modal" style="font-size: 20px; text-align: left; color: #3b82f6;">⚙️ Setări (${terenDB.nume})</h2>
                                </div>
                                
                                <div class="formular-auth" style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px; display: flex; flex-direction: column; flex: 1;">
                                    
                                    <div class="grup-input" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1);">
                                        <div style="display:flex; justify-content:space-between; align-items:center;">
                                            <label style="margin:0; font-weight:bold; color: ${terenDB.este_activ !== false ? '#22c55e' : '#ef4444'};">
                                                ${terenDB.este_activ !== false ? '✅ Terenul este Vizibil' : '❌ Terenul este Ascuns'}
                                            </label>
                                            <input type="checkbox" id="activ-${terenDB.id}" ${terenDB.este_activ !== false ? 'checked' : ''} style="width:20px;height:20px; cursor:pointer;">
                                        </div>
                                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Debifează pentru a ascunde complet terenul de clienți.</p>
                                    </div>

                                    <div class="grup-input" style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(239, 68, 68, 0.3);">
                                        <label style="color: #ef4444; font-weight: bold; font-size: 15px;">⛔ Blochează / Deblochează o zi</label>
                                        <div style="display: flex; gap: 5px; flex-wrap: wrap; margin-top: 5px;">
                                            <input type="date" id="data-blocare-${terenDB.id}" style="background: rgba(0,0,0,0.5); color: white; padding: 8px; border-radius: 5px; flex: 1; min-width: 120px;">
                                            <button type="button" onclick="blocheazaZiuaIntreaga('${terenDB.nume}', ${terenDB.id}, event)" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Închide</button>
                                            <button type="button" onclick="deblocheazaZiua('${terenDB.nume}', ${terenDB.id}, event)" style="background: #22c55e; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Deblochează</button>
                                        </div>
                                    </div>

                                    <div class="grup-input" style="margin-bottom: 15px; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; width: 100%; box-sizing: border-box;">
                                        <label style="margin-bottom: 8px; display: block; color: #a1eafb;">📸 Schimbă Poza Terenului</label>
                                        <div style="display: flex; gap: 10px; align-items: center; width: 100%;">
                                            <img src="${terenDB.poza || 'assets/imagini/default.png'}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); flex-shrink: 0;">
                                            <input type="file" id="poza-${terenDB.id}" accept="image/*" style="background: rgba(0,0,0,0.5); color: white; padding: 8px; border-radius: 5px; flex: 1; min-width: 0; cursor: pointer; border: 1px dashed rgba(255,255,255,0.2);">
                                        </div>
                                    </div>

                                    <div class="grup-input"><label>Preț Teren (Lei)</label><input type="number" id="pret-${terenDB.id}" value="${terenDB.pret}"></div>
                                    <div class="grup-input" style="display:flex; justify-content:space-between; margin-top:10px;"><label>Ofertă Minge?</label><input type="checkbox" id="minge-${terenDB.id}" ${terenDB.optiune_minge ? 'checked' : ''} style="width:20px;height:20px;"></div>
                                    <div class="grup-input" style="margin-top:10px;"><label>Preț Minge (Lei)</label><input type="number" id="pret-minge-${terenDB.id}" value="${terenDB.pret_minge || 15}"></div>
                                    
                                    <div style="flex: 1;"></div>
                                    <button id="btn-save-${terenDB.id}" type="button" onclick="salveazaSetariTeren(${terenDB.id}, '${terenDB.nume}')" class="buton-rezervare" style="background: #3b82f6; margin-top: 15px;">💾 Salvează Setările pt ${terenDB.nume}</button>
                                </div>
                            </div>
                        `;
                    }
                }
            }
            
            window.initializeazaTabel(terenuriPtTabel);

        } else {
            alert("Parolă incorectă sau eroare!");
        }
        btn.innerText = "Intră în Sistem";
    });

    window.blocheazaZiuaIntreaga = async function(numeTeren, idTeren, event) {
        const dataInput = document.getElementById(`data-blocare-${idTeren}`).value;
        if (!dataInput) return alert("Alege o dată din calendar mai întâi!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!confirm(`Ești sigur că blochezi complet terenul ${numeTeren} pe data de ${dataFormata}?`)) return;

        const btn = event.target; const textVechi = btn.innerText; btn.innerText = "Se blochează..."; btn.disabled = true;
        const ore = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        
        const { data: oreExistente } = await db.from('rezervari').select('ora').eq('teren', numeTeren).eq('data_str', dataFormata).neq('stare', 'anulata');
        const oreOcupate = oreExistente ? oreExistente.map(r => r.ora) : [];
        
        const oreDeBlocat = ore.filter(o => !oreOcupate.includes(o)).map(oraLibera => ({
            sport: "Blocat", teren: numeTeren, data_str: dataFormata, ora: oraLibera,
            pret_total: "0 Lei", email_client: "Teren Blocat", stare: 'activa', timestamp_start: Date.now()
        }));

        if (oreDeBlocat.length > 0) {
            const { error } = await db.from('rezervari').insert(oreDeBlocat);
            if (error) { alert("Eroare: " + error.message); btn.innerText = textVechi; btn.disabled = false; return; }
        }
        
        alert(`✅ Ziua a fost blocată!`); btn.innerText = textVechi; btn.disabled = false;
        if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); 
        if (typeof window.incarcaTabelProgram === 'function') window.incarcaTabelProgram(); 
    };

    window.deblocheazaZiua = async function(numeTeren, idTeren, event) {
        const dataInput = document.getElementById(`data-blocare-${idTeren}`).value;
        if (!dataInput) return alert("Alege o dată!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!confirm(`Deblochezi terenul ${numeTeren} pe ${dataFormata}?`)) return;

        const btn = event.target; const textVechi = btn.innerText; btn.innerText = "Așteaptă..."; btn.disabled = true;
        const { error } = await db.from('rezervari').delete().eq('teren', numeTeren).eq('data_str', dataFormata).eq('email_client', 'Teren Blocat');
        if (!error) { 
            alert(`✅ Ziua deblocată!`); 
            if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); 
            if (typeof window.incarcaTabelProgram === 'function') window.incarcaTabelProgram(); 
        } 
        else alert("Eroare: " + error.message);
        btn.innerText = textVechi; btn.disabled = false;
    };

    window.salveazaSetariTeren = async function(idDB, numeTeren) {
        const btnSave = document.getElementById(`btn-save-${idDB}`);
        if(btnSave) { btnSave.innerText = "⏳ Se salvează..."; btnSave.disabled = true; }

        const pret = document.getElementById(`pret-${idDB}`).value;
        const minge = document.getElementById(`minge-${idDB}`).checked;
        const pretMinge = document.getElementById(`pret-minge-${idDB}`).value;
        const esteActiv = document.getElementById(`activ-${idDB}`).checked;
        const fileInput = document.getElementById(`poza-${idDB}`);

        let dateDeUpdatat = { pret: parseInt(pret), optiune_minge: minge, pret_minge: parseInt(pretMinge), este_activ: esteActiv };

        if (fileInput && fileInput.files && fileInput.files[0]) {
            try { dateDeUpdatat.poza = await window.comprimaImagine(fileInput.files[0]); } 
            catch(e) {
                if(btnSave) { btnSave.innerText = `💾 Salvează Setările pt ${numeTeren}`; btnSave.disabled = false; }
                return alert("Eroare la procesarea pozei: " + e.message);
            }
        }

        const { error } = await db.from('terenuri').update(dateDeUpdatat).eq('id', idDB);
        
        if (!error) { alert(`✅ Setări salvate!`); document.getElementById('login-admin-btn').click(); }
        else alert("Eroare: " + error.message);
        
        if(btnSave) { btnSave.innerText = `💾 Salvează Setările pt ${numeTeren}`; btnSave.disabled = false; }
    };

    document.getElementById('btn-rezervare-manuala')?.addEventListener('click', async () => {
        const selectBox = document.getElementById('manual-teren');
        const terenAles = selectBox.value;
        const sportAles = selectBox.options[selectBox.selectedIndex].getAttribute('data-sport');
        const client = document.getElementById('manual-client').value.trim();
        const dataInput = document.getElementById('manual-data').value;
        const oraAlesa = document.getElementById('manual-ora').value;
        const pret = document.getElementById('manual-pret').value.trim();
        
        if (!client || !dataInput || !pret) return alert("Completează câmpurile!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

        document.getElementById('btn-rezervare-manuala').innerText = "Se verifică...";
        const { data: dublura } = await db.from('rezervari').select('id').eq('teren', terenAles).eq('data_str', dataFormata).eq('ora', oraAlesa).neq('stare', 'anulata');
        if (dublura && dublura.length > 0) {
            document.getElementById('btn-rezervare-manuala').innerText = window.lang === 'hu' ? "➕ Mentés" : "➕ Salvează";
            return alert(`❌ Ora ${oraAlesa} pe ${dataFormata} este rezervată!`);
        }

        const { error } = await db.from('rezervari').insert([{
            sport: sportAles, teren: terenAles, data_str: dataFormata, ora: oraAlesa,
            pret_total: pret + (window.lang === 'hu' ? " RON (Kézi)" : " Lei (Manual)"), email_client: client, stare: 'activa', timestamp_start: Date.now()
        }]);
        if (!error) { 
            alert("✅ Rezervare adăugată!"); 
            if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); 
            if (typeof window.incarcaTabelProgram === 'function') window.incarcaTabelProgram(); 
        } 
        else alert("Eroare: " + error.message);
        document.getElementById('btn-rezervare-manuala').innerText = window.lang === 'hu' ? "➕ Mentés" : "➕ Salvează";
    });

    document.getElementById('btn-adauga-teren')?.addEventListener('click', async () => {
        const nume = document.getElementById('teren-nume').value.trim();
        const sport = document.getElementById('teren-sport').value;
        const pret = document.getElementById('teren-pret').value.trim();
        const minge = document.getElementById('teren-minge').checked;
        const pretMinge = document.getElementById('teren-pret-minge').value.trim();
        const locatie = document.getElementById('teren-locatie').value.trim();
        const fileInput = document.getElementById('teren-poza');

        if (!nume || !pret || !locatie) return alert("Completează câmpurile!");
        const btn = document.getElementById('btn-adauga-teren'); btn.innerText = "⏳ Se salvează..."; btn.disabled = true;

        let pozaBase64 = null;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            try { pozaBase64 = await window.comprimaImagine(fileInput.files[0]); }
            catch(e) { alert("Eroare poză!"); btn.innerText = "➕ Adaugă Teren"; btn.disabled = false; return; }
        }

        const { error } = await db.from('terenuri').insert([{
            nume, sport, pret: parseInt(pret), optiune_minge: minge, pret_minge: parseInt(pretMinge), locatie, poza: pozaBase64, este_activ: true
        }]);
        
        if (error) alert("❌ Eroare DB: " + error.message);
        else { alert("✅ Teren adăugat!"); window.incarcaTerenuriAdmin(); window.actualizeazaBifeTerenuri(); }
        btn.innerText = "➕ Adaugă Teren"; btn.disabled = false;
    });

    document.getElementById('creeaza-supervisor-btn')?.addEventListener('click', async () => {
        const nume = document.getElementById('super-nume').value.trim();
        const parola = document.getElementById('super-parola').value.trim();
        const esteSuper = document.getElementById('check-super-admin').checked;
        const listaTerenuri = Array.from(document.querySelectorAll('.check-teren-alocat:checked')).map(cb => cb.value).join(','); 

        if (!nume || !parola) return alert("Completează datele!");
        if (!esteSuper && listaTerenuri === "") return alert("Bifează un teren!");

        const btn = document.getElementById('creeaza-supervisor-btn'); btn.innerText = "Se verifică...";
        const { data: verificare } = await db.from('users_admin').select('id').eq('parola', parola);
        if (verificare && verificare.length > 0) { btn.innerText = "Creează Angajat"; return alert("❌ Parola există deja!"); }

        const { error } = await db.from('users_admin').insert([{ nume_admin: nume, parola, is_super: esteSuper, terenuri: esteSuper ? "ALL" : listaTerenuri }]);
        if (!error) { alert(`✅ Cont creat!`); document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false); } 
        else alert("Eroare: " + error.message);
        btn.innerText = "Creează Angajat";
    });

    window.reincarcaIstoricAdmin = async function() {
        const container = document.getElementById('container-istoric');
        if (!container) return;
        container.style.display = 'flex'; // Lista verticala cu scroll interior
        container.innerHTML = "<p style='color: white; text-align: center;'>Se descarcă rezervările... ⏳</p>";
        
        // Preluăm clienții pentru a corela datele (nume, telefon) cu rezervările web
        const { data: clientiDB } = await db.from('clienti').select('*');
        const totiClientii = clientiDB || [];

        const { data, error } = await db.from('rezervari').select('*');
        if (error || !data || data.length === 0) { container.innerHTML = "<p style='color: white;'>Nu există nicio rezervare în sistem.</p>"; return; }

        data.sort((a, b) => b.id - a.id);
        let html = ""; let rezervariGasite = 0;

        const terenurileLui = contLogatGlobal.is_super ? [] : (contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : []);
        const acum = new Date();

        const txtActiva = window.lang === 'hu' ? 'AKTÍV' : 'ACTIVĂ';
        const txtAnulata = window.lang === 'hu' ? 'TÖRÖLVE' : 'ANULATĂ';
        const txtBlocata = window.lang === 'hu' ? 'ZÁRVA' : 'ZI BLOCATĂ';
        const txtFinalizata = window.lang === 'hu' ? 'BEFEJEZVE' : 'FINALIZATĂ';
        const txtCand = window.lang === 'hu' ? 'Mikor' : 'Când';
        const txtPret = window.lang === 'hu' ? 'Ár' : 'Preț';
        const txtBtnAnuleaza = window.lang === 'hu' ? '❌ Törlés' : '❌ Anulează';

        data.forEach(r => {
            if (!contLogatGlobal.is_super && !terenurileLui.includes(r.teren)) return;
            rezervariGasite++;

            let esteTrecuta = false;
            const matchData = r.data_str.match(/\d{2}\.\d{2}/); 
            if (matchData && r.stare !== 'anulata') {
                const [zi, luna] = matchData[0].split('.');
                const oraRezervareNumar = parseInt(r.ora.split(':')[0]);
                let anCurent = acum.getFullYear();
                if (acum.getMonth() === 11 && parseInt(luna) === 1) anCurent++;
                const dataTerminarii = new Date(anCurent, parseInt(luna) - 1, parseInt(zi), oraRezervareNumar, 59, 59);
                if (dataTerminarii < acum) esteTrecuta = true;
            }

            const eAnulata = r.stare === 'anulata';
            const eBlocaj = r.email_client === 'Teren Blocat';

            let culoareBorder = '#444'; let culoareTitlu = '#22c55e';
            let textStare = `<span style="color: #22c55e; font-weight: bold;">[${txtActiva}]</span>`;
            let butonAnulare = ''; let opacitate = '1';

            if (eAnulata) { culoareBorder = '#ef4444'; culoareTitlu = '#ef4444'; opacitate = '0.7'; textStare = `<span style="color: #ef4444; font-weight: bold;">[${txtAnulata}]</span>`; } 
            else if (eBlocaj) { culoareBorder = '#ef4444'; culoareTitlu = '#ef4444'; textStare = `<span style="color: #ef4444; font-weight: bold;">[${txtBlocata}]</span>`; } 
            else if (esteTrecuta) { culoareBorder = '#6b7280'; culoareTitlu = '#9ca3af'; opacitate = '0.85'; textStare = `<span style="color: #9ca3af; font-weight: bold;">[${txtFinalizata}]</span>`; } 
            else { butonAnulare = `<button onclick="anuleazaRezervareAdmin(${r.id})" style="margin-top: 10px; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; width: 100%;">${txtBtnAnuleaza}</button>`; }

            const dataTradusa = (typeof window.traduData === 'function') ? window.traduData(r.data_str) : r.data_str;

            let textClientAfisat = r.email_client;
            let contGasit = totiClientii.find(c => c.email === r.email_client);
            
            if (contGasit) {
                let infoClientList = [];
                if(contGasit.nume) infoClientList.push(`Nume: ${contGasit.nume}`);
                if(contGasit.telefon) infoClientList.push(`Tel: ${contGasit.telefon}`);
                infoClientList.push(`Email: ${contGasit.email}`);
                textClientAfisat = infoClientList.join(' | ');
            } else if (!eBlocaj) {
                textClientAfisat = `${r.email_client} (Manual)`;
            } else {
                textClientAfisat = "Sistem Blocare";
            }

            html += `
                <div style="background: rgba(255,255,255,0.1); border: 1px solid ${culoareBorder}; padding: 15px; margin: 0; border-radius: 8px; color: white; opacity: ${opacitate}; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h4 style="margin: 0 0 10px 0; color: ${culoareTitlu};">⚽ ${r.sport} - ${r.teren} ${textStare}</h4>
                        <p style="margin: 5px 0;"><strong>📅 ${txtCand}:</strong> ${dataTradusa} ( ${r.ora} )</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>👤 Client:</strong> ${textClientAfisat}</p>
                        <p style="margin: 5px 0;"><strong>💰 ${txtPret}:</strong> ${r.pret_total}</p>
                    </div>
                    ${butonAnulare}
                </div>`;
        });
        
        container.innerHTML = rezervariGasite === 0 ? "<p style='color: white;'>Nu există date.</p>" : html;
    };
    
    document.getElementById('btn-istoric')?.addEventListener('click', window.reincarcaIstoricAdmin);
});
