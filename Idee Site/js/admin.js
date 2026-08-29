let contLogatGlobal = null; 

// --- FUNCTII GLOBALE ---
window.actualizeazaBifeTerenuri = async function() {
    const container = document.getElementById('container-checkbox-terenuri');
    if (!container) return;

    // Păstrăm bifa de Super Admin curată
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

// Când adminul anulează, acum se SCHIMBĂ STAREA, nu se mai șterge!
window.anuleazaRezervareAdmin = async function(id) {
    if (confirm("Ești sigur că vrei să anulezi rezervarea? Ea va apărea marcată cu roșu în istoric.")) {
        const { error } = await db.from('rezervari').update({ stare: 'anulata' }).eq('id', id);
        if (!error) document.getElementById('btn-istoric').click();
        else alert("Eroare la anulare: " + error.message);
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
                // E Admin Simplu - Generăm interfața dinamică pt MULTIPLE TERENURI!
                document.getElementById('zona-admin-simplu').style.display = 'flex';
                const listaTerenuriAlocate = contLogatGlobal.terenuri.split(','); // "Bernabeu,Camp Nou"

                const containerPanouri = document.getElementById('container-panouri-multiple');
                const selectManualTeren = document.getElementById('manual-teren');
                containerPanouri.innerHTML = ''; selectManualTeren.innerHTML = '';

                // Tragem din DB datele terenurilor lui
                for (let numeT of listaTerenuriAlocate) {
                    if(!numeT) continue;
                    const { data: terenDB } = await db.from('terenuri').select('*').eq('nume', numeT).single();
                    if (terenDB) {
                        selectManualTeren.innerHTML += `<option value="${terenDB.nume}" data-sport="${terenDB.sport}">${terenDB.nume}</option>`;
                        
                        containerPanouri.innerHTML += `
                            <div class="modal-continut" style="position: static; border-color: #3b82f6; margin-bottom: 20px;">
                                <h2 class="titlu-modal" style="font-size: 20px; text-align: left; color: #3b82f6;">⚙️ Setări (${terenDB.nume})</h2>
                                <div class="formular-auth" style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                                    <div class="grup-input"><label>Preț Teren (Lei)</label><input type="number" id="pret-${terenDB.id}" value="${terenDB.pret}"></div>
                                    <div class="grup-input" style="display:flex; justify-content:space-between; margin-top:10px;"><label>Ofertă Minge?</label><input type="checkbox" id="minge-${terenDB.id}" ${terenDB.optiune_minge ? 'checked' : ''} style="width:20px;height:20px;"></div>
                                    <div class="grup-input" style="margin-top:10px;"><label>Preț Minge (Lei)</label><input type="number" id="pret-minge-${terenDB.id}" value="${terenDB.pret_minge || 15}"></div>
                                    <button type="button" onclick="salveazaSetariTeren(${terenDB.id}, '${terenDB.nume}')" class="buton-rezervare" style="background: #3b82f6; margin-top: 10px;">💾 Salvează Setările pt ${terenDB.nume}</button>
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

    // Funcție atașată butoanelor dinamice pt salvare setări (Admin Simplu)
    window.salveazaSetariTeren = async function(idDB, numeTeren) {
        const pret = document.getElementById(`pret-${idDB}`).value;
        const minge = document.getElementById(`minge-${idDB}`).checked;
        const pretMinge = document.getElementById(`pret-minge-${idDB}`).value;

        const { error } = await db.from('terenuri').update({ 
            pret: parseInt(pret), optiune_minge: minge, pret_minge: parseInt(pretMinge) 
        }).eq('id', idDB);
            
        if (!error) alert(`✅ Setările pentru ${numeTeren} au fost actualizate cu succes!`);
        else alert("Eroare la salvare: " + error.message);
    };

    // 3. ADMIN SIMPLU: ADAUGARE REZERVARE MANUALĂ CU VERIFICARE SUPRAPUNERI
    document.getElementById('btn-rezervare-manuala')?.addEventListener('click', async () => {
        const selectBox = document.getElementById('manual-teren');
        const terenAles = selectBox.value;
        const sportAles = selectBox.options[selectBox.selectedIndex].getAttribute('data-sport');
        const client = document.getElementById('manual-client').value.trim();
        const dataInput = document.getElementById('manual-data').value; // Vine "YYYY-MM-DD"
        const oraAlesa = document.getElementById('manual-ora').value;
        const pret = document.getElementById('manual-pret').value.trim();
        
        if (!client || !dataInput || !pret) return alert("Completează toate câmpurile!");
        
        // Conversie din "2026-08-08" în formatul DB "Sâm, 08.08"
        const d = new Date(dataInput);
        const zile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const ziText = zile[d.getDay()];
        const ziNumar = String(d.getDate()).padStart(2, '0');
        const lunaNumar = String(d.getMonth() + 1).padStart(2, '0');
        const dataFormata = `${ziText}, ${ziNumar}.${lunaNumar}`;

        document.getElementById('btn-rezervare-manuala').innerText = "Se verifică...";

        // VERIFICARE SUPRAPUNERI ÎN BAZA DE DATE
        const { data: dublura } = await db.from('rezervari')
            .select('id')
            .eq('teren', terenAles)
            .eq('data_str', dataFormata)
            .eq('ora', oraAlesa)
            .neq('stare', 'anulata'); // Dacă era una anulată, e ok să adăugăm peste ea

        if (dublura && dublura.length > 0) {
            document.getElementById('btn-rezervare-manuala').innerText = "➕ Salvează Rezervarea";
            return alert(`❌ ATENȚIE: Ora ${oraAlesa} pe data de ${dataFormata} este deja rezervată de un alt client!`);
        }

        const { error } = await db.from('rezervari').insert([{
            sport: sportAles,
            teren: terenAles, 
            data_str: dataFormata,
            ora: oraAlesa,
            pret_total: pret + " Lei (Manual)",
            email_client: client,
            stare: 'activa',
            timestamp_start: Date.now()
        }]);
        
        if (!error) {
            alert("✅ Rezervare adăugată cu succes!");
            document.getElementById('manual-client').value = ''; document.getElementById('manual-pret').value = '';
            document.getElementById('btn-istoric').click();
        } else alert("Eroare: " + error.message);
        
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

        if (!nume || !pret || !locatie || !poza) return alert("Completează toate câmpurile terenului!");
        
        const btn = document.getElementById('btn-adauga-teren'); btn.innerText = "Se salvează..."; btn.disabled = true;

        const { error } = await db.from('terenuri').insert([{
            nume: nume, sport: sport, pret: parseInt(pret),
            optiune_minge: minge, pret_minge: parseInt(pretMinge),
            locatie: locatie, poza: poza
        }]);

        if (error) alert("❌ Eroare DB: " + error.message);
        else {
            alert("✅ Teren adăugat!"); document.getElementById('teren-nume').value = '';
            window.incarcaTerenuriAdmin(); window.actualizeazaBifeTerenuri(); 
        }

        btn.innerText = "➕ Adaugă Teren"; btn.disabled = false;
    });

    // 5. SUPER ADMIN: CREARE CONT ANGAJAT NOU CU TERENURI MULTIPLE
    document.getElementById('creeaza-supervisor-btn')?.addEventListener('click', async () => {
        const nume = document.getElementById('super-nume').value.trim();
        const parola = document.getElementById('super-parola').value.trim();
        
        const esteSuper = document.getElementById('check-super-admin').checked;
        
        // Colectăm toate bifele
        const bifeTerenuri = document.querySelectorAll('.check-teren-alocat:checked');
        const listaTerenuri = Array.from(bifeTerenuri).map(cb => cb.value).join(','); // "Bernabeu,Camp Nou"

        if (!nume || !parola) return alert("Completează numele și parola!");
        if (!esteSuper && listaTerenuri === "") return alert("Bifează cel puțin un teren pentru acest angajat!");

        const btn = document.getElementById('creeaza-supervisor-btn'); btn.innerText = "Se verifică...";
        
        const { data: verificare } = await db.from('users_admin').select('id').eq('parola', parola);
        if (verificare && verificare.length > 0) { btn.innerText = "Creează Angajat"; return alert("❌ Parola este deja folosită!"); }

        const stringSalvat = esteSuper ? "ALL" : listaTerenuri;

        const { error } = await db.from('users_admin').insert([{
            nume_admin: nume, parola: parola, is_super: esteSuper, terenuri: stringSalvat 
        }]);

        if (!error) {
            alert(`✅ Cont creat!`); document.getElementById('super-nume').value = ''; document.getElementById('super-parola').value = '';
            document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
        } else alert("Eroare la creare: " + error.message);
        
        btn.innerText = "Creează Angajat";
    });

    // 6. ISTORIC REZERVĂRI
    document.getElementById('btn-istoric')?.addEventListener('click', async () => {
        const container = document.getElementById('container-istoric');
        container.style.display = 'flex';
        container.innerHTML = "<p style='color: white;'>Se descarcă rezervările... ⏳</p>";
        
        const { data, error } = await db.from('rezervari').select('*');
        if (error || !data || data.length === 0) {
            container.innerHTML = "<p style='color: white;'>Nu există nicio rezervare în sistem.</p>"; return;
        }

        data.sort((a, b) => b.id - a.id);
        let html = ""; let rezervariGasite = 0;

        // Dacă e admin simplu, are voie să vadă doar rezervările de la terenurile lui
        const terenurileLui = contLogatGlobal.is_super ? [] : contLogatGlobal.terenuri.split(',');

        data.forEach(r => {
            if (!contLogatGlobal.is_super && !terenurileLui.includes(r.teren)) return;

            rezervariGasite++;
            const culoare = (r.stare === 'anulata') ? '#ef4444' : '#22c55e'; // Roșu pt anulată
            const textStare = (r.stare === 'anulata') ? `<span style="color: #ef4444; font-weight: bold;">[ANULATĂ]</span>` : '';
            const butonAnulare = (r.stare === 'anulata') ? '' : `<button onclick="anuleazaRezervareAdmin(${r.id})" style="margin-top: 10px; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">❌ Anulează Rezervarea</button>`;

            html += `
                <div style="background: rgba(255,255,255,0.1); border: 1px solid ${(r.stare === 'anulata') ? '#ef4444' : '#444'}; padding: 15px; margin-bottom: 10px; border-radius: 8px; color: white; opacity: ${(r.stare === 'anulata') ? '0.7' : '1'};">
                    <h4 style="margin: 0 0 10px 0; color: ${culoare};">⚽ ${r.sport} - ${r.teren} ${textStare}</h4>
                    <p style="margin: 5px 0;"><strong>📅 Când:</strong> ${r.data_str} la ora ${r.ora}</p>
                    <p style="margin: 5px 0;"><strong>👤 Client:</strong> ${r.email_client}</p>
                    <p style="margin: 5px 0;"><strong>💰 Preț:</strong> ${r.pret_total}</p>
                    ${butonAnulare}
                </div>`;
        });
        
        container.innerHTML = rezervariGasite === 0 ? "<p style='color: white;'>Nu aveți nicio rezervare pentru terenurile alocate.</p>" : html;
    });
});