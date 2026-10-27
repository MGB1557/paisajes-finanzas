document.addEventListener("DOMContentLoaded", function () {
    // 1. Botón para borrar todos los datos del año
    const btnBorrarTodo = document.getElementById("btnBorrarTodo");
    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener("click", function () {
            let confirmacion = confirm("⚠️ ATENCIÓN: ¿Estás seguro de que quieres borrar TODOS los datos del año? Se perderán todos los ingresos, ahorros y gastos registrados, y no se podrán recuperar.");
            if (confirmacion) {
                localStorage.removeItem("misDatosFinancierosPro");
                location.reload();
            }
        });
    }
    
    // 2. Lista de enlaces de paisajes naturales
    const paisajesAlegres = [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1426604966848-d7adac902bff?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?auto=format&fit=crop&w=400&q=80"
    ];

   function cambiarFotoAleatoria() {
    const etiquetaImagen = document.getElementById("imagenPaisaje");
    if (etiquetaImagen) {
        // 1. Elegimos un paisaje aleatorio de tu lista
        const indiceAleatorio = Math.floor(Math.random() * paisajesAlegres.length);
        const urlElegida = paisajesAlegres[indiceAleatorio];

        // 2. Foto de reserva ultrarrápida y segura por si la web de la foto falla
        const fotoReserva = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

        // 3. Si la foto de internet falla o tarda, salta esto automáticamente sin dejar la app rota:
        etiquetaImagen.onerror = function() {
            console.warn("La imagen no se pudo cargar, usando imagen de respaldo segura.");
            etiquetaImagen.src = fotoReserva;
            // Prevenimos bucles infinitos si fallara la de reserva
            etiquetaImagen.onerror = null; 
        };

        // 4. Asignamos la foto seleccionada
        etiquetaImagen.src = urlElegida;
    }
}
// Y esta línea va FUERA, suelta abajo del todo para que ordene que se ejecute al abrir la app:
window.addEventListener("DOMContentLoaded", cambiarFotoAleatoria);

    // 3. Selección de elementos del DOM
    const selectMes = document.getElementById("selectMes");
    const formAnadirGasto = document.getElementById("formAnadirGasto");
    const inputIngreso = document.getElementById("inputIngreso");
    const inputAhorro = document.getElementById("inputAhorro");
    const inputNombre = document.getElementById("inputNombre");
    const inputPrecio = document.getElementById("inputPrecio");
    const selectCategoria = document.getElementById("selectCategoria");
    const listaGastos = document.getElementById("listaGastos");
    const spanTotal = document.getElementById("totalGastos");
    const spanSaldo = document.getElementById("saldoRestante");
    const alertaPresupuesto = document.getElementById("alertaPresupuesto");
    const barraProgreso = document.getElementById("barraProgreso");
    const btnVaciar = document.getElementById("btnVaciar");

    const anualIngresos = document.getElementById("anualIngresos");
    const anualAhorro = document.getElementById("anualAhorro");
    const anualGastos = document.getElementById("anualGastos");

    let datosMeses = JSON.parse(localStorage.getItem("misDatosFinancierosPro")) || {};

    const mesesOrden = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function obtenerMesActual() {
        return selectMes ? selectMes.value : "Enero";
    }

    function guardarEnMemoria() {
        localStorage.setItem("misDatosFinancierosPro", JSON.stringify(datosMeses));
    }

    function guardarYActualizar() {
        guardarEnMemoria();
        actualizarPantalla();
    }

    function cargarDatosMes() {
        let mesActual = obtenerMesActual();
        cambiarFotoAleatoria();
        
        if (!datosMeses[mesActual]) {
            datosMeses[mesActual] = {
                sueldo: "",
                ahorro: "",
                gastos: []
            };
            guardarEnMemoria();
        }

        if (inputIngreso) inputIngreso.value = datosMeses[mesActual].sueldo;
        if (inputAhorro) inputAhorro.value = datosMeses[mesActual].ahorro;
        actualizarPantalla();
    }

    if (selectMes) {
        selectMes.addEventListener("change", cargarDatosMes);
    }

    if (inputIngreso) {
        inputIngreso.addEventListener("input", function () {
            let mes = obtenerMesActual();
            datosMeses[mes].sueldo = inputIngreso.value;
            guardarYActualizar();
        });
        inputIngreso.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (inputAhorro) inputAhorro.focus(); } });
    }

    if (inputAhorro) {
        inputAhorro.addEventListener("input", function () {
            let mes = obtenerMesActual();
            datosMeses[mes].ahorro = inputAhorro.value;
            guardarYActualizar();
        });
        inputAhorro.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); if (inputNombre) inputNombre.focus(); } });
    }

    if (formAnadirGasto) {
        formAnadirGasto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            let nombreProducto = inputNombre ? inputNombre.value.trim() : "";
            let precioProducto = inputPrecio ? parseFloat(inputPrecio.value) : NaN;
            let categoriaGasto = selectCategoria ? selectCategoria.value : "📦 Otros";

            if (nombreProducto === "" || isNaN(precioProducto) || precioProducto <= 0) {
                alert("Por favor, introduce un nombre y un precio válidos.");
                return;
            }

            let mes = obtenerMesActual();
            if (!datosMeses[mes]) {
                datosMeses[mes] = { sueldo: "", ahorro: "", gastos: [] };
            }

            datosMeses[mes].gastos.push({
                nombre: nombreProducto,
                precio: precioProducto,
                categoria: categoriaGasto
            });

            guardarYActualizar();

            if (inputNombre) inputNombre.value = "";
            if (inputPrecio) inputPrecio.value = "";
            if (selectCategoria) selectCategoria.selectedIndex = 0;
            if (inputNombre) inputNombre.focus();
        });
    }

    if (btnVaciar) {
        btnVaciar.addEventListener("click", function () {
            let mes = obtenerMesActual();
            if (confirm(`¿Seguro que quieres vaciar todos los gastos de ${mes}?`)) {
                if (datosMeses[mes]) {
                    datosMeses[mes].gastos = [];
                    guardarYActualizar();
                }
            }
        });
    }

    function calcularEstadisticasAnuales() {
        let totalIngresosAnual = 0;
        let totalAhorroAnual = 0;
        let totalGastosAnual = 0;

        for (let mes of mesesOrden) {
            let datos = datosMeses[mes];
            if (datos && (datos.sueldo !== "" || (datos.gastos && datos.gastos.length > 0))) {
                totalIngresosAnual += parseFloat(datos.sueldo) || 0;
                totalAhorroAnual += parseFloat(datos.ahorro) || 0;

                if (datos.gastos && Array.isArray(datos.gastos)) {
                    for (let g of datos.gastos) {
                        totalGastosAnual += g.precio;
                    }
                }
            }
        }

        if (anualIngresos) anualIngresos.textContent = `${totalIngresosAnual.toFixed(2)} €`;
        if (anualAhorro) anualAhorro.textContent = `${totalAhorroAnual.toFixed(2)} €`;
        if (anualGastos) anualGastos.textContent = `${totalGastosAnual.toFixed(2)} €`;
    }

    function actualizarPantalla() {
        let mes = obtenerMesActual();
        let mesActualData = datosMeses[mes] || { sueldo: "", ahorro: "", gastos: [] };

        if (listaGastos) {
            listaGastos.innerHTML = "";
        }
        let sumaTotal = 0;

        if (mesActualData.gastos && Array.isArray(mesActualData.gastos)) {
            for (let i = 0; i < mesActualData.gastos.length; i++) {
                let item = mesActualData.gastos[i];
                sumaTotal += item.precio;

                if (listaGastos) {
                    let li = document.createElement("li");

                    let textoGasto = document.createElement("span");
                    let catValida = item.categoria || "📦 Otros";
                    textoGasto.innerHTML = `<span class="etiqueta-categoria">${catValida}</span> ${item.nombre} — ${item.precio.toFixed(2)} €`;

                    let botonBorrar = document.createElement("button");
                    botonBorrar.textContent = "❌";
                    botonBorrar.className = "btn-borrar-item";
                    botonBorrar.title = "Eliminar gasto";

                    botonBorrar.addEventListener("click", function () {
                        mesActualData.gastos.splice(i, 1);
                        guardarYActualizar();
                    });

                    li.appendChild(textoGasto);
                    li.appendChild(botonBorrar);
                    listaGastos.appendChild(li);
                }
            }
        }

        if (spanTotal) spanTotal.textContent = `${sumaTotal.toFixed(2)} €`;

        let sueldoActual = parseFloat(mesActualData.sueldo) || 0;
        let ahorroDeseado = parseFloat(mesActualData.ahorro) || 0;
        let saldoDisponible = sueldoActual - ahorroDeseado - sumaTotal;

        if (spanSaldo) spanSaldo.textContent = `${saldoDisponible.toFixed(2)} €`;

        let presupuestoTotalMaximo = sueldoActual - ahorroDeseado;
        if (barraProgreso) {
            if (presupuestoTotalMaximo > 0) {
                let porcentajeGastado = (sumaTotal / presupuestoTotalMaximo) * 100;
                if (porcentajeGastado > 100) porcentajeGastado = 100;
                barraProgreso.style.width = `${porcentajeGastado}%`;

                if (porcentajeGastado >= 85) {
                    barraProgreso.style.backgroundColor = "#d9534f";
                } else if (porcentajeGastado >= 60) {
                    barraProgreso.style.backgroundColor = "#f0ad4e";
                } else {
                    barraProgreso.style.backgroundColor = "#4CAF50";
                }
            } else {
                barraProgreso.style.width = "0%";
            }
        }

        if (spanSaldo && alertaPresupuesto) {
            if (saldoDisponible < 0) {
                spanSaldo.style.color = "#d9534f";
                alertaPresupuesto.style.display = "block";
            } else {
                spanSaldo.style.color = "#2f4546";
                alertaPresupuesto.style.display = "none";
            }
        }

        calcularEstadisticasAnuales();
        inicializarGrafico();
    }

    // --- COPIA DE SEGURIDAD ---
    const btnExportar = document.getElementById("btnExportar");
    if (btnExportar) {
        btnExportar.addEventListener("click", function () {
            let datosCrudos = localStorage.getItem("misDatosFinancierosPro");
            if (!datosCrudos) {
                alert("No hay datos guardados todavía para exportar.");
                return;
            }

            let blob = new Blob([datosCrudos], { type: "application/json" });
            let url = URL.createObjectURL(blob);
            
            let a = document.createElement("a");
            a.href = url;
            a.download = "copia-seguridad-finanzas.json";
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    const inputImportar = document.getElementById("inputImportar");
    if (inputImportar) {
        inputImportar.addEventListener("change", function (evento) {
            let archivo = evento.target.files[0];
            if (!archivo) return;

            let lector = new FileReader();
            lector.onload = function (e) {
                try {
                    let datosLeidos = JSON.parse(e.target.result);
                    if (typeof datosLeidos === "object" && datosLeidos !== null) {
                        localStorage.setItem("misDatosFinancierosPro", JSON.stringify(datosLeidos));
                        alert("¡Copia de seguridad restaurada con éxito! La página se recargará.");
                        location.reload();
                    } else {
                        alert("El archivo no tiene el formato correcto.");
                    }
                } catch (error) {
                    alert("Hubo un error al leer el archivo.");
                }
            };
            lector.readAsText(archivo);
        });
    }

    // --- MODO OSCURO ---
    const btnModoOscuro = document.getElementById("btnModoOscuro");
    const modoOscuroGuardado = localStorage.getItem("modoOscuroActivo");
    if (modoOscuroGuardado === "true") {
        document.body.classList.add("dark-mode");
        if (btnModoOscuro) btnModoOscuro.textContent = "☀️";
    }

    if (btnModoOscuro) {
        btnModoOscuro.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            let esOscuro = document.body.classList.contains("dark-mode");
            btnModoOscuro.textContent = esOscuro ? "☀️" : "🌙";
            localStorage.setItem("modoOscuroActivo", esOscuro);
        });
    }

    // --- GRÁFICO VISUAL (CHART.JS) ---
    let miGrafico = null;

    function inicializarGrafico() {
        const ctx = document.getElementById("graficoGastosMeses");
        if (!ctx) return;

        let datosGastosPorMes = mesesOrden.map(mes => {
            let datos = datosMeses[mes];
            if (!datos || !datos.gastos) return 0;
            return datos.gastos.reduce((total, g) => total + g.precio, 0);
        });

        if (miGrafico) {
            miGrafico.destroy();
        }

        miGrafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
                datasets: [{
                    label: 'Gastos (€)',
                    data: datosGastosPorMes,
                    backgroundColor: '#4CAF50',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    

    // Arranque inicial
    cambiarFotoAleatoria();
    cargarDatosMes();
    inicializarGrafico();
});