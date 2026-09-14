// ==========================================
// 0. SISTEMUL DE TRADUCERI (i18n) GLOBAL
// ==========================================
window.dict = {
    'ro': {
        'contul_meu': 'Contul Meu', 'login_cont': 'Login / Cont', 'fotbal': 'Fotbal', 'baschet': 'Baschet', 'tenis': 'Tenis', 'volei': 'Volei',
        'autentificare': 'Autentificare', 'creare_cont': 'Creare Cont', 'email': 'Adresă Email', 'parola': 'Parolă', 'telefon': 'Număr de Telefon',
        'nume_complet': 'Nume Complet (Username)',
        'intra_cont': 'Intră în cont', 'btn_creare_cont': 'Creează Cont', 'profil_titlu': 'Profilul Tău', 'rez_active': 'Rezervări Active',
        'istoric': 'Istoric Rezervări', 'deconectare': 'Deconectare', 'inapoi_profil': 'Înapoi la Profil', 'alege_terenul': 'Alege Terenul',
        'data_dorita': 'Data Dorită', 'ora_dorita': 'Ora Dorită', 'toate_orele': 'Toate Orele', 'inapoi': 'Înapoi',
        'finalizare_rezervare': 'Finalizare Rezervare', 'nevoie_minge': 'Ai nevoie de minge?', 'alege_ziua': 'Alege Ziua', 
        'alege_ora': 'Alege Ora (Poți selecta mai multe)', 'disclaimer': '⚠️ Atenție: Rezervarea poate fi anulată gratuit doar cu cel puțin 6 ore înainte de ora începerii.',
        'vezi_locatia': 'Vezi Locația (Hartă)', 'alegeti_o_ora': 'Alegeți o oră', 'zile': ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"], 'azi': 'Azi', 'maine': 'Mâine',
        'lei_ora': 'Lei/oră', 'ocupat': 'Ocupat', 'trecut': 'Trecut', 'rezerva': 'Rezervă', 'se_cauta': 'Se caută terenuri disponibile...',
        'fara_rezervari': 'Nu ai rezervări momentan.', 'anuleaza': '❌ Anulează (Gratuit)'
    },
    'hu': {
        'contul_meu': 'Fiókom', 'login_cont': 'Belépés / Fiók', 'fotbal': 'Foci', 'baschet': 'Kosárlabda', 'tenis': 'Tenisz', 'volei': 'Röplabda',
        'autentificare': 'Bejelentkezés', 'creare_cont': 'Regisztráció', 'email': 'E-mail cím', 'parola': 'Jelszó', 'telefon': 'Telefonszám',
        'nume_complet': 'Teljes Név (Felhasználónév)',
        'intra_cont': 'Belépés', 'btn_creare_cont': 'Fiók létrehozása', 'profil_titlu': 'Profilod', 'rez_active': 'Aktív foglalások',
        'istoric': 'Foglalási előzmények', 'deconectare': 'Kijelentkezés', 'inapoi_profil': 'Vissza a profilhoz', 'alege_terenul': 'Pálya kiválasztása',
        'data_dorita': 'Kívánt dátum', 'ora_dorita': 'Kívánt időpont', 'toate_orele': 'Minden időpont', 'inapoi': 'Vissza',
        'finalizare_rezervare': 'Foglalás véglegesítése', 'nevoie_minge': 'Szükséged van labdára?', 'alege_ziua': 'Válassz napot', 
        'alege_ora': 'Válassz időpontot (többet is lehet)', 'disclaimer': '⚠️ Figyelem: A foglalás ingyenesen lemondható a kezdés előtt legalább 6 órával.',
        'vezi_locatia': 'Helyszín (Térkép)', 'alegeti_o_ora': 'Válassz időpontot', 'zile': ["Vas", "Hét", "Ked", "Sze", "Csü", "Pén", "Szo"], 'azi': 'Ma', 'maine': 'Holnap',
        'lei_ora': 'RON/óra', 'ocupat': 'Foglalt', 'trecut': 'Elmúlt', 'rezerva': 'Foglalás', 'se_cauta': 'Szabad pályák keresése...',
        'fara_rezervari': 'Jelenleg nincsenek foglalásaid.', 'anuleaza': '❌ Lemondás (Ingyenes)'
    },
    'en': {
        'contul_meu': 'My Account', 'login_cont': 'Login / Account', 'fotbal': 'Football', 'baschet': 'Basketball', 'tenis': 'Tennis', 'volei': 'Volleyball',
        'autentificare': 'Login', 'creare_cont': 'Register', 'email': 'Email Address', 'parola': 'Password', 'telefon': 'Phone Number',
        'nume_complet': 'Full Name (Username)',
        'intra_cont': 'Sign In', 'btn_creare_cont': 'Create Account', 'profil_titlu': 'Your Profile', 'rez_active': 'Active Bookings',
        'istoric': 'Booking History', 'deconectare': 'Logout', 'inapoi_profil': 'Back to Profile', 'alege_terenul': 'Choose Court',
        'data_dorita': 'Desired Date', 'ora_dorita': 'Desired Time', 'toate_orele': 'All Hours', 'inapoi': 'Back',
        'finalizare_rezervare': 'Finalize Booking', 'nevoie_minge': 'Need a ball?', 'alege_ziua': 'Choose Day', 
        'alege_ora': 'Choose Time (Select multiple)', 'disclaimer': '⚠️ Warning: Free cancellation is only available up to 6 hours before start time.',
        'vezi_locatia': 'View Location (Map)', 'alegeti_o_ora': 'Choose a time', 'zile': ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], 'azi': 'Today', 'maine': 'Tomorrow',
        'lei_ora': 'RON/hour', 'ocupat': 'Booked', 'trecut': 'Passed', 'rezerva': 'Book', 'se_cauta': 'Searching for available courts...',
        'fara_rezervari': 'You have no bookings at the moment.', 'anuleaza': '❌ Cancel (Free)'
    }
};

