const STORAGE_KEY = "juegoDineroProgresoV3";
const FIREBASE_SETTINGS = {
  enabled: true,
  config: {
    apiKey: "AIzaSyBnLwAIGRq5WKlrWRV4Ceh9BJjED9H8GV8",
    authDomain: "el-juego-del-dinero-d67bf.firebaseapp.com",
    projectId: "el-juego-del-dinero-d67bf",
    storageBucket: "el-juego-del-dinero-d67bf.firebasestorage.app",
    messagingSenderId: "921460370852",
    appId: "1:921460370852:web:a5669adf75d2d034afe531",
    measurementId: "G-S5NZBENW8T"
  }
};

let firebaseDb = null;
let firebaseApi = null;
let firebaseReady = false;

const worlds = [
  { id: "hogar", region: "Isla Inicio", name: "El Hogar", countries: ["Moneda", "Billete", "Alcancía", "Compra", "Cambio", "Lista", "Meta", "Semana", "Ayuda", "Familia"], description: "Primeros pasos: dinero, precios, cambio, ahorro y decisiones pequeñas.", color: "#22D3EE", shape: "polygon(8% 28%,24% 8%,48% 14%,70% 4%,92% 24%,82% 54%,64% 62%,58% 92%,34% 80%,10% 70%)" },
  { id: "saber", region: "Valle Aprendiz", name: "El Saber", countries: ["Banco", "Tarjeta", "Cuenta", "Recibo", "Precio", "Deseo", "Necesidad", "Plan", "Registro", "Elección"], description: "Organización, banca básica, seguridad y comparación antes de gastar.", color: "#D4AF37", shape: "polygon(18% 8%,44% 16%,66% 8%,86% 22%,74% 42%,88% 68%,56% 88%,36% 74%,12% 84%,22% 48%)" },
  { id: "autonomia", region: "Ciudad Autonomía", name: "La Autonomía", countries: ["Ingreso", "Gasto", "Reserva", "Deuda", "Crédito", "Riesgo", "Seguro", "Contrato", "Impuesto", "Derecho"], description: "Ingresos, gastos, crédito, protección, impuestos y decisiones responsables.", color: "#FF00FF", shape: "polygon(6% 44%,20% 26%,44% 30%,58% 14%,90% 26%,76% 48%,94% 72%,58% 86%,38% 68%,12% 76%)" },
  { id: "mercado", region: "Bahía Mercado", name: "El Mercado", countries: ["Cliente", "Oferta", "Valor", "Costo", "Venta", "Equipo", "Caja", "Precio", "Calidad", "Ética"], description: "Economía real: clientes, precios, valor, ventas, caja, proveedores y ética.", color: "#50C878", shape: "polygon(12% 20%,38% 8%,58% 24%,84% 18%,94% 48%,74% 64%,68% 90%,42% 76%,18% 88%,6% 56%)" },
  { id: "futuro", region: "Cumbre Futuro", name: "El Futuro", countries: ["Inversión", "Interés", "Patrimonio", "Vivienda", "Retiro", "Tecnología", "Fintech", "Moneda digital", "Escala", "Legado"], description: "Interés compuesto, inversión, patrimonio, inflación, tecnología y futuro.", color: "#FFBF00", shape: "polygon(10% 16%,42% 6%,74% 18%,88% 40%,78% 70%,54% 86%,28% 76%,14% 92%,6% 62%,22% 42%)" }
];

const curricula = {
  1: [
    "Qué es el dinero", "Monedas y billetes", "Para qué sirve una alcancía", "Comprar algo pequeño", "Pagar y recibir cambio", "Mirar el precio", "Necesidad y deseo", "Ahorrar una moneda", "Pedir ayuda antes de pagar", "Cuidar tus cosas",
    "Hacer una lista simple", "Elegir entre dos cosas", "Guardar para una meta", "Merienda con presupuesto", "Juguete ahora o meta después", "Recibo de compra", "Banco como lugar seguro", "Tarjeta con permiso adulto", "Clave secreta", "No compartir datos",
    "Precios que suben", "Precios que bajan", "Dinero que alcanza menos", "Comparar dos precios", "Oferta que no necesitas", "Esperar antes de comprar", "Arreglar antes de comprar nuevo", "Compartir sin quedarte sin nada", "Fondo para mascota", "Sorpresa en casa",
    "Dinero prestado", "Devolver lo prestado", "Interés con semillas", "Interés compuesto con alcancía", "Ahorro semanal", "Meta de cumpleaños", "Viaje familiar", "Comprar con calma", "Presión de amigos", "Publicidad brillante",
    "Pequeño puesto de venta", "Costo de hacer algo", "Ganancia sencilla", "Separar gastar y guardar", "Cuidar el patrimonio de casa", "Electricidad, agua y comida", "Plan B familiar", "Revisar monedas", "Celebrar una meta", "Elegir la siguiente meta"
  ],
  2: [
    "Mesada con propósito", "Gasto diario en snacks", "Apps y compras dentro de apps", "Delivery y cargos extra", "Suscripciones olvidadas", "Salida con amigos", "Presión del grupo", "Compra por redes", "Primer precio como ancla", "Comparar antes de pagar",
    "Presupuesto de una semana", "Registro de gastos", "Meta grande", "Ahorro automático pequeño", "Tarjeta prepago", "Cuenta juvenil", "Transferencia y comprobante", "Claves y doble verificación", "Enlaces falsos", "Datos personales",
    "Inflación en la vida diaria", "Deflación explicada simple", "Poder de compra", "Costo de oportunidad", "Deuda y promesa de pago", "Préstamo entre amigos", "Interés simple", "Interés compuesto", "Pago mínimo", "Historial de crédito",
    "Riesgo y recompensa", "Inversión simulada", "Diversificar", "Horizonte de tiempo", "Noticias y decisiones", "Cripto con prudencia", "Educación como inversión", "Primer ingreso", "Proyecto escolar rentable", "Side hustle adolescente",
    "Valor frente a precio", "Contrato simple", "Garantía y compra usada", "Consumo responsable", "Ahorro para viaje", "Fondo de emergencia joven", "Sesgo de confirmación", "Comprar porque todos compran", "Plan financiero de 30 días", "Ruta personal de futuro"
  ],
  3: [
    "Ingreso neto", "Presupuesto mensual", "Gastos fijos", "Gastos variables", "Ahorro automático", "Fondo de emergencia", "Banca diaria", "Comisiones", "Tarjeta de crédito", "Pago mínimo",
    "Historial crediticio", "Préstamo responsable", "Seguro esencial", "Protección familiar", "Impuestos personales", "Contrato laboral", "Negociación salarial", "Salud financiera", "Documentos importantes", "Ciberseguridad bancaria",
    "Inflación doméstica", "Deflación y consumo", "Poder de compra", "Deuda ordenada", "Compra grande", "Alquiler o compra", "Hipoteca básica", "Mantenimiento del hogar", "Educación de hijos", "Cuidado de mayores",
    "Ingresos secundarios", "Inversión a largo plazo", "Interés compuesto", "Diversificación", "Riesgo y retorno", "Fondos y activos", "Moneda extranjera", "Fintech y regulación", "Activos digitales con cautela", "Plan de pensión",
    "Patrimonio familiar", "Protección de datos", "Derechos del consumidor", "Plan ante crisis", "Revisión anual", "Inversión ética", "Donaciones y comunidad", "Asesoría financiera", "Legado", "Objetivos de vida"
  ],
  4: [
    "Idea de negocio", "Problema del cliente", "Propuesta de valor", "Primer cliente", "Costo inicial", "Precio de venta", "Margen de ganancia", "Flujo de caja", "Separar cuenta personal y negocio", "Registro de ingresos",
    "Oferta mínima", "Validación de mercado", "Canal de venta", "Marca y confianza", "Inventario", "Proveedor", "Contrato básico", "Crédito productivo", "Impuestos del negocio", "Ciberseguridad del negocio",
    "Inflación y precios", "Deflación y demanda", "Punto de equilibrio", "Caja ante crisis", "Cobrar a tiempo", "Financiamiento", "Socios e inversionistas", "Indicadores básicos", "Equipo", "Delegar con control",
    "Reinvertir ganancias", "Interés compuesto empresarial", "Patrimonio del negocio", "Diversificación de ingresos", "Riesgo operativo", "Plan de continuidad", "Economía circular rentable", "Ética comercial", "Tecnología y automatización", "Fintech para negocio",
    "Activos digitales con prudencia", "Expansión a nuevos mercados", "Escalar sin perder control", "Gobierno financiero", "Reserva empresarial", "Negociación avanzada", "Valor de marca", "Regulación", "Empresa vendible", "Legado empresarial"
  ]
};

const womanEntrepreneurTopics = [
  "Mujer emprendedora: autonomía financiera", "Mujer emprendedora: relación sana con el dinero", "Mujer emprendedora: separar dinero personal y negocio", "Mujer emprendedora: fondo de seguridad", "Mujer emprendedora: precio justo", "Mujer emprendedora: cobrar sin miedo", "Mujer emprendedora: negociar con datos", "Mujer emprendedora: registrar cada venta", "Mujer emprendedora: cliente ideal", "Mujer emprendedora: propuesta de valor",
  "Mujer emprendedora: costo de producir", "Mujer emprendedora: margen de ganancia", "Mujer emprendedora: flujo de caja", "Mujer emprendedora: punto de equilibrio", "Mujer emprendedora: crédito productivo", "Mujer emprendedora: historial financiero", "Mujer emprendedora: contrato básico", "Mujer emprendedora: protección legal", "Mujer emprendedora: datos de clientes", "Mujer emprendedora: seguridad digital",
  "Mujer emprendedora: formalización", "Mujer emprendedora: impuestos", "Mujer emprendedora: compras a proveedor", "Mujer emprendedora: inventario", "Mujer emprendedora: vender con confianza", "Mujer emprendedora: presencia digital", "Mujer emprendedora: red de apoyo", "Mujer emprendedora: mentoría", "Mujer emprendedora: liderazgo financiero", "Mujer emprendedora: delegar con control",
  "Mujer emprendedora: reinvertir ganancias", "Mujer emprendedora: interés compuesto", "Mujer emprendedora: patrimonio propio", "Mujer emprendedora: diversificación", "Mujer emprendedora: inflación y precios", "Mujer emprendedora: crisis de caja", "Mujer emprendedora: plan de continuidad", "Mujer emprendedora: tecnología para vender", "Mujer emprendedora: fintech para negocio", "Mujer emprendedora: socios e inversionistas",
  "Mujer emprendedora: escalar sin agotarse", "Mujer emprendedora: economía circular", "Mujer emprendedora: consumo responsable", "Mujer emprendedora: ética comercial", "Mujer emprendedora: indicadores básicos", "Mujer emprendedora: expansión segura", "Mujer emprendedora: gobierno financiero", "Mujer emprendedora: valor de marca", "Mujer emprendedora: empresa vendible", "Mujer emprendedora: legado empresarial"
];

const levels = {
  1: { name: "Niño", duration: 25, intro: "misiones cortas con palabras sencillas, casa, tienda, colegio y alcancía" },
  2: { name: "Adolescente", duration: 35, intro: "retos con mesada, apps, salidas, redes, seguridad y metas" },
  3: { name: "Adulto", duration: 55, intro: "finanzas personales, hogar, crédito, inversión y patrimonio" },
  4: { name: "Emprendedor", duration: 75, intro: "negocio, caja, cliente, mercado y ruta Mujer Emprendedora" }
};

function char(c, role) {
  return { name: c[0], species: c[1], color: c[2], kind: c[3], coat: c[4] || "", role };
}

const child = [
  ["Eliseo", "Hurón", "#22D3EE", "ferret", "sable"], ["Louise", "Hurón", "#DC143C", "ferret", "dark"], ["Baco", "Hurón", "#FFBF00", "ferret", "gold"], ["Athenea", "Hurón", "#9400D3", "ferret", "silver"], ["Gaia", "Hurón", "#50C878", "ferret", "cream"], ["Elsa", "Hurón", "#E0FFFF", "ferret", "white"], ["Lau", "Setter inglés", "#D4AF37", "setter", "white-gold"], ["Julio", "Mestizo de mastín", "#0047AB", "mastiff", "brown"], ["Boston", "Gata con manchas", "#FF00FF", "cat", "calico"], ["Penélope", "Gata blanca", "#F3F4F6", "cat", "white"]
].map(c => char(c, "guía infantil"));
const teen = [["Vale Byte", "Creadora digital", "#FF00FF", "human"], ["Nico Flow", "Productor urbano", "#00FF00", "human"], ["Danna Trend", "Curadora de estilo", "#FFD1DC", "human"], ["Leo Gamer", "Estratega gamer", "#22D3EE", "human"], ["Maya Data", "Analista joven", "#D4AF37", "human"], ["Thiago Fix", "Maker", "#50C878", "human"]].map(c => char(c, "reto adolescente"));
const adult = [["Clara Balance", "Mentora financiera", "#FFD1DC", "human"], ["Marco Reserva", "Planificador", "#50C878", "human"], ["Nora Banco", "Especialista bancaria", "#22D3EE", "human"], ["Eli Patrimonio", "Consultora patrimonial", "#D4AF37", "human"]].map(c => char(c, "mentor adulto"));
const entrepreneur = [["Kai Venture", "Fundador", "#FFBF00", "human"], ["Rafa Bolsa", "Analista de mercado", "#22D3EE", "human"], ["Mila CFO", "Directora financiera", "#D4AF37", "human"], ["Tomás Scale", "Operador de crecimiento", "#0047AB", "human"], ["Zoe Lab", "Innovadora fintech", "#9400D3", "human"]].map(c => char(c, "mentor emprendedor"));
const woman = [["Ari Tech", "Mujer tech", "#00FF00", "human"], ["Sofía Capital", "Inversionista", "#D4AF37", "human"], ["Luna Pitch", "Emprendedora", "#FF00FF", "human"], ["Noa Legal", "Mentora legal", "#E0FFFF", "human"], ["Iris Mercado", "Estratega comercial", "#50C878", "human"]].map(c => char(c, "mentora mujer"));
const pools = { 1: child, 2: teen, 3: adult, 4: entrepreneur };

const positions = [[[6, 18], [24, 8], [46, 17], [70, 9], [83, 29], [70, 50], [48, 43], [24, 61], [10, 42], [42, 75]], [[18, 9], [38, 18], [60, 10], [80, 28], [66, 45], [84, 66], [58, 82], [36, 68], [16, 80], [28, 44]], [[8, 45], [20, 26], [44, 30], [58, 14], [82, 28], [74, 48], [90, 70], [58, 84], [38, 66], [14, 74]], [[12, 20], [38, 10], [58, 24], [82, 18], [90, 48], [72, 63], [65, 84], [42, 74], [20, 86], [8, 56]], [[10, 18], [40, 8], [72, 20], [85, 40], [76, 68], [54, 84], [30, 74], [14, 88], [8, 61], [24, 42]]];

const activityTypes = [
  { key: "choose", label: "Elegir la mejor opción" },
  { key: "true", label: "Verdadero útil" },
  { key: "order", label: "Ordenar pasos" },
  { key: "match", label: "Emparejar ideas" },
  { key: "classify", label: "Clasificar" },
  { key: "calc", label: "Calcular" },
  { key: "fill", label: "Completar frase" },
  { key: "risk", label: "Detectar riesgo" },
  { key: "express", label: "Actividad express" },
  { key: "compare", label: "Comparar" },
  { key: "plan", label: "Planear" },
  { key: "explain", label: "Explicar fácil" },
  { key: "memory", label: "Recordar regla" },
  { key: "simulate", label: "Simular consecuencia" },
  { key: "compound", label: "Reto de interés compuesto" }
];

const contexts = {
  1: ["en casa", "en la tienda", "en el colegio", "con la alcancía", "con una merienda", "con un juguete", "con la mascota", "con una lista familiar"],
  2: ["con la mesada", "en una app", "en una salida", "en redes", "con una suscripción", "con una compra digital", "con un proyecto escolar", "con el primer ingreso"],
  3: ["en el presupuesto mensual", "con la banca diaria", "con una deuda", "con un seguro", "con una compra grande", "con la inversión familiar", "con el patrimonio", "con un plan de retiro"],
  4: ["en la caja del negocio", "con un cliente", "con un proveedor", "con el inventario", "con una campaña", "con un crédito productivo", "con una inversión", "con la expansión"]
};

