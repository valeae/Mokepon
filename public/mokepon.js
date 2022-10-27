const sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
const sectionReiniciarJuego = document.getElementById("reiniciar");
const botonMokeponJugador = document.getElementById("boton-mokepon");
const botonReiniciar = document.getElementById("boton-reiniciar");

const sectionSeleccionarMokepon = document.getElementById("seleccionar-mokepon");

const spanMokeponJugador = document.getElementById("mokepon-jugador");

const spanMokeponContrincante = document.getElementById("mokepon-contrincante");

const spanVidasMokepon = document.getElementById("vidas-mokepon");
const spanVidasContrincante = document.getElementById("vidas-contrincante");

const sectionMensajes = document.getElementById("resultado");
const ataqueDelJugador = document.getElementById("ataque-del-jugador");
const ataqueDelContrincante = document.getElementById("ataque-del-contrincante");
const contenedorTajetas = document.getElementById("contenedor-tarjetas");
const contenedorAtaques = document.getElementById("contenedor-ataques");

const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null
let contrincanteId = null
let mokepones = [];
let mokeponesContrincantes = []
let ataqueMokepon = [];
let ataqueContrincante = [];
let opcionDeMokepones;
let inputHipodoge;
let inputCapipepo;
let inputRatigueya;
let mokeponJugador;
let mokeponJugadorObjeto;
let ataquesMokepon;
let ataquesMokeponContrincante;
let botonFuego;
let botonAgua;
let botonTierra;
let botones = [];
let indexAtaqueMokepon;
let indexAtaqueContrincante;
let victoriasMokepon = 0;
let victoriasContrincante = 0;
let vidasJugador = 3;
let vidasEnemigo = 3;
let lienzo = mapa.getContext("2d");
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./imagenes/mapa.jpg";
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoDelMapa = 350;

if (anchoDelMapa > anchoMaximoDelMapa) {
  anchoDelMapa = anchoMaximoDelMapa - 20;
}

alturaQueBuscamos = anchoDelMapa * 600 / 800;

mapa.width = anchoDelMapa;
mapa.height = alturaQueBuscamos;

class Mokepon {
  constructor(nombre, foto, vida, fotoMapa, id= null) {
    this.id = id
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.ataques = [];
    this.ancho = 60;
    this.alto = 60;
    this.x = aleatorio(0, mapa.width - this.ancho);
    this.y = aleatorio(0, mapa.height - this.alto);
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadX = 0;
    this.velocidadY = 0;
  }

  pintarMokepon() {
    lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
  }
}

let hipodoge = new Mokepon("Hipodoge", "./imagenes/hipodoge.png", 5, "./imagenes/cabezah.png");

let capipepo = new Mokepon("Capipepo", "./imagenes/capipepo.png", 5, "./imagenes/cabezac.png");

let ratigueya = new Mokepon("Ratigueya", "./imagenes/ratigueya.png", 5, "./imagenes/cabezar.png");

const HIPODOGE_ATAQUES = [
  { nombre: "AGUA💧", id: "boton-agua" },
  { nombre: "AGUA💧", id: "boton-agua" },
  { nombre: "AGUA💧", id: "boton-agua" },
  { nombre: "FUEGO🔥", id: "boton-fuego" },
  { nombre: "TIERRA🌱", id: "boton-tierra" }

]

hipodoge.ataques.push(...HIPODOGE_ATAQUES);

const CAPIPEPO_ATAQUES = [
  { nombre: "TIERRA🌱", id: "boton-tierra" },
  { nombre: "TIERRA🌱", id: "boton-tierra" },
  { nombre: "TIERRA🌱", id: "boton-tierra" },
  { nombre: "AGUA💧", id: "boton-agua" },
  { nombre: "FUEGO🔥", id: "boton-fuego" }
]

capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
  { nombre: "FUEGO🔥", id: "boton-fuego" },
  { nombre: "FUEGO🔥", id: "boton-fuego" },
  { nombre: "FUEGO🔥", id: "boton-fuego" },
  { nombre: "AGUA💧", id: "boton-agua" },
  { nombre: "TIERRA🌱", id: "boton-tierra" }
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(hipodoge, capipepo, ratigueya);