window.lang = localStorage.getItem('limba_app') || 'ro';
window.tipIstoricDeschis = null; // Stochează ce tip de istoric este deschis ("active" sau "istoric")

// Funcție globală utilitară pentru traducerea automată a zilelor reținute în BD
window.traduData = function(dataStrDB) {
    if (!dataStrDB) return "";
    const parts = dataStrDB.split(', ');
    if (parts.length === 2) {
        const indexZi = window.dict['ro']['zile'].indexOf(parts[0]);
        if (indexZi !== -1) {
            return `${window.dict[window.lang]['zile'][indexZi]}, ${parts[1]}`;
        }
    }
    return dataStrDB; // Fallback, returnează textul netradus
};

window.schimbaLimba = function(limbaNoua) {
    window.lang = limbaNoua;
    localStorage.setItem('limba_app', window.lang);
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const cheie = el.getAttribute('data-i18n');
        if (window.dict[window.lang][cheie]) {
            el.innerText = window.dict[window.lang][cheie];
        }
    });

    // Colorare și Evidențiere buton limbă (Activ)
    document.querySelectorAll('.btn-lang').forEach(btn => {
        if (btn.id === `btn-lang-${limbaNoua}`) {
            btn.style.background = '#34c759'; // Verde aprins
            btn.style.color = '#000';
            btn.style.boxShadow = '0 0 10px rgba(52, 199, 89, 0.5)';
        } else {
            btn.style.background = 'transparent';
            btn.style.color = 'white';
            btn.style.boxShadow = 'none';
        }
    });

    if(typeof window.actualizeazaButonCont === 'function') window.actualizeazaButonCont();
    
    // Re-generare zile din calendar la schimbarea limbii
    if(document.getElementById('modal-rezervare')?.style.display === 'flex' && typeof window.genereazaZile === 'function') {
        window.genereazaZile();
    }
    
    // Reîncărcare Istoric Client dacă este deschis, pentru traducerea în timp real a zilelor
    if (document.getElementById('modal-lista-rezervari')?.style.display === 'flex' && typeof window.reincarcaIstoricCurent === 'function') {
        window.reincarcaIstoricCurent();
    }
    
    // Reîncărcare Istoric Admin (pentru admin.js) dacă e deschis pe ecran
    if (document.getElementById('container-istoric')?.style.display === 'flex' && typeof window.reincarcaIstoricAdmin === 'function') {
        window.reincarcaIstoricAdmin();
    }
};