const surprises = {
  1: ["El precio sube una moneda.", "Aparece algo bonito que no estaba en la lista.", "La mascota necesita comida.", "Un amigo dice: cómpralo ya.", "Falta revisar el cambio."],
  2: ["La app suma un cargo extra.", "La oferta termina en diez minutos.", "El grupo presiona para gastar.", "Un enlace pide datos personales.", "La suscripción se renueva sola."],
  3: ["Llega un gasto inesperado.", "Sube una comisión.", "La inflación cambia el presupuesto.", "Una cuota vence antes de lo esperado.", "Una inversión baja esta semana."],
  4: ["Un cliente paga tarde.", "El proveedor sube precios.", "La demanda baja.", "Aparece un costo oculto.", "La caja queda ajustada."]
};

const dimensionKeys = ["liquidez", "seguridad", "crecimiento", "criterio", "impacto"];
const dimensionLabels = { liquidez: "Liquidez", seguridad: "Seguridad", crecimiento: "Crecimiento", criterio: "Criterio", impacto: "Impacto" };
const childDimensionLabels = { liquidez: "Mi bolsillo", seguridad: "Me protejo", crecimiento: "Mi meta crece", criterio: "Pienso antes", impacto: "Ayudo en casa" };
const routeLabels = { "1": "Niño", "2": "Adolescente", "3": "Adulto", "4-general": "Emprendedor General", "4-woman": "Mujer Emprendedora" };
const activityCountPerRoute = 50 * activityTypes.length;
const totalActivityCount = activityCountPerRoute * 5;
const scenarioBank = {
  1: [
    "una moneda aparece en el bolsillo antes de la merienda",
    "la familia prepara una lista corta para la tienda",
    "ves dos precios para un mismo juguete pequeño",
    "la alcancía suena y quieres saber cuánto hay",
    "alguien ofrece un dulce que no estaba planeado",
    "la mascota necesita comida y hay que elegir",
    "un recibo queda sobre la mesa de casa",
    "un amigo quiere que compres sin mirar"
  ],
  2: [
    "la app muestra un cargo pequeño al final",
    "la salida con amigos cuesta más de lo pensado",
    "una suscripción se renueva si nadie la cancela",
    "un enlace promete premio si escribes tus datos",
    "tu mesada debe llegar hasta el viernes",
    "una compra digital parece barata pero suma extras",
    "un proyecto escolar puede venderse en equipo",
    "un anuncio en redes usa urgencia para empujar"
  ],
  3: [
    "el presupuesto mensual recibe un gasto inesperado",
    "el banco cobra una comisión que conviene revisar",
    "la compra grande compite con el fondo de emergencia",
    "una inversión baja justo cuando hay dudas",
    "una factura vence antes de la fecha habitual",
    "un contrato tiene una condición poco visible",
    "la inflación cambia la compra del hogar",
    "una decisión familiar afecta patrimonio y tranquilidad"
  ],
  4: [
    "un cliente pide descuento pero paga tarde",
    "un proveedor sube precios sin avisar",
    "la caja queda justa después de una campaña",
    "un socio propone crecer antes de medir margen",
    "una venta grande exige contrato y cobro claro",
    "el inventario se mueve más lento de lo esperado",
    "una herramienta fintech promete ahorrar tiempo",
    "un mercado nuevo parece atractivo pero exige control"
  ]
};
const levelVerbs = {
  1: ["cuenta", "mira", "pregunta", "guarda", "compara", "espera"],
  2: ["revisa", "compara", "bloquea", "registra", "decide", "protege"],
  3: ["presupuesta", "prioriza", "calcula", "negocia", "protege", "revisa"],
  4: ["valida", "mide", "cobra", "reinvierte", "negocia", "controla"]
};
const familyTiles = [
  { name: "Nómina familiar", type: "income", amount: 120, lesson: "Entra dinero, pero no todo es para gastar." },
  { name: "Supermercado salvaje", type: "need", cost: 65, lesson: "La inflación aprieta: quien compara sobrevive mejor." },
  { name: "Banco: préstamo rápido", type: "loan", amount: 160, debt: 190, lesson: "La deuda da oxígeno, pero vuelve con coste." },
  { name: "Bolsa: comprar acciones", type: "stock", symbol: "AURA", shares: 2, lesson: "Comprar acciones puede subir tu patrimonio o golpear tu caja." },
  { name: "Startup garaje", type: "startup", cost: 140, asset: "Startup garaje", lesson: "Una empresa nueva puede explotar o quemar dinero." },
  { name: "Estafa piramidal", type: "scam", cost: 120, lesson: "Prometer dinero fácil suele esconder una trampa." },
  { name: "Renta y facturas", type: "expense", cost: 90, lesson: "Los gastos fijos ganan si no los planificas." },
  { name: "Fondo antibalas", type: "save", amount: 70, lesson: "La reserva es el cinturón de seguridad financiero." },
  { name: "Negocio familiar", type: "asset", cost: 220, rent: 48, asset: "Negocio familiar", lesson: "Caja, margen y cobro mandan." },
  { name: "Hackeo de tarjeta", type: "fraud", cost: 95, lesson: "La ciberseguridad también es dinero." },
  { name: "OPI relámpago", type: "ipo", symbol: "NOVA", shares: 3, cost: 150, lesson: "Salir al mercado puede disparar o hundir una empresa." },
  { name: "Quiebra técnica", type: "bankruptcy", lesson: "Cuando la deuda ahoga, toca vender, pactar y reconstruir." },
  { name: "Curso de alto impacto", type: "education", cost: 85, asset: "Habilidad premium", lesson: "La habilidad correcta puede cambiar ingresos futuros." },
  { name: "Crash bursátil", type: "marketCrash", lesson: "El mercado castiga a quien invierte sin colchón." },
  { name: "Compra de local", type: "asset", cost: 300, rent: 65, asset: "Local comercial", lesson: "Un activo grande exige caja grande." },
  { name: "Demanda inesperada", type: "expense", cost: 110, lesson: "Los riesgos legales también se presupuestan." },
  { name: "Seguro inteligente", type: "protect", cost: 55, lesson: "La protección parece cara hasta que la necesitas." },
  { name: "Boom de mercado", type: "marketBoom", lesson: "El crecimiento premia al preparado, no al improvisado." },
  { name: "Empresa unicornio", type: "startup", cost: 240, asset: "Empresa unicornio", lesson: "El alto crecimiento exige aguantar volatilidad." },
  { name: "Impuestos duros", type: "expense", cost: 80, lesson: "El rico que no planifica impuestos deja de serlo pronto." },
  { name: "Reestructuración", type: "recovery", amount: 100, lesson: "Recuperarse es parte del juego: negociar, vender y volver." },
  { name: "Inflación feroz", type: "inflation", cost: 45, lesson: "Si todo sube, manda el control del gasto." },
  { name: "Herencia disputada", type: "legacyRisk", lesson: "Sin acuerdos, el patrimonio también se rompe." },
  { name: "El gran trato", type: "deal", cost: 180, rent: 75, asset: "Gran trato", lesson: "El trato bueno se compra con números, no con euforia." },
  { name: "Meta común familiar", type: "goal", amount: 90, lesson: "La familia compite, pero la riqueza real también se comparte." },
  { name: "Auditoría sorpresa", type: "audit", cost: 75, lesson: "Orden documental o golpe de caja." },
  { name: "Rebote financiero", type: "recovery", amount: 140, lesson: "Después de una caída, disciplina y caja abren camino." },
  { name: "Burbuja especulativa", type: "bubble", lesson: "Cuando todos gritan compra, el riesgo suele estar caro." }
];
const stockMarket = {
  AURA: { name: "Aura Retail", price: 55, volatility: 18 },
  NOVA: { name: "NovaTech", price: 40, volatility: 30 },
  CASA: { name: "Casa 360", price: 70, volatility: 14 },
  BAL: { name: "Balboa Energy", price: 62, volatility: 22 }
};
const initialStockMarket = Object.fromEntries(Object.entries(stockMarket).map(([symbol, stock]) => [symbol, { ...stock }]));
const familyEvents = [
  { title: "La acción de moda se desploma", text: "La bolsa cae por resultados malos. Quien concentró demasiado, sangra.", market: -28 },
  { title: "Startup fracasa", text: "Una empresa nueva no logra clientes. Se pierde valor, pero queda aprendizaje.", startupFail: true },
  { title: "Startup sale adelante", text: "Un lanzamiento funciona y atrae compradores. El riesgo pagó.", startupWin: true },
  { title: "Estafa por enlace falso", text: "Quien no tenga protección pierde dinero. Nadie se hace rico regalando sus claves.", cash: -130, needsProtection: true },
  { title: "Quiebra y negociación", text: "Si hay mucha deuda, toca vender activos y renegociar. Duro, pero no final.", bankruptcyCheck: true },
  { title: "Rebote de mercado", text: "Después del miedo, algunas empresas sólidas se recuperan.", market: 22 },
  { title: "Cliente grande paga tarde", text: "Hay ventas, pero no caja. El negocio aprende a cobrar mejor.", cash: -70, assetIncome: 12 },
  { title: "Lanzamiento al mercado", text: "Una empresa entra a bolsa: puede subir fuerte o caer por expectativas.", ipoEvent: true },
  { title: "Inflación golpea la despensa", text: "Los precios suben y la familia ajusta hábitos.", allCost: 35 },
  { title: "Plan de recuperación", text: "Disciplina, venta de activos flojos y reserva: se puede volver.", recovery: 120 },
  { title: "Oferta demasiado perfecta", text: "Rentabilidad fija, urgente y secreta: huele a estafa.", scamTrap: true },
  { title: "Dividendos familiares", text: "Los activos productivos reparten caja.", assetIncome: 30 }
];
const childFamilyTiles = [
  { name: "Salida de casa", type: "income", amount: 40, lesson: "La partida empieza contando lo que tienes." },
  { name: "Merienda", type: "need", cost: 12, lesson: "Primero lo necesario, luego el capricho." },
  { name: "Alcancía mágica", type: "save", amount: 18, lesson: "Guardar un poco te da fuerza para después." },
  { name: "Juguete brillante", type: "gentleLoss", cost: 20, lesson: "Si compras por impulso, tu meta se aleja." },
  { name: "Banco amable", type: "bank", amount: 15, lesson: "El banco guarda dinero con más orden." },
  { name: "Mercado de cromos", type: "swap", lesson: "Cambiar también requiere pensar si es justo." },
  { name: "Mascota necesita comida", type: "need", cost: 16, lesson: "Cuidar a otros también cuesta dinero." },
  { name: "Reparar antes de comprar", type: "repair", cost: 8, amount: 14, lesson: "Arreglar puede ahorrar dinero." },
  { name: "Mini puesto familiar", type: "asset", cost: 35, rent: 10, asset: "Mini puesto", lesson: "Vender algo enseña costo, precio y ganancia." },
  { name: "Cambio mal contado", type: "gentleLoss", cost: 10, lesson: "Revisar el cambio evita perder monedas." },
  { name: "Cupón sorpresa", type: "joy", cost: 0, amount: 12, lesson: "Una buena oportunidad se revisa con calma." },
  { name: "Ayuda en casa", type: "income", amount: 25, lesson: "El esfuerzo también puede generar ingreso." },
  { name: "Precio sube", type: "inflation", cost: 8, lesson: "A veces las cosas cuestan más y ajustamos el plan." },
  { name: "Compartir con la familia", type: "cooperate", amount: 16, lesson: "La familia también gana cuando coopera." },
  { name: "Lista de compras", type: "protect", cost: 6, lesson: "Una lista protege contra compras por impulso." },
  { name: "Feria de juguetes usados", type: "toyMarket", cost: 18, asset: "Juguete cuidado", lesson: "Comprar usado puede cuidar dinero y objetos." },
  { name: "Moneda perdida", type: "gentleLoss", cost: 7, lesson: "Cuidar monedas pequeñas también importa." },
  { name: "Meta de cumpleaños", type: "goal", amount: 22, lesson: "Las metas se construyen en varias vueltas." },
  { name: "Interés con semillas", type: "childCompound", amount: 10, lesson: "Si no sacas todo, lo guardado crece poco a poco." },
  { name: "Celebración familiar", type: "joy", cost: 14, lesson: "Disfrutar está bien cuando hay presupuesto." }
];
const childFamilyEvents = [
  { title: "Aparece una oferta colorida", text: "La familia respira y revisa si estaba en la lista.", cash: -8 },
  { title: "La alcancía pesa más", text: "Las monedas guardadas ayudan a cumplir la meta.", reserve: 18 },
  { title: "Trueque justo", text: "Cambias algo que no usas por algo útil.", cash: 12 },
  { title: "Se rompe un juguete", text: "Repararlo cuesta menos que comprar otro.", cash: -10 },
  { title: "Venta familiar pequeña", text: "Venden limonada, dibujos o juguetes cuidados.", cash: 24, familyGoal: 10 },
  { title: "Precio de la merienda sube", text: "La familia compara y ajusta.", allCost: 6 },
  { title: "Meta cumplida por equipo", text: "Todos aportan y celebran sin gastar todo.", familyGoal: 28 },
  { title: "Moneda encontrada en el bolsillo", text: "Pequeñas cantidades también cuentan.", cash: 9, reserve: 5 }
];

let selectedLevel = +(localStorage.getItem("juegoDineroNivel") || 1);
let onboardingLevel = selectedLevel;
let selectedWorld = 0;
let selectedEntrepreneurTrack = localStorage.getItem("juegoDineroRutaEmprendedor") || "general";
let state = loadState();
let modules = buildModules(selectedLevel);
let activeMission = null;
let activeQuestion = 0;
let activeAnswers = [];
let particleScene = "onboarding";
let refreshParticles = () => {};

function routeKey(level = selectedLevel, track = selectedEntrepreneurTrack) {
  return level === 4 ? `4-${track === "woman" ? "woman" : "general"}` : String(level);
}

function routeLabel(key = routeKey()) {
  return routeLabels[key] || levels[selectedLevel]?.name || "Ruta";
}

function freshRouteProgress() {
  return { tokens: 0, unlocked: 1, completed: {}, scores: {}, profile: profileDefault() };
}

function currentProgress() {
  state.routes = state.routes || {};
  const key = routeKey();
  if (!state.routes[key]) state.routes[key] = freshRouteProgress();
  state.routes[key].completed = state.routes[key].completed || {};
  state.routes[key].scores = state.routes[key].scores || {};
  state.routes[key].profile = { ...profileDefault(), ...(state.routes[key].profile || {}) };
  state.routes[key].unlocked = Math.max(1, state.routes[key].unlocked || 1);
  state.routes[key].tokens = state.routes[key].tokens || 0;
  return state.routes[key];
}

function routeTokenTotal() {
  return Object.values(state.routes || {}).reduce((sum, progress) => sum + (progress.tokens || 0), 0);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("juegoDineroProgresoV2") || "{}";
    const data = { playerName: "", tokens: 0, unlocked: 1, completed: {}, scores: {}, attempts: [], routes: {}, profile: profileDefault(), family: familyDefault(), ...JSON.parse(saved) };
    data.routes = data.routes || {};
    if (Object.keys(data.completed || {}).length && !Object.keys(data.routes).length) {
      const migratedKey = routeKey();
      data.routes[migratedKey] = {
        tokens: data.tokens || 0,
        unlocked: data.unlocked || 1,
        completed: Object.fromEntries(Object.entries(data.completed || {}).map(([id, value]) => [`${migratedKey}-${id}`, value])),
        scores: Object.fromEntries(Object.entries(data.scores || {}).map(([id, value]) => [`${migratedKey}-${id}`, value])),
        profile: { ...profileDefault(), ...(data.profile || {}) }
      };
    }
    data.family = { ...familyDefault(), ...(data.family || {}) };
    data.family.market = { ...stockMarketDefault(), ...(data.family.market || {}) };
    applyMarketSnapshot(data.family.market);
    data.family.players = Array.isArray(data.family.players) && data.family.players.length ? data.family.players.map((player, index) => ({ ...familyPlayer(player.name || `Jugador ${index + 1}`, player.color || "#22D3EE"), ...player, stocks: player.stocks || {}, reputation: player.reputation ?? 50 })) : familyDefault().players;
    return data;
  } catch {
    return { playerName: "", tokens: 0, unlocked: 1, completed: {}, scores: {}, attempts: [], routes: {}, profile: profileDefault(), family: familyDefault() };
  }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  currentProgress();
  state.tokens = routeTokenTotal();
  if (state.family) state.family.market = stockMarketSnapshot();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem("juegoDineroNivel", String(selectedLevel));
  localStorage.setItem("juegoDineroRutaEmprendedor", selectedEntrepreneurTrack);
}

