document.addEventListener('DOMContentLoaded', async () => {
    let contLogatGlobal = null;
    let terenuriPtTabel = []; // Terenurile pe care are voie sa le vada in tabel/chat

    // Verificăm dacă există deja sesiune salvată
    const savedSess = localStorage.getItem('admin_session');
    if (savedSess) {
        contLogatGlobal = JSON.parse(savedSess);
        document.getElementById('form-login-admin').style.display = 'none';
        document.getElementById('container-admin-app').style.display = 'block';
        document.getElementById('admin-nume-sus').innerText = "Logat ca: " + contLogatGlobal.nume_admin;
        aplicaPermisiuni(contLogatGlobal);
        setTimeout(() => initializareRealtimeChatAdmin(), 1000);
    }

    document.getElementById('btn-deconectare-admin')?.addEventListener('click', () => {
        localStorage.removeItem('admin_session');
        window.location.reload();
    });

    document.getElementById('form-login-admin')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('login-admin-btn')?.click();
        }
    });

    document.getElementById('login-admin-btn')?.addEventListener('click', async () => {
        const email = document.getElementById('admin-email').value.trim();
        const parola = document.getElementById('admin-parola').value.trim();
        if (!email || !parola) return alert("Completati ambele campuri!");

        const btn = document.getElementById('login-admin-btn');
        btn.innerText = "⏳..."; btn.disabled = true;

        const { data: authData, error: authError } = await db.auth.signInWithPassword({
            email: email,
            password: parola,
        });

        if (authError) {
            btn.innerText = "Loghează-te ca Admin"; btn.disabled = false;
            return alert("Eroare autentificare (Auth): " + authError.message);
        }

        const emailLogat = authData.user.email;
        const { data: adminProfil } = await db.from('users_admin').select('*').eq('email', emailLogat).single();

        if (!adminProfil) {
            btn.innerText = "Loghează-te ca Admin"; btn.disabled = false;
            return alert("Ești logat, dar contul tău nu are profil de Admin (lipsă din users_admin).");
        }

        contLogatGlobal = adminProfil;
        localStorage.setItem('admin_session', JSON.stringify(adminProfil));

        document.getElementById('form-login-admin').style.display = 'none';
        document.getElementById('container-admin-app').style.display = 'block';
        document.getElementById('admin-nume-sus').innerText = "Logat ca: " + contLogatGlobal.nume_admin;
        
        aplicaPermisiuni(contLogatGlobal);
    });

    async function aplicaPermisiuni(cont) {
        if (cont.is_super) {
            document.querySelectorAll('.super-admin-only').forEach(el => el.style.display = 'flex');
            document.querySelectorAll('.admin-comun').forEach(el => el.style.display = 'flex');
            
            window.incarcaTerenuriAdmin();
            window.actualizeazaBifeTerenuri(); 
            
            const { data: toate } = await db.from('terenuri').select('nume');
            if (toate) terenuriPtTabel = toate.map(t => t.nume);
            
        } else {
            document.querySelectorAll('.super-admin-only').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.admin-comun').forEach(el => el.style.display = 'flex');

            const listaTerenuriAlocate = cont.terenuri ? cont.terenuri.split(',') : []; 
            terenuriPtTabel = listaTerenuriAlocate.filter(n => n); 

            const containerMeniu = document.getElementById('container-meniu-terenuri');
            const containerModale = document.getElementById('container-modale-terenuri');
            const selectManualTeren = document.getElementById('manual-teren');
            
            if (containerMeniu) containerMeniu.innerHTML = '';
            if (containerModale) containerModale.innerHTML = '';
            if (selectManualTeren) selectManualTeren.innerHTML = '';

            const { data: terenuriDB } = await db.from('terenuri').select('*').in('nume', terenuriPtTabel);

            if (terenuriDB) {
                terenuriDB.forEach(t => {
                    const idSafe = t.nume.replace(/\s+/g, '-').toLowerCase();

                    if (containerMeniu) {
                        containerMeniu.innerHTML += `
                            <button class="btn-meniu-teren" onclick="document.getElementById('modal-setari-${idSafe}').style.display='flex'">
                                ⚽ Setări ${t.nume}
                            </button>
                        `;
                    }

                    if (containerModale) {
                        containerModale.innerHTML += `
                            <div id="modal-setari-${idSafe}" class="modal" style="display: none;">
                                <div class="modal-box" style="position:relative; width: 95%; max-width: 500px;">
                                    <button class="buton-inchidere" onclick="this.closest('.modal').style.display='none'" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">✖</button>
                                    <h3 style="color: white; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">⚙️ ${t.nume}</h3>
                                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                        <label style="color: #ccc; font-size: 13px; display: block; margin-bottom: 5px;">Link Locație Google Maps</label>
                                        <input type="text" id="locatie-${idSafe}" value="${t.locatie}" style="width: 100%; padding: 10px; box-sizing: border-box; background: #222; border: 1px solid #444; color: white; border-radius: 5px;">
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                        <label style="color: #ccc; font-size: 13px; display: block; margin-bottom: 5px;">Preț Teren (RON/oră)</label>
                                        <input type="number" id="pret-${idSafe}" value="${t.pret}" style="width: 100%; padding: 10px; box-sizing: border-box; background: #222; border: 1px solid #444; color: white; border-radius: 5px;">
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <span style="color: white; font-size: 15px; display: block;">Are opțiune de Minge?</span>
                                        </div>
                                        <label class="switch">
                                            <input type="checkbox" id="minge-toggle-${idSafe}" ${t.optiune_minge ? 'checked' : ''} onchange="document.getElementById('container-pret-minge-${idSafe}').style.display = this.checked ? 'block' : 'none'">
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                    <div id="container-pret-minge-${idSafe}" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 15px; display: ${t.optiune_minge ? 'block' : 'none'};">
                                        <label style="color: #ccc; font-size: 13px; display: block; margin-bottom: 5px;">Preț Închiriere Minge (RON/oră)</label>
                                        <input type="number" id="pret-minge-${idSafe}" value="${t.pret_minge || 15}" style="width: 100%; padding: 10px; box-sizing: border-box; background: #222; border: 1px solid #444; color: white; border-radius: 5px;">
                                    </div>
                                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                                        <div>
                                            <span style="color: white; font-size: 15px; display: block;">Teren Activ</span>
                                            <span style="color: #aaa; font-size: 12px;">Dacă e oprit, clienții nu pot rezerva.</span>
                                        </div>
                                        <label class="switch">
                                            <input type="checkbox" id="activ-${idSafe}" ${t.este_activ ? 'checked' : ''}>
                                            <span class="slider round"></span>
                                        </label>
                                    </div>
                                    <button onclick="window.salveazaSetariTeren('${t.nume}', '${idSafe}')" style="width: 100%; padding: 15px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px;">💾 Salvează Setările</button>
                                </div>
                            </div>
                        `;
                    }

                    if (selectManualTeren) {
                        selectManualTeren.innerHTML += `<option value="${t.nume}">${t.nume}</option>`;
                    }
                });
            }
        }
    }

    document.querySelectorAll('.buton-inchidere').forEach(btn => {
        btn.addEventListener('click', function() {
            const m = this.closest('.modal');
            if (m) m.style.display = 'none';
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(m => {
                if (m.style.display !== 'none') m.style.display = 'none';
            });
        }
    });

    document.getElementById('admin-btn-istoric')?.addEventListener('click', () => {
        document.getElementById('container-istoric').style.display = 'flex';
        window.reincarcaIstoricAdmin();
    });
    
    document.getElementById('admin-inchide-istoric')?.addEventListener('click', () => {
        document.getElementById('container-istoric').style.display = 'none';
    });

    window.reincarcaIstoricAdmin = async function() {
        const dataInceput = document.getElementById('filtru-data-inceput').value;
        const dataSfarsit = document.getElementById('filtru-data-sfarsit').value;
        const stareFiltru = document.getElementById('filtru-stare-rezervare').value;

        const tableBody = document.querySelector('#tabel-rezervari tbody');
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">⏳ Se caută date...</td></tr>';

        let query = db.from('rezervari').select('*');
        if (dataInceput) query = query.gte('timestamp_start', new Date(dataInceput + 'T00:00:00').getTime());
        if (dataSfarsit) query = query.lte('timestamp_start', new Date(dataSfarsit + 'T23:59:59').getTime());
        
        const { data, error } = await query;
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">Nu există rezervări în acest interval.</td></tr>';
            return;
        }

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

            let esteTrecuta = false;
            const matchData = r.data_str.match(/\d{1,2}\.\d{1,2}/); 
            if (matchData && r.stare !== 'anulata') {
                const [zi, luna] = matchData[0].split('.');
                const oraRezervareNumar = parseInt(r.ora.split(':')[0]);
                let anCurent = acum.getFullYear();
                if (r.timestamp_start) {
                    const dataCreare = new Date(r.timestamp_start);
                    anCurent = dataCreare.getFullYear();
                    if (dataCreare.getMonth() === 11 && parseInt(luna) === 1) anCurent++;
                } else {
                    if (acum.getMonth() === 11 && parseInt(luna) === 1) anCurent++;
                }
                const dataTerminarii = new Date(anCurent, parseInt(luna) - 1, parseInt(zi), oraRezervareNumar, 59, 59);
                if (dataTerminarii < acum) esteTrecuta = true;
            }

            const eAnulata = r.stare === 'anulata';
            const eBlocata = (r.stare === 'blocata_admin');
            
            let stareFiltruFinal = 'active';
            if (eBlocata) stareFiltruFinal = 'blocate';
            else if (eAnulata) stareFiltruFinal = 'anulate';
            else if (esteTrecuta) stareFiltruFinal = 'trecute';
            
            if (stareFiltru !== 'toate' && stareFiltru !== stareFiltruFinal) return;

            let badge = '';
            let randOpacity = '1';
            let butonActiune = '';
            let randBg = 'transparent';

            if (eBlocata) {
                badge = `<span style="background: #eab308; color: black; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${txtBlocata}</span>`;
                butonActiune = `<button onclick="window.deblocheazaRezervare(${r.id})" style="background: #3b82f6; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Deblochează</button>`;
                randBg = 'rgba(234, 179, 8, 0.1)';
            } else if (eAnulata) {
                badge = `<span style="background: #ef4444; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${txtAnulata}</span>`;
                randOpacity = '0.5';
            } else if (esteTrecuta) {
                badge = `<span style="background: #6b7280; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${txtFinalizata}</span>`;
                randOpacity = '0.8';
            } else {
                badge = `<span style="background: #22c55e; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${txtActiva}</span>`;
                butonActiune = `<button onclick="window.anuleazaRezervareAdmin(${r.id})" style="background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">${txtBtnAnuleaza}</button>`;
            }
            
            const btnChatClient = r.email_client !== 'BLOCAT_ADMIN' ? `<button onclick="window.deschideChatDinTabel('${r.email_client}', '${r.teren}', '${r.email_client.split('@')[0]}')" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-left: 5px;">💬 Chat</button>` : '';

            let idFormated = r.id.toString().padStart(4, '0');
            const dataF = new Date(r.timestamp_start);
            const dataPrint = `${dataF.getDate().toString().padStart(2, '0')}.${(dataF.getMonth() + 1).toString().padStart(2, '0')} ${dataF.getHours().toString().padStart(2, '0')}:${dataF.getMinutes().toString().padStart(2, '0')}`;

            const dataTradusa = window.traduData ? window.traduData(r.data_str) : r.data_str;

            const tr = document.createElement('tr');
            tr.style.opacity = randOpacity;
            tr.style.backgroundColor = randBg;
            tr.innerHTML = `
                <td>#${idFormated}</td>
                <td>
                    <div style="font-weight: bold;">${r.email_client}</div>
                    <div style="font-size: 11px; color: #aaa;">Data facerii: ${dataPrint}</div>
                    ${btnChatClient}
                </td>
                <td>${r.teren}</td>
                <td>
                    <div style="font-weight: bold;">${dataTradusa}</div>
                    <div style="font-size: 12px; color: #3b82f6;">⏰ ${r.ora}</div>
                </td>
                <td><strong style="color: #22c55e;">${r.pret_total}</strong></td>
                <td>${badge}</td>
                <td>${butonActiune}</td>
            `;
            tableBody.appendChild(tr);
        });
    };

    document.getElementById('filtru-data-inceput')?.addEventListener('change', window.reincarcaIstoricAdmin);
    document.getElementById('filtru-data-sfarsit')?.addEventListener('change', window.reincarcaIstoricAdmin);
    document.getElementById('filtru-stare-rezervare')?.addEventListener('change', window.reincarcaIstoricAdmin);

    window.anuleazaRezervareAdmin = async function(id) {
        if(confirm("Sigur vrei să anulezi această rezervare? Clientul va pierde rezervarea!")) {
            await db.from('rezervari').update({ stare: 'anulata' }).eq('id', id);
            window.reincarcaIstoricAdmin();
        }
    };

    window.deblocheazaRezervare = async function(id) {
        if(confirm("Sigur vrei să deblochezi această oră? Clienții o vor putea rezerva din nou.")) {
            await db.from('rezervari').delete().eq('id', id);
            window.reincarcaIstoricAdmin();
        }
    };

    document.getElementById('admin-btn-manual')?.addEventListener('click', () => {
        document.getElementById('modal-adauga-manual').style.display = 'flex';
    });

    document.getElementById('btn-salveaza-manual')?.addEventListener('click', async () => {
        const nume = document.getElementById('manual-nume').value.trim();
        const teren = document.getElementById('manual-teren').value;
        const dataZ = document.getElementById('manual-data').value;
        const ora = document.getElementById('manual-ora').value;
        const eBlocaj = document.getElementById('manual-blocaj').checked;
        const pret = document.getElementById('manual-pret').value.trim();

        if (!teren || !dataZ || !ora) return alert("Selectează teren, data și ora!");
        if (!eBlocaj && !nume) return alert("Pune numele clientului (sau bifează Blocaj pentru a o bloca)!");

        const btn = document.getElementById('btn-salveaza-manual');
        btn.disabled = true; btn.innerText = "Se salvează...";

        const numeZileT_DB = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
        const d = new Date(dataZ);
        const dataSelectataStr = `${numeZileT_DB[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;

        const { data: dublura } = await db.from('rezervari')
            .select('id').eq('teren', teren).eq('data_str', dataSelectataStr).eq('ora', ora).neq('stare', 'anulata');

        if (dublura && dublura.length > 0) {
            btn.disabled = false; btn.innerText = "Adaugă";
            return alert("❌ Această oră este DEJA ocupată / blocată!");
        }

        const { error } = await db.from('rezervari').insert([{
            sport: '-', 
            teren: teren, 
            data_str: dataSelectataStr,
            ora: ora, 
            pret_total: eBlocaj ? "0 (Blocat Admin)" : (pret ? pret + " RON" : "Plătit / Custom"),
            email_client: eBlocaj ? "BLOCAT_ADMIN" : nume,
            stare: eBlocaj ? 'blocata_admin' : 'activa',
            timestamp_start: Date.now()
        }]);

        if (error) {
            alert("Eroare: " + error.message);
        } else {
            alert(eBlocaj ? "✅ Ora a fost blocată cu succes!" : "✅ Rezervare manuală adăugată cu succes!");
            document.getElementById('modal-adauga-manual').style.display = 'none';
        }
        btn.disabled = false; btn.innerText = "Adaugă";
    });

    window.salveazaSetariTeren = async function(numeTeren, idSafe) {
        const locatie = document.getElementById(`locatie-${idSafe}`).value;
        const pret = document.getElementById(`pret-${idSafe}`).value;
        const optiune_minge = document.getElementById(`minge-toggle-${idSafe}`).checked;
        const pret_minge = document.getElementById(`pret-minge-${idSafe}`).value;
        const este_activ = document.getElementById(`activ-${idSafe}`).checked;

        const { error } = await db.from('terenuri').update({
            locatie: locatie,
            pret: pret,
            optiune_minge: optiune_minge,
            pret_minge: optiune_minge ? pret_minge : null,
            este_activ: este_activ
        }).eq('nume', numeTeren);

        if (error) alert("❌ Eroare la salvare: " + error.message);
        else alert(`✅ Setările pentru ${numeTeren} au fost salvate cu succes!`);
    };

    // ==========================================
    // LOGICĂ CHAT ADMIN
    // ==========================================
    const modalChatAdmin = document.getElementById('modal-chat-admin');
    const btnVeziChatAdmin = document.getElementById('btn-vezi-chat-admin');
    const btnInchideChatAdmin = document.getElementById('inchide-chat-admin');
    const inputChatAdmin = document.getElementById('input-chat-admin');
    const btnTrimiteChatAdmin = document.getElementById('btn-trimite-chat-admin');
    
    let chatAdminRealtime = null;
    let chatAdminConversatieCurenta = null; // { email, teren, nume }
    let chatAdminMesajeToate = [];

    btnVeziChatAdmin?.addEventListener('click', () => {
        modalChatAdmin.style.display = 'flex';
        incarcaMesajeAdmin();
    });

    btnInchideChatAdmin?.addEventListener('click', () => {
        modalChatAdmin.style.display = 'none';
    });

    async function initializareRealtimeChatAdmin() {
        if (chatAdminRealtime) db.removeChannel(chatAdminRealtime);
        
        await incarcaMesajeAdmin(false);
        
        chatAdminRealtime = db.channel('mesaje_chat_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'mesaje_chat' }, payload => {
                const terenMesaj = payload.new ? payload.new.teren : (payload.old ? payload.old.teren : null);
                if (!terenMesaj) return;

                const terenurileAdmin = contLogatGlobal.is_super ? [] : (contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : []);
                
                // Dacă adminul e superadmin SAU are acces la terenul din mesaj
                if (contLogatGlobal.is_super || terenurileAdmin.includes(terenMesaj)) {
                    if (modalChatAdmin && modalChatAdmin.style.display === 'flex') {
                        incarcaMesajeAdmin();
                    } else {
                        if (payload.new && payload.new.expeditor === 'client' && payload.new.citit === false) {
                            const bulina = document.getElementById('bulina-chat-admin');
                            if (bulina) {
                                bulina.style.display = 'block';
                                bulina.innerText = parseInt(bulina.innerText || 0) + 1;
                            }
                        }
                    }
                }
            })
            .subscribe();
    }

    async function incarcaMesajeAdmin(randeaza = true) {
        if (!contLogatGlobal) return;
        
        let query = db.from('mesaje_chat').select('*').order('created_at', { ascending: true });
        if (!contLogatGlobal.is_super) {
            const terenurileAdmin = contLogatGlobal.terenuri ? contLogatGlobal.terenuri.split(',') : [];
            query = query.in('teren', terenurileAdmin);
        }

        const { data, error } = await query;
        if (error) { console.error("Eroare chat admin: ", error); return; }
        
        chatAdminMesajeToate = data || [];
        
        const nrNecitite = chatAdminMesajeToate.filter(m => m.expeditor === 'client' && m.citit === false).length;
        const bulina = document.getElementById('bulina-chat-admin');
        if (bulina) {
            bulina.style.display = nrNecitite > 0 ? 'block' : 'none';
            bulina.innerText = nrNecitite;
        }

        if (randeaza) randeazaListaConversatiiAdmin();
    }

    async function randeazaListaConversatiiAdmin() {
        const listaSide = document.getElementById('chat-admin-lista-clienti');
        if (!listaSide) return;

        // Grupăm mesajele unice per (email_client + teren)
        let grupuri = {};
        chatAdminMesajeToate.forEach(m => {
            const cheie = `${m.email_client}|${m.teren}`;
            if (!grupuri[cheie]) grupuri[cheie] = [];
            grupuri[cheie].push(m);
        });

        const arrayGrupuri = Object.keys(grupuri).map(cheie => {
            const [email, teren] = cheie.split('|');
            const mesajeG = grupuri[cheie];
            const ultimulTimp = mesajeG[mesajeG.length - 1].created_at;
            const areNecitite = mesajeG.some(x => x.expeditor === 'client' && x.citit === false);
            return { email, teren, mesaje: mesajeG, ultimulTimp, areNecitite };
        });

        arrayGrupuri.sort((a, b) => new Date(b.ultimulTimp) - new Date(a.ultimulTimp));

        if (arrayGrupuri.length === 0) {
            listaSide.innerHTML = '<p style="color: #ccc; font-size: 13px; text-align: center;">Nu există conversații active.</p>';
            return;
        }

        listaSide.innerHTML = '';
        
        for (const conv of arrayGrupuri) {
            const ultimulMesaj = conv.mesaje[conv.mesaje.length - 1].mesaj;
            const numeAfisat = conv.email.split('@')[0];
            
            const card = document.createElement('div');
            card.className = `card-conversatie ${conv.areNecitite ? 'necitit' : ''}`;
            
            const esteSelectat = chatAdminConversatieCurenta && chatAdminConversatieCurenta.email === conv.email && chatAdminConversatieCurenta.teren === conv.teren;
            if (esteSelectat) card.style.borderColor = 'white';
            
            card.innerHTML = `
                <h4>👤 ${numeAfisat} <span style="font-size: 11px; color:#aaa; font-weight:normal;">(${conv.teren})</span></h4>
                <p>${ultimulMesaj}</p>
            `;
            
            card.addEventListener('click', () => {
                chatAdminConversatieCurenta = { email: conv.email, teren: conv.teren, nume: numeAfisat };
                randeazaListaConversatiiAdmin(); 
                deschideConversatiaAdmin();
            });
            
            listaSide.appendChild(card);
        }
        
        if (chatAdminConversatieCurenta) {
            deschideConversatiaAdmin();
        }
    }

    window.deschideChatDinTabel = function(email, teren, nume) {
        // 1. Închide modalul de tabel și setări (dacă e deschis vreunul)
        document.querySelectorAll('.modal').forEach(m => {
            if (m.id !== 'modal-chat-admin') m.style.display = 'none';
        });
        
        // 2. Setează starea conversației curente
        chatAdminConversatieCurenta = { email: email, teren: teren, nume: nume };
        
        // 3. Deschide modalul de chat
        const modalChat = document.getElementById('modal-chat-admin');
        if (modalChat) modalChat.style.display = 'flex';
        
        // 4. Forțează starea expandată (Instagram style desktop / mobile active)
        const modalBox = document.querySelector('#modal-chat-admin .modal-chat-box');
        if (modalBox) modalBox.classList.add('conversatie-activa');
        
        // 5. Randează lista din stânga (ca să reflecte selecția)
        randeazaListaConversatiiAdmin();
        
        // 6. Încarcă și afișează mesajele din dreapta
        deschideConversatiaAdmin();
    };

    async function deschideConversatiaAdmin() {
        if (!chatAdminConversatieCurenta) return;
        
        document.getElementById('chat-admin-conversație-titlu').style.display = 'block';
        document.getElementById('chat-admin-conversație-titlu').innerText = `Chat cu ${chatAdminConversatieCurenta.nume} (${chatAdminConversatieCurenta.teren})`;
        
        const modalBox = document.querySelector('#modal-chat-admin .modal-chat-box');
        if (modalBox) modalBox.classList.add('conversatie-activa');

        const container = document.getElementById('chat-admin-mesaje');
        container.innerHTML = '';
        
        const mesaje = chatAdminMesajeToate.filter(m => m.email_client === chatAdminConversatieCurenta.email && m.teren === chatAdminConversatieCurenta.teren);
        let idUriDeMarcat = [];

        mesaje.forEach(m => {
            const bula = document.createElement('div');
            const dataObj = new Date(m.created_at);
            const dataOraFormata = `${dataObj.getDate().toString().padStart(2, '0')}.${(dataObj.getMonth() + 1).toString().padStart(2, '0')} ${dataObj.getHours().toString().padStart(2, '0')}:${dataObj.getMinutes().toString().padStart(2, '0')}`;
            
            if (m.expeditor === 'admin') {
                bula.className = 'mesaj-bula mesaj-trimis';
                let culoareBife = m.citit ? 'bife-albastre' : 'bife-gri';
                bula.innerHTML = `${m.mesaj} <span class="mesaj-timestamp">${dataOraFormata} <span class="bife-citit ${culoareBife}">✓✓</span></span>`;
            } else {
                bula.className = 'mesaj-bula mesaj-primit';
                bula.innerHTML = `${m.mesaj} <span class="mesaj-timestamp">${dataOraFormata}</span>`;
                if (!m.citit) idUriDeMarcat.push(m.id);
            }
            container.appendChild(bula);
        });

        container.scrollTop = container.scrollHeight;

        if (idUriDeMarcat.length > 0) {
            await db.from('mesaje_chat').update({ citit: true }).in('id', idUriDeMarcat);
        }

        inputChatAdmin.disabled = false;
        btnTrimiteChatAdmin.disabled = false;

        const btnStergeChat = document.getElementById('chat-admin-btn-sterge');
        if (btnStergeChat) {
            btnStergeChat.style.display = 'block';
            btnStergeChat.onclick = async () => {
                const conf = confirm(`Ești sigur că vrei să ștergi TOATE mesajele din conversația cu ${chatAdminConversatieCurenta.nume} (${chatAdminConversatieCurenta.teren})?\n\nAcest lucru va șterge mesajele și pentru client!`);
                if (conf) {
                    btnStergeChat.disabled = true;
                    btnStergeChat.style.opacity = '0.5';
                    const { error } = await db.from('mesaje_chat')
                        .delete()
                        .eq('email_client', chatAdminConversatieCurenta.email)
                        .eq('teren', chatAdminConversatieCurenta.teren);
                    
                    if (error) {
                        alert("Eroare la ștergere: " + error.message);
                    } else {
                        chatAdminConversatieCurenta = null;
                        document.getElementById('chat-admin-conversație-titlu').style.display = 'none';
                        container.innerHTML = '<p style="color: #ccc; text-align: center; margin-top: auto; margin-bottom: auto;">Conversație ștearsă.</p>';
                        inputChatAdmin.disabled = true;
                        btnTrimiteChatAdmin.disabled = true;
                        btnStergeChat.style.display = 'none';
                        incarcaMesajeAdmin();
                    }
                    btnStergeChat.disabled = false;
                    btnStergeChat.style.opacity = '1';
                }
            };
        }
    }

    async function trimiteMesajAdmin() {
        if (!chatAdminConversatieCurenta || inputChatAdmin.disabled) return;
        const text = inputChatAdmin.value.trim();
        if (!text) return;

        inputChatAdmin.disabled = true;
        btnTrimiteChatAdmin.disabled = true;

        const { error } = await db.from('mesaje_chat').insert([{
            email_client: chatAdminConversatieCurenta.email,
            teren: chatAdminConversatieCurenta.teren,
            expeditor: 'admin',
            mesaj: text,
            citit: false
        }]);

        if (error) alert("Eroare la trimitere: " + error.message);
        else inputChatAdmin.value = '';

        inputChatAdmin.disabled = false;
        btnTrimiteChatAdmin.disabled = false;
        inputChatAdmin.focus();
    }

    btnTrimiteChatAdmin?.addEventListener('click', trimiteMesajAdmin);
    inputChatAdmin?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') trimiteMesajAdmin();
    });

    document.getElementById('btn-inapoi-conversatie-admin')?.addEventListener('click', () => {
        chatAdminConversatieCurenta = null;
        const modalBox = document.querySelector('#modal-chat-admin .modal-chat-box');
        if (modalBox) modalBox.classList.remove('conversatie-activa');
        randeazaListaConversatiiAdmin();
        
        document.getElementById('chat-admin-conversație-titlu').style.display = 'none';
        const container = document.getElementById('chat-admin-mesaje');
        container.innerHTML = '<p style="color: #ccc; text-align: center; margin-top: auto; margin-bottom: auto;">Selectează un client din stânga pentru a vedea mesajele.</p>';
        const btnSterge = document.getElementById('btn-sterge-chat-admin');
        if (btnSterge) btnSterge.style.display = 'none';
        if (inputChatAdmin) inputChatAdmin.disabled = true;
        if (btnTrimiteChatAdmin) btnTrimiteChatAdmin.disabled = true;
    });

    const originalLoginAdminBtn = document.getElementById('login-admin-btn');
    if (originalLoginAdminBtn) {
        originalLoginAdminBtn.addEventListener('click', () => {
            setTimeout(() => { if (contLogatGlobal) initializareRealtimeChatAdmin(); }, 1500);
        });
    }

});
