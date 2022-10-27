var uri = 'https://amazing-events.herokuapp.com/api/events';
let menu = document.getElementById("menu");
let menuC= document.getElementById('event')
let checks = document.getElementById("checks");
let eventos = [];
let category = [];
let formBusqueda = document.getElementById("formBusqueda");
let paginaA = document.getElementById('indicador')
let tabla1 = document.getElementById('eStatics')
let tabla2 = document.getElementById('upcE')
let tabla3 = document.getElementById('pastE')

obtenerDatos(uri)

//cards
function mostrarCards(cardsE) {
  cardsE.forEach((evento) => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<img src="${evento.image}" class="card-img-top" alt="${evento.name}">
            <div class="card-body  d-flex flex-column justify-content-between">
                <h5 class="card-title">${evento.name}</h5>
                <p id="descripcion" class="card-text">${evento.description}</p>
                <p class="card-text">price: $ ${evento.price}</p>
                <a href="./card.html?id=${evento._id}" class="btn btn-primary">Details</a>
            </div>`;
    menu.appendChild(card);
  });
}

function pintarCard(card) {
  let cardG = document.createElement("div");
  cardG.className = "card mb-3";
  cardG.id = "tarjetaGrande";
  cardG.innerHTML = `
  <div class="row g-0 h-100">
  <div class="col-md-6 p-3 border border-dark text-center">
  <img src=${card.image} class="h-100 rounded-start cardImage w-100" alt="...">
  </div>
  <div id="texto" class="col-md-6 p-3 border border-dark">
  <div id="texto1" class="card-body">
  <h5 class="card-title">${card.name}</h5>
  <h6>Category</h6>
  <p class="card-text">${card.category}</p>
  <h6>Description</h6>
  <p class="card-text"> ${card.description}</p>
  <h6>Place</h6>
  <p class="card-text"> ${card.place}</p>
  <h6>Price</h6>
  <p class="card-text">$ ${card.price}</p>
  </div>
  </div>
  </div>
  </div>`;

  console.log(cardG);
  menuC.appendChild(cardG)
}

//checkboxs
function mostrarChecks(eventos) {
  eventos.forEach((evento) => {
    if (!category.includes(evento.category)) {
      category.push(evento.category);
      let chek = document.createElement("div");
      chek.className = "form-check form-switch";
      chek.innerHTML = `<input class="form-check-input" type="checkbox" role="switch" id="${evento.category}">
    <label class="form-check-label" for="${evento.category}"> <p class="text-white me-1">${evento.category}</p> </label>`;
      checks.appendChild(chek);
    }
  });
};

//FILTRO
function buscador() {
  // let buscador = document.getElementsByClassName("buscador");
  formBusqueda.addEventListener("input", () => {
    let filtro1 = searchC(eventos);
    let filtro2 = filtrarbusqueda(filtro1);
    limpiarHtml();
    if (filtro2.length != 0) {
      mostrarCards(filtro2);
    } else {
      emptyCards();
    }
  });
}
//FUNCIONES//

//OBTENCIÓN DE DATOS
function obtenerDatos(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (paginaA.value == 'index') {
        eventos = data.events
        mostrarCards(eventos);
        mostrarChecks(eventos)
        buscador()
      } else if (paginaA.value == 'pastE') {
        eventos = data.events.filter(evento => evento.date < data.currentDate)
        mostrarCards(eventos)
        mostrarChecks(eventos)
        buscador()
      } else if (paginaA.value == 'upcoming') {
        eventos = data.events.filter(evento => evento.date > data.currentDate)
        mostrarCards(eventos)
        mostrarChecks(eventos)
        buscador()
      } else if (paginaA.value == 'pCard') {
        eventos = data.events
        let parametrosUrl = location.search;
        let parametros = new URLSearchParams(parametrosUrl);
        let id = parametros.get("id");
        let evenFiltrado = eventos.find(evento => evento._id == id)
        pintarCard(evenFiltrado)
      } else if (paginaA.value == 'stats') {
        eventos = data.events
        filtrarTablas(eventos)
      }
    })
}


//BUSCADOR
function searchC(check) {
  let texto = formBusqueda[8];
  texto.value.toLowerCase();
  let busquedaFiltrada1 = check.filter(
    (busqueda) =>
      busqueda.name.toLowerCase().includes(texto.value) ||
      busqueda.description.toLowerCase().includes(texto.value) ||
      busqueda.category.toLowerCase().includes(texto.value)
  );
  limpiarHtml();
  if (busquedaFiltrada1.length == 0) {
    limpiarHtml();
    emptyCards();
  }
  if (texto.value == "") {
    limpiarHtml();
    mostrarCards(eventos);
  }
  mostrarCards(busquedaFiltrada1);
  return busquedaFiltrada1;
}

//FUNCIONALIDAD DE LOS CHECKS
function pintarChecks() {
  checks.addEventListener("change", () => {
    let filtro1 = searchC(eventos);
    let filtro2 = filtrarbusqueda(filtro1);
    limpiarHtml();
    if (filtro2.length != 0) {
      mostrarCards(filtro2);
    } else {
      emptyCards();
    }
  });
}

//Fx de Event Listener
function filtrarbusqueda(arrayAFiltrar) {
  limpiarHtml();
  let check = document.querySelectorAll("input[type='checkbox']");
  let arrayChbx = Array.from(check);
  let switchChecked = arrayChbx.filter((swbx) => swbx.checked);
  let switchA = switchChecked.map((elemnt) => elemnt.id);
  if (switchChecked != "") {
    let filtrado = arrayAFiltrar.filter((evento) =>
      switchA.includes(evento.category)
    );
    return filtrado;
  } else {
    return arrayAFiltrar;
  }
}

//FUNCION PARA LIMPIAR EL MENU
function limpiarHtml() {
  menu.innerHTML = "";
}

//FUNCION DE FILTRADO VACIO
function emptyCards() {
  let empty = document.createElement("div");
  empty.className = "card text-bg-dark w-100 text-center";
  empty.innerHTML = `<img src="https://cdn.writermag.com/2019/03/question-marks.jpg" class="card-img" alt="...">
  <div id="ordenar" class="card-img-overlay">
  <h3 class="card-title text-white bg-dark">Nothing Here! Please, search with another thing</h3>
  </div>
  </div>`;
  menu.appendChild(empty);
}

//FUNCION DE TABLAS
function filtrarTablas(array) {
  let pastStc = array.filter(evento => (parseInt(evento.assistance) / parseInt(evento.capacity)))
  let upcStc = array.filter(evento => (parseInt(evento.estimate) / parseInt(evento.capacity)))
  let indices = []
  let maximos = []
  let minimos = []
  pastStc.forEach(past => {
    indices.push(parseInt(past.assistance) / parseInt(past.capacity))
  })
  upcStc.forEach(upc => {
    indices.push(parseInt(upc.estimate) / parseInt(upc.capacity))
  })

  let indMax = Math.max(...indices)
  let indMin = Math.min(...indices)

  //Llenar máximos
  pastStc.forEach(past => {
    if (parseInt(past.assistance) / parseInt(past.capacity) == indMax) {
      maximos.push(past)
    }
  })
  upcStc.forEach(upc => {
    if (parseInt(upc.estimate) / parseInt(upc.capacity) == indMax) {
      maximos.push(upc)
    }
  })
  //Llenar mínimos
  pastStc.forEach(past => {
    if (parseInt(past.assistance) / parseInt(past.capacity) == indMin) {
      minimos.push(past)
    }
  })
  upcStc.forEach(upc => {
    if (parseInt(upc.estimate) / parseInt(upc.capacity) == indMin) {
      minimos.push(upc)
    }
  })

  //Capacidad de Maximos
  let capacityA = []

  maximos.forEach(evento => {
    evento.capacity
    capacityA.push(parseInt(evento.capacity))
  })
  let highAttendance = Math.max(...capacityA)
  let maxAttendance = maximos.filter(evento => evento.capacity == highAttendance)

  //Capacidad de Mínimos
  let capacityB = []

  minimos.forEach(evento => {
    evento.capacity
    capacityB.push(parseInt(evento.capacity))
  })
  let lowAttendance = Math.max(...capacityB)
  let minAttendance = minimos.filter(evento => evento.capacity == lowAttendance)


  let capacidad = []
  array.forEach(evento => capacidad.push(parseInt(evento.capacity)))
  let capMayor = Math.max(...capacidad)
  let capacidadMax = array.filter(evento => evento.capacity == capMayor)

  let tabla = document.createElement('tr')
  tabla.className = 'table-light'
  tabla.innerHTML = `
    <td class= 'col-4'>  
      ${maxAttendance[0].name} (${indMax * 100}%)
    </td>
    <td class= 'col-4'>
     ${minAttendance[0].name} (${indMin * 100}%)
    </td>
    <td class= 'col-4'>
      ${capacidadMax[0].name} (${capacidadMax[0].capacity})
    </td>
  `;
  tabla1.appendChild(tabla)

  //Tabla de Upcoming

let categoryUpc=[]


upcStc.forEach(evento=>{
  if(!categoryUpc.includes(evento.category)){
    categoryUpc.push(evento.category)
    let revenues= upcStc.filter(upc=> upc.category==evento.category)
    let revenues2= revenues.map(evento=> parseInt(evento.estimate)*evento.price)
    let revenuesReduce= revenues2.reduce((valorAnterior, valorActual) =>{
      return valorAnterior+valorActual
    })
    let attendance= upcStc.filter(upc=> upc.category==evento.category).map(evento=> parseInt(evento.estimate)/parseInt(evento.capacity)).reduce((valorAnterior, valorActual) =>{
      return valorAnterior+valorActual
    })/revenues2.length
    let attendanceFinal= attendance*100
 
    let tabla = document.createElement('tr')
    tabla.className= 'table-light'
    tabla.innerHTML=`
    <td class= 'col-4'>  
      ${evento.category}
    </td>
    <td class= 'col-4 text-end'>
     $ ${revenuesReduce} 
    </td>
    <td class= 'col-4 text-end'>
      ${attendanceFinal.toFixed(2)} %
    </td>
    `;
    tabla2.appendChild(tabla)
  }})

  //TABLA DE PAST

  let categoryPast=[]

  pastStc.forEach(evento=>{
    if(!categoryPast.includes(evento.category)){
      categoryPast.push(evento.category)
      let revenues= pastStc.filter(past=> past.category==evento.category)
      let revenues2= revenues.map(evento=> parseInt(evento.assistance)*evento.price)
      let revenuesReduce= revenues2.reduce((valorAnterior, valorActual) =>{
        return valorAnterior+valorActual
      })
      let attendance= pastStc.filter(past=> past.category==evento.category).map(evento=> parseInt(evento.assistance)/parseInt(evento.capacity)).reduce((valorAnterior, valorActual) =>{
        return valorAnterior+valorActual
      })/revenues2.length
      let attendanceFinal= attendance*100
  
  
      let tabla = document.createElement('tr')
      tabla.className= 'table-light'
      tabla.innerHTML=`
      <td class= 'col-4'>  
        ${evento.category}
      </td>
      <td class= 'col-4 text-end'>
       $ ${revenuesReduce} 
      </td>
      <td class= 'col-4 text-end'>
        ${attendanceFinal.toFixed(2)} %
      </td>
      `;
      tabla3.appendChild(tabla)
    }})
   
    
      }

 