function profileDefault() {
  return { liquidez: 0, seguridad: 0, crecimiento: 0, criterio: 0, impacto: 0, streak: 0, lastInsight: "Cada decisión entrena tu forma de pensar el dinero." };
}

function familyDefault() {
  return {
    open: false,
    started: false,
    turn: 0,
    round: 1,
    lastRoll: 0,
    familyGoal: 0,
    market: stockMarketDefault(),
    log: ["Arranca El Rico de la Familia: gana quien construya patrimonio, sobreviva a crisis y no caiga en trampas."],
    players: [
      familyPlayer("Mamá", "#FFD1DC"),
      familyPlayer("Papá", "#22D3EE"),
      familyPlayer("Hijo/a", "#FFBF00")
    ]
  };
}

function familyPlayer(name, color) {
  return { name, color, position: 0, cash: 450, reserve: 90, debt: 0, joy: 50, reputation: 50, protection: 0, assets: [], stocks: {} };
}

function stockMarketDefault() {
  return Object.fromEntries(Object.entries(initialStockMarket).map(([symbol, stock]) => [symbol, { ...stock }]));
}

function stockMarketSnapshot() {
  return Object.fromEntries(Object.entries(stockMarket).map(([symbol, stock]) => [symbol, { ...stock }]));
}

function applyMarketSnapshot(snapshot) {
  Object.entries(snapshot || {}).forEach(([symbol, stock]) => {
    if (stockMarket[symbol]) Object.assign(stockMarket[symbol], stock);
  });
}

function isChildFamilyMode() {
  return selectedLevel === 1;
}

function currentFamilyTiles() {
  return isChildFamilyMode() ? childFamilyTiles : familyTiles;
}

function currentFamilyEvents() {
  return isChildFamilyMode() ? childFamilyEvents : familyEvents;
}

function familyGameTitle() {
  return isChildFamilyMode() ? "El Tesoro de la Familia" : "El Rico de la Familia";
}

function topicsForLevel(level, track = selectedEntrepreneurTrack) {
  if (level === 4 && track === "woman") return womanEntrepreneurTopics;
  return curricula[level];
}

function buildModules(level, track = selectedEntrepreneurTrack) {
  const activeRoute = routeKey(level, track);
  return topicsForLevel(level, track).map((topic, index) => {
    const worldIndex = Math.floor(index / 10);
    const world = worlds[worldIndex];
    const zone = world.countries[index % 10];
    return {
      id: index + 1,
      key: `${activeRoute}-${index + 1}`,
      route: activeRoute,
      code: `M${index + 1}`,
      topic,
      worldIndex,
      localIndex: index % 10,
      country: zone,
      activities: activityTypes.map((type, activityIndex) => createActivity(topic, index, activityIndex, level, type, world, zone, activeRoute))
    };
  });
}

function createActivity(topic, topicIndex, activityIndex, level, type, world, zone, activeRoute) {
  const place = contexts[level][(topicIndex + activityIndex) % contexts[level].length];
  const nums = numbersFor(level, topicIndex, activityIndex);
  const focus = focusFor(topic);
  const scenario = scenarioFor(level, world, zone, topicIndex, activityIndex);
  const correct = correctText(level, type.key, topic, nums, place, scenario, world, zone);
  const question = questionText(level, type.key, topic, nums, place, scenario, world, zone);
  const options = shuffleOptions([correct, ...wrongOptions(level, type.key, topic, nums, place, scenario, world, zone)], topicIndex * 31 + activityIndex * 17 + level).slice(0, 4);
  if (!options.includes(correct)) options[(topicIndex + activityIndex) % 4] = correct;
  return {
    id: `${activeRoute}-W${world.id}-Z${topicIndex + 1}-A${activityIndex + 1}`,
    type: type.key,
    answerFormat: type.label,
    topic,
    question,
    options: options.map((text, i) => {
      const isCorrect = text === correct;
      return { text, isCorrect, impact: optionImpact(isCorrect, i, focus, level) };
    }),
    place,
    scenario,
    worldName: world.name,
    routeName: routeLabels[activeRoute] || levels[level].name,
    focus,
    lifeEffect: lifeEffect(level, topic, focus),
    prompt: promptFor(level, type.key),
    tip: tipFor(level, type.key)
  };
}

function scenarioFor(level, world, zone, topicIndex, activityIndex) {
  const base = scenarioBank[level][(topicIndex * 7 + activityIndex * 3) % scenarioBank[level].length];
  const verb = levelVerbs[level][(topicIndex + activityIndex) % levelVerbs[level].length];
  const worldText = level === 1 ? `en ${world.name}` : `dentro de ${world.region}`;
  return `${base}; ${worldText}, zona ${zone}, la acción clave es ${verb}`;
}

function numbersFor(level, topicIndex, activityIndex) {
  const sets = {
    1: [[5, 2], [8, 3], [10, 4], [12, 5], [6, 1]],
    2: [[20, 5], [30, 8], [50, 10], [60, 15], [100, 20]],
    3: [[500, 50], [800, 120], [1000, 150], [1200, 200], [300, 45]],
    4: [[100, 60], [250, 140], [500, 330], [1000, 760], [80, 45]]
  };
  return sets[level][(topicIndex + activityIndex) % sets[level].length];
}

function focusFor(topic) {
  const t = topic.toLowerCase();
  if (t.includes("clave") || t.includes("datos") || t.includes("ciber") || t.includes("banco") || t.includes("tarjeta") || t.includes("seguro")) return "seguridad";
  if (t.includes("invers") || t.includes("interés") || t.includes("crecimiento") || t.includes("reinvertir") || t.includes("diversificar")) return "crecimiento";
  if (t.includes("inflación") || t.includes("deflación") || t.includes("precio") || t.includes("presupuesto") || t.includes("caja") || t.includes("liquidez")) return "liquidez";
  if (t.includes("cliente") || t.includes("mercado") || t.includes("proveedor") || t.includes("impuesto") || t.includes("regulación") || t.includes("ética")) return "impacto";
  return "criterio";
}

function topicClean(topic) {
  return topic.replace("Mujer emprendedora: ", "");
}

function questionText(level, key, topic, nums, place, scenario, world, zone) {
  const clean = topicClean(topic);
  const child = {
    choose: `${scenario}. ¿Qué haces primero para entender ${clean.toLowerCase()} sin gastar por impulso?`,
    true: `${scenario}. Toca la frase verdadera que ayuda con ${clean.toLowerCase()}.`,
    order: `${scenario}. Ordena los pasos para practicar ${clean.toLowerCase()} con calma.`,
    match: `${scenario}. Empareja ${clean.toLowerCase()} con el ejemplo que sí puedes ver en tu día.`,
    classify: `${scenario}. Clasifica la decisión: necesidad, deseo o cuidado.`,
    calc: `${scenario}. Si tienes $${nums[0]} y guardas $${nums[1]}, ¿cuánto puedes usar todavía?`,
    fill: `${scenario}. Completa la idea: ${clean.toLowerCase()} me ayuda a...`,
    risk: `${scenario}. ¿Qué señal te avisa que debes parar y preguntar?`,
    express: `${scenario}. Reto express: elige la acción que puedes hacer antes de contar hasta 10.`,
    compare: `${scenario}. Compara dos opciones pequeñas: ¿cuál cuida mejor tu meta?`,
    plan: `${scenario}. Elige un mini plan para probar ${clean.toLowerCase()} esta semana.`,
    explain: `${scenario}. ¿Cómo se lo dirías a otro niño usando palabras fáciles?`,
    memory: `${scenario}. ¿Qué regla corta te ayuda a recordar ${clean.toLowerCase()}?`,
    simulate: `${scenario}. Si decides rápido sin mirar, ¿qué puede pasar en ${zone}?`,
    compound: compoundQuestion(level, nums, clean, scenario)
  };
  if (level === 1) return child[key];
  const teen = {
    choose: `${scenario}. ¿Qué decisión te da más control sobre ${clean.toLowerCase()}?`,
    true: `${scenario}. Selecciona la frase que explica ${clean.toLowerCase()} sin humo ni presión.`,
    order: `${scenario}. Ordena la ruta antes de pagar, guardar o invertir.`,
    match: `${scenario}. Empareja ${clean.toLowerCase()} con una consecuencia real.`,
    classify: `${scenario}. Clasifica la acción según mesada, seguridad y futuro.`,
    calc: `${scenario}. Si recibes $${nums[0]} y separas $${nums[1]}, ¿cuánto queda disponible?`,
    fill: `${scenario}. Completa la frase útil para aplicar ${clean.toLowerCase()}.`,
    risk: `${scenario}. ¿Qué señal muestra riesgo antes de tocar pagar?`,
    express: `${scenario}. Actividad express: elige la revisión que haces antes de decidir.`,
    compare: `${scenario}. ¿Qué opción gana al comparar precio final, uso y meta?`,
    plan: `${scenario}. Elige un plan de 7 días para practicar ${clean.toLowerCase()}.`,
    explain: `${scenario}. ¿Qué explicación demuestra que entendiste el concepto?`,
    memory: `${scenario}. Elige la regla para no caer en impulso, app o presión social.`,
    simulate: `${scenario}. ¿Qué consecuencia aparece si ignoras costo, plazo o seguridad?`,
    compound: compoundQuestion(level, nums, clean, scenario)
  };
  if (level === 2) return teen[key];
  const adult = {
    choose: `${scenario}. ¿Qué decisión sostiene mejor ${clean.toLowerCase()} sin debilitar la reserva?`,
    true: `${scenario}. Elige la definición práctica que sirve para decidir.`,
    order: `${scenario}. Ordena el proceso responsable antes de comprometer dinero.`,
    match: `${scenario}. Empareja ${clean.toLowerCase()} con su aplicación financiera real.`,
    classify: `${scenario}. Clasifica la acción según liquidez, riesgo y patrimonio.`,
    calc: `${scenario}. Si entran $${nums[0]} y reservas $${nums[1]}, ¿cuánto queda para operar?`,
    fill: `${scenario}. Completa la frase financiera que convierte teoría en decisión.`,
    risk: `${scenario}. Detecta el riesgo principal antes de avanzar.`,
    express: `${scenario}. Actividad express: elige la revisión mínima responsable.`,
    compare: `${scenario}. Compara costo total, beneficio, plazo y consecuencia.`,
    plan: `${scenario}. Elige el plan con monto, fecha, responsable y revisión.`,
    explain: `${scenario}. ¿Qué explicación podría defender una persona responsable?`,
    memory: `${scenario}. Selecciona la regla financiera más sólida.`,
    simulate: `${scenario}. Simula la consecuencia de decidir sin datos suficientes.`,
    compound: compoundQuestion(level, nums, clean, scenario)
  };
  if (level === 3) return adult[key];
  return {
    choose: `${scenario}. ¿Qué decisión protege caja, margen y control en ${clean.toLowerCase()}?`,
    true: `${scenario}. Selecciona la afirmación que sirve para dirigir el negocio.`,
    order: `${scenario}. Ordena la secuencia empresarial antes de crecer.`,
    match: `${scenario}. Empareja ${clean.toLowerCase()} con su indicador o consecuencia.`,
    classify: `${scenario}. Clasifica la acción según caja, cliente, riesgo y escala.`,
    calc: `${scenario}. Si entran $${nums[0]} y reservas $${nums[1]}, ¿cuánto queda para operar?`,
    fill: `${scenario}. Completa la frase de gestión para aplicar ${clean.toLowerCase()}.`,
    risk: `${scenario}. Detecta el riesgo que puede romper caja o reputación.`,
    express: `${scenario}. Actividad express: elige la revisión de dirección antes de avanzar.`,
    compare: `${scenario}. Compara margen, cobro, riesgo operativo y aprendizaje.`,
    plan: `${scenario}. Elige el plan con meta, indicador, responsable y fecha.`,
    explain: `${scenario}. ¿Qué explicación vendería la decisión ante un equipo serio?`,
    memory: `${scenario}. Selecciona la regla de negocio que evita crecer a ciegas.`,
    simulate: `${scenario}. Simula la consecuencia de vender sin caja, contrato o margen.`,
    compound: compoundQuestion(level, nums, clean, scenario)
  }[key];
}

function compoundQuestion(level, nums, topic, scenario) {
  if (level === 1) return `${scenario}. Si guardas monedas y no sacas todo, ¿qué pasa con tu meta de ${topic.toLowerCase()}?`;
  if (level === 2) return `${scenario}. Si separas $${nums[1]} cada semana y lo dejas trabajar con tiempo, ¿qué idea aparece?`;
  if (level === 3) return `${scenario}. ¿Qué resume mejor el interés compuesto aplicado a ${topic.toLowerCase()}?`;
  return `${scenario}. ¿Cómo usarías reinversión e interés compuesto para que ${topic.toLowerCase()} crezca sin perder control?`;
}

function correctText(level, key, topic, nums, place, scenario, world, zone) {
  const left = nums[0] - nums[1];
  const clean = topicClean(topic).toLowerCase();
  const childAnswers = {
    choose: `Parar, mirar y pedir ayuda antes de usar dinero para ${clean}`,
    true: `Con ${clean}, el dinero se mira, se cuenta y se cuida`,
    order: "Mirar el precio, contar monedas, preguntar y decidir",
    match: `${topicClean(topic)} = algo que puedo reconocer en casa, tienda o colegio`,
    classify: `Necesario primero; deseo después si alcanza para ${clean}`,
    calc: `$${left}`,
    fill: `cuidar lo que tengo y decidir mejor con ${clean}`,
    risk: `Comprar sin mirar si alcanza para ${zone.toLowerCase()}`,
    express: `Contar, separar una moneda y decir para qué meta sirve`,
    compare: `La opción que necesito, puedo pagar y no rompe mi meta`,
    plan: `Guardar una parte y revisar la alcancía antes de volver a gastar`,
    explain: `Es elegir con calma para que el dinero alcance y no me confunda`,
    memory: `Primero necesito, después deseo, y siempre reviso`,
    simulate: `Puede faltar dinero para algo importante de casa`,
    compound: `Muchas monedas pequeñas pueden crecer con paciencia`
  };
  if (level === 1) return childAnswers[key];
  const teenAnswers = {
    choose: `Revisar saldo, costo real y consecuencia antes de ${clean}`,
    true: `Una buena decisión protege mi presente, mi seguridad y mi meta`,
    order: `Meta, límite, comparación, decisión y revisión`,
    match: `${topicClean(topic)} = decisión con efecto en saldo, seguridad o futuro`,
    classify: `Prioridad: cubre meta, seguridad y presupuesto`,
    calc: `$${left}`,
    fill: `tomar decisiones con información y no por impulso`,
    risk: `Prisa, datos pedidos, cargos escondidos o presión del grupo`,
    express: `Mirar precio final, saldo, seguridad y si era necesario`,
    compare: `La opción que usaré más y no rompe mi meta`,
    plan: `Registrar gastos, poner límite y revisar en siete días`,
    explain: `Es comparar costo, riesgo, beneficio y momento`,
    memory: `Si me apura, lo reviso dos veces`,
    simulate: `Puedo pagar de más, endeudarme o perder seguridad`,
    compound: `El dinero puede crecer más cuando se reinvierte y se deja tiempo`
  };
  if (level === 2) return teenAnswers[key];
  const adultAnswers = {
    choose: `Comparar costo total, plazo, riesgo y efecto en la reserva`,
    true: `La decisión conecta flujo, seguridad, objetivo y horizonte`,
    order: `Diagnóstico, objetivo, opciones, decisión y seguimiento`,
    match: `${topicClean(topic)} = una decisión que modifica flujo, riesgo o patrimonio`,
    classify: `Priorizar liquidez, seguridad y crecimiento sostenible`,
    calc: `$${left}`,
    fill: `convertir decisiones repetidas en estabilidad y patrimonio`,
    risk: `Aceptar una condición sin medir costo total, plazo o protección`,
    express: `Revisar monto, fecha, responsable y plan B`,
    compare: `La opción con mejor costo total y menor riesgo innecesario`,
    plan: `Definir monto, fecha, límite, responsable y revisión`,
    explain: `Incluye números, riesgo, objetivo y siguiente paso`,
    memory: `No comprometas liquidez sin entender el riesgo`,
    simulate: `La reserva baja, la deuda sube o el objetivo se atrasa`,
    compound: `Rendimientos que generan nuevos rendimientos cuando hay tiempo y constancia`
  };
  if (level === 3) return adultAnswers[key];
  return {
    choose: `Validar cliente, costo, margen, caja y riesgo`,
    true: `Debe mejorar caja, control, aprendizaje o crecimiento`,
    order: `Validar, medir, vender, cobrar, reinvertir y revisar`,
    match: `${topicClean(topic)} = indicador, decisión y consecuencia medible`,
    classify: `Priorizar caja sana, cliente real y control`,
    calc: `$${left}`,
    fill: `tomar decisiones medibles que sostienen el negocio`,
    risk: `Crecer sin caja, contrato, margen o seguridad`,
    express: `Mirar caja, margen, fecha de cobro y siguiente decisión`,
    compare: `La opción con mejor margen y menor riesgo operativo`,
    plan: `Meta, presupuesto, indicador, responsable, fecha y revisión`,
    explain: `Presenta situación, números, riesgo y decisión recomendada`,
    memory: `Sin caja y margen, crecer puede romper el negocio`,
    simulate: `Puede faltar caja aunque haya ventas`,
    compound: `Reinvertir ganancias con disciplina para crear patrimonio empresarial`
  }[key];
}

