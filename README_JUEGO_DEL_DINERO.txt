EL JUEGO DEL DINERO
===================

Abrir:
Abre index.html en el navegador o sube todos los archivos a GitHub Pages.

Archivos para GitHub:
- index.html
- styles.css
- app.js
- firebase-config.js
- README_JUEGO_DEL_DINERO.txt

Firebase:
firebase-config.js ya contiene la configuracion del proyecto el-juego-del-dinero-d67bf y deja Firebase activo.

Guardado de avance:
El boton Guardar avance guarda el progreso en este dispositivo y, si Firebase esta disponible, tambien lo protege en la base de datos configurada.

Firestore guardara:
- students/{studentId}
- students/{studentId}/attempts/{attemptAutoId}

Contenido:
El juego organiza 5 mundos con 50 zonas por ruta. Cada zona trabaja 15 tipos de actividad. La base total queda en 3.750 actividades generadas: 5 rutas educativas x 50 zonas x 15 formatos.

Unicidad:
Las preguntas se construyen con ruta, edad, mundo, zona, tema, escenario cotidiano y tipo de actividad. Esto evita que una pregunta de Niño se repita en Adolescente, Adulto, Emprendedor General o Mujer Emprendedora, y evita que el mismo mundo reutilice la misma situacion de forma plana.

Actividades:
- Elegir la mejor opcion
- Verdadero util
- Ordenar pasos
- Emparejar ideas
- Clasificar
- Calcular
- Completar frase
- Detectar riesgo
- Actividad express
- Comparar
- Planear
- Explicar facil
- Recordar regla
- Simular consecuencia
- Reto de interes compuesto

Rutas:
- Niño
- Adolescente
- Adulto
- Emprendedor
- Mujer, como subruta dentro de Emprendedor

Entrada por edad:
La pantalla principal pide nombre y rango. Al entrar, el rango elegido bloquea la ruta correspondiente para mantener la progresion pedagogica. Un niño entra a Niño y ve El Tesoro de la Familia; adolescente, adulto y emprendedor entran a su ruta y ven El Rico de la Familia. Las otras rutas quedan desactivadas para ese estudiante. Para cambiar de edad o ruta se debe crear una nueva entrada de estudiante.

Modo administradora:
En la pantalla de entrada se puede abrir "Acceso administradora" e introducir el codigo AURA-ADMIN. Este modo permite revisar todas las rutas, cambiar entre Niño, Adolescente, Adulto, Emprendedor General y Mujer Emprendedora, acceder a todos los mundos y comprobar los dos juegos familiares. Es un control de revision en una web estatica, no un sistema de seguridad de servidor.

Capa avanzada:
Cada respuesta genera una huella financiera en cinco dimensiones: liquidez, seguridad, crecimiento, criterio e impacto. El juego no solo califica respuestas; muestra como cada decision afecta dinero disponible, riesgo, patrimonio, futuro y economia real.

Refuerzo pedagogico:
La ruta Niño empieza por conceptos basicos: que es el dinero, monedas, billetes, alcancia, comprar, pagar, cambio, necesidad, deseo, ahorro y banco. La ruta Adolescente usa ejemplos de mesada, apps, salidas, redes, suscripciones, seguridad digital, inflacion, deuda e inversion simulada. Adulto y Emprendedor avanzan hacia banca, credito, patrimonio, interes compuesto, inversion, impuestos, caja, margen, proveedores, regulacion, crecimiento y legado.

Interaccion:
Los personajes intervienen durante cada mision, cambian el escenario y proponen actividades express. Las actividades ya no se muestran todas como una lista simple: ordenar usa secuencias, emparejar usa tarjetas concepto-ejemplo, clasificar usa cubos, calcular usa panel propio, completar usa hueco, riesgo usa alerta, comparar usa rutas, planear usa tarjetas de plan e interes compuesto usa una banda de crecimiento. Al acertar aparece confeti; al fallar aparece una reaccion visual para reforzar pausa, revision y repeticion.

Situaciones criticas:
Ademas de las 15 actividades de cada mision, aparecen situaciones criticas repentinas cada cierto avance. No cuentan como una de las 15 preguntas ni como nota normal. Funcionan como decisiones de vida real con 3 opciones y consecuencias inmediatas. Estan adaptadas por ruta: Niño trabaja compras sorpresa y cambio mal contado; Adolescente trabaja presion de apps, grupo y suscripciones; Adulto trabaja urgencias del hogar y seguridad bancaria; Emprendedor trabaja caja, proveedores, clientes grandes y margen; Mujer Emprendedora tiene situaciones propias de precio justo, negociacion, autonomia financiera y separacion entre dinero personal y negocio.

