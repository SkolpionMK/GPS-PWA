import { openDB } from "idb"

let db;
const nome = document.getElementById('nomeCompleto')
const data = document.getElementById('dataNascimento')
const latitude = document.getElementById('latitude')
const longitude = document.getElementById('longitude')
const cadastrar = document.getElementById('cadastrar')
const listar = document.getElementById('listar')
const deletar = document.getElementById('deletar')

async function createDB() {
    try {
        db = await openDB('nascidos', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        showResult('Banco de dados criado!');
                    }
                }
        });
        showResult('Banco de dados aberto.');
    } catch (e) {
        showResult('Erro ao criar o banco de dados: ' + e.message);
    }
}

window.addEventListener('DOMContentLoaded', async event => {
    createDB();
});

async function addData() {
    const tx = await db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.add({nome: nome.value, dataNasc: data.value, latitude: latitude.innerHTML, longitude: longitude.innerHTML});
    await tx.done;
}

async function getData() {
    if(db === undefined) {
        showResult('O banco de dados está fechado!');
        return;
    }
    const tx = db.transaction('pessoas', 'readonly');
    const store = tx.objectStore('pessoas');
    const allData = await store.getAll();
    if(allData) {
        showResult("Nascidos cadastrados: " + JSON.stringify(allData));
    } else {
        showResult("Nenhum nascido cadastrado.");
    }
}

async function deleteData() {
    const tx = db.transaction('pessoas', 'readwrite');
    const store = tx.objectStore('pessoas');
    store.delete(nome.value);
    await tx.done;
    showResult("Usuário deletado com sucesso!");
}

cadastrar.addEventListener('click', async () => {
    await addData();
    showResult('Nascido cadastrado com sucesso!');
});

listar.addEventListener('click', async () => {
    await getData();
});

deletar.addEventListener('click', async () => {
    await deleteData();
});

const showResult = (message) => {
    const result = document.getElementById('result');
    result.innerHTML = message;
}