function wrongOptions(level, key, topic, nums, place, scenario, world, zone) {
  const clean = topicClean(topic).toLowerCase();
  const typed = {
    order: [
      "Decidir, gastar, mirar y preguntar",
      "Comprar, esconder el recibo, contar y revisar",
      "Aceptar la presión, pagar, pensar y corregir"
    ],
    match: [
      `${topicClean(topic)} = comprar sin revisar`,
      `${topicClean(topic)} = usar todo hoy`,
      `${topicClean(topic)} = ignorar precio, plazo y seguridad`
    ],
    classify: [
      `Deseo urgente aunque rompa ${zone.toLowerCase()}`,
      `Riesgo escondido presentado como premio`,
      `Gasto que no mira saldo ni consecuencia`
    ],
    fill: [
      `gastar antes de pensar en ${clean}`,
      "hacer lo mismo que todos",
      "decidir porque el anuncio brilla"
    ],
    risk: [
      "No hay riesgo si parece divertido",
      "La prisa siempre ayuda a decidir mejor",
      "Pedir claves o datos no importa"
    ],
    express: [
      "Pagar primero y revisar después",
      "Preguntar solo cuando ya no quede dinero",
      "Elegir lo más brillante sin contar"
    ],
    compare: [
      "La opción más cara siempre es mejor",
      "La opción urgente gana aunque no la necesites",
      "La opción que copia el grupo evita pensar"
    ],
    plan: [
      "Gastar todo hoy y ver mañana",
      "No anotar nada para no preocuparse",
      "Cambiar la meta cada vez que aparece una oferta"
    ],
    explain: [
      "Es hacer caso al impulso",
      "Es comprar porque otros compran",
      "Es no mirar números para no aburrirse"
    ],
    memory: [
      "Si brilla, compra",
      "Si apura, no revises",
      "Si todos lo hacen, está bien"
    ],
    simulate: [
      "Nunca pasa nada aunque no revises",
      "El dinero vuelve solo al día siguiente",
      "El riesgo desaparece si no lo miras"
    ],
    compound: [
      "Sacar todo cada vez que se guarda",
      "Esperar sin meta y sin revisar",
      "Cambiar de plan cada día"
    ],
    true: [
      "Decidir con prisa siempre ahorra tiempo y dinero",
      "Una clave se puede compartir si hay confianza",
      "El precio final no hace falta mirarlo"
    ]
  };
  if (typed[key]) return typed[key];
  const base = {
    1: [`Comprar rápido en ${zone.toLowerCase()} porque se ve bonito`, "Usar todo el dinero hoy", "No preguntar y esconder el recibo", "Prestar sin saber cuándo vuelve"],
    2: [`Aceptar en ${place} porque todos lo hacen`, "Tocar comprar antes de ver el total", "Usar la clave en cualquier enlace", "Pagar mínimo sin entender la deuda"],
    3: [`Elegir solo por la cuota más baja en ${world.name}`, "Usar la reserva para un deseo", "Firmar sin revisar plazo y costo", "Invertir todo en una sola opción"],
    4: [`Vender en ${world.name} sin calcular costo`, "Crecer aunque no haya caja", "Mezclar dinero personal y negocio", "Aceptar cualquier cliente sin condiciones"]
  };
  if (key === "calc") return [`$${nums[0]}`, `$${nums[1]}`, `$${nums[0] + nums[1]}`, "$0"];
  return base[level];
}

function promptFor(level, key) {
  const labels = {
    choose: "Elige la decisión que abre mejor el reto.",
    true: "Toca la tarjeta que sí ayuda.",
    order: "Pulsa la secuencia más ordenada.",
    match: "Encuentra la pareja concepto-ejemplo.",
    classify: "Elige el cubo donde cae mejor la acción.",
    calc: "Usa el panel de cálculo.",
    fill: "Completa el hueco con la mejor idea.",
    risk: "Marca la señal de cuidado.",
    express: "Elige la acción rápida que harías ya.",
    compare: "Compara las dos rutas antes de elegir.",
    plan: "Selecciona el plan que sí se puede cumplir.",
    explain: "Escoge la explicación más clara.",
    memory: "Activa la regla útil.",
    simulate: "Elige la consecuencia más probable.",
    compound: "Mira tiempo, paciencia y crecimiento."
  };
  if (level === 1) return labels[key];
  return labels[key].replace("Toca", "Selecciona");
}

function tipFor(level, key) {
  if (level === 1) return "No hace falta correr. Cuenta, mira y decide.";
  if (level === 2) return "Antes de pagar, revisa precio final, seguridad y si encaja con tu meta.";
  if (level === 3) return "Una buena decisión deja claro el monto, el plazo, el riesgo y la revisión.";
  return "En negocio, caja y margen mandan antes que la emoción de crecer.";
}

function lifeEffect(level, topic, focus) {
  if (level === 1) return `Esto conecta ${topic.toLowerCase()} con cosas que ves en casa, la tienda o el colegio.`;
  if (level === 2) return `Esto lleva ${topic.toLowerCase()} a apps, salidas, compras, presión de grupo y seguridad.`;
  if (level === 3) return `Esto conecta ${topic.toLowerCase()} con presupuesto, banca, deuda, inversión y patrimonio.`;
  return `Esto convierte ${topic.toLowerCase()} en decisión de caja, cliente, margen, riesgo y crecimiento.`;
}

function optionImpact(isCorrect, index, focus, level) {
  const impact = { liquidez: 0, seguridad: 0, crecimiento: 0, criterio: 0, impacto: 0 };
  if (isCorrect) {
    impact[focus] += 3;
    impact.criterio += 2;
    if (level >= 2) impact.seguridad += 1;
    if (level >= 3) impact.crecimiento += 1;
    if (level === 4) impact.impacto += 1;
  } else {
    impact[focus] -= 2;
    impact.criterio -= 1;
    if (index % 2 === 0) impact.seguridad -= 1;
  }
  return impact;
}

function shuffleOptions(items, seed) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function guide(module) {
  const list = selectedLevel === 4 && selectedEntrepreneurTrack === "woman" ? woman : pools[selectedLevel];
  return list[(module.id + module.worldIndex) % list.length];
}

function pair(worldIndex, level) {
  const list = level === 4 && selectedEntrepreneurTrack === "woman" ? woman : pools[level];
  return [list[worldIndex % list.length], list[(worldIndex + 2) % list.length]];
}

async function initFirebase() {
  if (!FIREBASE_SETTINGS.enabled || !FIREBASE_SETTINGS.config.projectId) return;
  try {
    const appM = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const fireM = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
    const app = appM.initializeApp(FIREBASE_SETTINGS.config);
    firebaseDb = fireM.getFirestore(app);
    firebaseApi = fireM;
    firebaseReady = true;
    renderFirebaseStatus();
  } catch {
    renderFirebaseStatus("Tu avance se guardará en este equipo");
  }
}