function iniciarJuego() {
  sectionSeleccionarAtaque.style.display = "none";
  sectionVerMapa.style.display = "none";

  mokepones.forEach((mokepon) => {
    opcionDeMokepones = `
        <input type="radio" name="mokepon" id=${mokepon.nombre} />
        <label class="tarjeta-mokepon" for=${mokepon.nombre}>
          <p>${mokepon.nombre}</p>
          <img src=${mokepon.foto} alt=${mokepon.nombre} />
        </label>
    `;

    contenedorTajetas.innerHTML += opcionDeMokepones;

    inputHipodoge = document.getElementById("Hipodoge");
    inputCapipepo = document.getElementById("Capipepo");
    inputRatigueya = document.getElementById("Ratigueya");
  });

  botonMokeponJugador.addEventListener("click", seleccionarMokeponJugador);
  botonReiniciar.addEventListener("click", reiniciarJuego);

  unirseAlJuego()
}

function unirseAlJuego() {
  fetch("http://192.168.0.13:8080/unirse")
      .then(function (res) {
          console.log(res)
          if (res.ok) {
              res.text()
                  .then(function (respuesta) {
                      console.log(respuesta)
                      jugadorId = respuesta
                  })
          }
      })
}

function seleccionarMokeponJugador() {
  if (inputHipodoge.checked) {
    spanMokeponJugador.innerHTML = inputHipodoge.id;
    mokeponJugador = inputHipodoge.id;
  } else if (inputCapipepo.checked) {
    spanMokeponJugador.innerHTML = inputCapipepo.id;
    mokeponJugador = inputCapipepo.id;
  } else if (inputRatigueya.checked) {
    spanMokeponJugador.innerHTML = inputRatigueya.id;
    mokeponJugador = inputRatigueya.id;
  } else {
    alert("DEBES SELECCIONAR UNO");
    return
  }

  sectionSeleccionarMokepon.style.display = "none";

  seleccionarMokepon(mokeponJugador)
  
  extraerAtaques(mokeponJugador);
  sectionVerMapa.style.display = "flex";
  iniciarMapa();

  seleccionarMokepon(mokeponJugador);
}

function seleccionarMokepon(mokeponJugador) {
  fetch(`http://192.168.0.13:8080/mokepon/${jugadorId}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mokepon: mokeponJugador
    })
  });
}



function extraerAtaques(mokeponJugador) {
  let ataques;
  for (let i = 0; i < mokepones.length; i++) {
    if (mokeponJugador === mokepones[i].nombre) {
      ataques = mokepones[i].ataques;
    }
  }

  mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
  ataques.forEach((ataque) => {
    ataquesMokepon = ` 
    <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button> 
    `;

    contenedorAtaques.innerHTML += ataquesMokepon;
  });

  botonFuego = document.getElementById("boton-fuego");
  botonAgua = document.getElementById("boton-agua");
  botonTierra = document.getElementById("boton-tierra");
  botones = document.querySelectorAll(".BAtaque");
}

function secuenciaAtaque() {
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "FUEGO🔥") {
        ataqueMokepon.push("FUEGO");
        console.log(ataqueMokepon);
        boton.style.background = "#112f58";
        boton.disabled = true;
      } else if (e.target.textContent === "AGUA💧") {
        ataqueMokepon.push("AGUA");
        console.log(ataqueMokepon);
        boton.style.background = "#112f58";
        boton.disabled = true;
      } else {
        ataqueMokepon.push("TIERRA");
        console.log(ataqueMokepon);
        boton.style.background = "#112f58";
        boton.disabled = true;
      }
      if (ataqueMokepon.length === 5) {
        enviarAtaques();
      }
      
    });
  });
}

function enviarAtaques() {
  fetch(`http://192.168.0.13:8080/mokepon/${jugadorId}/ataques`, {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ataques: ataqueMokepon
    })
  })

  intervalo = setInterval(obtenerAtaques, 50)

}

function obtenerAtaques() {
  fetch(`http://192.168.0.13:8080/mokepon/${contrincanteId}/ataques`)
    .then(function (res) {
      if(res.ok) {
        res.json()
          .then(function ({ ataques}) {
            if (ataques.length === 5) {
              ataqueContrincante = ataques
              combate()
            }
          })
      }
    })
}