Personajes:
Los personajes ya no son avatares planos. Se generan como personajes 3D estilizados con capas, cuerpo, cabeza, orejas, rostro, ojos con seguimiento del cursor, parpadeo, boca animada cuando hablan, gesto, salto y aparicion en las reacciones de acierto o fallo. La version actual conserva los mismos personajes y nombres, pero cambia su formato visual hacia mascota educativa redondeada: cabeza grande, ojos grandes, volumen limpio, cuerpo simple, mejillas, cola, insignia, bocadillo de dialogo, intervencion al tocar el personaje y presentador visible en el tablero familiar. No usa modelos externos; esta version funciona directamente en GitHub Pages. Para una version de realismo tipo consola se podrian sustituir estos personajes por modelos GLB creados en Blender y renderizados con WebGL.

Progreso:
El avance queda separado por ruta: Niño, Adolescente, Adulto, Emprendedor General y Mujer Emprendedora. Completar una zona en una edad ya no desbloquea ni marca como completada la misma zona en otra edad.

Particulas visuales:
El fondo animado cambia por edad, mundo y seccion de juego: entrada, mapa, mision, tablero infantil y tablero avanzado. Ya no usa siluetas vacias: las monedas, billetes, alcancias, tarjetas, banco, seguridad, recibos, calculo, tienda, caja, contrato, acciones, inversion, patrimonio y lanzamiento empresarial se dibujan con relleno, marco y detalles internos. Hogar muestra simbolos de dinero cotidiano y familia; Saber muestra banco, tarjeta, seguridad y documentos; Autonomia muestra recibos, impuestos, vivienda y proteccion; Mercado muestra tienda, caja, precio, venta y trato; Futuro muestra inversion, crecimiento, patrimonio, tiempo y empresas que despegan.

Modo familia:
Incluye dos versiones de tablero familiar segun la ruta activa.

Version infantil: El Tesoro de la Familia
Disponible en la ruta Niño. Es un tablero por turnos con monedas, alcancia, merienda, banco amable, mercado de cromos, mascota, reparaciones, mini puesto familiar, cambio mal contado, cupones, precio que sube, lista de compras, feria de juguetes usados, interes con semillas, celebracion y meta comun. Tiene perdidas suaves, sorpresas y recuperaciones sencillas, sin bolsa agresiva ni quiebras duras.

Version avanzada: El Rico de la Familia
Disponible desde Adolescente en adelante. Esta inspirado en la tension y diversion de los grandes juegos familiares de negociacion, pero no copia sus reglas. Permite jugar por turnos entre varios miembros de la familia. Cada jugador tiene dinero, reserva, deuda, bienestar, reputacion, proteccion, activos y cartera de acciones simuladas.

Objetivo del modo familia:
En la version infantil, competir por construir el mayor tesoro familiar aprendiendo a contar, guardar, esperar, reparar, compartir y cumplir metas. En la version avanzada, competir por ser El Rico de la Familia construyendo el mayor patrimonio neto, pero tambien colaborar para aumentar la meta comun. El juego mezcla diversion, negociacion y aprendizaje: pagar gastos, comprar activos, tomar o evitar deuda, sufrir perdidas, detectar estafas, recuperarse de quiebras, invertir en bolsa simulada y hablar de dinero en familia.

Mecanicas familiares:
- Turnos con dado.
- Fichas de varios jugadores.
- Casillas con gastos, activos, ahorro, prestamos, bolsa, OPI, startups, estafas, hackeos, quiebras, auditorias, inflacion, recuperaciones y eventos.
- Cartas salvajes con desplomes, rebotes de mercado, startups que fracasan, empresas que despegan, estafas, quiebra tecnica, lanzamientos al mercado, dividendos e inflacion.
- Ranking por dinero, reserva, deuda, activos, acciones, reputacion, bienestar y patrimonio neto.
- Meta comun para que la familia compita y coopere a la vez.

Bolsa y empresas:
El modo familiar incluye acciones simuladas como Aura Retail, NovaTech, Casa 360 y Balboa Energy. Los precios se mueven con crashes, booms, OPI y eventos, y ahora el mercado queda guardado dentro de la partida. Tambien hay empresas nuevas que pueden fracasar, quedar en pruebas o salir adelante. Todo es juego educativo y no representa recomendacion financiera real.

Certificados:
Emite certificado por cada mundo al completar sus 10 zonas.