// ==========================================
// 1. LOGICA APLICAȚIEI
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    
    let loggedInUser = JSON.parse(localStorage.getItem('user_session')) || null;
    let terenuriDinDB = []; 
    let sportCurent = "", terenCurent = "", pretTerenCurent = 0, pretMingeCurent = 15;
    let mingeBifata = false, oraSelectata = [], dataSelectataStr = "";

    window.schimbaLimba(window.lang);

    const aziD = new Date();
    const numeZileT_DB = ["Dum", "Lun", "Mar", "Mie", "Joi", "Vin", "Sâm"];
    const aziStringFormatat = `${numeZileT_DB[aziD.getDay()]}, ${String(aziD.getDate()).padStart(2, '0')}.${String(aziD.getMonth() + 1).padStart(2, '0')}`;

    async function incarcaTerenuri() {
        const { data, error } = await db.from('terenuri').select('*');
        if (data && !error) terenuriDinDB = data;
    }
    await incarcaTerenuri();

    const btnTopCont = document.getElementById('btn-top-cont');
    
    window.actualizeazaButonCont = function() {
        const textTopCont = document.getElementById('text-top-cont');
        if(textTopCont) {
            textTopCont.innerText = loggedInUser ? window.dict[window.lang]['contul_meu'] : window.dict[window.lang]['login_cont'];
        }
    };
    window.actualizeazaButonCont();

    if (btnTopCont) {
        btnTopCont.addEventListener('click', async () => {
            if (loggedInUser) {
                if(document.getElementById('profil-nume')) document.getElementById('profil-nume').innerText = loggedInUser.nume || "Nume Nesetat";
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

    // --- ESC PENTRU A ÎNCHIDE ORICE MODAL ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = ['modal-auth', 'modal-profil', 'modal-terenuri', 'modal-rezervare', 'modal-lista-rezervari'];
            modals.forEach(id => {
                const el = document.getElementById(id);
                if (el && el.style.display !== 'none') el.style.display = 'none';
            });
        }
    });

    // --- ENTER PENTRU LOGIN / REGISTER ---
    document.getElementById('form-login')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('btn-executa-login')?.click(); }
    });
    document.getElementById('form-register')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); document.getElementById('btn-executa-register')?.click(); }
    });

    document.getElementById('inchide-auth')?.addEventListener('click', () => document.getElementById('modal-auth').style.display = 'none');
    document.getElementById('inchide-profil')?.addEventListener('click', () => document.getElementById('modal-profil').style.display = 'none');
    
    document.getElementById('btn-logout')?.addEventListener('click', () => {
        loggedInUser = null; localStorage.removeItem('user_session');
        document.getElementById('modal-profil').style.display = 'none'; window.actualizeazaButonCont();
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
        if(!email || !parola) return alert("Completati datele!");
        const { data } = await db.from('clienti').select('*').eq('email', email).eq('parola', parola).single();
        if (data) {
            const safeUser = { id: data.id, nume: data.nume, email: data.email, telefon: data.telefon };
            loggedInUser = safeUser; 
            localStorage.setItem('user_session', JSON.stringify(safeUser));
            document.getElementById('modal-auth').style.display = 'none'; window.actualizeazaButonCont();
        } else alert("Email sau parolă greșită!");
    });

    document.getElementById('btn-executa-register')?.addEventListener('click', async () => {
        const nume = document.getElementById('reg-nume').value.trim();
        const email = document.getElementById('reg-email').value.trim(); 
        const telefon = document.getElementById('reg-telefon').value.trim(); 
        const parola = document.getElementById('reg-parola').value.trim();
        
        if(!nume || !email || !telefon || !parola) return alert("Completați toate câmpurile!");
        
        const btn = document.getElementById('btn-executa-register');
        btn.innerText = "⏳..."; btn.disabled = true;

        const { data: verificareEmail } = await db.from('clienti').select('email').eq('email', email).single();
        if (verificareEmail) {
            btn.innerText = window.dict[window.lang]['btn_creare_cont']; btn.disabled = false;
            return alert("Există deja un cont cu această adresă de email! Te rugăm să te conectezi pe el.");
        }

        const { data: verificareTel } = await db.from('clienti').select('telefon').eq('telefon', telefon);
        if (verificareTel && verificareTel.length > 0) {
            btn.innerText = window.dict[window.lang]['btn_creare_cont']; btn.disabled = false;
            return alert("Acest număr de telefon este deja folosit pentru alt cont! Nu poți crea mai multe conturi pe același număr.");
        }

        const { error } = await db.from('clienti').insert([{ nume, email, telefon, parola }]);
        btn.innerText = window.dict[window.lang]['btn_creare_cont']; btn.disabled = false;
        
        if (!error) {
            alert("Cont creat cu succes! Te poți autentifica acum.");
            document.getElementById('tab-login').click();
        } else {
            alert("Eroare: " + error.message);
        }
    });

    // --- ISTORIC REZERVĂRI ---
    window.reincarcaIstoricCurent = function() {
        if(loggedInUser && window.tipIstoricDeschis) {
            deschideIstoric(window.tipIstoricDeschis);
        }
    };

    async function deschideIstoric(tip) {
        window.tipIstoricDeschis = tip;
        document.getElementById('modal-profil').style.display = 'none';
        document.getElementById('modal-lista-rezervari').style.display = 'flex';
        
        document.getElementById('titlu-lista-rezervari').innerText = tip === 'active' ? window.dict[window.lang]['rez_active'] : window.dict[window.lang]['istoric'];
        const container = document.getElementById('container-rezervari');
        container.innerHTML = `<p style="color:white; text-align:center;">⏳</p>`;

        const { data, error } = await db.from('rezervari').select('*').ilike('email_client', loggedInUser.email.trim());
        container.innerHTML = "";
        
        if (!data || data.length === 0) {
            container.innerHTML = `<p style='color:white; text-align:center;'>${window.dict[window.lang]['fara_rezervari']}</p>`; return;
        }

        let afisate = 0; const acum = new Date();

        data.sort((a, b) => b.id - a.id).forEach((r) => {
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

            if (tip === 'active' && (r.stare === 'anulata' || esteTrecuta)) return;
            afisate++;
            
            let culoareBorder = 'rgba(255,255,255,0.1)'; let culoareTitlu = '#22c55e'; let opacitate = '1';
            let textExtra = '<span style="color: #22c55e; font-weight: bold;">[ACTIVE]</span>';
            let butonAnulare = '';

            if (r.stare === 'anulata') {
                culoareBorder = '#ef4444'; culoareTitlu = '#ef4444'; opacitate = '0.7';
                textExtra = '<span style="color: #ef4444; font-weight: bold;">[CANCELED]</span>';
            } else if (esteTrecuta) {
                culoareBorder = '#6b7280'; culoareTitlu = '#9ca3af'; opacitate = '0.85';
                textExtra = '<span style="color: #9ca3af; font-weight: bold;">[FINALIZED]</span>';
            } else {
                if (tip === 'active') {
                    butonAnulare = `<button class="btn-anulare anulare-client" data-id="${r.id}" style="margin-top: 10px; background: #ef4444; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">${window.dict[window.lang]['anuleaza']}</button>`;
                }
            }

            const terenAsociat = terenuriDinDB.find(t => t.nume === r.teren);
            const linkLocatie = (terenAsociat && terenAsociat.locatie) ? terenAsociat.locatie : '';
            const onClickLocatie = linkLocatie ? `window.open('${linkLocatie}', '_blank')` : `alert('Error')`;
            const butonLocatie = `<button onclick="${onClickLocatie}" style="margin-top: 10px; margin-right: 10px; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">📍 ${window.dict[window.lang]['vezi_locatia'].split(' ')[0]}</button>`;
            
            const dataTradusa = window.traduData(r.data_str);

            container.innerHTML += `
                <div style="background: rgba(255,255,255,0.05); border: 1px solid ${culoareBorder}; padding: 15px; border-radius: 8px; color: white; margin-bottom: 10px; opacity: ${opacitate};">
                    <h4 style="margin: 0 0 10px 0; color: ${culoareTitlu};">⚽ ${r.sport} - ${r.teren} ${textExtra}</h4>
                    <p style="margin: 5px 0;">📅 ${dataTradusa} | ⏰ ${r.ora}</p>
                    <p style="margin: 5px 0;">Total: <strong>${r.pret_total}</strong></p>
                    <div style="display: flex; flex-wrap: wrap;">${butonLocatie}${butonAnulare}</div>
                </div>
            `;
        });
        
        if (afisate === 0) container.innerHTML = `<p style='color:white; text-align:center;'>${window.dict[window.lang]['fara_rezervari']}</p>`;
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
            if (confirm("Confirm?")) {
                await db.from('rezervari').update({ stare: 'anulata' }).eq('id', idRez);
                deschideIstoric("active"); 
            }
        }
    });

    // --- LOGICA TERENURI ---
    document.querySelectorAll('.card-sport').forEach(card => {
        card.addEventListener('click', async () => {
            sportCurent = card.getAttribute('data-sport'); 
            const numeSportTradus = window.dict[window.lang][sportCurent.toLowerCase()] || sportCurent;
            
            document.getElementById('titlu-sport').innerText = `${window.dict[window.lang]['alege_terenul']} - ${numeSportTradus}`;
            document.getElementById('modal-terenuri').style.display = 'flex';
            
            const aziFormatStandard = new Date().toISOString().split('T')[0];
            const filtruData = document.getElementById('filtru-data');
            if(filtruData) filtruData.value = aziFormatStandard;
            const filtruOra = document.getElementById('filtru-ora');
            if(filtruOra) filtruOra.value = 'ALL'; 
            
            await aplicaFiltruSiDeseneazaTerenuri();
        });
    });

    async function aplicaFiltruSiDeseneazaTerenuri() {
        const dataSelectataDinFiltru = document.getElementById('filtru-data').value;
        const oraAleasa = document.getElementById('filtru-ora').value;
        const containerDinamicTerenuri = document.getElementById('container-dinamic-terenuri');
        
        containerDinamicTerenuri.innerHTML = `<p style="color:white; width: 100%; text-align: center;">${window.dict[window.lang]['se_cauta']}</p>`;

        const terenuriPentruAcestSport = terenuriDinDB.filter(t => t.sport === sportCurent && t.este_activ !== false);

        if (terenuriPentruAcestSport.length === 0) {
            containerDinamicTerenuri.innerHTML = '<p style="color:white; width: 100%; text-align: center;">0</p>';
            return;
        }

        const dataObj = new Date(dataSelectataDinFiltru);
        const ziTextDB = numeZileT_DB[dataObj.getDay()];
        const ziNumar = String(dataObj.getDate()).padStart(2, '0');
        const lunaNumar = String(dataObj.getMonth() + 1).padStart(2, '0');
        const dataFormatataPentruDB = `${ziTextDB}, ${ziNumar}.${lunaNumar}`;

        let terenuriDisponibile = terenuriPentruAcestSport;

        if (oraAleasa !== 'ALL') {
            const { data: rezervari } = await db.from('rezervari').select('teren, ora').eq('data_str', dataFormatataPentruDB).eq('stare', 'activa').eq('ora', oraAleasa);
            if (rezervari) {
                terenuriDisponibile = terenuriPentruAcestSport.filter(teren => {
                    return !rezervari.some(rez => rez.teren === teren.nume);
                });
            }
        }

        containerDinamicTerenuri.innerHTML = '';
        if (terenuriDisponibile.length === 0) {
            containerDinamicTerenuri.innerHTML = `<p style="color: #ff4d4d; width: 100%; text-align: center;">0 / ${oraAleasa}</p>`;
            return;
        }

        terenuriDisponibile.forEach(teren => {
            const divTeren = document.createElement('div');
            divTeren.className = 'card-teren-poza btn-teren';
            divTeren.innerHTML = `<img src="${teren.poza}" alt="${teren.nume}"><div class="info-teren-poza"><h3>${teren.nume}</h3><p>${teren.pret} ${window.dict[window.lang]['lei_ora']}</p></div>`;
            divTeren.addEventListener('click', () => incarcaInterfataRezervare(teren));
            containerDinamicTerenuri.appendChild(divTeren);
        });
    }

    document.getElementById('filtru-data')?.addEventListener('change', aplicaFiltruSiDeseneazaTerenuri);
    document.getElementById('filtru-ora')?.addEventListener('change', aplicaFiltruSiDeseneazaTerenuri);

    function incarcaInterfataRezervare(terenDinDB) {
        terenCurent = terenDinDB.nume; pretTerenCurent = terenDinDB.pret; pretMingeCurent = terenDinDB.pret_minge !== null ? terenDinDB.pret_minge : 15;
        document.getElementById('buton-vezi-locatia').onclick = () => window.open(terenDinDB.locatie, '_blank');
        
        mingeBifata = false; document.getElementById('checkbox-minge').checked = false;
        if (terenDinDB.optiune_minge) {
            document.getElementById('container-minge').style.display = 'flex';
            document.getElementById('text-label-minge').innerText = `${window.dict[window.lang]['nevoie_minge']} (+${pretMingeCurent})`;
        } else document.getElementById('container-minge').style.display = 'none';

        document.getElementById('modal-terenuri').style.display = 'none';
        document.getElementById('modal-rezervare').style.display = 'flex';
        window.genereazaZile();
    }

    document.getElementById('inchide-terenuri')?.addEventListener('click', () => document.getElementById('modal-terenuri').style.display = 'none');
    document.getElementById('inapoi-la-terenuri')?.addEventListener('click', () => { document.getElementById('modal-rezervare').style.display = 'none'; document.getElementById('modal-terenuri').style.display = 'flex'; });
    document.getElementById('inchide-rezervare')?.addEventListener('click', () => document.getElementById('modal-rezervare').style.display = 'none');
    document.getElementById('checkbox-minge')?.addEventListener('change', (e) => { mingeBifata = e.target.checked; actualizeazaButonFinal(); });

    window.genereazaZile = function() {
        const containerZile = document.getElementById('container-zile'); 
        if(!containerZile) return;
        containerZile.innerHTML = '';
        const azi = new Date();

        // Extragem data din filtru pentru a o selecta automat
        let indexDeSelectat = 0;
        const filtruDataInput = document.getElementById('filtru-data');
        if (filtruDataInput && filtruDataInput.value) {
            const dataC = new Date(filtruDataInput.value);
            const aziFaraOra = new Date(azi.getFullYear(), azi.getMonth(), azi.getDate());
            dataC.setHours(0,0,0,0);
            const diffDays = Math.round((dataC - aziFaraOra) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < 7) {
                indexDeSelectat = diffDays;
            }
        }

        for (let i = 0; i < 7; i++) {
            let dataCurenta = new Date(); dataCurenta.setDate(azi.getDate() + i);
            let btnZi = document.createElement('button'); btnZi.className = 'btn-zi' + (i === indexDeSelectat ? ' selectat' : '');
            
            let ziTextVizual = i === 0 ? window.dict[window.lang]['azi'] : (i === 1 ? window.dict[window.lang]['maine'] : window.dict[window.lang]['zile'][dataCurenta.getDay()]);
            
            let ziTextDB = numeZileT_DB[dataCurenta.getDay()];
            let ziNumar = String(dataCurenta.getDate()).padStart(2, '0');
            let lunaNumar = String(dataCurenta.getMonth() + 1).padStart(2, '0');

            btnZi.innerText = `${ziTextVizual}\n${ziNumar}.${lunaNumar}`;
            btnZi.addEventListener('click', () => {
                document.querySelectorAll('.btn-zi').forEach(b => b.classList.remove('selectat')); btnZi.classList.add('selectat');
                dataSelectataStr = `${ziTextDB}, ${ziNumar}.${lunaNumar}`; 
                incarcaOreDinSupabase();
            });
            containerZile.appendChild(btnZi);
            if (i === indexDeSelectat) btnZi.click();
        }
    };

    async function incarcaOreDinSupabase() {
        oraSelectata = []; actualizeazaButonFinal();
        const containerOre = document.getElementById('container-ore');
        containerOre.innerHTML = '<p style="grid-column: span 4; text-align:center;">⏳...</p>';

        const requestDay = dataSelectataStr; // Salvează data pentru care se face cererea curentă
        const { data: rezervariOcupate } = await db.from('rezervari')
            .select('ora').eq('teren', terenCurent).eq('data_str', dataSelectataStr).neq('stare', 'anulata');
            
        // Dacă utilizatorul a dat click pe altă zi cât timp așteptam baza de date, abandonăm afișarea veche
        if (requestDay !== dataSelectataStr) return;

        let oreOcupateArray = rezervariOcupate ? rezervariOcupate.map(r => r.ora) : [];
        
        const oraCurenta = new Date().getHours(); 
        const esteZiuaDeAzi = (dataSelectataStr === aziStringFormatat);

        // NOU: Verificăm ce a selectat clientul în filtru pentru Oră
        const filtruOraInput = document.getElementById('filtru-ora');
        const oraCautataInFiltru = filtruOraInput ? filtruOraInput.value : 'ALL';
        
        // Verificăm dacă suntem fix pe ziua căutată în filtru
        let suntemPeZiuaCautata = false;
        const filtruDataInput = document.getElementById('filtru-data');
        if (filtruDataInput && filtruDataInput.value) {
            const dataC = new Date(filtruDataInput.value);
            const ziTextDB = numeZileT_DB[dataC.getDay()];
            const ziNumar = String(dataC.getDate()).padStart(2, '0');
            const lunaNumar = String(dataC.getMonth() + 1).padStart(2, '0');
            if (`${ziTextDB}, ${ziNumar}.${lunaNumar}` === dataSelectataStr) {
                suntemPeZiuaCautata = true;
            }
        }

        containerOre.innerHTML = '';
        for (let i = 12; i <= 22; i++) {
            let oraTxt = `${i}:00`; let btnOra = document.createElement('button');
            btnOra.className = 'btn-ora'; btnOra.innerText = oraTxt;

            if (oreOcupateArray.includes(oraTxt) || (esteZiuaDeAzi && i <= oraCurenta)) {
                btnOra.classList.add('ocupat'); 
                btnOra.disabled = true; 
                btnOra.innerText += oreOcupateArray.includes(oraTxt) ? ` (${window.dict[window.lang]['ocupat']})` : ` (${window.dict[window.lang]['trecut']})`;
            } else {
                btnOra.addEventListener('click', () => toggleOra(btnOra, oraTxt));
                
                // Dacă ora curentă corespunde cu cea din filtru, o bifăm automat
                if (suntemPeZiuaCautata && oraCautataInFiltru === oraTxt) {
                    btnOra.classList.add('selectat');
                    oraSelectata.push(oraTxt);
                }
            }
            containerOre.appendChild(btnOra);
        }
        
        actualizeazaButonFinal(); // Reactualizăm butonul de rezervare ca să fie verde și gata de plată
    }

    function toggleOra(btn, ora) {
        if (btn.classList.contains('selectat')) { btn.classList.remove('selectat'); oraSelectata = oraSelectata.filter(o => o !== ora); } 
        else { btn.classList.add('selectat'); oraSelectata.push(ora); }
        actualizeazaButonFinal();
    }

    function actualizeazaButonFinal() {
        const butonConfirma = document.getElementById('buton-confirma');
        if (oraSelectata.length === 0) {
            butonConfirma.innerText = window.dict[window.lang]['alegeti_o_ora']; butonConfirma.disabled = true; butonConfirma.style.opacity = '0.5';
        } else {
            let pretTotal = (pretTerenCurent * oraSelectata.length);
            if (mingeBifata) pretTotal += pretMingeCurent;
            butonConfirma.innerText = `${window.dict[window.lang]['rezerva']} (${pretTotal})`; butonConfirma.disabled = false; butonConfirma.style.opacity = '1';
        }
    }

    document.getElementById('buton-confirma')?.addEventListener('click', async () => {
        if (!loggedInUser) {
            document.getElementById('modal-rezervare').style.display = 'none'; document.getElementById('modal-auth').style.display = 'flex'; return;
        }

        const butonConfirma = document.getElementById('buton-confirma');
        butonConfirma.disabled = true;

        const { data: dublura } = await db.from('rezervari').select('ora').eq('teren', terenCurent).eq('data_str', dataSelectataStr).neq('stare', 'anulata').in('ora', oraSelectata);
        if (dublura && dublura.length > 0) {
            butonConfirma.disabled = false; incarcaOreDinSupabase(); return;
        }

        let pretDoarTeren = pretTerenCurent;
        
        const rowsToInsert = oraSelectata.map((ora, index) => {
            let costOra = pretDoarTeren;
            let textPret = `${costOra} RON`;
            
            // Adăugăm prețul mingii DOAR la prima oră rezervată din pachet, ca să nu dăm numere cu virgulă ciudate
            if (index === 0 && mingeBifata) {
                costOra += pretMingeCurent;
                textPret = `${costOra} RON (+Minge)`;
            }
            
            return {
                sport: sportCurent, 
                teren: terenCurent, 
                data_str: dataSelectataStr,
                ora: ora, 
                pret_total: textPret,
                email_client: loggedInUser.email, 
                stare: 'activa', 
                timestamp_start: Date.now()
            };
        });
        
        const { error } = await db.from('rezervari').insert(rowsToInsert);
        
        let erori = error ? 1 : 0;
        if (error && error.code === '23505') {
            alert("Atenție: Una sau mai multe ore selectate tocmai au fost rezervate de altcineva. Vă rugăm să reîncărcați și să alegeți altă oră.");
        } else if (error) {
            alert("Eroare la salvarea rezervării: " + error.message);
        }

        if (erori === 0) { document.getElementById('modal-rezervare').style.display = 'none'; } 
        butonConfirma.disabled = false;
    });
});
