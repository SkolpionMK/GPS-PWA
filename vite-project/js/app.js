import { openDB } from "idb";

/**
 * ============================================
 * GPS PWA - Single Page Application (SPA)
 * ============================================
 * Aplicação de cadastro de usuários com geolocalização
 * Armazena dados em IndexedDB para persistência
 */

// ==========================================
// ESTADO GLOBAL
// ==========================================

let db;
let currentRoute = 'localizacao';

// ==========================================
// INICIALIZAÇÃO
// ==========================================

/**
 * Inicializa a aplicação
 */
async function initApp() {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                const reg = await navigator.serviceWorker.register('/sw.js', { type: "module" });
                console.log('Service Worker registrada! ;)', reg);
            } catch (err) {
                console.log(':( Service Worker registro falhou: ', err);
            }
        });
    }

    // Inicializar banco de dados
    await initDB();

    // Renderizar rota inicial
    renderRoute('localizacao');
}

/**
 * Inicializa IndexedDB
 */
async function initDB() {
    try {
        db = await openDB('usuariosDB', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        if (!db.objectStoreNames.contains('usuarios')) {
                            const store = db.createObjectStore('usuarios', {
                                keyPath: 'nome'
                            });
                            store.createIndex('id', 'id');
                        }
                }
            }
        });
        console.log("Banco de dados inicializado");
    } catch (e) {
        console.error("Erro ao inicializar banco de dados:", e);
    }
}

// ==========================================
// SISTEMA DE ROTEAMENTO
// ==========================================

/**
 * Renderiza uma rota específica da SPA
 */
function renderRoute(route) {
    currentRoute = route;
    const appContainer = document.getElementById('app');
    let template;

    switch (route) {
        case 'localizacao':
            template = document.getElementById('view-localizacao').content.cloneNode(true);
            appContainer.innerHTML = '';
            appContainer.appendChild(template);
            setupLocalizacaoView();
            break;
        case 'nome':
            template = document.getElementById('view-nome').content.cloneNode(true);
            appContainer.innerHTML = '';
            appContainer.appendChild(template);
            setupNomeView();
            break;
        case 'senha':
            template = document.getElementById('view-senha').content.cloneNode(true);
            appContainer.innerHTML = '';
            appContainer.appendChild(template);
            setupSenhaView();
            break;
    }
}

// ==========================================
// VIEW: LOCALIZAÇÃO
// ==========================================

function setupLocalizacaoView() {
    let posicaoInical;
    let clicks = 0;

    const warning = document.getElementById('warning');
    const capturarLocalizacao = document.getElementById('localizacao');
    const encontrarLocalizacao = document.getElementById('buscar');
    const latitude = document.getElementById('latitude');
    const longitude = document.getElementById('longitude');
    const map = document.getElementById('gmap_canvas');
    const latinput = document.getElementById('latInput');
    const longinput = document.getElementById('longInput');
    const prosseguirBtn = document.getElementById('prosseguir-loc');

    const sucesso = (posicao) => {
        posicaoInical = posicao;
        latitude.innerHTML = posicaoInical.coords.latitude;
        longitude.innerHTML = posicaoInical.coords.longitude;
        map.src = `https://maps.google.com/maps?q=${posicaoInical.coords.latitude},${posicaoInical.coords.longitude}&z=13&ie=UTF8&iwloc=&output=embed`;
        try {
            localStorage.setItem('coord', `${posicaoInical.coords.latitude},${posicaoInical.coords.longitude}`);
        } catch (e) {
            console.warn('Não foi possível salvar coordenadas no localStorage', e);
        }
    };

    const buscar = () => {
        warning.innerHTML = 'Parabéns, você conseguiu clicar no botão! E o premio de usuário mais persistnte vai para... você!!!';
        latitude.innerHTML = latinput.value;
        longitude.innerHTML = longinput.value;
        map.src = `https://maps.google.com/maps?q=${latinput.value},${longinput.value}&z=13&ie=UTF8&iwloc=&output=embed`;
        try {
            localStorage.setItem('coord', `${latinput.value},${longinput.value}`);
        } catch (e) {
            console.warn('Não foi possível salvar coordenadas no localStorage', e);
        }
    };

    const erro = (error) => {
        let errorMessage;
        switch (error.code) {
            case 0:
                errorMessage = "Erro desconhecido";
                break;
            case 1:
                errorMessage = "Permissão negada!";
                break;
            case 2:
                errorMessage = "Captura de posição indisponivel!";
                break;
            case 3:
                errorMessage = "Tempo de solicitação excedido!";
                break;
        }
        console.log('Ocorreu um erro: ' + errorMessage);
    };

    const random = (min, max) => {
        return Math.random() * (max - min) + min;
    };

    const annoying = () => {
        latinput.value = random(-90, 90).toFixed(6);
        longinput.value = random(-90, 90).toFixed(6);
        setTimeout(annoying, 100);
    };

    capturarLocalizacao.addEventListener('click', () => {
        clicks++;
        switch (clicks) {
            case 1:
                warning.style.visibility = 'visible';
                break;
            case 2:
                warning.innerHTML = 'pare!';
                break;
            case 3:
                warning.innerHTML = 'sério, pare agora!';
                break;
            case 4:
                warning.innerHTML = 'é o seu último aviso...';
                break;
            case 5:
                warning.innerHTML = '...porfavor...';
                break;
            case 6:
                warning.innerHTML = 'ok, você venceu. Eu desisto. Vamos lá clique';
                break;
            case 7:
                warning.innerHTML = 'Parabéns, você clicou no botão! E o premio de usuário mais persistnte vai para... você!!!';
                break;
            case 8:
                navigator.geolocation.getCurrentPosition(sucesso, erro);
                break;
            case 9:
                warning.innerHTML = '...';
                break;
            case 10:
                warning.innerHTML = 'ok, você já conseguiu o que queria. Pare de clicar!';
                break;
            case 11:
                warning.style.visibility = 'hidden';
                break;
        }
    });

    encontrarLocalizacao.addEventListener('click', () => buscar());

    prosseguirBtn.addEventListener('click', () => {
        if (!latinput.value || !longinput.value) {
            alert('Por favor, insira ou capture coordenadas válidas!');
            return;
        }
        renderRoute('nome');
    });

    annoying();
}