function seleccionarMokeponContrincante(contrincante) {
  spanMokeponContrincante.innerHTML = contrincante.nombre;
  ataquesMokeponContrincante = contrincante.ataques;
  secuenciaAtaque();
}

function ataqueAleatorioContrincante() {
  console.log("Ataques Conrincante", ataquesMokeponContrincante);
  let ataqueAleatorio = aleatorio(0, ataquesMokeponContrincante.length - 1);

  if (ataqueAleatorio === 0 || ataqueAleatorio === 1) {
    ataqueContrincante.push("FUEGO");
  } else if (ataqueAleatorio === 3 || ataqueAleatorio === 4) {
    ataqueContrincante.push("AGUA");
  } else {
    ataqueContrincante.push("TIERRA");
  }

  console.log(ataqueContrincante);
  iniciarPelea();
}

function iniciarPelea() {
  if (ataqueMokepon.length === 5) {
    combate();
  }
}

function indexAmbosOponentes(mokepon, contrincante) {
  indexAtaqueMokepon = ataqueMokepon[mokepon];
  indexAtaqueContrincante = ataqueContrincante[contrincante];
}

function combate() {
  clearInterval (intervalo)

  for (let index = 0; index < ataqueMokepon.length; index++) {
    if (ataqueMokepon[index] === ataqueContrincante[index]) {
      indexAmbosOponentes(index, index);
      anuncio("EMPATE 🤯‍");
    } else if (
      ataqueMokepon[index] === "FUEGO" &&
      ataqueContrincante[index] === "TIERRA"
    ) {
      indexAmbosOponentes(index, index);
      anuncio("GANASTE 🎉");
      victoriasMokepon++;
      spanVidasMokepon.innerHTML = victoriasMokepon;
    } else if (
      ataqueMokepon[index] === "AGUA" &&
      ataqueContrincante[index] === "FUEGO"
    ) {
      indexAmbosOponentes(index, index);
      anuncio("GANASTE 🎉");
      victoriasMokepon++;
      spanVidasMokepon.innerHTML = victoriasMokepon;
    } else if (
      ataqueMokepon[index] === "TIERRA" &&
      ataqueContrincante[index] === "AGUA"
    ) {
      indexAmbosOponentes(index, index);
      anuncio("GANASTE 🎉");
      victoriasMokepon++;
      spanVidasMokepon.innerHTML = victoriasMokepon;
    } else {
      indexAmbosOponentes(index, index);
      anuncio("PERDISTE 😵");
      victoriasContrincante++;
      spanVidasContrincante.innerHTML = victoriasContrincante;
    }
  }

  revisarVidas();
}

function revisarVidas() {
  if (victoriasMokepon === victoriasContrincante) {
    anuncioFinal("😵‍💫 ESTO FUE UN EMPATE ✌");
  } else if (victoriasMokepon > victoriasContrincante) {
    anuncioFinal("🎉 TU MOKEPON GANO LA BATALLA 🤗");
  } else {
    anuncioFinal("TU MOKEPON NO RESISTIO 😵‍💫");
  }
}

function anuncio(resultado) {
  let nuevoAtaqueDelJugador = document.createElement("p");
  let nuevoAtaqueDelContrincante = document.createElement("p");

  sectionMensajes.innerHTML = resultado;
  nuevoAtaqueDelJugador.innerHTML = indexAtaqueMokepon;
  nuevoAtaqueDelContrincante.innerHTML = indexAtaqueContrincante;

  ataqueDelJugador.appendChild(nuevoAtaqueDelJugador);
  ataqueDelContrincante.appendChild(nuevoAtaqueDelContrincante);
}

function anuncioFinal(resultadoFinal) {
  sectionMensajes.innerHTML = resultadoFinal;

  sectionReiniciarJuego.style.display = "block";
}

function reiniciarJuego() {
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
  mokeponJugadorObjeto.x = mokeponJugadorObjeto.x + mokeponJugadorObjeto.velocidadX;
  mokeponJugadorObjeto.y = mokeponJugadorObjeto.y + mokeponJugadorObjeto.velocidadY;
  lienzo.clearRect(0, 0, mapa.clientWidth, mapa.clientHeight);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);

  mokeponJugadorObjeto.pintarMokepon();

  enviarPosicion(mokeponJugadorObjeto.x, mokeponJugadorObjeto.y)

  mokeponesContrincantes.forEach(function (mokepon) {
    mokepon.pintarMokepon()
    revisarColision(mokepon)
  })

}

