const proximo = document.querySelector('.btn-link')
const letra = document.getElementById('letra')
const usuario = document.getElementById('usuario')
const inserir = document.getElementById('inserir')
const apagar = document.getElementById('apagar')
let indiceAtual = 0
const caracteres = []
for (let i = 32; i <= 126; i++) {
    caracteres.push(String.fromCharCode(i))
}
const alternarCaracteres = () => {
    letra.textContent = caracteres[indiceAtual]
    indiceAtual = (indiceAtual + 1) % caracteres.length
    setTimeout(alternarCaracteres, 500)
}

alternarCaracteres()

const inserirTexto = () => {
    usuario.value += caracteres[indiceAtual]
}

const apagarTexto = () => {
    usuario.value = usuario.textContent.slice(0, -1)
}

inserir.addEventListener('click', () => {
    inserirTexto()
})
apagar.addEventListener('click', () => {
    apagarTexto()
})

proximo.addEventListener('click', (e) => {
    if (usuario.value.trim() === '') {
        e.preventDefault()
        alert('Por favor, digite um nome de usuário!')
    } else {
        sessionStorage.setItem('usuario', usuario.value)
    }
})