//Elementos del DOM a usar
const tituloClima = document.getElementById('tituloClima')
const inputEstado = document.getElementById('inputEstado')
const busquedaEstado = document.getElementById('busquedaEstado')
const inputMuncipio = document.getElementById('inputMuncipio')
const busquedaMunicipio = document.getElementById('busquedaMuncipio')
const listaMunicipios = document.getElementById('listaMunicipios')
const divPaginacion = document.getElementById('paginacion')
const inicioPagSpan = document.getElementById('inicioPag') 
const finPagSpan = document.getElementById('finPag') 
const munPagSpan = document.getElementById('munPag') 
const botonAntPag = document.getElementById('antPag')
const botonSigPag = document.getElementById('sigPag')

//Sirve para imprimir lista y paginación
let estadoSeleccionado;
let inicioPaginaActual = 0;

//Guarda los climas en los estados
estados.forEach( e => {
    e.Municipios.forEach(m => {
        m.clima = []
        m.clima[0] = datos.find(dato => (dato.idmun == m.idMunicipio && dato.ndia == "0" && e.idEstado == dato.ides))
        m.clima[1] = datos.find(dato => (dato.idmun == m.idMunicipio && dato.ndia == "1" && e.idEstado == dato.ides))
        m.clima[2] = datos.find(dato => (dato.idmun == m.idMunicipio && dato.ndia == "2" && e.idEstado == dato.ides))
        m.clima[3] = datos.find(dato => (dato.idmun == m.idMunicipio && dato.ndia == "3" && e.idEstado == dato.ides))
    })  
})

//Cuando se escribe en el input se ejecuta este código
inputEstado.addEventListener('keyup', () => {
    busquedaEstado.innerHTML = ""
    if(inputEstado.value.length < 1){
        busquedaEstado.classList.add('hidden')
    } else {
        busquedaEstado.classList.remove('hidden')
        const expresion = new RegExp("\\b" + inputEstado.value, "i");
        estadosFiltrados = estados.filter(estado => {
            if(estado.Nombre.toLowerCase().search(expresion) != -1){
                return estado;
            }
        });
        estadosFiltrados.forEach(estado => {
            let nuevoLiEstado = document.createElement('li')
            nuevoLiEstado.classList.add('p-3', 'text-slate-700', 'font-semibold', 'cursor-pointer', 'hover:bg-zinc-300', 'border-b', 'border-b-slate-100')
            nuevoLiEstado.value = estado.idEstado
            nuevoLiEstado.textContent = estado.Nombre
            nuevoLiEstado.onclick = seleccionarEstado
            busquedaEstado.appendChild(nuevoLiEstado)
        })
    }
})

function seleccionarEstado(e) {
    busquedaEstado.classList.add('hidden')
    estadoSeleccionado = estados.find(estado => estado.idEstado == e.target.value)
    inputEstado.value = estadoSeleccionado.Nombre
    munPagSpan.textContent = estadoSeleccionado.Municipios.length
    inicioPaginaActual = 0;
    inputMuncipio.disabled = false
    inputMuncipio.value = ""
    paginacionClimasPorEstado(0)
}

//Cuando se escribe en el input se ejecuta este código
inputMuncipio.addEventListener('keyup', () => {
    busquedaMunicipio.innerHTML = ""
    if(inputMuncipio.value.length < 1){
        busquedaMunicipio.classList.add('hidden')
    } else {
        busquedaMunicipio.classList.remove('hidden')
        const expresion = new RegExp("\\b" + inputMuncipio.value, "i");
        municipiosFiltrados = estadoSeleccionado.Municipios.filter(municipio => {
            if(municipio.Nombre.toLowerCase().search(expresion) != -1){
                return municipio;
            }
        });
        municipiosFiltrados.forEach(municipio => {
            let nuevoLiMunicipio = document.createElement('li')
            nuevoLiMunicipio.classList.add('p-3', 'text-slate-700', 'font-semibold', 'cursor-pointer', 'hover:bg-zinc-300','border-b', 'border-b-slate-100')
            nuevoLiMunicipio.value = municipio.idMunicipio
            nuevoLiMunicipio.textContent = municipio.Nombre
            nuevoLiMunicipio.onclick = seleccionarMunicipio
            busquedaMunicipio.appendChild(nuevoLiMunicipio)
        })
    }
})

