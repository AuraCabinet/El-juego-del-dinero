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
let refreshParticles = () => {};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("juegoDineroProgresoV2") || "{}";
    const data = { playerName: "", tokens: 0, unlocked: 1, completed: {}, scores: {}, attempts: [], profile: profileDefault(), family: familyDefault(), ...JSON.parse(saved) };
    data.family = { ...familyDefault(), ...(data.family || {}) };
    data.family.players = Array.isArray(data.family.players) && data.family.players.length ? data.family.players.map((player, index) => ({ ...familyPlayer(player.name || `Jugador ${index + 1}`, player.color || "#22D3EE"), ...player, stocks: player.stocks || {}, reputation: player.reputation ?? 50 })) : familyDefault().players;
    return data;
  } catch {
    return { playerName: "", tokens: 0, unlocked: 1, completed: {}, scores: {}, attempts: [], profile: profileDefault(), family: familyDefault() };
  }
}

function saveState() {
  state.updatedAt = new Date().toISOString();
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

function topicsForLevel(level) {
  if (level === 4 && selectedEntrepreneurTrack === "woman") return womanEntrepreneurTopics;
  return curricula[level];
}

function buildModules(level) {
  return topicsForLevel(level).map((topic, index) => ({
    id: index + 1,
    code: `M${index + 1}`,
    topic,
    worldIndex: Math.floor(index / 10),
    localIndex: index % 10,
    country: worlds[Math.floor(index / 10)].countries[index % 10],
    activities: activityTypes.map((type, activityIndex) => createActivity(topic, index, activityIndex, level, type))
  }));
}

function createActivity(topic, topicIndex, activityIndex, level, type) {
  const place = contexts[level][(topicIndex + activityIndex) % contexts[level].length];
  const nums = numbersFor(level, topicIndex, activityIndex);
  const focus = focusFor(topic);
  const correct = correctText(level, type.key, topic, nums, place);
  const question = questionText(level, type.key, topic, nums, place);
  const options = shuffleOptions([correct, ...wrongOptions(level, type.key, topic, nums, place)], topicIndex * 31 + activityIndex * 17 + level).slice(0, 4);
  if (!options.includes(correct)) options[(topicIndex + activityIndex) % 4] = correct;
  return {
    id: `L${level}-T${topicIndex + 1}-A${activityIndex + 1}`,
    type: type.key,
    answerFormat: type.label,
    topic,
    question,
    options: options.map((text, i) => {
      const isCorrect = text === correct;
      return { text, isCorrect, impact: optionImpact(isCorrect, i, focus, level) };
    }),
    place,
    focus,
    lifeEffect: lifeEffect(level, topic, focus),
    prompt: promptFor(level, type.key),
    tip: tipFor(level, type.key)
  };
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

function questionText(level, key, topic, nums, place) {
  const simple = {
    choose: `Mira ${place}. ¿Qué harías primero con "${topic}"?`,
    true: `¿Cuál frase ayuda de verdad con "${topic}"?`,
    order: `Ordena una forma segura de practicar "${topic}".`,
    match: `Une la idea con su ejemplo: "${topic}".`,
    classify: `Clasifica la mejor acción para "${topic}".`,
    calc: `Si tienes $${nums[0]} y guardas $${nums[1]}, ¿cuánto queda para usar?`,
    fill: `Completa la frase: "${topic}" sirve para...`,
    risk: `¿Dónde está el riesgo en esta situación ${place}?`,
    express: `Reto rápido: ¿qué puedes hacer en 30 segundos con "${topic}"?`,
    compare: `Compara dos opciones. ¿Cuál cuida mejor tu dinero?`,
    plan: `Elige un plan pequeño para practicar "${topic}".`,
    explain: `¿Cómo se lo explicarías a alguien de tu edad?`,
    memory: `Recuerda la regla más útil para "${topic}".`,
    simulate: `Si eliges rápido sin revisar, ¿qué puede pasar?`,
    compound: compoundQuestion(level, nums)
  };
  if (level === 1) return simple[key];
  const teenLine = {
    choose: `${place}: ¿qué decisión te deja con más control sobre "${topic}"?`,
    true: `Elige la frase más útil para entender "${topic}" sin complicarlo.`,
    order: `Ordena los pasos antes de gastar, guardar o invertir.`,
    match: `Empareja "${topic}" con una situación real.`,
    classify: `Clasifica la acción que protege tu mesada o primer ingreso.`,
    calc: `Si recibes $${nums[0]} y separas $${nums[1]}, ¿cuánto queda disponible?`,
    fill: `Completa la idea práctica de "${topic}".`,
    risk: `${place}: ¿qué señal te avisa que debes parar?`,
    express: `Actividad express: ¿qué revisión rápida haces antes de decidir?`,
    compare: `¿Qué opción tiene mejor relación entre precio, uso y futuro?`,
    plan: `Elige un plan de una semana para "${topic}".`,
    explain: `¿Qué explicación demuestra que lo entendiste?`,
    memory: `Elige una regla para no caer en impulso o presión.`,
    simulate: `¿Qué consecuencia aparece si no miras costo, plazo o seguridad?`,
    compound: compoundQuestion(level, nums)
  };
  if (level === 2) return teenLine[key];
  const advanced = {
    choose: `${place}: ¿qué decisión sostiene mejor "${topic}"?`,
    true: `Elige la definición operativa de "${topic}".`,
    order: `Ordena un proceso responsable para decidir.`,
    match: `Empareja concepto y aplicación real.`,
    classify: `Clasifica la acción según estabilidad, riesgo y futuro.`,
    calc: `Si entran $${nums[0]} y reservas $${nums[1]}, ¿cuánto queda para operar?`,
    fill: `Completa la frase financiera útil.`,
    risk: `Detecta el riesgo principal antes de avanzar.`,
    express: `Actividad express: revisa dato, monto, fecha y consecuencia.`,
    compare: `Compara costo total, beneficio y plazo.`,
    plan: `Elige el plan con fecha, monto y revisión.`,
    explain: `Elige la explicación que una persona responsable podría defender.`,
    memory: `Selecciona la regla financiera más sólida.`,
    simulate: `Simula la consecuencia más probable de decidir sin datos.`,
    compound: compoundQuestion(level, nums)
  };
  return advanced[key];
}

function compoundQuestion(level, nums) {
  if (level === 1) return "Si guardas 1 moneda, luego otra, y no las sacas, ¿qué aprende tu alcancía?";
  if (level === 2) return `Si ahorras $${nums[1]} cada semana y no lo sacas, ¿qué idea aparece con el tiempo?`;
  if (level === 3) return "¿Qué resume mejor el interés compuesto en una inversión de largo plazo?";
  return "¿Cómo se usa el interés compuesto para hacer crecer patrimonio sin perder control?";
}

function correctText(level, key, topic, nums, place) {
  const left = nums[0] - nums[1];
  const childAnswers = {
    choose: "Parar, mirar el precio y pedir ayuda si hace falta",
    true: "El dinero sirve para pagar, guardar y elegir con cuidado",
    order: "Mirar, contar, preguntar y decidir",
    match: "Alcancía = lugar para guardar una meta",
    classify: "Necesario primero, deseo después",
    calc: `$${left}`,
    fill: "cuidar lo que tengo y decidir mejor",
    risk: "Comprar sin mirar si alcanza",
    express: "Contar tus monedas y decir cuál vas a guardar",
    compare: "La opción que necesitas y puedes pagar",
    plan: "Guardar una parte y revisar la alcancía",
    explain: "Es elegir con calma para que el dinero alcance",
    memory: "Primero necesito, después deseo",
    simulate: "Puede faltar dinero para algo importante",
    compound: "Que muchas monedas pequeñas pueden crecer con paciencia"
  };
  if (level === 1) return childAnswers[key];
  const teenAnswers = {
    choose: "Revisar dinero disponible, costo real y consecuencia",
    true: "Una buena decisión protege mi presente y mi futuro",
    order: "Meta, límite, comparación, decisión y revisión",
    match: "Suscripción = pago que puede repetirse solo",
    classify: "Prioridad: cubre meta, seguridad y presupuesto",
    calc: `$${left}`,
    fill: "tomar decisiones con información y no por impulso",
    risk: "Prisa, datos pedidos o cargos escondidos",
    express: "Mirar precio final, saldo y si era necesario",
    compare: "La opción que usaré más y no rompe mi meta",
    plan: "Registrar gastos, poner límite y revisar en siete días",
    explain: "Es comparar costo, riesgo, beneficio y momento",
    memory: "Si me apura, lo reviso dos veces",
    simulate: "Puedo pagar de más, endeudarme o perder seguridad",
    compound: "El dinero puede crecer más cuando se reinvierte y se deja tiempo"
  };
  if (level === 2) return teenAnswers[key];
  const adultAnswers = {
    choose: "Comparar costo total, plazo, riesgo y efecto en la reserva",
    true: "Debe conectar flujo, seguridad, objetivo y horizonte",
    order: "Diagnóstico, objetivo, opciones, decisión y seguimiento",
    match: "Patrimonio = activos, protección y decisiones de largo plazo",
    classify: "Priorizar liquidez, seguridad y crecimiento sostenible",
    calc: `$${left}`,
    fill: "convertir decisiones repetidas en estabilidad y patrimonio",
    risk: "Aceptar una condición sin medir costo total o plazo",
    express: "Revisar monto, fecha, responsable y plan B",
    compare: "La opción con mejor costo total y menor riesgo innecesario",
    plan: "Definir monto, fecha, límite, responsable y revisión",
    explain: "Incluye números, riesgo, objetivo y siguiente paso",
    memory: "No comprometas liquidez sin entender el riesgo",
    simulate: "La reserva baja, la deuda sube o el objetivo se atrasa",
    compound: "Rendimientos que generan nuevos rendimientos cuando hay tiempo y constancia"
  };
  if (level === 3) return adultAnswers[key];
  return {
    choose: "Validar cliente, costo, margen, caja y riesgo",
    true: "Debe mejorar caja, control, aprendizaje o crecimiento",
    order: "Validar, medir, vender, cobrar, reinvertir y revisar",
    match: "Margen = precio menos costo antes de otros gastos",
    classify: "Priorizar caja sana, cliente real y control",
    calc: `$${left}`,
    fill: "tomar decisiones medibles que sostienen el negocio",
    risk: "Crecer sin caja, contrato, margen o seguridad",
    express: "Mirar caja, margen, fecha de cobro y siguiente decisión",
    compare: "La opción con mejor margen y menor riesgo operativo",
    plan: "Meta, presupuesto, indicador, responsable, fecha y revisión",
    explain: "Presenta situación, números, riesgo y decisión recomendada",
    memory: "Sin caja y margen, crecer puede romper el negocio",
    simulate: "Puede faltar caja aunque haya ventas",
    compound: "Reinvertir ganancias con disciplina para crear patrimonio empresarial"
  }[key];
}

function wrongOptions(level, key, topic, nums) {
  const base = {
    1: ["Comprar rápido porque se ve bonito", "Usar todo el dinero hoy", "No preguntar y esconder el recibo", "Prestar sin saber cuándo vuelve"],
    2: ["Aceptar porque todos lo hacen", "Tocar comprar antes de ver el total", "Usar la clave en cualquier enlace", "Pagar mínimo sin entender la deuda"],
    3: ["Elegir solo por la cuota más baja", "Usar la reserva para un deseo", "Firmar sin revisar plazo y costo", "Invertir todo en una sola opción"],
    4: ["Vender sin calcular costo", "Crecer aunque no haya caja", "Mezclar dinero personal y negocio", "Aceptar cualquier cliente sin condiciones"]
  };
  if (key === "calc") return [`$${nums[0]}`, `$${nums[1]}`, `$${nums[0] + nums[1]}`, "$0"];
  return base[level];
}

function promptFor(level, key) {
  const labels = {
    choose: "Elige una respuesta.",
    true: "Toca la frase que sí ayuda.",
    order: "Busca la secuencia más ordenada.",
    match: "Elige la pareja correcta.",
    classify: "Pon la acción en el grupo correcto.",
    calc: "Haz la resta sencilla.",
    fill: "Completa la idea.",
    risk: "Encuentra la señal de cuidado.",
    express: "Haz el reto mental rápido.",
    compare: "Compara antes de elegir.",
    plan: "Elige el plan que se puede cumplir.",
    explain: "Escoge la explicación más clara.",
    memory: "Recuerda la regla útil.",
    simulate: "Mira la consecuencia.",
    compound: "Piensa en tiempo, paciencia y crecimiento."
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
  document.getElementById("close-mission").onclick = () => document.getElementById("mission").close();
  document.getElementById("close-certificate").onclick = () => document.getElementById("certificate").close();
  document.getElementById("save-progress").onclick = () => manualSaveProgress();
  document.getElementById("family-mode").onclick = () => toggleFamilyMode();
  if (state.playerName) showGame();
  particles();
}

function setupOnboarding() {
  document.querySelectorAll("[data-onboard-level]").forEach(button => {
    button.onclick = () => {
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
  renderFamilyGame();
  render();
}

function render() {
  if (!state.playerName) return;
  document.getElementById("welcome").textContent = `Hola, ${state.playerName}`;
  document.getElementById("tokens").textContent = state.tokens;
  document.getElementById("done").textContent = `${Object.keys(state.completed).length}/50`;
  const values = Object.values(state.scores);
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
  box.innerHTML = "";
  worlds.forEach((world, index) => {
    const done = modules.filter(module => module.worldIndex === index && state.completed[module.id]).length;
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
    button.className = `node ${state.completed[module.id] ? "done" : ""}`;
    button.style.left = `${left}%`;
    button.style.top = `${top}%`;
    button.style.borderColor = module.id <= state.unlocked ? world.color : "";
    button.disabled = module.id > state.unlocked;
    button.innerHTML = `<b>${module.code}</b><small>${module.country}</small><em>${g.name}</em>`;
    button.onclick = () => openMission(module);
    map.appendChild(button);
  });
}

function toggleFamilyMode() {
  state.family = { ...familyDefault(), ...(state.family || {}) };
  state.family.open = !state.family.open;
  saveState();
  renderFamilyGame();
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
  box.innerHTML = `
    <div class="family-head">
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
        <div class="family-log">${family.log.slice(-5).reverse().map(item => `<p>${item}</p>`).join("")}</div>
      </aside>
    </div>`;
  document.getElementById("add-family-player").onclick = addFamilyPlayer;
  document.getElementById("reset-family-game").onclick = resetFamilyGame;
  document.getElementById("roll-family-dice").onclick = rollFamilyDice;
  document.getElementById("family-event").onclick = () => applyFamilyEvent(true);
}

function familyTileHtml(tile, index, players) {
  const markers = players.filter(player => player.position === index).map(player => `<i style="--p:${player.color}" title="${player.name}">${player.name.slice(0, 1).toUpperCase()}</i>`).join("");
  return `<button class="family-tile tile-${tile.type}" type="button"><b>${index + 1}</b><strong>${tile.name}</strong><small>${tile.lesson}</small><span>${markers}</span></button>`;
}

function familyPlayerHtml(player, active) {
  const childMode = isChildFamilyMode();
  const sharesValue = stockValue(player);
  const worth = netWorth(player);
  const portfolio = Object.entries(player.stocks || {}).filter(([, qty]) => qty > 0).map(([symbol, qty]) => `${symbol} x${qty}`).join(" · ") || "sin acciones";
  return `<article class="family-player ${active ? "active" : ""}" style="--player:${player.color}">
    <h3>${player.name}</h3>
    <div><span>Dinero</span><b>$${player.cash}</b></div>
    <div><span>Reserva</span><b>$${player.reserve}</b></div>
    <div><span>${childMode ? "Préstamos" : "Deuda"}</span><b>$${player.debt}</b></div>
    <div><span>Activos</span><b>${player.assets.length}</b></div>
    ${childMode ? "" : `<div><span>Acciones</span><b>$${sharesValue}</b></div><div><span>Reputación</span><b>${player.reputation}</b></div>`}
    <div><span>Bienestar</span><b>${player.joy}</b></div>
    ${childMode ? "" : `<small>${portfolio}</small>`}
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
        <span class="pill">${levels[selectedLevel].name}</span>
        <span class="pill">${activity.answerFormat}</span>
      </div>
      <div class="mission-grid">
        <aside class="card">
          <div class="guide-duo live-guides">${mini(mainGuide, "lead")}${mini(support, "support")}</div>
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
            <div class="decision-lab"><span>Economía viva</span><strong>${dimensionLabels[activity.focus]}</strong><small>${activity.lifeEffect}</small></div>
            <p>${activity.tip}</p>
          </div>
          <div class="surprise"><p>Imprevisto del día</p><h3>${surprise}</h3><p>${support.name} cambia el escenario. Ajusta tu decisión.</p></div>
          <div class="card activity activity-${activity.type}">
            ${activityVisual(activity)}
            <h3>${activity.question}</h3>
            <div class="options">${activity.options.map((option, index) => `<button data-option="${index}" class="${activeAnswers[activeQuestion] === index ? "selected" : ""}">${option.text}</button>`).join("")}</div>
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

function mini(character, role = "") {
  return `<div class="guide ${role}"><div class="avatar">${avatar(character)}</div><h3>${character.name}</h3><p>${character.species}</p></div>`;
}

function grade() {
  const total = activeMission.activities.length;
  const correct = activeMission.activities.reduce((sum, activity, index) => sum + (activity.options[activeAnswers[index]]?.isCorrect ? 1 : 0), 0);
  const score = Math.round(correct / total * 100);
  const passed = score >= 80;
  const mainGuide = guide(activeMission);
  const impact = summarizeImpacts(activeMission, activeAnswers);
  const insight = applyLearningImpact(impact, score, passed);
  if (passed) {
    if (!state.completed[activeMission.id]) state.tokens += 100 + (score === 100 ? 50 : 25);
    state.completed[activeMission.id] = true;
    state.unlocked = Math.max(state.unlocked, activeMission.id + 1);
  }
  state.scores[activeMission.id] = score;
  recordAttempt(correct, score, passed, impact, insight);
  saveState();
  syncAttemptIfConfigured();
  showReaction(passed, selectedLevel);
  document.getElementById("mission-content").innerHTML = `
    <div class="mission-body">
      <div class="result">
        <p>Resultado</p>
        <h2 class="${passed ? "ok" : "bad"}">${score}%</h2>
        <p>${passed ? `${mainGuide.name} celebra tu decisión.` : `${mainGuide.name} se enfada un poquito con el impulso y te invita a repetir.`}</p>
        <div class="impact-panel"><h3>Huella financiera</h3><div class="impact-grid">${impactBadges(impact)}</div><p>${insight}</p></div>
        <div class="pill-row"><span class="pill">${correct}/${total} correctas</span><span class="pill">${state.tokens} tokens</span><span class="pill">${Object.keys(state.completed).length}/50 zonas</span></div>
        <button id="finish">Volver al mapa</button>
      </div>
    </div>`;
  document.getElementById("finish").onclick = () => {
    document.getElementById("mission").close();
    render();
    if (passed && modules.filter(module => module.worldIndex === activeMission.worldIndex).every(module => state.completed[module.id])) openCertificate(activeMission.worldIndex);
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
  return dimensionKeys.map(key => `<span><b>${dimensionLabels[key]}</b><em>${(values[key] || 0) > 0 ? "+" : ""}${values[key] || 0}</em></span>`).join("");
}

function profileInline() {
  const profile = state.profile || profileDefault();
  const dominant = dominantDimension(profile);
  return `<span class="pulse-line">Pulso financiero: ${dimensionLabels[dominant]} · racha ${profile.streak || 0}</span>`;
}

function applyLearningImpact(impact, score, passed) {
  state.profile = { ...profileDefault(), ...(state.profile || {}) };
  dimensionKeys.forEach(key => state.profile[key] = Math.max(0, (state.profile[key] || 0) + (impact[key] || 0)));
  state.profile.streak = passed ? (state.profile.streak || 0) + 1 : 0;
  const dominant = dominantDimension(impact);
  state.profile.lastInsight = score >= 80 ? `Tu fortaleza hoy fue ${dimensionLabels[dominant]}. Estás aprendiendo a mirar consecuencias, no solo respuestas.` : `Repite con calma. Fíjate especialmente en ${dimensionLabels[dominant]} y vuelve a decidir paso a paso.`;
  return state.profile.lastInsight;
}

function recordAttempt(correct, score, passed, impact, insight) {
  const world = worlds[activeMission.worldIndex];
  const mainGuide = guide(activeMission);
  const attempt = {
    attemptId: `${state.studentId || "student"}-${Date.now()}`,
    studentId: state.studentId,
    studentName: state.playerName,
    level: selectedLevel,
    levelName: levels[selectedLevel].name,
    worldId: world.id,
    worldName: `${world.region}: ${world.name}`,
    moduleId: activeMission.id,
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
    profileAfter: { ...state.profile },
    tokensAfterAttempt: state.tokens,
    completedModules: Object.keys(state.completed).length,
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
}

function dataset() {
  return {
    student: { id: state.studentId, name: state.playerName, selectedLevel, selectedLevelName: levels[selectedLevel].name, createdAt: state.createdAt, updatedAt: state.updatedAt },
    progress: { tokens: state.tokens, unlocked: state.unlocked, completedModules: Object.keys(state.completed).length, completed: state.completed, scores: state.scores, profile: state.profile },
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

function syncAttemptIfConfigured() {
  syncProgress();
}

function openCertificate(index) {
  const world = worlds[index];
  const done = modules.filter(module => module.worldIndex === index && state.completed[module.id]).length;
  const date = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  document.getElementById("certificate-content").innerHTML = `<div class="mission-body"><section class="certificate"><p>Certificado de aprobación</p><h2>El Juego del Dinero</h2><p>Otorga el presente certificado a</p><div class="cert-name">${state.playerName}</div><p>por aprobar</p><h3>${world.region}: ${world.name}</h3><p>${world.description}</p><div class="pill-row"><span class="pill">${done}/10 zonas aprobadas</span><span class="pill">Nota mínima: 80%</span><span class="pill">${date}</span></div></section><div class="actions"><button class="secondary" id="close-cert-action">Volver</button><button id="print-cert">Imprimir o guardar PDF</button></div></div>`;
  document.getElementById("close-cert-action").onclick = () => document.getElementById("certificate").close();
  document.getElementById("print-cert").onclick = () => print();
  openDialog(document.getElementById("certificate"));
}

function showReaction(passed, level) {
  const layer = document.createElement("div");
  layer.className = `reaction-layer ${passed ? "win" : "miss"}`;
  const pieces = passed ? Array.from({ length: level === 1 ? 38 : 22 }, (_, i) => `<span style="--x:${Math.random() * 100}%;--d:${Math.random() * 1.2 + .6}s;--r:${Math.random() * 360}deg"></span>`).join("") : `<div class="angry-face"><b>!</b><small>Respira y repite</small></div>`;
  layer.innerHTML = pieces;
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), passed ? 1600 : 1400);
}

function openDialog(dialog) {
  dialog.showModal ? dialog.showModal() : dialog.setAttribute("open", "open");
}

function avatar(c) {
  if (c.kind === "ferret") return ferret(c);
  if (c.kind === "setter" || c.kind === "mastiff") return dog(c);
  if (c.kind === "cat") return cat(c);
  return human(c);
}

function ferret(c) {
  const coats = { sable: ["#8B5A2B", "#F3D7B6"], dark: ["#3B2417", "#C6A27A"], gold: ["#B8860B", "#FFE5A3"], silver: ["#BFC7D5", "#F3F4F6"], cream: ["#E8D5AD", "#FFF4CC"], white: ["#F8FAFC", "#DCEBFF"] };
  const [base, face] = coats[c.coat] || coats.sable;
  return `<svg viewBox="0 0 140 140"><ellipse cx="72" cy="76" rx="44" ry="34" fill="${base}" stroke="${c.color}" stroke-width="4"/><ellipse cx="70" cy="72" rx="25" ry="20" fill="${face}"/><path d="M34 52c-12-6-18-1-20 9M106 52c12-6 18-1 20 9" stroke="${base}" stroke-width="10" stroke-linecap="round"/><circle cx="58" cy="68" r="4" fill="#020617"/><circle cx="82" cy="68" r="4" fill="#020617"/><path d="M67 79h8M71 79v8" stroke="#020617" stroke-width="3"/></svg>`;
}

function dog(c) {
  const setter = c.kind === "setter";
  const base = setter ? "#F8FAFC" : "#8A5A3C";
  const spot = setter ? "#D4AF37" : "#4A2D1F";
  const ear = setter ? "#B8860B" : "#2A160D";
  return `<svg viewBox="0 0 140 140"><ellipse cx="70" cy="72" rx="${setter ? 36 : 42}" ry="${setter ? 38 : 34}" fill="${base}" stroke="${c.color}" stroke-width="4"/><path d="M38 48c-18 8-20 34-10 48M102 48c18 8 20 34 10 48" stroke="${ear}" stroke-width="${setter ? 13 : 18}" stroke-linecap="round" fill="none"/><path d="M54 42c9 8 20 8 32 0" stroke="${spot}" stroke-width="10" stroke-linecap="round"/><circle cx="56" cy="68" r="5" fill="#020617"/><circle cx="84" cy="68" r="5" fill="#020617"/></svg>`;
}

function cat(c) {
  const white = c.coat === "white";
  const base = white ? "#F8FAFC" : "#F3D7B6";
  return `<svg viewBox="0 0 140 140"><path d="M40 48 28 20l30 16M100 48l12-28-30 16" fill="${base}" stroke="${c.color}" stroke-width="4"/><circle cx="70" cy="70" r="40" fill="${base}" stroke="${c.color}" stroke-width="4"/>${white ? "" : `<path d="M44 47c10-12 25-13 34-4 10 9 25 5 32-4v42c-16-8-26-2-34 6-10 9-24 4-32-4z" fill="#4B2A16"/><circle cx="90" cy="56" r="13" fill="#111827"/>`}<circle cx="56" cy="68" r="5" fill="#020617"/><circle cx="84" cy="68" r="5" fill="#020617"/></svg>`;
}

function human(c) {
  return `<svg viewBox="0 0 140 140"><circle cx="70" cy="42" r="22" fill="#FFD1DC" stroke="${c.color}" stroke-width="4"/><path d="M32 118c6-29 21-48 38-48s32 19 38 48" fill="${c.color}" opacity=".28" stroke="${c.color}" stroke-width="4"/><path d="M49 44h42M54 56c10 8 22 8 32 0" stroke="#020617" stroke-width="4" fill="none"/><path d="M34 98h72" stroke="#D4AF37" stroke-width="5"/></svg>`;
}

function particles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let ps = [];
  const iconSets = {
    1: ["coin", "jar", "price", "list", "seed", "key"],
    2: ["phone", "lock", "coin", "chart", "ticket", "clock"],
    3: ["card", "shield", "home", "chart", "doc", "safe"],
    4: ["chart", "cash", "gear", "card", "box", "contract"]
  };
  function make() {
    const level = selectedLevel || onboardingLevel || 1;
    const icons = iconSets[level] || iconSets[1];
    const count = innerWidth < 640 ? 48 : 80;
    ps = Array.from({ length: count }, (_, index) => ({ x: Math.random(), y: Math.random(), s: 10 + Math.random() * 18, v: .00022 + Math.random() * .0005, d: (Math.random() - .5) * .00034, t: icons[index % icons.length], spin: Math.random() * 6 }));
  }
  refreshParticles = make;
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
  }
  function drawIcon(p) {
    const x = p.x * canvas.width;
    const y = p.y * canvas.height;
    const s = p.s * Math.min(devicePixelRatio || 1, 2);
    ctx.save();
    ctx.globalAlpha = .62;
    ctx.strokeStyle = worlds[selectedWorld]?.color || "#22D3EE";
    ctx.fillStyle = "rgba(224,255,255,.10)";
    ctx.lineWidth = 2;
    ctx.translate(x, y);
    ctx.rotate(Math.sin(Date.now() / 1800 + p.spin) * .18);
    if (p.t === "coin") {
      ctx.beginPath(); ctx.arc(0, 0, s * .48, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#FFBF00"; ctx.fillText("$", -s * .18, s * .2);
    } else if (p.t === "chart") {
      ctx.beginPath(); ctx.moveTo(-s, s * .5); ctx.lineTo(-s * .3, 0); ctx.lineTo(s * .1, s * .18); ctx.lineTo(s, -s * .55); ctx.stroke();
    } else if (p.t === "lock" || p.t === "key" || p.t === "shield" || p.t === "safe") {
      ctx.strokeRect(-s * .5, -s * .15, s, s * .7); ctx.beginPath(); ctx.arc(0, -s * .15, s * .35, Math.PI, 0); ctx.stroke();
    } else if (p.t === "jar" || p.t === "box") {
      ctx.strokeRect(-s * .45, -s * .35, s * .9, s * .9); ctx.beginPath(); ctx.moveTo(-s * .25, -s * .5); ctx.lineTo(s * .25, -s * .5); ctx.stroke();
    } else if (p.t === "phone" || p.t === "card") {
      ctx.strokeRect(-s * .38, -s * .6, s * .76, s * 1.2); ctx.fillRect(-s * .18, s * .42, s * .36, 2);
    } else if (p.t === "home") {
      ctx.beginPath(); ctx.moveTo(-s * .6, 0); ctx.lineTo(0, -s * .55); ctx.lineTo(s * .6, 0); ctx.lineTo(s * .42, s * .58); ctx.lineTo(-s * .42, s * .58); ctx.closePath(); ctx.stroke();
    } else {
      ctx.strokeRect(-s * .55, -s * .35, s * 1.1, s * .7);
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