function init() {
  document.body.dataset.level = selectedLevel;
  initFirebase();
  setupOnboarding();
  setupEntrepreneurTabs();
  renderCompanions();
  document.getElementById("name-form").addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("player-name").value.trim();
    if (!name) return;
    state.playerName = name;
    state.studentId = state.studentId || `STD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    state.createdAt = state.createdAt || new Date().toISOString();
    selectedLevel = onboardingLevel;
    state.level = selectedLevel;
    document.body.dataset.level = selectedLevel;
    modules = buildModules(selectedLevel);
    saveState();
    showGame();
  });
  document.querySelectorAll(".levels button[data-level]").forEach(button => {
    button.onclick = () => {
      selectedLevel = +button.dataset.level;
      state.level = selectedLevel;
      document.body.dataset.level = selectedLevel;
      modules = buildModules(selectedLevel);
      saveState();
      render();
      refreshParticles();
    };
  });
  document.getElementById("close-mission").onclick = () => {
    document.getElementById("mission").close();
    particleScene = state.family?.open ? (isChildFamilyMode() ? "familyChild" : "familyAdvanced") : "map";
    refreshParticles();
  };
  document.getElementById("close-certificate").onclick = () => document.getElementById("certificate").close();
  document.getElementById("save-progress").onclick = () => manualSaveProgress();
  document.getElementById("family-mode").onclick = () => toggleFamilyMode();
  setupAvatarInteractivity();
  if (state.playerName) showGame();
  particles();
}

function setupAvatarInteractivity() {
  document.addEventListener("pointermove", event => {
    const x = ((event.clientX / innerWidth) - .5) * 18;
    const y = ((event.clientY / innerHeight) - .5) * -14;
    document.documentElement.style.setProperty("--look-x", `${x.toFixed(2)}deg`);
    document.documentElement.style.setProperty("--look-y", `${y.toFixed(2)}deg`);
    document.documentElement.style.setProperty("--pupil-x", `${(x / 4).toFixed(2)}px`);
    document.documentElement.style.setProperty("--pupil-y", `${(-y / 5).toFixed(2)}px`);
  }, { passive: true });
}

function setupOnboarding() {
  document.querySelectorAll("[data-onboard-level]").forEach(button => {
    button.onclick = () => {
      particleScene = "onboarding";
      onboardingLevel = +button.dataset.onboardLevel;
      document.querySelectorAll("[data-onboard-level]").forEach(item => item.classList.toggle("active", item === button));
      document.body.dataset.level = onboardingLevel;
      renderCompanions();
      refreshParticles();
    };
  });
}

function setupEntrepreneurTabs() {
  document.querySelectorAll("[data-track]").forEach(button => {
    button.onclick = () => {
      selectedEntrepreneurTrack = button.dataset.track;
      modules = buildModules(selectedLevel);
      saveState();
      render();
    };
  });
}

function renderCompanions() {
  const list = pools[onboardingLevel] || child;
  const a = list[0];
  const b = list[1];
  document.getElementById("companions").innerHTML = `<div class="mini">${avatar(a)}</div><div class="mini">${avatar(b)}</div><div class="copy"><b>${levels[onboardingLevel].name}</b><span>${levels[onboardingLevel].intro}</span></div>`;
}

function showGame() {
  document.getElementById("onboarding").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  particleScene = "map";
  refreshParticles();
  renderFamilyGame();
  render();
}

function render() {
  if (!state.playerName) return;
  const progress = currentProgress();
  document.getElementById("welcome").textContent = `Hola, ${state.playerName}`;
  document.getElementById("tokens").textContent = progress.tokens;
  document.getElementById("done").textContent = `${Object.keys(progress.completed).length}/50`;
  const values = Object.values(progress.scores);
  document.getElementById("score").textContent = `${values.length ? values[values.length - 1] : 0}%`;
  document.querySelectorAll(".levels button[data-level]").forEach(button => button.classList.toggle("active", +button.dataset.level === selectedLevel));
  renderEntrepreneurTabs();
  renderFirebaseStatus();
  renderWorlds();
  renderMap();
  renderFamilyGame();
}

function renderEntrepreneurTabs() {
  const tabs = document.getElementById("entrepreneur-tabs");
  tabs.classList.toggle("hidden", selectedLevel !== 4);
  tabs.querySelectorAll("[data-track]").forEach(button => button.classList.toggle("active", button.dataset.track === selectedEntrepreneurTrack));
}

function renderFirebaseStatus(message) {
  const status = document.getElementById("firebase-status");
  if (!status) return;
  if (message) {
    status.className = "firebase-status online";
    status.textContent = message;
    return;
  }
  status.className = firebaseReady ? "firebase-status online" : "firebase-status local";
  status.textContent = firebaseReady ? "Tu avance está protegido" : "Avance listo para guardar";
}

function manualSaveProgress() {
  saveState();
  renderFirebaseStatus("Guardando tu avance...");
  syncProgress("Avance guardado");
}

function renderWorlds() {
  const box = document.getElementById("world-buttons");
  const progress = currentProgress();
  box.innerHTML = "";
  worlds.forEach((world, index) => {
    const done = modules.filter(module => module.worldIndex === index && progress.completed[module.key]).length;
    const guides = pair(index, selectedLevel);
    const button = document.createElement("button");
    button.className = index === selectedWorld ? "active" : "";
    button.innerHTML = `<strong>${world.region}: ${world.name}</strong><small>${guides[0].name} + ${guides[1].name} · ${done}/10 zonas</small>`;
    button.onclick = () => {
      selectedWorld = index;
      render();
      refreshParticles();
    };
    box.appendChild(button);
    if (done === 10) {
      const cert = document.createElement("button");
      cert.textContent = `Emitir certificado: ${world.name}`;
      cert.onclick = () => openCertificate(index);
      box.appendChild(cert);
    }
  });
}

function renderMap() {
  const world = worlds[selectedWorld];
  const guides = pair(selectedWorld, selectedLevel);
  const progress = currentProgress();
  document.getElementById("world-region").textContent = world.region;
  document.getElementById("world-title").textContent = world.name;
  document.getElementById("world-description").innerHTML = `${world.description} Guías activos: ${guides[0].name} y ${guides[1].name}. ${profileInline()}`;
  const map = document.getElementById("map");
  map.innerHTML = `<div class="continent" style="--world-color:${world.color};clip-path:${world.shape}"></div>`;
  const pos = positions[selectedWorld];
  const mods = modules.filter(module => module.worldIndex === selectedWorld);
  pos.slice(0, -1).forEach((point, index) => route(map, point, pos[index + 1]));
  mods.forEach((module, index) => {
    const g = guide(module);
    const button = document.createElement("button");
    const [left, top] = pos[index];
    button.className = `node ${progress.completed[module.key] ? "done" : ""}`;
    button.style.left = `${left}%`;
    button.style.top = `${top}%`;
    button.style.borderColor = module.id <= progress.unlocked ? world.color : "";
    button.disabled = module.id > progress.unlocked;
    button.innerHTML = `<b>${module.code}</b><small>${module.country}</small><em>${g.name}</em>`;
    button.onclick = () => openMission(module);
    map.appendChild(button);
  });
}

function toggleFamilyMode() {
  state.family = { ...familyDefault(), ...(state.family || {}) };
  state.family.open = !state.family.open;
  particleScene = state.family.open ? (isChildFamilyMode() ? "familyChild" : "familyAdvanced") : "map";
  saveState();
  renderFamilyGame();
  refreshParticles();
  document.getElementById("family-game").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderFamilyGame() {
  const box = document.getElementById("family-game");
  if (!box) return;
  const family = state.family || familyDefault();
  box.classList.toggle("hidden", !family.open);
  document.getElementById("family-mode").textContent = family.open ? "Cerrar tablero" : familyGameTitle();
  if (!family.open) return;
  const player = family.players[family.turn % family.players.length];
  const tiles = currentFamilyTiles();
  const childMode = isChildFamilyMode();
  const presenter = childMode ? child[(family.turn + family.round) % child.length] : pair(selectedWorld, selectedLevel)[0];
  const presenterLine = childMode
    ? `${presenter.name} reparte el dado: cuenta monedas, mira la meta y decide con la familia.`
    : `${presenter.name} abre la mesa: caja, deuda, mercado y reputación cuentan en cada turno.`;
  box.innerHTML = `
    <div class="family-head">
      <div class="family-presenter">${mini(presenter, "lead", presenterLine)}</div>
      <div>
        <p class="brand-p">Juego familiar por turnos</p>
        <h2>${familyGameTitle()}</h2>
        <p>${childMode ? "Tablero infantil con monedas, alcancía, trueques, compras pequeñas, metas familiares y sorpresas suaves." : "Tablero competitivo con bolsa simulada, empresas nuevas, estafas, deudas, quiebras, recuperaciones y pactos familiares."}</p>
      </div>
      <div class="family-turn">
        <span>Turno</span>
        <b>${player.name}</b>
        <small>Ronda ${family.round} · dado ${family.lastRoll || "-"} · ${childMode ? "tesoro en juego" : "patrimonio en juego"}</small>
      </div>
    </div>
    <div class="family-controls">
      <input id="family-player-name" maxlength="24" placeholder="Nuevo jugador">
      <button id="add-family-player" type="button">Añadir miembro</button>
      <button id="reset-family-game" type="button" class="secondary">Reiniciar tablero</button>
    </div>
    <div class="family-layout">
      <section class="family-board">${tiles.map((tile, index) => familyTileHtml(tile, index, family.players)).join("")}</section>
      <aside class="family-side">
        <div class="family-actions">
          <button id="roll-family-dice" type="button">Tirar dado</button>
          <button id="family-event" type="button" class="secondary">${childMode ? "Carta sorpresa" : "Carta salvaje"}</button>
        </div>
        ${childMode ? "" : `<div class="market-tape">${marketTapeHtml()}</div>`}
        <div class="family-goal"><span>Meta familiar</span><b>$${family.familyGoal}</b><small>Se llena con acuerdos, ahorro y buenas decisiones.</small></div>
        <div class="family-players">${family.players.map((p, index) => familyPlayerHtml(p, index === family.turn % family.players.length)).join("")}</div>
        <div class="family-log">${family.log.slice(-5).reverse().map(item => `<p>${escapeHtml(item)}</p>`).join("")}</div>
      </aside>
    </div>`;
  document.getElementById("add-family-player").onclick = addFamilyPlayer;
  document.getElementById("reset-family-game").onclick = resetFamilyGame;
  document.getElementById("roll-family-dice").onclick = rollFamilyDice;
  document.getElementById("family-event").onclick = () => applyFamilyEvent(true);
  setupGuideInteractions(box);
}

function familyTileHtml(tile, index, players) {
  const markers = players.filter(player => player.position === index).map(player => {
    const safeName = escapeHtml(player.name);
    return `<i style="--p:${player.color}" title="${safeName}">${safeName.slice(0, 1).toUpperCase()}</i>`;
  }).join("");
  return `<button class="family-tile tile-${tile.type}" type="button"><b>${index + 1}</b><strong>${tile.name}</strong><small>${tile.lesson}</small><span>${markers}</span></button>`;
}

function familyPlayerHtml(player, active) {
  const childMode = isChildFamilyMode();
  const sharesValue = stockValue(player);
  const worth = netWorth(player);
  const portfolio = Object.entries(player.stocks || {}).filter(([, qty]) => qty > 0).map(([symbol, qty]) => `${symbol} x${qty}`).join(" · ") || "sin acciones";
  return `<article class="family-player ${active ? "active" : ""}" style="--player:${player.color}">
    <h3>${escapeHtml(player.name)}</h3>
    <div><span>Dinero</span><b>$${player.cash}</b></div>
    <div><span>Reserva</span><b>$${player.reserve}</b></div>
    <div><span>${childMode ? "Préstamos" : "Deuda"}</span><b>$${player.debt}</b></div>
    <div><span>Activos</span><b>${player.assets.length}</b></div>
    ${childMode ? "" : `<div><span>Acciones</span><b>$${sharesValue}</b></div><div><span>Reputación</span><b>${player.reputation}</b></div>`}
    <div><span>Bienestar</span><b>${player.joy}</b></div>
    ${childMode ? "" : `<small>${escapeHtml(portfolio)}</small>`}
    <footer>${childMode ? "Tesoro familiar" : "Patrimonio neto"}: $${worth}</footer>
  </article>`;
}

function marketTapeHtml() {
  return Object.entries(stockMarket).map(([symbol, stock]) => `<span><b>${symbol}</b><em>$${stock.price}</em><small>${stock.name}</small></span>`).join("");
}

function stockValue(player) {
  return Object.entries(player.stocks || {}).reduce((sum, [symbol, qty]) => sum + (stockMarket[symbol]?.price || 0) * qty, 0);
}

function netWorth(player) {
  return player.cash + player.reserve + player.assets.length * 120 + stockValue(player) - player.debt;
}

function addFamilyPlayer() {
  const input = document.getElementById("family-player-name");
  const name = input.value.trim();
  if (!name) return;
  const colors = ["#22D3EE", "#FFBF00", "#50C878", "#FF00FF", "#FFD1DC", "#D4AF37"];
  state.family.players.push(familyPlayer(name, colors[state.family.players.length % colors.length]));
  state.family.log.push(`${name} se une al tablero familiar.`);
  input.value = "";
  saveState();
  renderFamilyGame();
}

function resetFamilyGame() {
  state.family = { ...familyDefault(), open: true };
  applyMarketSnapshot(state.family.market);
  saveState();
  renderFamilyGame();
}

function rollFamilyDice() {
  const family = state.family;
  const player = family.players[family.turn % family.players.length];
  const tiles = currentFamilyTiles();
  const roll = 1 + Math.floor(Math.random() * 6);
  family.lastRoll = roll;
  const oldPosition = player.position;
  player.position = (player.position + roll) % tiles.length;
  if (player.position < oldPosition) {
    family.round += 1;
    player.cash += isChildFamilyMode() ? 45 : 80;
    player.reserve += isChildFamilyMode() ? 10 : 15;
    family.log.push(`${player.name} completa una vuelta: recibe ingreso y separa una parte para reserva.`);
  }
  resolveFamilyTile(player, tiles[player.position]);
  family.turn = (family.turn + 1) % family.players.length;
  saveState();
  renderFamilyGame();
  showReaction(true, Math.min(selectedLevel, 2));
}

function resolveFamilyTile(player, tile) {
  const family = state.family;
  if (isChildFamilyMode()) {
    resolveChildFamilyTile(player, tile);
    return;
  }
  if (tile.type === "income") {
    player.cash += tile.amount || 100;
    player.reserve += 20;
    family.log.push(`${player.name} cobra ingresos y separa reserva antes de gastar.`);
    return;
  }
  if (tile.type === "loan") {
    player.cash += tile.amount;
    player.debt += tile.debt;
    player.reputation = Math.max(0, player.reputation - 4);
    family.log.push(`${player.name} toma un préstamo rápido: entra caja, pero la deuda vuelve más pesada.`);
    return;
  }
  if (tile.type === "stock" || tile.type === "ipo") {
    buyStock(player, tile.symbol, tile.shares || 1, tile.cost);
    return;
  }
  if (tile.type === "startup") {
    launchStartup(player, tile);
    return;
  }
  if (tile.type === "scam" || tile.type === "fraud") {
    hitByScam(player, tile.cost, tile.type === "fraud" ? "hackeo" : "estafa");
    return;
  }
  if (tile.type === "bankruptcy") {
    bankruptcyCheck(player);
    return;
  }
  if (tile.type === "marketCrash") {
    moveMarket(-26, `${player.name} pisa Crash bursátil: las cotizaciones caen y las carteras tiemblan.`);
    return;
  }
  if (tile.type === "marketBoom") {
    moveMarket(24, `${player.name} activa Boom de mercado: suben las acciones, pero nadie sabe cuánto durará.`);
    return;
  }
  if (tile.type === "recovery") {
    recoverPlayer(player, tile.amount || 100);
    return;
  }
  if (tile.type === "bubble") {
    bubbleWarning(player);
    return;
  }
  if (tile.type === "legacyRisk") {
    family.familyGoal = Math.max(0, family.familyGoal - 60);
    player.reputation = Math.max(0, player.reputation - 8);
    family.log.push(`${player.name} cae en herencia disputada: sin acuerdos, el patrimonio familiar pierde valor.`);
    return;
  }
  if (tile.type === "audit") {
    const penalty = player.assets.length ? tile.cost : Math.round(tile.cost / 2);
    payFamilyCost(player, penalty);
    player.reputation = Math.max(0, player.reputation - 3);
    family.log.push(`${player.name} recibe auditoría sorpresa: quien no ordena papeles paga tensión y caja.`);
    return;
  }
  if (tile.type === "asset" || tile.type === "invest" || tile.type === "deal") {
    if (player.cash >= tile.cost) {
      player.cash -= tile.cost;
      player.assets.push(tile.asset || tile.name);
      player.reserve += Math.round((tile.rent || 15) / 3);
      player.reputation += 3;
      family.log.push(`${player.name} compra ${tile.name}: gana activo, pero ahora debe defender caja y margen.`);
    } else {
      player.debt += Math.round(tile.cost / 2);
      player.reputation = Math.max(0, player.reputation - 5);
      family.log.push(`${player.name} quiso cerrar ${tile.name} sin caja suficiente: la deuda muerde.`);
    }
    return;
  }
  if (tile.type === "need" || tile.type === "expense") {
    payFamilyCost(player, tile.cost);
    family.log.push(`${player.name} cae en ${tile.name}: ${tile.lesson}`);
    return;
  }
  if (tile.type === "save" || tile.type === "bank") {
    player.reserve += tile.amount || 25;
    family.log.push(`${player.name} fortalece su reserva en ${tile.name}.`);
    return;
  }
  if (tile.type === "education") {
    payFamilyCost(player, tile.cost);
    player.assets.push(tile.asset || "Aprendizaje");
    player.joy += 6;
    family.log.push(`${player.name} invierte en aprender: no todo activo se puede tocar.`);
    return;
  }
  if (tile.type === "protect") {
    payFamilyCost(player, tile.cost);
    player.protection += 1;
    family.log.push(`${player.name} mejora su seguridad financiera y digital.`);
    return;
  }
  if (tile.type === "inflation") {
    family.players.forEach(member => payFamilyCost(member, tile.cost));
    family.log.push("La inflación toca a todos: la familia ajusta el presupuesto.");
    return;
  }
  if (tile.type === "joy") {
    payFamilyCost(player, tile.cost);
    player.joy += 12;
    family.log.push(`${player.name} disfruta con presupuesto: gastar también puede ser sano si está planificado.`);
    return;
  }
  if (tile.type === "cooperate" || tile.type === "goal" || tile.type === "legacy") {
    family.familyGoal += tile.amount || 30;
    player.joy += 5;
    family.log.push(`${player.name} suma a la meta común. La familia compite, pero también construye.`);
    return;
  }
  applyFamilyEvent(false);
}

function resolveChildFamilyTile(player, tile) {
  const family = state.family;
  if (tile.type === "income") {
    player.cash += tile.amount || 20;
    family.log.push(`${player.name} gana monedas y decide guardar una parte.`);
    return;
  }
  if (tile.type === "need") {
    payFamilyCost(player, tile.cost);
    family.log.push(`${player.name} paga ${tile.name}: necesidad primero, capricho después.`);
    return;
  }
  if (tile.type === "save" || tile.type === "bank") {
    player.reserve += tile.amount || 12;
    family.log.push(`${player.name} suma a su alcancía. El tesoro crece despacio.`);
    return;
  }
  if (tile.type === "gentleLoss") {
    payFamilyCost(player, tile.cost);
    player.joy = Math.max(0, player.joy - 2);
    family.log.push(`${player.name} pierde unas monedas en ${tile.name}. No pasa nada: se revisa y se aprende.`);
    return;
  }
  if (tile.type === "swap") {
    player.joy += 5;
    player.reserve += 6;
    family.log.push(`${player.name} hace un trueque justo y aprende a comparar valor, no solo precio.`);
    return;
  }
  if (tile.type === "repair") {
    payFamilyCost(player, tile.cost);
    player.reserve += tile.amount || 10;
    family.log.push(`${player.name} repara antes de comprar nuevo y salva monedas para su meta.`);
    return;
  }
  if (tile.type === "asset" || tile.type === "toyMarket") {
    if (player.cash >= tile.cost) {
      player.cash -= tile.cost;
      player.assets.push(tile.asset || tile.name);
      player.cash += tile.rent || 8;
      family.log.push(`${player.name} consigue ${tile.name}: aprende costo, cuidado y pequeña ganancia.`);
    } else {
      family.log.push(`${player.name} no tiene suficientes monedas para ${tile.name}. Decide esperar.`);
    }
    return;
  }
  if (tile.type === "protect") {
    payFamilyCost(player, tile.cost);
    player.protection += 1;
    family.log.push(`${player.name} usa una lista de compras: queda protegido contra el impulso.`);
    return;
  }
  if (tile.type === "inflation") {
    family.players.forEach(member => payFamilyCost(member, tile.cost));
    family.log.push("Los precios suben un poquito: todos ajustan su plan.");
    return;
  }
  if (tile.type === "childCompound") {
    player.reserve += Math.max(tile.amount || 8, Math.round(player.reserve * .12));
    family.log.push(`${player.name} ve interés con semillas: lo guardado crece si no se saca todo.`);
    return;
  }
  if (tile.type === "joy") {
    if (tile.cost) payFamilyCost(player, tile.cost);
    player.joy += tile.amount || 10;
    family.log.push(`${player.name} disfruta con presupuesto y sin romper la meta.`);
    return;
  }
  if (tile.type === "cooperate" || tile.type === "goal") {
    family.familyGoal += tile.amount || 15;
    player.joy += 5;
    family.log.push(`${player.name} suma al tesoro común de la familia.`);
    return;
  }
  applyFamilyEvent(false);
}

function payFamilyCost(player, amount) {
  if (player.cash >= amount) {
    player.cash -= amount;
    return;
  }
  const missing = amount - player.cash;
  player.cash = 0;
  if (player.reserve >= missing) {
    player.reserve -= missing;
  } else {
    const debt = missing - player.reserve;
    player.reserve = 0;
    player.debt += debt;
    player.joy = Math.max(0, player.joy - 5);
  }
}

function buyStock(player, symbol, shares, fixedCost) {
  const stock = stockMarket[symbol] || stockMarket.AURA;
  const cost = fixedCost || stock.price * shares;
  if (player.cash >= cost) {
    player.cash -= cost;
    player.stocks = player.stocks || {};
    player.stocks[symbol] = (player.stocks[symbol] || 0) + shares;
    state.family.log.push(`${player.name} compra ${shares} acciones de ${symbol}. Ahora participa en la bolsa simulada.`);
  } else {
    player.debt += Math.round(cost * .45);
    state.family.log.push(`${player.name} quiso entrar en ${symbol} sin caja: compra tarde, deuda pronto.`);
  }
}

function launchStartup(player, tile) {
  if (player.cash < tile.cost) {
    player.debt += Math.round(tile.cost * .55);
    player.reputation = Math.max(0, player.reputation - 6);
    state.family.log.push(`${player.name} lanza ${tile.asset} sin caja suficiente: nace con deuda encima.`);
    return;
  }
  player.cash -= tile.cost;
  const score = (player.reputation || 50) + player.reserve / 8 + player.assets.length * 6 - player.debt / 18;
  if (score > 70) {
    player.assets.push(tile.asset);
    player.cash += 110;
    player.reputation += 9;
    state.family.log.push(`${player.name} lanza ${tile.asset}: consigue tracción, caja y reputación.`);
  } else if (score > 45) {
    player.assets.push(`${tile.asset} en pruebas`);
    player.reputation += 3;
    state.family.log.push(`${player.name} lanza ${tile.asset}: no explota, pero queda vivo y aprende.`);
  } else {
    player.debt += 90;
    player.reputation = Math.max(0, player.reputation - 10);
    state.family.log.push(`${player.name} lanza ${tile.asset} y fracasa: sin caja ni clientes, toca reconstruir.`);
  }
}

function hitByScam(player, amount, label) {
  if (player.protection > 0) {
    player.protection -= 1;
    player.reputation += 2;
    state.family.log.push(`${player.name} detecta ${label} a tiempo gracias a su protección. No cae.`);
    return;
  }
  payFamilyCost(player, amount || 100);
  player.reputation = Math.max(0, player.reputation - 9);
  state.family.log.push(`${player.name} cae en ${label}: pierde dinero y aprende que la prisa sale cara.`);
}

function bankruptcyCheck(player) {
  if (player.debt < 180) {
    player.reserve += 30;
    state.family.log.push(`${player.name} mira la quiebra de cerca, pero su deuda aún es manejable. Refuerza reserva.`);
    return;
  }
  const sold = player.assets.splice(0, Math.ceil(player.assets.length / 2));
  const recovery = sold.length * 90 + Math.min(player.reserve, 80);
  player.debt = Math.max(0, player.debt - recovery);
  player.reserve = Math.max(0, player.reserve - 80);
  player.joy = Math.max(0, player.joy - 14);
  player.reputation = Math.max(0, player.reputation - 12);
  state.family.log.push(`${player.name} entra en quiebra técnica: vende ${sold.length} activos, renegocia deuda y sigue jugando.`);
}

function recoverPlayer(player, amount) {
  const debtPayment = Math.min(player.debt, amount);
  player.debt -= debtPayment;
  player.reserve += Math.round((amount - debtPayment) * .7);
  player.cash += Math.round((amount - debtPayment) * .3);
  player.reputation += 5;
  player.joy += 4;
  state.family.log.push(`${player.name} ejecuta recuperación: paga deuda, reconstruye reserva y vuelve a respirar.`);
}

function moveMarket(percent, message) {
  Object.values(stockMarket).forEach(stock => {
    const noise = Math.round((Math.random() - .5) * stock.volatility);
    stock.price = Math.max(5, Math.round(stock.price * (1 + (percent + noise) / 100)));
  });
  if (state.family) state.family.market = stockMarketSnapshot();
  state.family.log.push(message);
}

function bubbleWarning(player) {
  const exposed = stockValue(player);
  if (exposed > player.reserve * 3) {
    const loss = Math.round(exposed * .22);
    payFamilyCost(player, loss);
    moveMarket(-18, `${player.name} entra en burbuja especulativa demasiado expuesto: pierde caja y el mercado corrige.`);
  } else {
    player.reputation += 4;
    state.family.log.push(`${player.name} ve la burbuja y no se lanza de cabeza. A veces ganar es no entrar.`);
  }
}

function applyFamilyEvent(manual) {
  const family = state.family;
  const player = family.players[family.turn % family.players.length];
  const events = currentFamilyEvents();
  const event = events[(family.round + family.turn + family.log.length) % events.length];
  if (event.needsProtection && player.protection > 0) {
    player.protection -= 1;
    family.log.push(`${event.title}: ${player.name} estaba protegido y evita la pérdida.`);
  } else {
    if (event.cash) event.cash > 0 ? player.cash += event.cash : payFamilyCost(player, Math.abs(event.cash));
    if (event.reserve) player.reserve = Math.max(0, player.reserve + event.reserve);
    if (event.reserveBoost) player.reserve = Math.round(player.reserve * event.reserveBoost);
    if (event.familyGoal) family.familyGoal += event.familyGoal;
    if (event.asset) player.assets.push(event.asset);
    if (event.assetIncome) player.cash += player.assets.length * event.assetIncome;
    if (event.market) moveMarket(event.market, `${event.title}: ${event.text}`);
    if (event.startupFail) failRandomStartup(player);
    if (event.startupWin) winRandomStartup(player);
    if (event.bankruptcyCheck) bankruptcyCheck(player);
    if (event.ipoEvent) ipoEvent(player);
    if (event.allCost) family.players.forEach(member => payFamilyCost(member, event.allCost));
    if (event.recovery) recoverPlayer(player, event.recovery);
    if (event.scamTrap) hitByScam(player, 115, "oferta demasiado perfecta");
    family.log.push(`${event.title}: ${event.text}`);
  }
  if (manual) family.turn = (family.turn + 1) % family.players.length;
  saveState();
  renderFamilyGame();
}

function failRandomStartup(player) {
  const index = player.assets.findIndex(asset => asset.toLowerCase().includes("startup") || asset.toLowerCase().includes("empresa"));
  if (index >= 0) {
    const [asset] = player.assets.splice(index, 1);
    player.debt += 70;
    player.reputation = Math.max(0, player.reputation - 8);
    state.family.log.push(`${asset} fracasa: ${player.name} pierde el activo y asume costes de cierre.`);
  } else {
    payFamilyCost(player, 45);
  }
}

function winRandomStartup(player) {
  const hasStartup = player.assets.some(asset => asset.toLowerCase().includes("startup") || asset.toLowerCase().includes("empresa"));
  if (hasStartup) {
    player.cash += 180;
    player.reputation += 12;
    player.reserve += 50;
    state.family.log.push(`Una empresa de ${player.name} sale adelante: entra caja, reputación y reserva.`);
  } else {
    player.cash += 45;
    state.family.log.push(`${player.name} no tenía startup, pero aprovecha el mercado con un ingreso pequeño.`);
  }
}

function ipoEvent(player) {
  const symbols = Object.keys(stockMarket);
  const symbol = symbols[(state.family.round + player.name.length) % symbols.length];
  stockMarket[symbol].price = Math.max(8, Math.round(stockMarket[symbol].price * 1.35));
  buyStock(player, symbol, 1);
  state.family.log.push(`${stockMarket[symbol].name} vive una OPI caliente. ${player.name} entra con una acción.`);
}

function route(map, a, b) {
  const line = document.createElement("span");
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.sqrt(dx * dx + dy * dy);
  const ang = Math.atan2(dy, dx) * 180 / Math.PI;
  const center = matchMedia("(max-width:640px)").matches ? 34 : 43;
  line.className = "route";
  line.style.left = `calc(${a[0]}% + ${center}px)`;
  line.style.top = `calc(${a[1]}% + ${center}px)`;
  line.style.width = `${len}%`;
  line.style.transform = `rotate(${ang}deg)`;
  map.appendChild(line);
}

function openMission(module) {
  activeMission = module;
  activeQuestion = 0;
  activeAnswers = [];
  renderMission();
  openDialog(document.getElementById("mission"));
}

function renderMission() {
  particleScene = "mission";
  refreshParticles();
  const total = activeMission.activities.length;
  const activity = activeMission.activities[activeQuestion];
  const mainGuide = guide(activeMission);
  const guides = pair(activeMission.worldIndex, selectedLevel);
  const support = guides.find(item => item.name !== mainGuide.name) || guides[0];
  const surprise = surprises[selectedLevel][(activeMission.id + activeQuestion) % surprises[selectedLevel].length];
  const lines = characterLines(selectedLevel, activeMission.topic, activity.place, mainGuide, support, activity);
  document.getElementById("mission-content").innerHTML = `
    <div class="mission-body">
      <div class="pill-row">
        <span class="pill">${activeMission.country}</span>
        <span class="pill">${routeLabel()}</span>
        <span class="pill">${activity.answerFormat}</span>
      </div>
      <div class="mission-grid">
        <aside class="card">
          <div class="guide-duo live-guides">${mini(mainGuide, "lead", lines.guideLine)}${mini(support, "support", lines.supportLine)}</div>
          <div class="guide-stage" id="guide-stage">
            <b>${mainGuide.name}</b>
            <span>${lines.guideLine}</span>
          </div>
          <div class="interaction">
            <p><b>${mainGuide.name}</b>: ${lines.guideLine}</p>
            <p><b>${support.name}</b>: ${lines.supportLine}</p>
            <p class="express"><b>Actividad express</b>: ${lines.actionLine}</p>
          </div>
        </aside>
        <section>
          <div class="capsule">
            <p class="brand-p">Reto activo</p>
            <h3>${activeMission.topic}</h3>
            <p>${activity.prompt}</p>
            <div class="decision-lab"><span>${selectedLevel === 1 ? "Mi reto de dinero" : "Economía viva"}</span><strong>${(selectedLevel === 1 ? childDimensionLabels : dimensionLabels)[activity.focus]}</strong><small>${activity.lifeEffect}</small></div>
            <p>${activity.tip}</p>
          </div>
          <div class="surprise"><p>Imprevisto del día</p><h3>${surprise}</h3><p>${support.name} cambia el escenario. Ajusta tu decisión.</p></div>
          <div class="card activity activity-${activity.type}">
            ${activityVisual(activity)}
            <h3>${activity.question}</h3>
            ${renderActivityControl(activity)}
          </div>
          <div class="actions">
            <button class="secondary" id="prev" ${activeQuestion === 0 ? "disabled" : ""}>Anterior</button>
            <button id="next" ${activeAnswers[activeQuestion] === undefined ? "disabled" : ""}>${activeQuestion === total - 1 ? "Calificar" : "Siguiente"}</button>
          </div>
        </section>
      </div>
    </div>`;
  document.querySelectorAll("[data-option]").forEach(button => {
    button.onclick = () => {
      document.querySelectorAll("[data-option]").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      activeAnswers[activeQuestion] = +button.dataset.option;
      document.getElementById("next").disabled = false;
    };
  });
  document.getElementById("prev").onclick = () => {
    if (activeQuestion > 0) {
      activeQuestion--;
      renderMission();
    }
  };
  document.getElementById("next").onclick = () => activeQuestion < total - 1 ? (activeQuestion++, renderMission()) : grade();
  setupGuideInteractions(document.getElementById("mission-content"));
}

function renderActivityControl(activity) {
  const selected = activeAnswers[activeQuestion];
  const button = (option, index, inner = option.text) => `<button data-option="${index}" class="${selected === index ? "selected" : ""}">${inner}</button>`;
  if (activity.type === "order") {
    return `<div class="activity-control order-control">${activity.options.map((option, index) => {
      const steps = option.text.split(/,| y |;| antes de | después /).map(part => part.trim()).filter(Boolean).slice(0, 5);
      return button(option, index, `<span>Secuencia ${index + 1}</span><ol>${steps.map(step => `<li>${step}</li>`).join("")}</ol>`);
    }).join("")}</div>`;
  }
  if (activity.type === "match") {
    return `<div class="activity-control match-control">${activity.options.map((option, index) => {
      const parts = option.text.split("=");
      const left = parts[0]?.trim() || activity.topic;
      const right = parts.slice(1).join("=").trim() || option.text;
      return button(option, index, `<span>${left}</span><b>${right}</b>`);
    }).join("")}</div>`;
  }
  if (activity.type === "classify") {
    return `<div class="activity-control classify-control">${activity.options.map((option, index) => {
      const labels = selectedLevel === 1 ? ["Necesito", "Deseo", "Cuido", "Espero"] : ["Liquidez", "Seguridad", "Crecimiento", "Riesgo"];
      return button(option, index, `<small>${labels[index % labels.length]}</small><strong>${option.text}</strong>`);
    }).join("")}</div>`;
  }
  if (activity.type === "calc") {
    return `<div class="activity-control calc-control"><div class="calc-screen">${activity.question.match(/\$[0-9]+/g)?.join(" - ") || "calcula"}</div>${activity.options.map((option, index) => button(option, index, `<b>${option.text}</b>`)).join("")}</div>`;
  }
  if (activity.type === "fill") {
    return `<div class="activity-control fill-control"><p>${topicClean(activity.topic)} me ayuda a <span>________</span></p>${activity.options.map((option, index) => button(option, index)).join("")}</div>`;
  }
  if (activity.type === "risk") {
    return `<div class="activity-control risk-control">${activity.options.map((option, index) => button(option, index, `<i>!</i><span>${option.text}</span>`)).join("")}</div>`;
  }
  if (activity.type === "express") {
    return `<div class="activity-control express-control"><div class="express-count">10</div>${activity.options.map((option, index) => button(option, index, `<span>Acción ${index + 1}</span><b>${option.text}</b>`)).join("")}</div>`;
  }
  if (activity.type === "compare") {
    return `<div class="activity-control compare-control">${activity.options.map((option, index) => button(option, index, `<span>Opción ${index + 1}</span><b>${option.text}</b>`)).join("")}</div>`;
  }
  if (activity.type === "plan") {
    return `<div class="activity-control plan-control">${activity.options.map((option, index) => button(option, index, `<span>${index + 1}</span><p>${option.text}</p>`)).join("")}</div>`;
  }
  if (activity.type === "true") {
    return `<div class="activity-control true-control">${activity.options.map((option, index) => button(option, index, `<b>${index === 0 ? "V" : index === 1 ? "?" : index === 2 ? "!" : "X"}</b><span>${option.text}</span>`)).join("")}</div>`;
  }
  if (activity.type === "compound") {
    return `<div class="activity-control compound-control"><div class="compound-strip"><span>$</span><span>tiempo</span><span>más $</span></div>${activity.options.map((option, index) => button(option, index)).join("")}</div>`;
  }
  return `<div class="activity-control options">${activity.options.map((option, index) => button(option, index)).join("")}</div>`;
}

function activityVisual(activity) {
  const visuals = {
    choose: `<div class="activity-visual choice-dial"><span>1</span><span>2</span><span>3</span></div>`,
    true: `<div class="activity-visual true-lamp"><b>V</b><b>?</b></div>`,
    order: `<ol class="activity-visual step-stack"><li>Primero</li><li>Después</li><li>Luego</li></ol>`,
    match: `<div class="activity-visual match-grid"><span>Idea</span><span>Ejemplo</span></div>`,
    classify: `<div class="activity-visual buckets"><span>Necesito</span><span>Deseo</span><span>Cuido</span></div>`,
    calc: `<div class="activity-visual calc-box"><b>$</b><span>resta simple</span></div>`,
    fill: `<div class="activity-visual fill-line"><span></span><span></span><span></span></div>`,
    risk: `<div class="activity-visual risk-scan"><b>!</b><span>revisa antes</span></div>`,
    express: `<div class="activity-visual express-timer"><b>30</b><span>segundos</span></div>`,
    compare: `<div class="activity-visual compare-bars"><span></span><span></span></div>`,
    plan: `<div class="activity-visual plan-card"><span>meta</span><span>paso</span><span>revisión</span></div>`,
    explain: `<div class="activity-visual speech-pop">Explícalo fácil</div>`,
    memory: `<div class="activity-visual memory-card"><b>Regla</b></div>`,
    simulate: `<div class="activity-visual simulate-path"><span></span><span></span><span></span></div>`,
    compound: `<div class="activity-visual compound-grow"><span>$</span><span>$$</span><span>$$$</span></div>`
  };
  return visuals[activity.type] || "";
}

function characterLines(level, topic, place, mainGuide, support, activity) {
  const guideLine = {
    1: `Vamos despacio con ${topic.toLowerCase()}. Mira ${place} y cuenta antes de tocar.`,
    2: `Te pongo una escena real ${place}. Revisa si hay prisa, presión o costo escondido.`,
    3: `Abrimos el tablero adulto: monto, fecha, riesgo, reserva y objetivo.`,
    4: `Entramos al negocio: cliente, costo, margen, caja y siguiente decisión.`
  }[level];
  const supportLine = {
    1: `Yo salto al reto: si dudas, pregunta y vuelve a contar.`,
    2: `Cambio el escenario: imagina que la app te apura para pagar.`,
    3: `Cambio el escenario: aparece una obligación que no esperabas.`,
    4: `Cambio el escenario: el cliente o proveedor mueve las condiciones.`
  }[level];
  const actionLine = {
    1: `di en voz baja: "necesito, deseo, guardo" y elige.`,
    2: `mira saldo, precio final y seguridad antes de decidir.`,
    3: `escribe mentalmente monto, plazo, riesgo y plan B.`,
    4: `calcula caja, margen, cobro y riesgo antes de crecer.`
  }[level];
  return { guideLine, supportLine, actionLine };
}

function mini(character, role = "", line = "") {
  const safeLine = escapeHtml(line || `${character.name} está listo para intervenir.`);
  return `<div class="guide ${role} guide-click" role="button" tabindex="0" data-guide-name="${escapeHtml(character.name)}" data-guide-line="${safeLine}">
    <div class="guide-bubble">${safeLine}</div>
    <div class="avatar">${avatar(character)}</div>
    <h3>${character.name}</h3>
    <p>${character.species}</p>
    <small class="tap-hint">Toca para hablar</small>
  </div>`;
}

function setupGuideInteractions(scope = document) {
  scope.querySelectorAll(".guide-click").forEach(guideEl => {
    const say = () => {
      const name = guideEl.dataset.guideName || "";
      const line = guideEl.dataset.guideLine || "";
      const stage = scope.querySelector("#guide-stage") || document.getElementById("guide-stage");
      document.querySelectorAll(".guide-click.speaking").forEach(item => item.classList.remove("speaking"));
      guideEl.classList.add("speaking");
      if (stage) stage.innerHTML = `<b>${escapeHtml(name)}</b><span>${escapeHtml(line)}</span>`;
      setTimeout(() => guideEl.classList.remove("speaking"), 1800);
    };
    guideEl.onclick = say;
    guideEl.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        say();
      }
    };
  });
}

function grade() {
  const total = activeMission.activities.length;
  const correct = activeMission.activities.reduce((sum, activity, index) => sum + (activity.options[activeAnswers[index]]?.isCorrect ? 1 : 0), 0);
  const score = Math.round(correct / total * 100);
  const passed = score >= 80;
  const mainGuide = guide(activeMission);
  const impact = summarizeImpacts(activeMission, activeAnswers);
  const insight = applyLearningImpact(impact, score, passed);
  const progress = currentProgress();
  if (passed) {
    if (!progress.completed[activeMission.key]) progress.tokens += 100 + (score === 100 ? 50 : 25);
    progress.completed[activeMission.key] = true;
    progress.unlocked = Math.max(progress.unlocked, activeMission.id + 1);
  }
  progress.scores[activeMission.key] = score;
  const attempt = recordAttempt(correct, score, passed, impact, insight);
  saveState();
  syncAttemptIfConfigured(attempt);
  showReaction(passed, selectedLevel);
  document.getElementById("mission-content").innerHTML = `
    <div class="mission-body">
      <div class="result">
        <p>Resultado</p>
        <h2 class="${passed ? "ok" : "bad"}">${score}%</h2>
        <p>${passed ? `${mainGuide.name} celebra tu decisión.` : `${mainGuide.name} se enfada un poquito con el impulso y te invita a repetir.`}</p>
        <div class="impact-panel"><h3>${selectedLevel === 1 ? "Mi huella de aprendizaje" : "Huella financiera"}</h3><div class="impact-grid">${impactBadges(impact)}</div><p>${insight}</p></div>
        <div class="pill-row"><span class="pill">${correct}/${total} correctas</span><span class="pill">${progress.tokens} tokens</span><span class="pill">${Object.keys(progress.completed).length}/50 zonas</span></div>
        <button id="finish">Volver al mapa</button>
      </div>
    </div>`;
  document.getElementById("finish").onclick = () => {
    document.getElementById("mission").close();
    particleScene = state.family?.open ? (isChildFamilyMode() ? "familyChild" : "familyAdvanced") : "map";
    refreshParticles();
    render();
    if (passed && modules.filter(module => module.worldIndex === activeMission.worldIndex).every(module => progress.completed[module.key])) openCertificate(activeMission.worldIndex);
  };
}

function summarizeImpacts(mission, answers) {
  const total = { liquidez: 0, seguridad: 0, crecimiento: 0, criterio: 0, impacto: 0 };
  mission.activities.forEach((activity, index) => {
    const impact = activity.options[answers[index]]?.impact || {};
    dimensionKeys.forEach(key => total[key] += impact[key] || 0);
  });
  return total;
}

function dominantDimension(values) {
  return dimensionKeys.slice().sort((a, b) => (values[b] || 0) - (values[a] || 0))[0] || "criterio";
}

function impactBadges(values) {
  const labels = selectedLevel === 1 ? childDimensionLabels : dimensionLabels;
  return dimensionKeys.map(key => `<span><b>${labels[key]}</b><em>${(values[key] || 0) > 0 ? "+" : ""}${values[key] || 0}</em></span>`).join("");
}

function profileInline() {
  const profile = currentProgress().profile || profileDefault();
  const dominant = dominantDimension(profile);
  const labels = selectedLevel === 1 ? childDimensionLabels : dimensionLabels;
  const title = selectedLevel === 1 ? "Mi progreso" : "Pulso financiero";
  return `<span class="pulse-line">${title}: ${labels[dominant]} · racha ${profile.streak || 0}</span>`;
}

function applyLearningImpact(impact, score, passed) {
  const progress = currentProgress();
  progress.profile = { ...profileDefault(), ...(progress.profile || {}) };
  dimensionKeys.forEach(key => progress.profile[key] = Math.max(0, (progress.profile[key] || 0) + (impact[key] || 0)));
  progress.profile.streak = passed ? (progress.profile.streak || 0) + 1 : 0;
  const dominant = dominantDimension(impact);
  const labels = selectedLevel === 1 ? childDimensionLabels : dimensionLabels;
  progress.profile.lastInsight = score >= 80 ? `Tu fortaleza hoy fue ${labels[dominant]}. Estás aprendiendo a mirar consecuencias, no solo respuestas.` : `Repite con calma. Fíjate especialmente en ${labels[dominant]} y vuelve a decidir paso a paso.`;
  return progress.profile.lastInsight;
}

function recordAttempt(correct, score, passed, impact, insight) {
  const world = worlds[activeMission.worldIndex];
  const mainGuide = guide(activeMission);
  const progress = currentProgress();
  const attempt = {
    attemptId: `${state.studentId || "student"}-${Date.now()}`,
    studentId: state.studentId,
    studentName: state.playerName,
    level: selectedLevel,
    levelName: levels[selectedLevel].name,
    routeKey: routeKey(),
    routeName: routeLabel(),
    worldId: world.id,
    worldName: `${world.region}: ${world.name}`,
    moduleId: activeMission.key,
    moduleCode: activeMission.code,
    moduleTopic: activeMission.topic,
    country: activeMission.country,
    guide: mainGuide.name,
    correct,
    total: activeMission.activities.length,
    score,
    passed,
    impact,
    insight,
    profileAfter: { ...progress.profile },
    tokensAfterAttempt: progress.tokens,
    completedModules: Object.keys(progress.completed).length,
    answers: activeAnswers.slice(),
    answerDetails: activeMission.activities.map((activity, index) => ({
      questionId: activity.id,
      format: activity.answerFormat,
      question: activity.question,
      selectedOption: activity.options[activeAnswers[index]]?.text || "",
      correct: Boolean(activity.options[activeAnswers[index]]?.isCorrect)
    })),
    createdAt: new Date().toISOString()
  };
  state.attempts = Array.isArray(state.attempts) ? state.attempts : [];
  state.attempts.push(attempt);
  return attempt;
}

function dataset() {
  const progress = currentProgress();
  return {
    student: { id: state.studentId, name: state.playerName, selectedLevel, selectedLevelName: levels[selectedLevel].name, routeKey: routeKey(), routeName: routeLabel(), createdAt: state.createdAt, updatedAt: state.updatedAt },
    progress: { routeKey: routeKey(), routeName: routeLabel(), tokens: progress.tokens, unlocked: progress.unlocked, completedModules: Object.keys(progress.completed).length, completed: progress.completed, scores: progress.scores, profile: progress.profile, routes: state.routes },
    attempts: state.attempts || []
  };
}

async function syncProgress(successMessage) {
  if (!firebaseDb || !firebaseApi || !navigator.onLine || !state.studentId) {
    renderFirebaseStatus("Avance guardado");
    return;
  }
  try {
    const ref = firebaseApi.doc(firebaseDb, "students", state.studentId);
    await firebaseApi.setDoc(ref, { ...dataset().student, progress: dataset().progress, updatedAt: new Date().toISOString() }, { merge: true });
    renderFirebaseStatus(successMessage || "Avance guardado");
  } catch {
    renderFirebaseStatus("Avance guardado en este equipo");
  }
}

async function syncAttemptIfConfigured(attempt) {
  await syncProgress();
  if (!attempt || !firebaseDb || !firebaseApi || !navigator.onLine || !state.studentId) return;
  try {
    const ref = firebaseApi.doc(firebaseDb, "students", state.studentId, "attempts", attempt.attemptId);
    await firebaseApi.setDoc(ref, attempt, { merge: true });
  } catch {
    renderFirebaseStatus("Avance guardado en este equipo");
  }
}

function openCertificate(index) {
  const world = worlds[index];
  const progress = currentProgress();
  const done = modules.filter(module => module.worldIndex === index && progress.completed[module.key]).length;
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  document.getElementById("certificate-content").innerHTML = `<div class="mission-body"><section class="certificate"><p>Certificado de aprobación</p><h2>El Juego del Dinero</h2><p>Otorga el presente certificado a</p><div class="cert-name">${escapeHtml(state.playerName)}</div><p>por aprobar</p><h3>${world.region}: ${world.name}</h3><p>${world.description}</p><div class="pill-row"><span class="pill">${routeLabel()}</span><span class="pill">${done}/10 zonas aprobadas</span><span class="pill">Nota mínima: 80%</span><span class="pill">${date}</span></div></section><div class="actions"><button class="secondary" id="close-cert-action">Volver</button><button id="print-cert">Imprimir o guardar PDF</button></div></div>`;
  document.getElementById("close-cert-action").onclick = () => document.getElementById("certificate").close();
  document.getElementById("print-cert").onclick = () => print();
  openDialog(document.getElementById("certificate"));
}

function showReaction(passed, level) {
  const layer = document.createElement("div");
  layer.className = `reaction-layer ${passed ? "win" : "miss"}`;
  const hero = activeMission ? guide(activeMission) : null;
  const heroAvatar = hero ? `<div class="reaction-character ${passed ? "celebrate" : "warn"}">${avatar(hero)}<strong>${passed ? "Genial" : "Pausa"}</strong></div>` : "";
  const pieces = passed
    ? `${Array.from({ length: level === 1 ? 52 : 30 }, (_, i) => `<span style="--x:${Math.random() * 100}%;--d:${Math.random() * 1.35 + .55}s;--r:${Math.random() * 360}deg"></span>`).join("")}${heroAvatar}<div class="reward-burst"><b>+ criterio</b><small>decidiste mejor</small></div>`
    : `${heroAvatar}<div class="angry-face"><b>!</b><small>Respira y repite</small></div><div class="mistake-shake">El impulso intentó ganar</div>`;
  layer.innerHTML = pieces;
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), passed ? 1600 : 1400);
}

function openDialog(dialog) {
  dialog.showModal ? dialog.showModal() : dialog.setAttribute("open", "open");
}

function avatar(c) {
  if (c.kind === "human") return human(c);
  const palette = animalPalette(c);
  return avatar3d(c, palette, c.kind);
}

function animalPalette(c) {
  if (c.kind === "ferret") {
    const coats = { sable: ["#8B5A2B", "#F3D7B6", "#4A2D1F"], dark: ["#3B2417", "#C6A27A", "#120A06"], gold: ["#B8860B", "#FFE5A3", "#6B3F08"], silver: ["#BFC7D5", "#F3F4F6", "#65748A"], cream: ["#E8D5AD", "#FFF4CC", "#A9874F"], white: ["#F8FAFC", "#DCEBFF", "#9CB3CF"] };
    const [fur, face, dark] = coats[c.coat] || coats.sable;
    return { fur, face, dark, skin: face };
  }
  if (c.kind === "setter") return { fur: "#F8FAFC", face: "#FFF5DE", dark: "#B8860B", skin: "#F4C07B" };
  if (c.kind === "mastiff") return { fur: "#8A5A3C", face: "#C9A17C", dark: "#2A160D", skin: "#B98258" };
  if (c.kind === "cat") {
    const white = c.coat === "white";
    return { fur: white ? "#F8FAFC" : "#F3D7B6", face: white ? "#EAF4FF" : "#FFE0B8", dark: white ? "#9CB3CF" : "#4B2A16", skin: "#F8C8A8" };
  }
  return { fur: "#D4AF37", face: "#FFE5A3", dark: "#4A2D1F", skin: "#F4C07B" };
}

function avatar3d(c, palette, kindClass) {
  const safeName = escapeHtml(c.name);
  return `<div class="avatar3d avatar-${kindClass}" style="--accent:${c.color};--fur:${palette.fur};--face:${palette.face};--dark:${palette.dark};--skin:${palette.skin}" aria-label="${safeName}">
    <div class="avatar-shadow"></div>
    <div class="avatar-aura"></div>
    <div class="avatar-rig">
      <span class="tail"></span>
      <div class="avatar-body"><span class="chest"></span><span class="arm arm-left"></span><span class="arm arm-right"></span></div>
      <div class="head">
        <span class="ear ear-left"></span><span class="ear ear-right"></span>
        <span class="mask"></span>
        <span class="snout"></span>
        <span class="cheek cheek-left"></span><span class="cheek cheek-right"></span>
        <span class="eye eye-left"><i></i></span><span class="eye eye-right"><i></i></span>
        <span class="brow brow-left"></span><span class="brow brow-right"></span>
        <span class="nose"></span><span class="mouth"></span>
      </div>
      <span class="foot foot-left"></span><span class="foot foot-right"></span>
      <span class="badge-dot"></span>
    </div>
  </div>`;
}

function human(c) {
  const skin = c.name.includes("Mila") || c.name.includes("Sofía") || c.name.includes("Noa") ? "#D89A72" : "#F2B88F";
  const hair = c.name.includes("Rafa") || c.name.includes("Marco") || c.name.includes("Tomás") ? "#1F2937" : c.name.includes("Zoe") || c.name.includes("Ari") ? "#5227A3" : "#4B2A16";
  return `<div class="avatar3d avatar-human" style="--accent:${c.color};--fur:${hair};--face:${skin};--dark:${hair};--skin:${skin}" aria-label="${escapeHtml(c.name)}">
    <div class="avatar-shadow"></div>
    <div class="avatar-aura"></div>
    <div class="avatar-rig">
      <div class="avatar-body human-body"><span class="chest"></span><span class="arm arm-left"></span><span class="arm arm-right"></span></div>
      <div class="head human-head">
        <span class="hair"></span><span class="ear ear-left"></span><span class="ear ear-right"></span>
        <span class="cheek cheek-left"></span><span class="cheek cheek-right"></span>
        <span class="eye eye-left"><i></i></span><span class="eye eye-right"><i></i></span>
        <span class="brow brow-left"></span><span class="brow brow-right"></span>
        <span class="nose"></span><span class="mouth"></span>
      </div>
      <span class="foot foot-left"></span><span class="foot foot-right"></span>
      <span class="badge-dot"></span>
    </div>
  </div>`;
}

function particles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let ps = [];
  const ageIcons = {
    1: ["coin", "bill", "jar", "piggy", "price", "list", "seed", "key", "cart", "home"],
    2: ["phone", "lock", "card", "chart", "ticket", "clock", "subscription", "shield", "coin", "bill"],
    3: ["card", "shield", "home", "chart", "doc", "safe", "bank", "tax", "portfolio", "receipt"],
    4: ["chart", "cash", "gear", "card", "box", "contract", "rocket", "store", "team", "portfolio"]
  };
  const worldIcons = {
    hogar: ["coin", "bill", "jar", "piggy", "list", "cart", "home", "receipt"],
    saber: ["bank", "card", "doc", "lock", "shield", "calc", "book", "price"],
    autonomia: ["wallet", "shield", "receipt", "tax", "safe", "home", "card", "clock"],
    mercado: ["store", "box", "tag", "chart", "handshake", "cart", "cash", "gear"],
    futuro: ["chart", "portfolio", "seed", "rocket", "home", "diamond", "clock", "bill"]
  };
  const sceneIcons = {
    onboarding: ["coin", "bill", "book", "seed", "home", "jar"],
    map: ["chart", "compass", "coin", "shield", "portfolio", "clock"],
    mission: ["doc", "calc", "price", "shield", "seed", "card"],
    familyChild: ["piggy", "coin", "cart", "home", "jar", "seed", "list"],
    familyAdvanced: ["chart", "cash", "rocket", "contract", "shield", "portfolio", "gear"]
  };
  function make() {
    const level = selectedLevel || onboardingLevel || 1;
    const world = worlds[selectedWorld] || worlds[0];
    const icons = [...(ageIcons[level] || ageIcons[1]), ...(worldIcons[world.id] || []), ...(sceneIcons[particleScene] || [])];
    const count = innerWidth < 640 ? 54 : 92;
    ps = Array.from({ length: count }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      s: 11 + Math.random() * 19,
      v: .00018 + Math.random() * .00048,
      d: (Math.random() - .5) * .00036,
      t: icons[index % icons.length],
      spin: Math.random() * 6,
      pulse: .85 + Math.random() * .3
    }));
  }
  refreshParticles = make;
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else {
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }
  }
  function fillStroke(fill, stroke, width = 1.5) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.fill();
    ctx.stroke();
  }
  function label(text, size, color = "rgba(2,6,23,.82)", y = 0) {
    ctx.fillStyle = color;
    ctx.font = `900 ${Math.max(7, size)}px Segoe UI, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, y);
  }
  function drawCoin(s) {
    const grad = ctx.createRadialGradient(-s * .18, -s * .18, s * .08, 0, 0, s * .58);
    grad.addColorStop(0, "rgba(255,245,180,.95)");
    grad.addColorStop(.45, "rgba(255,191,0,.72)");
    grad.addColorStop(1, "rgba(126,87,12,.45)");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(255,235,160,.92)";
    ctx.lineWidth = Math.max(1.5, s * .08);
    ctx.beginPath();
    ctx.arc(0, 0, s * .54, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(92,62,8,.55)";
    ctx.lineWidth = Math.max(1, s * .045);
    ctx.beginPath();
    ctx.arc(0, 0, s * .36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(2,6,23,.72)";
    ctx.font = `900 ${Math.max(10, s * .64)}px Segoe UI, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", 0, s * .03);
    for (let i = 0; i < 10; i++) {
      const a = i * Math.PI * 2 / 10;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * s * .43, Math.sin(a) * s * .43);
      ctx.lineTo(Math.cos(a) * s * .49, Math.sin(a) * s * .49);
      ctx.stroke();
    }
  }
  function drawBill(s, text = "100") {
    const w = s * 1.55;
    const h = s * .88;
    const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grad.addColorStop(0, "rgba(224,255,255,.26)");
    grad.addColorStop(.5, "rgba(80,200,120,.22)");
    grad.addColorStop(1, "rgba(212,175,55,.24)");
    ctx.fillStyle = grad;
    ctx.strokeStyle = "rgba(224,255,255,.78)";
    ctx.lineWidth = Math.max(1.5, s * .055);
    rr(-w / 2, -h / 2, w, h, s * .12);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(212,175,55,.58)";
    ctx.lineWidth = Math.max(1, s * .035);
    ctx.strokeRect(-w * .39, -h * .31, w * .78, h * .62);
    ctx.fillStyle = "rgba(255,191,0,.88)";
    ctx.font = `900 ${Math.max(8, s * .34)}px Segoe UI, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 0, 0);
    ctx.fillStyle = "rgba(224,255,255,.70)";
    ctx.font = `800 ${Math.max(7, s * .24)}px Segoe UI, Arial`;
    ctx.fillText("$", -w * .34, -h * .22);
    ctx.fillText("$", w * .34, h * .22);
    ctx.strokeStyle = "rgba(224,255,255,.38)";
    for (let i = 0; i < 3; i++) {
      const y = -h * .18 + i * h * .18;
      ctx.beginPath();
      ctx.moveTo(-w * .22, y);
      ctx.lineTo(w * .22, y);
      ctx.stroke();
    }
  }
  function drawPanel(s, text, fill, stroke) {
    const w = s * 1.15;
    const h = s * .9;
    rr(-w / 2, -h / 2, w, h, s * .12);
    fillStroke(fill, stroke, Math.max(1.4, s * .055));
    label(text, s * .32, "rgba(224,255,255,.88)");
  }
  function drawSimpleIcon(type, s, worldColor) {
    const line = "rgba(224,255,255,.82)";
    const soft = `${worldColor}55`;
    const gold = "rgba(255,191,0,.78)";
    const green = "rgba(80,200,120,.62)";
    const red = "rgba(239,68,68,.68)";
    if (type === "piggy" || type === "jar") {
      rr(-s * .46, -s * .34, s * .92, s * .86, s * .16);
      fillStroke(type === "piggy" ? "rgba(255,209,220,.36)" : "rgba(224,255,255,.20)", line, s * .055);
      ctx.fillStyle = gold;
      ctx.fillRect(-s * .26, -s * .12, s * .52, s * .08);
      label("$", s * .38, gold, s * .18);
      if (type === "piggy") {
        ctx.beginPath();
        ctx.arc(s * .42, -s * .18, s * .12, 0, Math.PI * 2);
        fillStroke("rgba(255,209,220,.44)", line, s * .04);
      }
    } else if (type === "price" || type === "tag") {
      ctx.beginPath();
      ctx.moveTo(-s * .55, -s * .2);
      ctx.lineTo(-s * .12, -s * .55);
      ctx.lineTo(s * .55, s * .12);
      ctx.lineTo(s * .15, s * .55);
      ctx.closePath();
      fillStroke("rgba(212,175,55,.25)", line, s * .055);
      ctx.beginPath();
      ctx.arc(-s * .17, -s * .26, s * .08, 0, Math.PI * 2);
      fillStroke("rgba(2,6,23,.65)", line, s * .035);
      label("$", s * .34, gold, s * .08);
    } else if (type === "list" || type === "receipt" || type === "doc" || type === "contract") {
      rr(-s * .42, -s * .58, s * .84, s * 1.16, s * .1);
      fillStroke("rgba(224,255,255,.18)", line, s * .05);
      ctx.strokeStyle = type === "contract" ? gold : line;
      ctx.lineWidth = Math.max(1, s * .05);
      for (let i = 0; i < 4; i++) {
        const y = -s * .32 + i * s * .19;
        ctx.beginPath();
        ctx.moveTo(-s * .24, y);
        ctx.lineTo(s * .25, y);
        ctx.stroke();
      }
      if (type === "receipt") label("%", s * .25, gold, s * .36);
    } else if (type === "seed") {
      ctx.beginPath();
      ctx.ellipse(-s * .15, s * .05, s * .24, s * .46, -.65, 0, Math.PI * 2);
      fillStroke(green, line, s * .045);
      ctx.beginPath();
      ctx.ellipse(s * .18, -s * .04, s * .22, s * .42, .6, 0, Math.PI * 2);
      fillStroke("rgba(255,191,0,.42)", line, s * .045);
    } else if (type === "key") {
      ctx.beginPath();
      ctx.arc(-s * .28, 0, s * .24, 0, Math.PI * 2);
      fillStroke("rgba(255,191,0,.26)", line, s * .055);
      ctx.strokeStyle = gold;
      ctx.lineWidth = s * .12;
      ctx.beginPath();
      ctx.moveTo(-s * .04, 0);
      ctx.lineTo(s * .5, 0);
      ctx.stroke();
      ctx.lineWidth = s * .07;
      ctx.beginPath();
      ctx.moveTo(s * .28, 0);
      ctx.lineTo(s * .28, s * .22);
      ctx.moveTo(s * .43, 0);
      ctx.lineTo(s * .43, s * .16);
      ctx.stroke();
    } else if (type === "phone") {
      rr(-s * .34, -s * .62, s * .68, s * 1.24, s * .13);
      fillStroke("rgba(2,6,23,.72)", line, s * .055);
      rr(-s * .24, -s * .42, s * .48, s * .76, s * .06);
      fillStroke(soft, "rgba(224,255,255,.26)", s * .03);
      label("$", s * .28, gold, -s * .02);
    } else if (type === "lock" || type === "safe" || type === "shield") {
      if (type === "shield") {
        ctx.beginPath();
        ctx.moveTo(0, -s * .58);
        ctx.lineTo(s * .48, -s * .34);
        ctx.lineTo(s * .34, s * .38);
        ctx.lineTo(0, s * .62);
        ctx.lineTo(-s * .34, s * .38);
        ctx.lineTo(-s * .48, -s * .34);
        ctx.closePath();
        fillStroke("rgba(34,211,238,.22)", line, s * .055);
        label("SI", s * .24, gold, s * .02);
      } else {
        rr(-s * .48, -s * .12, s * .96, s * .7, s * .12);
        fillStroke(type === "safe" ? "rgba(2,6,23,.74)" : "rgba(34,211,238,.18)", line, s * .055);
        ctx.beginPath();
        ctx.arc(0, -s * .13, s * .32, Math.PI, 0);
        ctx.stroke();
        label(type === "safe" ? "$" : "*", s * .34, gold, s * .22);
      }
    } else if (type === "chart" || type === "portfolio") {
      rr(-s * .56, -s * .42, s * 1.12, s * .92, s * .1);
      fillStroke("rgba(80,200,120,.14)", line, s * .045);
      ctx.fillStyle = green;
      [-.32, -.08, .16].forEach((x, i) => ctx.fillRect(s * x, s * (.24 - i * .17), s * .14, s * (.18 + i * .18)));
      ctx.strokeStyle = gold;
      ctx.lineWidth = s * .06;
      ctx.beginPath();
      ctx.moveTo(-s * .42, s * .2);
      ctx.lineTo(-s * .12, -s * .02);
      ctx.lineTo(s * .12, s * .08);
      ctx.lineTo(s * .43, -s * .28);
      ctx.stroke();
    } else if (type === "card") {
      drawBill(s, "TAR");
    } else if (type === "cash" || type === "bill") {
      drawBill(s, type === "cash" ? "100" : "50");
    } else if (type === "home" || type === "bank" || type === "store") {
      ctx.beginPath();
      ctx.moveTo(-s * .58, -s * .02);
      ctx.lineTo(0, -s * .58);
      ctx.lineTo(s * .58, -s * .02);
      ctx.lineTo(s * .44, s * .58);
      ctx.lineTo(-s * .44, s * .58);
      ctx.closePath();
      fillStroke(type === "store" ? "rgba(80,200,120,.20)" : "rgba(224,255,255,.16)", line, s * .055);
      if (type === "bank") label("BAN", s * .2, gold, s * .12);
      else if (type === "store") label("TDA", s * .2, gold, s * .12);
      else {
        ctx.fillStyle = "rgba(212,175,55,.45)";
        ctx.fillRect(-s * .1, s * .18, s * .2, s * .4);
      }
    } else if (type === "cart") {
      ctx.strokeStyle = line;
      ctx.lineWidth = s * .07;
      ctx.beginPath();
      ctx.moveTo(-s * .5, -s * .32);
      ctx.lineTo(-s * .35, -s * .32);
      ctx.lineTo(-s * .22, s * .18);
      ctx.lineTo(s * .42, s * .18);
      ctx.lineTo(s * .5, -s * .1);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(-s * .13, s * .39, s * .08, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(s * .32, s * .39, s * .08, 0, Math.PI * 2); ctx.fill();
    } else if (type === "clock") {
      ctx.beginPath();
      ctx.arc(0, 0, s * .48, 0, Math.PI * 2);
      fillStroke("rgba(224,255,255,.14)", line, s * .055);
      ctx.strokeStyle = gold;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s * .25);
      ctx.moveTo(0, 0);
      ctx.lineTo(s * .22, s * .12);
      ctx.stroke();
    } else if (type === "compass") {
      ctx.beginPath();
      ctx.arc(0, 0, s * .5, 0, Math.PI * 2);
      fillStroke("rgba(34,211,238,.14)", line, s * .05);
      ctx.beginPath();
      ctx.moveTo(0, -s * .42);
      ctx.lineTo(s * .16, s * .12);
      ctx.lineTo(0, s * .02);
      ctx.lineTo(-s * .16, s * .12);
      ctx.closePath();
      fillStroke("rgba(255,191,0,.50)", gold, s * .035);
    } else if (type === "ticket" || type === "subscription") {
      drawPanel(s, type === "subscription" ? "APL" : "TIC", "rgba(255,0,255,.18)", line);
    } else if (type === "tax") {
      drawPanel(s, "IMP", "rgba(239,68,68,.18)", red);
    } else if (type === "calc") {
      drawPanel(s, "123", "rgba(34,211,238,.16)", line);
    } else if (type === "book") {
      rr(-s * .5, -s * .45, s, s * .9, s * .08);
      fillStroke("rgba(34,211,238,.18)", line, s * .05);
      ctx.beginPath();
      ctx.moveTo(0, -s * .42);
      ctx.lineTo(0, s * .42);
      ctx.stroke();
      label("$", s * .3, gold, s * .02);
    } else if (type === "wallet") {
      rr(-s * .55, -s * .32, s * 1.1, s * .76, s * .12);
      fillStroke("rgba(212,175,55,.20)", line, s * .055);
      ctx.beginPath();
      ctx.arc(s * .25, s * .04, s * .08, 0, Math.PI * 2);
      fillStroke(gold, gold, 1);
    } else if (type === "box") {
      ctx.beginPath();
      ctx.moveTo(0, -s * .55);
      ctx.lineTo(s * .5, -s * .25);
      ctx.lineTo(s * .5, s * .34);
      ctx.lineTo(0, s * .62);
      ctx.lineTo(-s * .5, s * .34);
      ctx.lineTo(-s * .5, -s * .25);
      ctx.closePath();
      fillStroke("rgba(212,175,55,.18)", line, s * .05);
      ctx.beginPath();
      ctx.moveTo(0, -s * .55);
      ctx.lineTo(0, s * .62);
      ctx.moveTo(-s * .5, -s * .25);
      ctx.lineTo(0, s * .05);
      ctx.lineTo(s * .5, -s * .25);
      ctx.stroke();
    } else if (type === "gear") {
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6;
        const r = i % 2 ? s * .42 : s * .56;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      fillStroke("rgba(224,255,255,.16)", line, s * .045);
      ctx.beginPath();
      ctx.arc(0, 0, s * .19, 0, Math.PI * 2);
      fillStroke("rgba(2,6,23,.68)", gold, s * .04);
    } else if (type === "rocket") {
      ctx.beginPath();
      ctx.moveTo(0, -s * .64);
      ctx.quadraticCurveTo(s * .45, -s * .1, s * .18, s * .42);
      ctx.lineTo(0, s * .28);
      ctx.lineTo(-s * .18, s * .42);
      ctx.quadraticCurveTo(-s * .45, -s * .1, 0, -s * .64);
      ctx.closePath();
      fillStroke("rgba(255,191,0,.28)", line, s * .05);
      ctx.beginPath();
      ctx.arc(0, -s * .16, s * .12, 0, Math.PI * 2);
      fillStroke(soft, line, s * .03);
    } else if (type === "team" || type === "handshake") {
      ctx.fillStyle = soft;
      ctx.beginPath(); ctx.arc(-s * .2, -s * .12, s * .2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(s * .2, -s * .12, s * .2, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = line;
      ctx.lineWidth = s * .06;
      ctx.beginPath();
      ctx.moveTo(-s * .48, s * .34);
      ctx.quadraticCurveTo(0, s * .02, s * .48, s * .34);
      ctx.stroke();
    } else if (type === "diamond") {
      ctx.beginPath();
      ctx.moveTo(0, -s * .58);
      ctx.lineTo(s * .52, -s * .08);
      ctx.lineTo(0, s * .58);
      ctx.lineTo(-s * .52, -s * .08);
      ctx.closePath();
      fillStroke("rgba(224,255,255,.22)", line, s * .05);
      ctx.strokeStyle = gold;
      ctx.beginPath();
      ctx.moveTo(-s * .52, -s * .08);
      ctx.lineTo(s * .52, -s * .08);
      ctx.moveTo(0, -s * .58);
      ctx.lineTo(0, s * .58);
      ctx.stroke();
    } else {
      drawPanel(s, "$", soft, line);
    }
  }
  function drawIcon(p) {
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;
    const s = p.s * Math.min(devicePixelRatio || 1, 2);
    const worldColor = worlds[selectedWorld]?.color || "#22D3EE";
    ctx.save();
    ctx.globalAlpha = .54 + Math.sin(Date.now() / 900 + p.spin) * .08;
    ctx.strokeStyle = worldColor;
    ctx.fillStyle = "rgba(224,255,255,.10)";
    ctx.lineWidth = Math.max(1.4, s * .055);
    ctx.translate(x, y);
    ctx.scale(p.pulse, p.pulse);
    ctx.rotate(Math.sin(Date.now() / 1800 + p.spin) * .2);
    if (p.t === "coin") {
      drawCoin(s);
    } else {
      drawSimpleIcon(p.t, s, worldColor);
    }
    ctx.restore();
  }
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ps.forEach(p => {
      p.y -= p.v;
      p.x += p.d;
      if (p.y < -.08) p.y = 1.08;
      if (p.x < -.08) p.x = 1.08;
      if (p.x > 1.08) p.x = -.08;
      drawIcon(p);
    });
    requestAnimationFrame(frame);
  }
  addEventListener("resize", () => { resize(); make(); });
  resize();
  make();
  frame();
}

try {
  init();
} catch (error) {
  document.body.innerHTML = `<main class="shell"><section class="panel"><h1>No se pudo cargar</h1><p>${String(error.message || error)}</p></section></main>`;
}
