if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module" })
            console.log('Service Worker registrada! ;)', reg)
        } catch(err) {
            console.log(':( Service Worker registro falhou: ', err)
        }
    })
}

let posicaoInical
let clicks = 0
const warning = document.getElementById('warning')
const capturarLocalizacao = document.getElementById('localizacao')
const encontrarLocalizacao = document.getElementById('buscar')
const latitude = document.getElementById('latitude')
const longitude = document.getElementById('longitude')
const map = document.getElementById('gmap_canvas')
const latinput = document.getElementById('latInput')
const longinput = document.getElementById('longInput')
const sucesso = (posicao) => {
    posicaoInical = posicao
    latitude.innerHTML = posicaoInical.coords.latitude
    longitude.innerHTML = posicaoInical.coords.longitude
    map.src = `https://maps.google.com/maps?q=${posicaoInical.coords.latitude},${posicaoInical.coords.longitude}&z=13&ie=UTF8&iwloc=&output=embed`
    try {
        localStorage.setItem('latitude', String(posicaoInical.coords.latitude))
        localStorage.setItem('longitude', String(posicaoInical.coords.longitude))
    } catch (error) {
        console.log('Não foi possível salvar coordenadas no localStorage', error)
    }
}

const buscar = () => {
    warning.innerHTML = 'Parabéns, você conseguiu clicar no botão! E o premio de usuário mais persistnte vai para... você!!!'
    latitude.innerHTML = latinput.value
    longitude.innerHTML = longinput.value
    map.src = `https://maps.google.com/maps?q=${latinput.value},${longinput.value}&z=13&ie=UTF8&iwloc=&output=embed`
    // salvar coordenadas digitadas no localStorage
    try {
        localStorage.setItem('coord', `${latitude.innerHTML},${longitude.innerHTML}`)
    } catch (e) {
        console.warn('Não foi possível salvar coordenadas no localStorage', e)
    }
}

const erro = (error) => {
    let errorMessage
    switch(error.code){
        case 0:
            errorMessage = "Erro desconhecido"
        break
        case 1:
            errorMessage = "Permissão negada!"
        break
        case 2:
            errorMessage = "Captura de posição indisponivel!"
        break
        case 3:
            errorMessage = "Tempo de solicitação excedido!"
        break
    }
    console.log('Ocorreu um erro: ' + errorMessage)
}

const random = (min, max) => {
    return Math.random() * (max - min) + min
}

const annoying = () =>{
    latinput.value = random(-90, 90).toFixed(6)
    longinput.value = random(-90, 90).toFixed(6)
    setTimeout(annoying, 100)
}

capturarLocalizacao.addEventListener('click', () => {
    clicks++
    switch(clicks) {
        case 1:
            warning.style.visibility = 'visible'
        break
        case 2:
            warning.innerHTML = 'pare!'
        break
        case 3:
            warning.innerHTML = 'sério, pare agora!'
        break
        case 4:
            warning.innerHTML = 'é o seu último aviso...'
        break
        case 5:
            warning.innerHTML = '...porfavor...'
        break
        case 6:
            warning.innerHTML = 'ok, você venceu. Eu desisto. Vamos lá clique'
        break
        case 7:
            warning.innerHTML = 'Parabéns, você clicou no botão! E o premio de usuário mais persistnte vai para... você!!!'
        break
        case 8:
            navigator.geolocation.getCurrentPosition(sucesso, erro)
        break
        case 9:
            warning.innerHTML = '...'
        break
        case 10:
            warning.innerHTML = 'ok, você já conseguiu o que queria. Pare de clicar!'
        break
        case 11:
            warning.style.visibility = 'hidden'
        break
        }
})

encontrarLocalizacao.addEventListener('click', () => buscar())

annoying()