function enviarPosicion(x, y) {
  fetch(`http://192.168.0.13:8080/mokepon/${jugadorId}/posicion`, {
      method: "post",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          x,
          y
      })
  })
  .then(function (res) {
    if (res.ok) {
        res.json()
            .then(function ({ contrincantes }) {
                console.log(contrincantes)
                mokeponesContrincantes = contrincantes.map(function (contrincante) {
                    let mokeponContrincante = null
                    const mokeponNombre = contrincante.mokepon.nombre || ""
                    if (mokeponNombre === "Hipodoge") {
                      mokeponContrincante = new Mokepon("Hipodoge", "./imagenes/hipodoge.png", 5, "./imagenes/cabezah.png", contrincante.id);
                    } else if (mokeponNombre === "Capipepo") {
                      mokeponContrincante = new Mokepon("Capipepo", "./imagenes/capipepo.png", 5, "./imagenes/cabezac.png", contrincante.id);
                    } else if (mokeponNombre === "Ratigueya") {
                      mokeponContrincante = new Mokepon("Ratigueya", "./imagenes/ratigueya.png", 5, "./imagenes/cabezar.png", contrincante.id);
                    }
                    
                    

                    mokeponContrincante.x = contrincante.x
                    mokeponContrincante.y = contrincante.y

                    return mokeponContrincante
                    
                })
            })
    }
  })
}

function moverDerecha() {
  mokeponJugadorObjeto.velocidadX = 5;
}

function moverIzquierda() {
  mokeponJugadorObjeto.velocidadX = -5;
}

function moverAbajo() {
  mokeponJugadorObjeto.velocidadY = 5;
}

function moverArriba() {
  mokeponJugadorObjeto.velocidadY = -5;
}

function detenerMovimiento() {
  mokeponJugadorObjeto.velocidadX = 0;
  mokeponJugadorObjeto.velocidadY = 0;
}

function sePresionoUnaTecla(event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba();
      break;
    case "ArrowDown":
      moverAbajo();
      break;
    case "ArrowLeft":
      moverIzquierda();
      break;
    case "ArrowRight":
      moverDerecha();
      break;
    default:
      break;
  }
}

function iniciarMapa() {
  mokeponJugadorObjeto = obtenerObjetoMokepon(mokeponJugador);

  intervalo = setInterval(pintarCanvas, 50);

  window.addEventListener("keydown", sePresionoUnaTecla);

  window.addEventListener("keyup", detenerMovimiento);
}

function obtenerObjetoMokepon() {
  for (let i = 0; i < mokepones.length; i++) {
    if (mokeponJugador === mokepones[i].nombre) {
      return mokepones[i];
    }
  }
}

function revisarColision(contrincante) {
  const arribaContrincante = contrincante.y;
  const abajoContrincante = contrincante.y + contrincante.alto;
  const derechaContrincante = contrincante.x + contrincante.ancho;
  const izquierdaContrincante = contrincante.x;

  const arribaMokepon = mokeponJugadorObjeto.y;
  const abajoMokepon = mokeponJugadorObjeto.y + mokeponJugadorObjeto.alto;
  const derechaMokepon = mokeponJugadorObjeto.x + mokeponJugadorObjeto.ancho;
  const izquierdaMokepon = mokeponJugadorObjeto.x;

  if (
    abajoMokepon < arribaContrincante ||
    arribaMokepon > abajoContrincante ||
    derechaMokepon < izquierdaContrincante ||
    izquierdaMokepon > derechaContrincante
  ) {
    return;
  }
  detenerMovimiento();
  clearInterval(intervalo);
  console.log("Se detecto una colision");
  
  contrincanteId = contrincante.id
  sectionSeleccionarAtaque.style.display = "flex";
  sectionVerMapa.style.display = "none";
  seleccionarMokeponContrincante(contrincante);
}

window.addEventListener("load", iniciarJuego);