function seleccionarMunicipio(e){
    console.log(e.target)
    busquedaMunicipio.classList.add('hidden')
    municipio = estadoSeleccionado.Municipios.find(municipio => municipio.idMunicipio == e.target.value)
    inputMuncipio.value = municipio.Nombre
    mostrarClimaMunicipio(municipio)
}

function paginacionClimasPorEstado(inicio){
    let cantidadMunicipios = estadoSeleccionado.Municipios.length
    
    if(inicio == 0) botonAntPag.classList.add('hidden')
    else botonAntPag.classList.remove('hidden')

    if(cantidadMunicipios <= inicio+10) botonSigPag.classList.add('hidden')
    else botonSigPag.classList.remove('hidden')

    if(estadoSeleccionado.Municipios.length < 10){
        listarClimasPorEstado(0, cantidadMunicipios);
        divPaginacion.classList.remove('flex')
        divPaginacion.classList.add('hidden')
    } else {
        divPaginacion.classList.remove('hidden')
        divPaginacion.classList.add('flex')
        inicioPagSpan.textContent = inicio + 1
        if(inicio+10 > cantidadMunicipios) {
            listarClimasPorEstado(inicio, cantidadMunicipios)
            finPagSpan.textContent = cantidadMunicipios
        } else {
            listarClimasPorEstado(inicio, inicio+10)
            finPagSpan.textContent = inicio + 10
        }
    }
}

botonSigPag.onclick = () => {
    inicioPaginaActual += 10
    paginacionClimasPorEstado(inicioPaginaActual)
}

botonAntPag.onclick = () => {
    inicioPaginaActual -=10
    paginacionClimasPorEstado(inicioPaginaActual)
}

function listarClimasPorEstado(inicio, fin) {
    tituloClima.textContent = ""
    listaMunicipios.innerHTML = ""
    for (let i = inicio; i < fin; i++) {
        const municipio = estadoSeleccionado.Municipios[i];
        let clima = municipio.clima[0]
        let fecha = new Date(clima.dloc.substring(0, 4), clima.dloc.substring(4, 6) - 1, clima.dloc.substring(6, 8));
        listaMunicipios.innerHTML += `
        <div class="p-5 bg-zinc-100 shadow-lg">
            <div class="flex justify-between">
                <h3 class="font-bold uppercase text-slate-700">${clima.nmun}</h3>
                <p class="font-bold uppercase text-slate-700">${fecha.toLocaleDateString()}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3">
                <div class="m-3">
                    <img src="../src/icons/${clima.desciel.replace(/\s/g, '').toLowerCase()}.svg" alt="${clima.desciel}" class="m-auto">
                    <p class="text-center text-slate-600 uppercase">${clima.desciel}</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.probprec}%</p>
                    <p class="text-center text-slate-600 uppercase">Probabilidad Precipitación</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.velvien} km/h</p>
                    <p class="text-center text-slate-600 uppercase">Velocidad del viento</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.dirvienc}</p>
                    <p class="text-center text-slate-600 uppercase">Dirección del viento</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.prec} l/m²</p>
                    <p class="text-center text-slate-600 uppercase">Precipitación</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmax}°C</p>
                    <p class="text-center text-slate-600 uppercase">Temperatura Máxima</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmin}°C</p>
                    <p class="text-center text-slate-600 uppercase">Temperatura Mínima</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.cc}%</p>
                    <p class="text-center text-slate-600 uppercase">Cobertura de nubes</p>
                </div>
            </div>
        </div>`
    }
}

