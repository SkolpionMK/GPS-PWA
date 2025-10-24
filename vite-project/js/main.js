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
}

const buscar = () => {
    latitude.innerHTML = latinput.value
    longitude.innerHTML = longinput.value
    map.src = `https://maps.google.com/maps?q=${latinput.value},${longinput.value}&z=13&ie=UTF8&iwloc=&output=embed`
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

capturarLocalizacao.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(sucesso, erro)
})

encontrarLocalizacao.addEventListener('click', () => buscar())