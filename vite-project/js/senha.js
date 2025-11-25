import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('usuariosDB', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('usuarios', {
                             keyPath: 'nome' 
                        });
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!")
                }
            }
        })
        showResult("Banco de dados aberto.")
    } catch (e) {
       showResult("Erro ao criar o banco de dados: " + e.message)
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    createDB();
});

const caractere = document.getElementById('caractere')
const senha = document.getElementById('senha')
const inserirSenha = document.getElementById('inserir')
const apagarSenha = document.getElementById('apagar')
const cadastrar = document.getElementById('cadastrar')
const slider = document.getElementById('slider')

const caracteres = []
for (let i = 32; i <= 126; i++) {
    caracteres.push(String.fromCharCode(i))
}

slider.addEventListener('input', () => {
    caractere.textContent = caracteres[parseInt(slider.value)]
})

const inserir = () => {
    senha.value += caractere.textContent
}

const apagar = () => {
    senha.value = senha.value.slice(0, -1)
}

async function addData(usuario) {
    const tx = await db.transaction('usuarios', 'readwrite');
    const store = tx.objectStore('usuarios');
    store.add(usuario);
    await tx.done;
}

async function getData() {
    if (!db) {
        showResult("O banco de dados está fechado")
        return;
    }

    const tx = await db.transaction('usuarios', 'readonly');
    const store = tx.objectStore('usuarios');
    const allUsuarios = await store.getAll();
    showResult(JSON.stringify(allUsuarios));
}

function showResult(message) {
    console.log(message)
}

inserirSenha.addEventListener('click', () => {
    inserir()
})

apagarSenha.addEventListener('click', () => {
    apagar()
})

const cadastrarUsuario = () => {
    const nome = sessionStorage.getItem('usuario')
    const senhaUsuario = senha.value

    if (!nome) {
        alert('Por favor, volte e defina um nome de usuário!')
        return
    }

    if (!senhaUsuario) {
        alert('Por favor, defina uma senha!')
        return
    }

    const coordenadas = localStorage.getItem('coord')
    
    const usuario = {
        id: nome,
        nome: nome,
        senha: senhaUsuario,
        coordenadas: coordenadas
    }
    addData(usuario)
    console.log('Usuário cadastrado:', usuario)
    alert(`Usuário "${usuario.nome}" cadastrado com sucesso!`)
    console.log('Lista de usuários: ')
    getData()
}

cadastrar.addEventListener('click', cadastrarUsuario)