function mostrarClimaMunicipio(municipio) {
    divPaginacion.classList.remove('flex')
    divPaginacion.classList.add('hidden')
    listaMunicipios.innerHTML = ""
    tituloClima.textContent = municipio.Nombre
    municipio.clima.forEach(clima => {
        let fecha = new Date(clima.dloc.substring(0, 4), clima.dloc.substring(4, 6) - 1, clima.dloc.substring(6, 8));
        listaMunicipios.innerHTML += `
        <div class="p-5 bg-zinc-100 shadow-lg">
            <h3 class="font-bold text-xl uppercase text-slate-700 text-center">${fecha.toLocaleDateString()}</h3>
            <div class="grid grid-cols-2 md:grid-cols-3">
                <div class="m-3">
                    <img src="../src/icons/${clima.desciel.replace(" ", '').toLowerCase()}.svg" alt="${clima.desciel}" class="m-auto">
                    <p class="text-center text-slate-600 uppercase">${clima.desciel}</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.probprec}%</p>
                    <p class="text-center text-slate-600 uppercase">Probabilidad Precipitación</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.velvien} km/h</p>
                    <p class="text-center text-slate-600 uppercase">Velocidad del viento</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.dirvienc}</p>
                    <p class="text-center text-slate-600 uppercase">Dirección del viento</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.prec} l/m²</p>
                    <p class="text-center text-slate-600 uppercase">Precipitación</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmax}°C</p>
                    <p class="text-center text-slate-600 uppercase">Temperatura Máxima</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmin}°C</p>
                    <p class="text-center text-slate-600 uppercase">Temperatura Mínima</p>
                </div>
                <div class="m-3 flex flex-col justify-end">
                    <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.cc}%</p>
                    <p class="text-center text-slate-600 uppercase">Cobertura de nubes</p>
                </div>
            </div>
        </div>`
    })
}

climasEstadosPrincipales = [
    estados[0].Municipios[0].clima[0],
    estados[1].Municipios[1].clima[0],
    estados[2].Municipios[2].clima[0],
    estados[3].Municipios[1].clima[0],
    estados[4].Municipios[29].clima[0],
    estados[5].Municipios[2].clima[0],
    estados[6].Municipios[81].clima[0],
    estados[7].Municipios[18].clima[0],
    estados[8].Municipios[6].clima[0],
    estados[9].Municipios[4].clima[0],
    estados[10].Municipios[14].clima[0],
    estados[11].Municipios[28].clima[0],
    estados[12].Municipios[49].clima[0],
    estados[13].Municipios[39].clima[0],
    estados[14].Municipios[107].clima[0],
    estados[15].Municipios[52].clima[0],
    estados[16].Municipios[7].clima[0],
    estados[17].Municipios[16].clima[0],
    estados[18].Municipios[43].clima[0],
    estados[19].Municipios[213].clima[0],
    estados[20].Municipios[136].clima[0],
    estados[21].Municipios[13].clima[0],
    estados[22].Municipios[3].clima[0],
    estados[23].Municipios[27].clima[0],
    estados[24].Municipios[5].clima[0],
    estados[25].Municipios[29].clima[0],
    estados[26].Municipios[3].clima[0],
    estados[27].Municipios[40].clima[0],
    estados[28].Municipios[4].clima[0],
    estados[29].Municipios[111].clima[0],
    estados[30].Municipios[49].clima[0],
    estados[31].Municipios[55].clima[0]
]

climasEstadosPrincipales.forEach(clima => {
    let fecha = new Date(clima.dloc.substring(0, 4), clima.dloc.substring(4, 6) - 1, clima.dloc.substring(6, 8));
    listaMunicipios.innerHTML += `<div class="p-5 bg-zinc-100 shadow-lg">
    <div class="flex justify-between">
        <h3 class="font-bold uppercase text-slate-700">${clima.nmun}, ${clima.nes}</h3>
        <p class="font-bold uppercase text-slate-700">${fecha.toLocaleDateString()}</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-3">
        <div class="m-3">
            <img src="../src/icons/${clima.desciel.replace(/\s/g, '').toLowerCase()}.svg" alt="${clima.desciel}" class="m-auto">
            <p class="text-center text-slate-600 uppercase">${clima.desciel}</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.probprec}%</p>
            <p class="text-center text-slate-600 uppercase">Probabilidad Precipitación</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.velvien} km/h</p>
            <p class="text-center text-slate-600 uppercase">Velocidad del viento</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.dirvienc}</p>
            <p class="text-center text-slate-600 uppercase">Dirección del viento</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.prec} l/m²</p>
            <p class="text-center text-slate-600 uppercase">Precipitación</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmax}°C</p>
            <p class="text-center text-slate-600 uppercase">Temperatura Máxima</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.tmin}°C</p>
            <p class="text-center text-slate-600 uppercase">Temperatura Mínima</p>
        </div>
        <div class="m-3 flex flex-col justify-end">
            <p class="text-center text-xl text-slate-600 font-bold uppercase mb-5">${clima.cc}%</p>
            <p class="text-center text-slate-600 uppercase">Cobertura de nubes</p>
        </div>
    </div>
</div>`
})

