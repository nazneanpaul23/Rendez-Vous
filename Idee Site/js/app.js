document.addEventListener('DOMContentLoaded', async () => {
    
    let loggedInUser = JSON.parse(localStorage.getItem('user_session')) || null;
    let terenuriDinDB = []; 
    let sportCurent = "", terenCurent = "", pretTerenCurent = 0, pretMingeCurent = 15;
    let mingeBifata = false, oraSelectata = [], dataSelectataStr = "";

    async function incarcaTerenuri() {
        const { data, error } = await db.from('terenuri').select('*');
        if (data && !error) terenuriDinDB = data;
    }
    await incarcaTerenuri();

    const btnTopCont = document.getElementById('btn-top-cont');
    function actualizeazaButonCont() {
        const textTopCont = document.getElementById('text-top-cont');
        if(textTopCont) textTopCont.innerText = loggedInUser ? "Contul Meu" : "Login / Cont";
    }
    actualizeazaButonCont();

    if (btnTopCont) {
        btnTopCont.addEventListener('click', async () => {
            if (loggedInUser) {
                document.getElementById('profil-email').innerText = loggedInUser.email;
                if(document.getElementById('profil-telefon')) document.getElementById('profil-telefon').innerText = loggedInUser.telefon || "-";
                
                const nrActiveSpan = document.getElementById('nr-active');
                if (nrActiveSpan) {
                    const { data } = await db.from('rezervari').select('id').ilike('email_client', loggedInUser.email.trim()).neq('stare', 'anulata');
                    nrActiveSpan.innerText = data ? data.length : 0;
                }
                document.getElementById('modal-profil').style.display = 'flex';
            } else document.getElementById('modal-auth').style.display = 'flex';
        });
    }

    document.getElementById('inchide-auth')?.addEventListener('click', () => document.getElementById('modal-auth').style.display = 'none');
    document.getElementById('inchide-profil')?.addEventListener('click', () => document.getElementById('modal-profil').style.display = 'none');
    
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        loggedInUser = null; localStorage.removeItem('user_session');
        document.getElementById('modal-profil').style.display = 'none'; actualizeazaButonCont();
    });

    document.getElementById('tab-login')?.addEventListener('click', () => {
        document.getElementById('form-login').style.display = 'block'; document.getElementById('form-register').style.display = 'none';
        document.getElementById('tab-login').classList.add('activ'); document.getElementById('tab-register').classList.remove('activ');
    });

    document.getElementById('tab-register')?.addEventListener('click', () => {
        document.getElementById('form-login').style.display = 'none'; document.getElementById('form-register').style.display = 'block';
        document.getElementById('tab-register').classList.add('activ'); document.getElementById('tab-login').classList.remove('activ');
    });

    document.getElementById('btn-executa-login')?.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim(); const parola = document.getElementById('login-parola').value.trim();
        if(!email || !parola) return alert("Completează datele!");
        const { data } = await db.from('clienti').select('*').eq('email', email).eq('parola', parola).single();
        if (data) {
            loggedInUser = data; localStorage.setItem('user_session', JSON.stringify(loggedInUser));
            document.getElementById('modal-auth').style.display = 'none'; actualizeazaButonCont(); alert("Te-ai logat cu succes!");
        } else alert("Email sau parolă greșită!");
    });

    document.getElementById('btn-executa-register')?.addEventListener('click', async () => {
        const email = document.getElementById('reg-email').value.trim(); const telefon = document.getElementById('reg-telefon').value.trim(); const parola = document.getElementById('reg-parola').value.trim();
        if(!email || !telefon || !parola) return alert("Completează datele!");
        const { data: verificare } = await db.from('clienti').select('email').eq('email', email).single();
        if (verificare) return alert("Există deja un cont cu acest email!");
        const { error } = await db.from('clienti').insert([{ email, telefon, parola }]);
        if (error) alert("Eroare la creare cont."); else { alert("Cont creat! Loghează-te."); document.getElementById('tab-login').click(); }
    });

    // --- 3. ISTORIC REZERVĂRI CLIENT ---
    async function deschideIstoric(tip) {
        document.getElementById('modal-profil').style.display = 'none';
        document.getElementById('modal-lista-rezervari').style.display = 'flex';
        
        const titlu = tip === 'active' ? "Rezervările Tale Active" : "Istoric Rezervări";
        document.getElementById('titlu-lista-rezervari').innerText = titlu;
        const container = document.getElementById('container-rezervari');
        container.innerHTML = '<p style="color:white; text-align:center;">Se descarcă rezervările... ⏳</p>';

        const { data, error } = await db.from('rezervari').select('*').ilike('email_client', loggedInUser.email.trim());
        container.innerHTML = "";
        
        if (!data || data.length === 0) {
            container.innerHTML = "<p style='color:white; text-align:center;'>Nu ai rezervări momentan.</p>"; return;
        }

        let afisate = 0;
        data.sort((a, b) => b.id - a.id).forEach((r) => {
            // Dacă apasă pe Active, sărim peste cele anulate
            if (tip === 'active' && r.stare === 'anulata') return;
            
            afisate++;
            const textAnulat = r.stare === 'anulata' ? '<span style="color: #ef4444; font-weight: bold;">[ANULATĂ]</span>' : '';
            const butonAnulare = (tip === 'active' && r.stare !== 'anulata') ? `<button class="btn-anulare anulare-client" data-id="${r.id}" style="margin-top: 10px; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">❌ Anulează (Gratuit)</button>` : '';

            // Extragem link-ul din DB pentru a vizualiza harta
            const terenAsociat = terenuriDinDB.find(t => t.nume === r.teren);
            const linkLocatie = (terenAsociat && terenAsociat.locatie) ? terenAsociat.locatie : '';
            const onClickLocatie = linkLocatie ? `window.open('${linkLocatie}', '_blank')` : `alert('Locația nu este disponibilă.')`;
            const butonLocatie = `<button onclick="${onClickLocatie}" style="margin-top: 10px; margin-right: 10px; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">📍 Vezi Locația</button>`;

            container.innerHTML += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid ${(r.stare === 'anulata') ? '#ef4444' : 'rgba(255,255,255,0.1)'}; padding: 15px; border-radius: 8px; color: white; margin-bottom: 10px; opacity: ${(r.stare === 'anulata') ? '0.7' : '1'};">
                    <h4 style="margin: 0 0 10px 0; color: ${(r.stare === 'anulata') ? '#ef4444' : '#22c55e'};">⚽ ${r.sport} - ${r.teren} ${textAnulat}</h4>
                    <p style="margin: 5px 0;">📅 ${r.data_str} | ⏰ ${r.ora}</p>
                    <p style="margin: 5px 0;">Total: <strong>${r.pret_total}</strong></p>
                    <div style="display: flex; flex-wrap: wrap;">
                        ${butonLocatie}
                        ${butonAnulare}
                    </div>
                </div>
            `;
        });
        
        if (afisate === 0) container.innerHTML = "<p style='color:white; text-align:center;'>Nu ai rezervări în această categorie.</p>";
    }

    document.getElementById('btn-vezi-active')?.addEventListener('click', () => deschideIstoric("active"));
    document.getElementById('btn-vezi-istoric')?.addEventListener('click', () => deschideIstoric("istoric"));

    document.getElementById('inapoi-la-profil')?.addEventListener('click', () => {
        document.getElementById('modal-lista-rezervari').style.display = 'none'; document.getElementById('modal-profil').style.display = 'flex';
    });
    document.getElementById('inchide-istoric-client')?.addEventListener('click', () => document.getElementById('modal-lista-rezervari').style.display = 'none');

    document.getElementById('container-rezervari')?.addEventListener('click', async (e) => {
        if (e.target.classList.contains('anulare-client')) {
            const idRez = e.target.getAttribute('data-id');
            if (confirm("Sigur vrei să anulezi această rezervare?")) {
                await db.from('rezervari').update({ stare: 'anulata' }).eq('id', idRez);
                alert("Rezervare anulată cu succes!");
                deschideIstoric("active"); 
            }
        }
    });

    // 4. LOGICA DE REZERVARE A TERENULUI
    document.querySelectorAll('.card-sport').forEach(card => {
        card.addEventListener('click', () => {
            sportCurent = card.querySelector('h2').innerText;
            document.getElementById('titlu-sport').innerText = `Alege Terenul - ${sportCurent}`;
            const containerDinamicTerenuri = document.getElementById('container-dinamic-terenuri');
            containerDinamicTerenuri.innerHTML = '';
            
            const terenuriPentruAcestSport = terenuriDinDB.filter(t => t.sport === sportCurent);
            if (terenuriPentruAcestSport.length === 0) {
                containerDinamicTerenuri.innerHTML = '<p style="color:white; width: 100%; text-align: center;">Niciun teren adăugat momentan pentru acest sport.</p>';
            } else {
                terenuriPentruAcestSport.forEach(teren => {
                    const divTeren = document.createElement('div');
                    divTeren.className = 'card-teren-poza btn-teren';
                    divTeren.innerHTML = `<img src="${teren.poza}" alt="${teren.nume}"><div class="info-teren-poza"><h3>${teren.nume}</h3><p>${teren.pret} Lei/oră</p></div>`;
                    divTeren.addEventListener('click', () => incarcaInterfataRezervare(teren));
                    containerDinamicTerenuri.appendChild(divTeren);
                });
            }
            document.getElementById('modal-terenuri').style.display = 'flex';
        });
    });

    function incarcaInterfataRezervare(terenDinDB) {
        terenCurent = terenDinDB.nume; pretTerenCurent = terenDinDB.pret; pretMingeCurent = terenDinDB.pret_minge !== null ? terenDinDB.pret_minge : 15;
        document.getElementById('buton-vezi-locatia').onclick = () => window.open(terenDinDB.locatie, '_blank');
        
        mingeBifata = false; document.getElementById('checkbox-minge').checked = false;
        if (terenDinDB.optiune_minge) {
            document.getElementById('container-minge').style.display = 'flex';
            document.getElementById('text-label-minge').innerText = `Ai nevoie de minge? (+${pretMingeCurent} Lei)`;
        } else document.getElementById('container-minge').style.display = 'none';

        document.getElementById('modal-terenuri').style.display = 'none';
        document.getElementById('modal-rezervare').style.display = 'flex';
        genereazaZile();
    }

    document.getElementById('inchide-terenuri')?.addEventListener('click', () => document.getElementById('modal-terenuri').style.display = 'none');
    document.getElementById('inapoi-la-terenuri')?.addEventListener('click', () => { document.getElementById('modal-rezervare').style.display = 'none'; document.getElementById('modal-terenuri').style.display = 'flex'; });
    document.getElementById('inchide-rezervare')?.addEventListener('click', () => document.getElementById('modal-rezervare').style.display = 'none');
    document.getElementById('checkbox-minge')?.addEventListener('change', (e) => { mingeBifata = e.target.checked; actualizeazaButonFinal(); });

    function genereazaZile() {
        const containerZile = document.getElementById('container-zile'); containerZile.innerHTML = '';
        const azi = new Date(); const numeZile = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];

        for (let i = 0; i < 7; i++) {
            let dataCurenta = new Date(); dataCurenta.setDate(azi.getDate() + i);
            let btnZi = document.createElement('button'); btnZi.className = 'btn-zi' + (i === 0 ? ' selectat' : '');
            let ziTextVizual = i === 0 ? 'Azi' : (i === 1 ? 'Mâine' : numeZile[dataCurenta.getDay()]);
            
            let ziTextDB = numeZile[dataCurenta.getDay()];
            let ziNumar = String(dataCurenta.getDate()).padStart(2, '0');
            let lunaNumar = String(dataCurenta.getMonth() + 1).padStart(2, '0');

            btnZi.innerText = `${ziTextVizual}\n${ziNumar}.${lunaNumar}`;
            btnZi.addEventListener('click', () => {
                document.querySelectorAll('.btn-zi').forEach(b => b.classList.remove('selectat')); btnZi.classList.add('selectat');
                dataSelectataStr = `${ziTextDB}, ${ziNumar}.${lunaNumar}`;
                incarcaOreDinSupabase();
            });
            containerZile.appendChild(btnZi);
            if (i === 0) btnZi.click();
        }
    }

    async function incarcaOreDinSupabase() {
        oraSelectata = []; actualizeazaButonFinal();
        const containerOre = document.getElementById('container-ore');
        containerOre.innerHTML = '<p style="grid-column: span 4; text-align:center;">Se verifică disponibilitatea...</p>';

        const { data: rezervariOcupate } = await db.from('rezervari')
            .select('ora').eq('teren', terenCurent).eq('data_str', dataSelectataStr).neq('stare', 'anulata');

        let oreOcupateArray = rezervariOcupate ? rezervariOcupate.map(r => r.ora) : [];

        containerOre.innerHTML = '';
        for (let i = 12; i <= 22; i++) {
            let oraTxt = `${i}:00`; let btnOra = document.createElement('button');
            btnOra.className = 'btn-ora'; btnOra.innerText = oraTxt;

            if (oreOcupateArray.includes(oraTxt)) {
                btnOra.classList.add('ocupat'); btnOra.innerText += " (Ocupat)";
            } else {
                btnOra.addEventListener('click', () => toggleOra(btnOra, oraTxt));
            }
            containerOre.appendChild(btnOra);
        }
    }

    function toggleOra(btn, ora) {
        if (btn.classList.contains('selectat')) { btn.classList.remove('selectat'); oraSelectata = oraSelectata.filter(o => o !== ora); } 
        else { btn.classList.add('selectat'); oraSelectata.push(ora); }
        actualizeazaButonFinal();
    }

    function actualizeazaButonFinal() {
        const butonConfirma = document.getElementById('buton-confirma');
        if (oraSelectata.length === 0) {
            butonConfirma.innerText = "Alegeți o oră"; butonConfirma.disabled = true; butonConfirma.style.opacity = '0.5';
        } else {
            let pretTotal = (pretTerenCurent * oraSelectata.length);
            if (mingeBifata) pretTotal += pretMingeCurent;
            butonConfirma.innerText = `Rezervă (${pretTotal} Lei)`; butonConfirma.disabled = false; butonConfirma.style.opacity = '1';
        }
    }

    document.getElementById('buton-confirma')?.addEventListener('click', async () => {
        if (!loggedInUser) {
            alert("Trebuie să fii logat pentru a face o rezervare!");
            document.getElementById('modal-rezervare').style.display = 'none'; document.getElementById('modal-auth').style.display = 'flex'; return;
        }

        const butonConfirma = document.getElementById('buton-confirma');
        butonConfirma.innerText = "Se verifică disponibilitatea..."; butonConfirma.disabled = true;

        const { data: dublura } = await db.from('rezervari').select('ora').eq('teren', terenCurent).eq('data_str', dataSelectataStr).neq('stare', 'anulata').in('ora', oraSelectata);
        if (dublura && dublura.length > 0) {
            alert("❌ O oră selectată a fost ocupată recent de altcineva!"); butonConfirma.disabled = false; incarcaOreDinSupabase(); return;
        }

        let pretTotal = (pretTerenCurent * oraSelectata.length);
        if (mingeBifata) pretTotal += pretMingeCurent;
        
        let erori = 0;
        for (let ora of oraSelectata) {
            const { error } = await db.from('rezervari').insert([{
                sport: sportCurent, teren: terenCurent, data_str: dataSelectataStr,
                ora: ora, pret_total: `${pretTotal / oraSelectata.length} Lei`,
                email_client: loggedInUser.email, stare: 'activa', timestamp_start: Date.now()
            }]);
            if (error) erori++;
        }

        if (erori === 0) { alert("✅ Rezervarea ta a fost salvată cu succes!"); document.getElementById('modal-rezervare').style.display = 'none'; } 
        else alert("Eroare la salvarea rezervării.");
        
        butonConfirma.disabled = false;
    });
});