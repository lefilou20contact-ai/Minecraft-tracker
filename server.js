const express = require('express');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-client');
const app = express();

app.use(express.json());

// =========================================================================
// CONFIGURATION SUPABASE
// =========================================================================
const SUPABASE_URL = 'https://frhhtqjgkuhukzxswpro.supabase.co';
const SUPABASE_KEY = 'sb_publishable_IVsd8-qvgOydr8TTxO5oCQ_ml_3iUhq';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Minecraft Tracker</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
        <style>
            :root {
                --bg: #08080c;
                --panel-bg: rgba(255, 255, 255, 0.02);
                --accent: #a3e635;
                --border: rgba(255, 255, 255, 0.06);
                --text-main: #f8fafc;
                --text-muted: #64748b;
            }
            body {
                background-color: var(--bg);
                color: var(--text-main);
                font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                background: radial-gradient(circle at top, #11111e 0%, #050508 100%);
            }
            .search-box {
                display: flex;
                gap: 12px;
                margin-bottom: 40px;
                width: 100%;
                max-width: 500px;
            }
            .search-input {
                flex: 1;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid var(--border);
                padding: 16px 20px;
                border-radius: 14px;
                color: #fff;
                font-size: 16px;
                outline: none;
                transition: all 0.3s;
                backdrop-filter: blur(8px);
            }
            .search-input:focus {
                border-color: var(--accent);
                box-shadow: 0 0 20px rgba(163, 230, 53, 0.15);
            }
            .search-btn {
                background: var(--accent);
                color: #000;
                border: none;
                padding: 0 28px;
                border-radius: 14px;
                font-weight: 700;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.2s;
            }
            .search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(163, 230, 53, 0.25);
            }
            .namemc-grid {
                display: none;
                grid-template-columns: 1fr 1.2fr;
                gap: 24px;
                width: 100%;
                max-width: 1000px;
            }
            .panel {
                background: var(--panel-bg);
                border: 1px solid var(--border);
                border-radius: 20px;
                padding: 24px;
                backdrop-filter: blur(16px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            }
            .panel-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: var(--text-muted);
                margin-top: 0;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .panel-title i { color: var(--accent); }
            .profile-header {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 24px;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                padding-bottom: 20px;
            }
            .mini-avatar {
                width: 64px;
                height: 64px;
                border-radius: 12px;
                border: 1px solid var(--border);
            }
            .profile-title h1 { margin: 0; font-size: 28px; letter-spacing: -0.5px; }
            .uuid-badge {
                font-family: monospace;
                font-size: 11px;
                color: var(--text-muted);
                background: rgba(0,0,0,0.4);
                padding: 4px 8px;
                border-radius: 6px;
                margin-top: 4px;
                display: inline-block;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255,255,255,0.03);
                font-size: 15px;
            }
            .info-row:last-child { border-bottom: none; }
            .info-label { color: var(--text-muted); }
            .info-value { font-weight: 600; }
            .info-value.neon { color: var(--accent); }
            .skin-render-box {
                grid-row: span 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 450px;
                position: relative;
            }
            .skin-3d-img {
                max-height: 380px;
                object-fit: contain;
                filter: drop-shadow(0 20px 30px rgba(0,0,0,0.7));
                transition: transform 0.3s;
            }
            .skin-3d-img:hover { transform: scale(1.03); }
            .cape-container { display: flex; gap: 12px; flex-wrap: wrap; }
            .cape-item {
                background: rgba(163, 230, 53, 0.04);
                border: 1px dashed var(--accent);
                border-radius: 10px;
                padding: 10px 16px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                color: var(--accent);
                font-weight: bold;
            }
            .no-cape { color: var(--text-muted); font-size: 14px; font-style: italic; }
            
            /* Nouveaux styles pour la liste d'historique */
            .full-width-box { grid-column: span 2; }
            .history-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 16px;
            }
            .history-card {
                background: rgba(255,255,255,0.01);
                border: 1px solid var(--border);
                border-radius: 14px;
                padding: 16px;
                text-align: center;
                position: relative;
                transition: all 0.2s;
            }
            .history-card:hover { border-color: var(--accent); background: rgba(163, 230, 53, 0.01); }
            .history-card img { height: 120px; object-fit: contain; margin-bottom: 10px; }
            .history-number {
                position: absolute;
                top: 10px;
                left: 10px;
                font-size: 11px;
                font-weight: bold;
                background: rgba(255,255,255,0.05);
                padding: 2px 6px;
                border-radius: 4px;
                color: var(--text-muted);
            }
            .history-date { font-size: 12px; color: var(--text-muted); }

            .session-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 14px 20px;
                background: rgba(255, 255, 255, 0.01);
                border: 1px solid var(--border);
                border-radius: 12px;
                margin-bottom: 10px;
                font-size: 14px;
            }
            .session-item:hover {
                border-color: rgba(163, 230, 53, 0.3);
                background: rgba(163, 230, 53, 0.005);
            }
            .session-left { display: flex; align-items: center; gap: 16px; }
            .session-icon { color: var(--accent); font-size: 16px; width: 20px; text-align: center; }
            .session-ip { font-weight: 600; color: #fff; }
            .session-version {
                font-size: 11px;
                background: rgba(255, 255, 255, 0.06);
                color: var(--text-muted);
                padding: 2px 6px;
                border-radius: 4px;
                font-family: monospace;
            }
            .session-right { text-align: right; }
            .session-time { font-weight: bold; color: var(--accent); }
            .session-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
            .no-sessions { color: var(--text-muted); font-style: italic; text-align: center; padding: 20px 0; }

            .error-msg {
                color: #f87171;
                background: rgba(248,113,113,0.08);
                border: 1px solid rgba(248,113,113,0.2);
                border-radius: 10px;
                padding: 14px 20px;
                margin-bottom: 20px;
                display: none;
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="search-box">
            <input type="text" id="username" class="search-input" placeholder="Entrez un pseudo Minecraft (ex: Notch)..." onkeydown="if(event.key==='Enter') trackPlayer()">
            <button onclick="trackPlayer()" class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div class="error-msg" id="error-msg"></div>

        <div class="namemc-grid" id="main-interface">
            <div class="panel">
                <div class="profile-header">
                    <img id="player-head" class="mini-avatar" src="" alt="Tête">
                    <div class="profile-title">
                        <h1 id="player-name">Pseudo</h1>
                        <div id="player-uuid" class="uuid-badge">UUID</div>
                    </div>
                </div>
                <div class="panel-title"><i class="fa-solid fa-chart-simple"></i> Données du Tracker</div>
                <div class="info-row">
                    <div class="info-label">Temps de jeu global</div>
                    <div class="info-value neon" id="player-time">0 min</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Serveur actuel / dernier</div>
                    <div class="info-value" id="player-server">-</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Dernière activité</div>
                    <div class="info-value" id="player-last-login">-</div>
                </div>
            </div>

            <div class="panel skin-render-box">
                <div class="panel-title" style="position: absolute; top: 24px; left: 24px;">
                    <i class="fa-solid fa-cube"></i> Rendu 3D du Skin
                </div>
                <img id="skin-3d" class="skin-3d-img" src="" alt="Rendu Complet">
            </div>

            <div class="panel">
                <div class="panel-title"><i class="fa-solid fa-shield-halved"></i> Cape</div>
                <div id="cape-wrapper" class="cape-container"></div>
            </div>

            <div class="panel full-width-box">
                <div class="panel-title"><i class="fa-solid fa-clock-rotate-left"></i> Historique des sessions</div>
                <div id="sessions-wrapper"></div>
            </div>

            <div class="panel full-width-box">
                <div class="panel-title"><i class="fa-solid fa-images"></i> Aperçus du Skin</div>
                <div class="history-grid" id="history-wrapper"></div>
            </div>
        </div>

        <script>
            async function trackPlayer() {
                const pseudo = document.getElementById('username').value.trim();
                if (!pseudo) return;

                const errEl = document.getElementById('error-msg');
                errEl.style.display = 'none';

                try {
                    const response = await fetch('/api/player/' + encodeURIComponent(pseudo));
                    const data = await response.json();

                    if (!response.ok) {
                        errEl.textContent = data.error || "Joueur introuvable.";
                        errEl.style.display = 'block';
                        document.getElementById('main-interface').style.display = 'none';
                        return;
                    }

                    document.getElementById('player-head').src = "https://mc-heads.net/avatar/" + data.uuid + "/64";
                    document.getElementById('player-name').innerText = data.pseudo;
                    document.getElementById('player-uuid').innerText = data.uuid;

                    document.getElementById('player-time').innerText = data.stats.totalTime + " min";
                    document.getElementById('player-server').innerText = data.stats.lastServer;
                    document.getElementById('player-last-login').innerText = data.stats.lastLogin;

                    document.getElementById('skin-3d').src = "https://visage.surgeplay.com/full/400/" + data.uuid;

                    const capeWrapper = document.getElementById('cape-wrapper');
                    capeWrapper.innerHTML = data.capeUrl
                        ? '<div class="cape-item"><i class="fa-solid fa-gavel"></i> Cape Officielle Mojang</div>'
                        : '<span class="no-cape">Aucune cape détectée sur ce compte.</span>';

                    // Injection Dynamique de l'historique des sessions
                    const sessionsWrapper = document.getElementById('sessions-wrapper');
                    sessionsWrapper.innerHTML = '';
                    
                    if (data.history && data.history.length > 0) {
                        data.history.forEach(session => {
                            const item = document.createElement('div');
                            item.className = 'session-item';
                            item.innerHTML = \`
                                <div class="session-left">
                                    <div class="session-icon"><i class="fa-solid \${session.server_ip.includes('Solo') ? 'fa-house' : 'fa-server'}"}></i></div>
                                    <div>
                                        <span class="session-ip">\${session.server_ip}</span>
                                        <span class="session-version">\${session.game_version}</span>
                                    </div>
                                </div>
                                <div class="session-right">
                                    <div class="session-time">+\${session.play_time} min</div>
                                    <div class="session-date">\${session.played_at}</div>
                                </div>
                            \`;
                            sessionsWrapper.appendChild(item);
                        });
                    } else {
                        sessionsWrapper.innerHTML = '<div class="no-sessions">Aucun historique de session disponible pour ce joueur.</div>';
                    }

                    const historyWrapper = document.getElementById('history-wrapper');
                    historyWrapper.innerHTML = '';
                    [{ label: "Actuel", date: "Aujourd'hui" }, { label: "#2", date: "Janv. 2026" }, { label: "#1", date: "Création" }].forEach(skin => {
                        const card = document.createElement('div');
                        card.className = 'history-card';
                        card.innerHTML = \`
                            <div class="history-number">\${skin.label}</div>
                            <img src="https://visage.surgeplay.com/bust/120/\${data.uuid}" alt="Skin">
                            <div class="history-date">\${skin.date}</div>
                        \`;
                        historyWrapper.appendChild(card);
                    });

                    document.getElementById('main-interface').style.display = 'grid';

                } catch (err) {
                    errEl.textContent = "Erreur de connexion au serveur.";
                    errEl.style.display = 'block';
                }
            }
        </script>
    </body>
    </html>
    `);
});

// API - Récupération du profil joueur + historique
app.get('/api/player/:pseudo', async (req, res) => {
    try {
        const name = req.params.pseudo;

        const profileRes = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${name}`);
        if (!profileRes.data || !profileRes.data.id) {
            return res.status(404).json({ error: "Joueur introuvable sur Mojang." });
        }
        const uuid = profileRes.data.id;
        const exactPseudo = profileRes.data.name;

        const sessionRes = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);

        let skinUrl = null;
        let capeUrl = null;

        if (sessionRes.data && sessionRes.data.properties) {
            const textureProp = sessionRes.data.properties.find(p => p.name === 'textures');
            if (textureProp) {
                const texturesJson = JSON.parse(Buffer.from(textureProp.value, 'base64').toString('utf-8'));
                if (texturesJson.textures) {
                    skinUrl = texturesJson.textures.SKIN?.url || null;
                    capeUrl = texturesJson.textures.CAPE?.url || null;
                }
            }
        }

        // 1. Charger les données du joueur globales depuis Supabase
        const { data: playerStats } = await supabase
            .from('tracker_stats')
            .select('*')
            .eq('uuid', uuid)
            .single();

        // 2. Charger les 8 dernières sessions enregistrées pour l'historique
        const { data: historyData } = await supabase
            .from('server_history')
            .select('*')
            .eq('uuid', uuid)
            .order('id', { ascending: false })
            .limit(8);

        const localData = playerStats || {
            totalTime: 0,
            lastServer: "Inconnu (Mod non connecté)",
            lastLogin: "Aucune session reçue"
        };

        res.json({ 
            pseudo: exactPseudo, 
            uuid, 
            skinUrl, 
            capeUrl, 
            stats: localData, 
            history: historyData || [] 
        });

    } catch (error) {
        console.error("Erreur API Mojang:", error.message);
        res.status(500).json({ error: "Erreur lors de la récupération du profil." });
    }
});

// API - Réception des données du mod JAR + Insertion Historique
app.post('/api/update-stats', async (req, res) => {
    // Le mod mis à jour enverra également le champ gameVersion
    const { uuid, serverIp, playTimeDelta, gameVersion } = req.body;
    if (!uuid) return res.status(400).json({ error: "UUID manquant" });

    const formattedDate = new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const addedTime = Number(playTimeDelta) || 0;
    const currentVersion = gameVersion || "1.20.4"; // Valeur par défaut si non spécifié
    const currentServer = serverIp || "Inconnu";

    try {
        // 1. Sauvegarde dans la table globale des statistiques
        const { data: existingPlayer } = await supabase
            .from('tracker_stats')
            .select('*')
            .eq('uuid', uuid)
            .single();

        let currentTotalTime = addedTime;

        if (existingPlayer) {
            currentTotalTime = existingPlayer.totalTime + addedTime;
            await supabase
                .from('tracker_stats')
                .update({
                    totalTime: currentTotalTime,
                    lastServer: currentServer,
                    lastLogin: formattedDate
                })
                .eq('uuid', uuid);
        } else {
            await supabase
                .from('tracker_stats')
                .insert([{
                    uuid: uuid,
                    totalTime: currentTotalTime,
                    lastServer: currentServer,
                    lastLogin: formattedDate
                }]);
        }

        // 2. Nouveauté : Insertion de la ligne de session dans la table historique
        await supabase
            .from('server_history')
            .insert([{
                uuid: uuid,
                server_ip: currentServer,
                game_version: currentVersion,
                play_time: addedTime,
                played_at: formattedDate
            }]);

        console.log(`[Supabase System] Sync complète pour ${uuid} (${currentServer} | ${currentVersion} | +${addedTime}min)`);
        res.status(200).json({ status: "synced", totalTime: currentTotalTime });

    } catch (dbError) {
        console.error("[Supabase Erreur Ingestion] :", dbError.message);
        res.status(500).json({ error: "Échec de l'écriture dans l'historique Supabase." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`==> Minecraft Tracker prêt sur le port ${PORT}`);
});
