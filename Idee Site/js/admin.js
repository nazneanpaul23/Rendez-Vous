let contLogatGlobal = null; 

// --- FUNCTII GLOBALE ---
window.actualizeazaBifeTerenuri = async function() {
    const container = document.getElementById('container-checkbox-terenuri');
    if (!container) return;

    container.innerHTML = `
        <label><input type="checkbox" id="check-super-admin" value="ALL" style="margin-right: 5px;"> 👑 SUPER ADMIN (Acces Total)</label>
        <hr style="border-color: rgba(255,255,255,0.1); width: 100%; margin: 5px 0;">
    `;
    
    const { data } = await db.from('terenuri').select('nume, sport');
    if (data) {
        data.forEach(t => {
            container.innerHTML += `<label><input type="checkbox" class="check-teren-alocat" value="${t.nume}" style="margin-right: 5px;"> ${t.nume} (${t.sport})</label>`;
        });
    }
};

window.incarcaTerenuriAdmin = async function() {
    const container = document.getElementById('container-lista-terenuri');
    if (!container) return;
    container.innerHTML = "<p style='color: white;'>Se descarcă terenurile din cloud...</p>";
    
    const { data } = await db.from('terenuri').select('*');
    if (!data || data.length === 0) {
        container.innerHTML = "<p style='color: #ccc;'>Niciun teren adăugat.</p>"; return;
    }
    
    let html = "";
    data.forEach(t => {
        let textMinge = t.optiune_minge ? `Da (${t.pret_minge || 15} Lei)` : 'Nu';
        html += `
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #f59e0b;">${t.sport} - ${t.nume}</h4>
                    <p style="margin: 0; font-size: 13px; color: #ccc;">Preț: ${t.pret} Lei/oră | Minge: ${textMinge}</p>
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
        if (!error && typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin();
        else if (error) alert("Eroare la anulare: " + error.message);
    }
};

// --- LOGICA PRINCIPALĂ A PAGINII ---
document.addEventListener('DOMContentLoaded', () => {

    // 1. AUTENTIFICARE
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
            document.getElementById('text-rol-activ').innerText = `Logat ca: ${contLogatGlobal.nume_admin}`;

            if (contLogatGlobal.is_super) {
                document.getElementById('zona-super-admin').style.display = 'flex';
                window.incarcaTerenuriAdmin();
                window.actualizeazaBifeTerenuri(); 
            } else {
                // E Admin Simplu
                document.getElementById('zona-admin-simplu').style.display = 'flex';
                const listaTerenuriAlocate = contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : []; 

                const containerPanouri = document.getElementById('container-panouri-multiple');
                const selectManualTeren = document.getElementById('manual-teren');
                containerPanouri.innerHTML = ''; selectManualTeren.innerHTML = '';

                for (let numeT of listaTerenuriAlocate) {
                    if(!numeT) continue;
                    const { data: terenDB } = await db.from('terenuri').select('*').eq('nume', numeT).single();
                    if (terenDB) {
                        selectManualTeren.innerHTML += `<option value="${terenDB.nume}" data-sport="${terenDB.sport}">${terenDB.nume}</option>`;
                        
                        containerPanouri.innerHTML += `
                            <div class="modal-continut" style="position: static; border-color: #3b82f6; margin-bottom: 20px;">
                                <h2 class="titlu-modal" style="font-size: 20px; text-align: left; color: #3b82f6;">⚙️ Setări (${terenDB.nume})</h2>
                                <div class="formular-auth" style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                                    
                                    <!-- 🟢 ASCUNDERE TOTALĂ TEREN (ON/OFF) -->
                                    <div class="grup-input" style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1);">
                                        <div style="display:flex; justify-content:space-between; align-items:center;">
                                            <label style="margin:0; font-weight:bold; color: ${terenDB.este_activ !== false ? '#22c55e' : '#ef4444'};">
                                                ${terenDB.este_activ !== false ? '✅ Terenul este Vizibil' : '❌ Terenul este Ascuns'}
                                            </label>
                                            <input type="checkbox" id="activ-${terenDB.id}" ${terenDB.este_activ !== false ? 'checked' : ''} style="width:20px;height:20px; cursor:pointer;">
                                        </div>
                                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #ccc;">Debifează pentru a ascunde complet terenul de clienți.</p>
                                    </div>

                                    <!-- 🔴 BLOCAREA ȘI DEBLOCAREA UNEI ZILE -->
                                    <div class="grup-input" style="background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid rgba(239, 68, 68, 0.3);">
                                        <label style="color: #ef4444; font-weight: bold; font-size: 15px;">⛔ Blochează / Deblochează o zi</label>
                                        <p style="margin: 5px 0 10px 0; font-size: 12px; color: #ccc;">Alege o dată. Închide ziua pentru a opri rezervările, sau Deblochează pentru a le permite din nou.</p>
                                        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                                            <input type="date" id="data-blocare-${terenDB.id}" style="background: rgba(0,0,0,0.5); color: white; padding: 8px; border-radius: 5px; flex: 1; min-width: 120px;">
                                            <button type="button" onclick="blocheazaZiuaIntreaga('${terenDB.nume}', ${terenDB.id}, event)" style="background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Închide</button>
                                            <button type="button" onclick="deblocheazaZiua('${terenDB.nume}', ${terenDB.id}, event)" style="background: #22c55e; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Deblochează</button>
                                        </div>
                                    </div>

                                    <!-- Schimbare Poză și Prețuri -->
                                    <div class="grup-input" style="margin-bottom: 10px;">
                                        <label>Link Poză Nouă</label>
                                        <input type="text" id="poza-${terenDB.id}" value="${terenDB.poza || ''}">
                                    </div>

                                    <div class="grup-input"><label>Preț Teren (Lei)</label><input type="number" id="pret-${terenDB.id}" value="${terenDB.pret}"></div>
                                    <div class="grup-input" style="display:flex; justify-content:space-between; margin-top:10px;"><label>Ofertă Minge?</label><input type="checkbox" id="minge-${terenDB.id}" ${terenDB.optiune_minge ? 'checked' : ''} style="width:20px;height:20px;"></div>
                                    <div class="grup-input" style="margin-top:10px;"><label>Preț Minge (Lei)</label><input type="number" id="pret-minge-${terenDB.id}" value="${terenDB.pret_minge || 15}"></div>
                                    
                                    <button type="button" onclick="salveazaSetariTeren(${terenDB.id}, '${terenDB.nume}')" class="buton-rezervare" style="background: #3b82f6; margin-top: 15px;">💾 Salvează Setările pt ${terenDB.nume}</button>
                                </div>
                            </div>
                        `;
                    }
                }
            }
        } else {
            alert("Parolă incorectă sau eroare!");
        }
        btn.innerText = "Intră în Sistem";
    });

    // 🔴 BLOCARE ZI
    window.blocheazaZiuaIntreaga = async function(numeTeren, idTeren, event) {
        const dataInput = document.getElementById(`data-blocare-${idTeren}`).value;
        if (!dataInput) return alert("Alege o dată din calendar mai întâi!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!confirm(`Ești sigur că blochezi complet terenul ${numeTeren} pe data de ${dataFormata}?`)) return;

        const btn = event.target; const textVechi = btn.innerText; btn.innerText = "Se blochează..."; btn.disabled = true;
        const ore = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"];
        
        // Luăm dintr-un foc toate orele deja ocupate de pe acel teren în acea zi
        const { data: oreExistente } = await db.from('rezervari')
            .select('ora')
            .eq('teren', numeTeren)
            .eq('data_str', dataFormata)
            .neq('stare', 'anulata');
            
        const oreOcupate = oreExistente ? oreExistente.map(r => r.ora) : [];
        
        // Generăm obiectele doar pentru orele libere
        const oreDeBlocat = ore.filter(o => !oreOcupate.includes(o)).map(oraLibera => ({
            sport: "Blocat", teren: numeTeren, data_str: dataFormata, ora: oraLibera,
            pret_total: "0 Lei", email_client: "Teren Blocat", stare: 'activa', timestamp_start: Date.now()
        }));

        if (oreDeBlocat.length > 0) {
            const { error } = await db.from('rezervari').insert(oreDeBlocat);
            if (error) {
                alert("Eroare la blocarea zilei: " + error.message);
                btn.innerText = textVechi; btn.disabled = false;
                return;
            }
        }
        
        alert(`✅ Ziua de ${dataFormata} a fost blocată cu succes!`); btn.innerText = textVechi; btn.disabled = false;
        if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); 
    };

    // 🟢 DEBLOCARE ZI
    window.deblocheazaZiua = async function(numeTeren, idTeren, event) {
        const dataInput = document.getElementById(`data-blocare-${idTeren}`).value;
        if (!dataInput) return alert("Alege o dată din calendar mai întâi!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (!confirm(`Ești sigur că vrei să DEBLOCHEZI terenul ${numeTeren} pe data de ${dataFormata}?`)) return;

        const btn = event.target; const textVechi = btn.innerText; btn.innerText = "Așteaptă..."; btn.disabled = true;
        const { error } = await db.from('rezervari').delete().eq('teren', numeTeren).eq('data_str', dataFormata).eq('email_client', 'Teren Blocat');
        if (!error) { alert(`✅ Ziua a fost deblocată!`); if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); } 
        else alert("Eroare la deblocare: " + error.message);
        btn.innerText = textVechi; btn.disabled = false;
    };

    // SALVARE SETĂRI
    window.salveazaSetariTeren = async function(idDB, numeTeren) {
        const pret = document.getElementById(`pret-${idDB}`).value;
        const minge = document.getElementById(`minge-${idDB}`).checked;
        const pretMinge = document.getElementById(`pret-minge-${idDB}`).value;
        const poza = document.getElementById(`poza-${idDB}`).value.trim();
        const esteActiv = document.getElementById(`activ-${idDB}`).checked;

        const { error } = await db.from('terenuri').update({ 
            pret: parseInt(pret), optiune_minge: minge, pret_minge: parseInt(pretMinge), poza: poza, este_activ: esteActiv
        }).eq('id', idDB);
        if (!error) { alert(`✅ Setările pentru ${numeTeren} au fost actualizate!`); document.getElementById('login-admin-btn').click(); }
        else alert("Eroare: " + error.message);
    };

    // 3. ADMIN SIMPLU: ADAUGARE REZERVARE MANUALĂ
    document.getElementById('btn-rezervare-manuala')?.addEventListener('click', async () => {
        const selectBox = document.getElementById('manual-teren');
        const terenAles = selectBox.value;
        const sportAles = selectBox.options[selectBox.selectedIndex].getAttribute('data-sport');
        const client = document.getElementById('manual-client').value.trim();
        const dataInput = document.getElementById('manual-data').value;
        const oraAlesa = document.getElementById('manual-ora').value;
        const pret = document.getElementById('manual-pret').value.trim();
        
        if (!client || !dataInput || !pret) return alert("Completează toate câmpurile!");
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const dataFormata = `${zile[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

        document.getElementById('btn-rezervare-manuala').innerText = "Se verifică...";
        const { data: dublura } = await db.from('rezervari').select('id').eq('teren', terenAles).eq('data_str', dataFormata).eq('ora', oraAlesa).neq('stare', 'anulata');
        if (dublura && dublura.length > 0) {
            document.getElementById('btn-rezervare-manuala').innerText = "➕ Salvează Rezervarea";
            return alert(`❌ Ora ${oraAlesa} pe ${dataFormata} este deja rezervată!`);
        }

        const { error } = await db.from('rezervari').insert([{
            sport: sportAles, teren: terenAles, data_str: dataFormata, ora: oraAlesa,
            pret_total: pret + " Lei (Manual)", email_client: client, stare: 'activa', timestamp_start: Date.now()
        }]);
        if (!error) { alert("✅ Rezervare adăugată cu succes!"); if (typeof window.reincarcaIstoricAdmin === 'function') window.reincarcaIstoricAdmin(); } 
        else alert("Eroare: " + error.message);
        document.getElementById('btn-rezervare-manuala').innerText = "➕ Salvează Rezervarea";
    });

    // 4. SUPER ADMIN: ADAUGARE TEREN NOU
    document.getElementById('btn-adauga-teren')?.addEventListener('click', async () => {
        const nume = document.getElementById('teren-nume').value.trim();
        const sport = document.getElementById('teren-sport').value;
        const pret = document.getElementById('teren-pret').value.trim();
        const minge = document.getElementById('teren-minge').checked;
        const pretMinge = document.getElementById('teren-pret-minge').value.trim();
        const locatie = document.getElementById('teren-locatie').value.trim();
        const poza = document.getElementById('teren-poza').value.trim();
        if (!nume || !pret || !locatie || !poza) return alert("Completează toate câmpurile!");
        
        const btn = document.getElementById('btn-adauga-teren'); btn.innerText = "Se salvează..."; btn.disabled = true;
        const { error } = await db.from('terenuri').insert([{
            nume, sport, pret: parseInt(pret), optiune_minge: minge, pret_minge: parseInt(pretMinge), locatie, poza, este_activ: true
        }]);
        if (error) alert("❌ Eroare DB: " + error.message);
        else { alert("✅ Teren adăugat!"); window.incarcaTerenuriAdmin(); window.actualizeazaBifeTerenuri(); }
        btn.innerText = "➕ Adaugă Teren"; btn.disabled = false;
    });

    // 5. SUPER ADMIN: CREARE CONT ANGAJAT
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

    // 6. ISTORIC REZERVĂRI INTELIGENT
    window.reincarcaIstoricAdmin = async function() {
        const container = document.getElementById('container-istoric');
        if (!container) return;
        container.style.display = 'flex';
        container.innerHTML = "<p style='color: white;'>Se descarcă rezervările... ⏳</p>";
        
        const { data, error } = await db.from('rezervari').select('*');
        if (error || !data || data.length === 0) {
            container.innerHTML = "<p style='color: white;'>Nu există nicio rezervare în sistem.</p>"; return;
        }

        data.sort((a, b) => b.id - a.id);
        let html = ""; let rezervariGasite = 0;

        const terenurileLui = contLogatGlobal.is_super ? [] : (contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : []);
        const acum = new Date();

        data.forEach(r => {
            if (!contLogatGlobal.is_super && !terenurileLui.includes(r.teren)) return;
            rezervariGasite++;

            // Verificăm timpul
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

            // CULORI ȘI TEXTE DINAMICE
            let culoareBorder = '#444';
            let culoareTitlu = '#22c55e'; // Verde standard (Activ)
            let textStare = `<span style="color: #22c55e; font-weight: bold;">[ACTIVĂ]</span>`;
            let butonAnulare = '';
            let opacitate = '1';

            if (eAnulata) {
                culoareBorder = '#ef4444'; culoareTitlu = '#ef4444'; opacitate = '0.7';
                textStare = `<span style="color: #ef4444; font-weight: bold;">[ANULATĂ]</span>`;
            } else if (eBlocaj) {
                culoareBorder = '#ef4444'; culoareTitlu = '#ef4444';
                textStare = `<span style="color: #ef4444; font-weight: bold;">[ZI BLOCATĂ]</span>`;
            } else if (esteTrecuta) {
                culoareBorder = '#6b7280'; culoareTitlu = '#9ca3af'; opacitate = '0.85'; // Gri
                textStare = `<span style="color: #9ca3af; font-weight: bold;">[FINALIZATĂ]</span>`;
            } else {
                // Dacă e ACTIVĂ și în VIITOR, arătăm butonul de anulare
                butonAnulare = `<button onclick="anuleazaRezervareAdmin(${r.id})" style="margin-top: 10px; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">❌ Anulează</button>`;
            }

            // Aici folosim functia globală de traducere din app.js (dacă există)
            const dataTradusa = (typeof window.traduData === 'function') ? window.traduData(r.data_str) : r.data_str;

            html += `
                <div style="background: rgba(255,255,255,0.1); border: 1px solid ${culoareBorder}; padding: 15px; margin-bottom: 10px; border-radius: 8px; color: white; opacity: ${opacitate};">
                    <h4 style="margin: 0 0 10px 0; color: ${culoareTitlu};">⚽ ${r.sport} - ${r.teren} ${textStare}</h4>
                    <p style="margin: 5px 0;"><strong>📅 Când:</strong> ${dataTradusa} la ora ${r.ora}</p>
                    <p style="margin: 5px 0;"><strong>👤 Client:</strong> ${r.email_client}</p>
                    <p style="margin: 5px 0;"><strong>💰 Preț:</strong> ${r.pret_total}</p>
                    ${butonAnulare}
                </div>`;
        });
        
        container.innerHTML = rezervariGasite === 0 ? "<p style='color: white;'>Nu aveți nicio rezervare pentru terenurile alocate.</p>" : html;
    };
    
    document.getElementById('btn-istoric')?.addEventListener('click', window.reincarcaIstoricAdmin);
});