// ==========================================
// VIEW: NOME
// ==========================================

function setupNomeView() {
    const letra = document.getElementById('letra');
    const usuario = document.getElementById('usuario');
    const inserir = document.getElementById('inserir-nome');
    const apagar = document.getElementById('apagar-nome');
    const voltarBtn = document.getElementById('voltar-nome');
    const proximoBtn = document.getElementById('proximo-nome');

    let indiceAtual = 0;
    const caracteres = [];
    for (let i = 32; i <= 126; i++) {
        caracteres.push(String.fromCharCode(i));
    }

    const alternarCaracteres = () => {
        letra.textContent = caracteres[indiceAtual];
        indiceAtual = (indiceAtual + 1) % caracteres.length;
        setTimeout(alternarCaracteres, 500);
    };

    alternarCaracteres();

    inserir.addEventListener('click', () => {
        usuario.value += caracteres[indiceAtual];
    });

    apagar.addEventListener('click', () => {
        usuario.value = usuario.value.slice(0, -1);
    });

    voltarBtn.addEventListener('click', () => renderRoute('localizacao'));

    proximoBtn.addEventListener('click', () => {
        if (usuario.value.trim() === '') {
            alert('Por favor, digite um nome de usuário!');
            return;
        }
        sessionStorage.setItem('usuario', usuario.value);
        renderRoute('senha');
    });
}

// ==========================================
// VIEW: SENHA
// ==========================================

function setupSenhaView() {
    const caractere = document.getElementById('caractere');
    const senha = document.getElementById('senha');
    const inserirSenha = document.getElementById('inserir-senha');
    const apagarSenha = document.getElementById('apagar-senha');
    const cadastrar = document.getElementById('cadastrar');
    const slider = document.getElementById('slider');
    const voltarBtn = document.getElementById('voltar-senha');

    const caracteres = [];
    for (let i = 32; i <= 126; i++) {
        caracteres.push(String.fromCharCode(i));
    }

    slider.addEventListener('input', () => {
        caractere.textContent = caracteres[parseInt(slider.value)];
    });

    inserirSenha.addEventListener('click', () => {
        senha.value += caractere.textContent;
    });

    apagarSenha.addEventListener('click', () => {
        senha.value = senha.value.slice(0, -1);
    });

    cadastrar.addEventListener('click', async () => {
        const nome = sessionStorage.getItem('usuario');
        const senhaUsuario = senha.value;
        const coordenadas = localStorage.getItem('coord');

        if (!nome) {
            alert('Por favor, volte e defina um nome de usuário!');
            return;
        }

        if (!senhaUsuario) {
            alert('Por favor, defina uma senha!');
            return;
        }

        const usuario = {
            id: Math.random().toString(36).substr(2, 9),
            nome: nome,
            senha: senhaUsuario,
            coordenadas: coordenadas
        };

        try {
            const tx = db.transaction('usuarios', 'readwrite');
            const store = tx.objectStore('usuarios');
            await store.add(usuario);
            await tx.done;

            console.log('Usuário cadastrado:', usuario);
            alert(`Usuário "${usuario.nome}" cadastrado com sucesso!`);
            sessionStorage.removeItem('usuario');
            renderRoute('localizacao');
        } catch (e) {
            console.error('Erro ao salvar usuário:', e);
            alert('Erro ao salvar usuário: ' + e.message);
        }
    });

    voltarBtn.addEventListener('click', () => renderRoute('nome'));
}

// ==========================================
// INICIAR APP
// ==========================================

window.addEventListener('DOMContentLoaded', initApp);
