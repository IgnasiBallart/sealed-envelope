import { LEGAL } from "@/lib/legal";
import type { Locale } from "@/lib/locale";

export type LegalDoc = "notice" | "privacy" | "terms";

export type LegalSection = { heading?: string; paragraphs: string[] };

function operatorBlock(locale: Locale): string[] {
  const contact =
    locale === "en"
      ? `Contact: ${LEGAL.email}`
      : locale === "es"
        ? `Contacto: ${LEGAL.email}`
        : `Contacte: ${LEGAL.email}`;
  if (!LEGAL.publishIdentity) return [contact];
  return [
    locale === "en" ? `Operator: ${LEGAL.operatorName}.` : `Titular: ${LEGAL.operatorName}.`,
    LEGAL.nif
      ? `NIF: ${LEGAL.nif}.`
      : locale === "en"
        ? "Tax ID (NIF) will appear here before live payments."
        : locale === "es"
          ? "El NIF constará aquí antes de cobrar en modo live."
          : "El NIF constarà aquí abans de cobrar en mode live.",
    LEGAL.addressLines.length > 0
      ? locale === "en"
        ? `Address: ${LEGAL.addressLines.join(", ")}, ${LEGAL.country}.`
        : locale === "es"
          ? `Domicilio: ${LEGAL.addressLines.join(", ")}, ${LEGAL.country}.`
          : `Domicili: ${LEGAL.addressLines.join(", ")}, ${LEGAL.country}.`
      : locale === "en"
        ? `Country: ${LEGAL.country}.`
        : locale === "es"
          ? `País: ${LEGAL.country}.`
          : `País: ${LEGAL.country}.`,
    contact,
  ];
}

const copy: Record<Locale, Record<LegalDoc, { title: string; sections: LegalSection[] }>> = {
  en: {
    notice: {
      title: "Legal notice",
      sections: [
        {
          paragraphs: [
            `${LEGAL.brand} (${LEGAL.siteUrl}) is an online shop that sells printable escape-room PDFs. This notice is published under the Spanish Information Society Services Act (LSSI).`,
            ...operatorBlock("en"),
          ],
        },
        {
          heading: "Purpose",
          paragraphs: [
            "The site lets you browse rooms, pay with Stripe Checkout and download the PDFs you bought. There are no user accounts. The email address you enter at checkout identifies the order.",
          ],
        },
        {
          heading: "Intellectual property",
          paragraphs: [
            `The website, brand and product files belong to ${LEGAL.operatorName}. Buying a room gives you a personal licence to download, print and play it. You may not resell, republish or share the PDFs.`,
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy",
      sections: [
        {
          paragraphs: [
            `${LEGAL.operatorName} is the controller of personal data processed when you buy on ${LEGAL.brand}. Contact: ${LEGAL.email}.`,
          ],
        },
        {
          heading: "What we process",
          paragraphs: [
            "Email address, the room you bought, the PDF language, the Stripe Checkout session id, payment status and a hash of the download token. Stripe processes the card; we never see full card numbers.",
            "Purpose: to take payment, send the download link, resend it if you ask, and keep proof of purchase. Legal basis: performance of the contract and legal duties around invoicing.",
            "We do not run analytics, advertising pixels or accounts. The site language is in the URL, not in a cookie. The color theme is stored in the browser (localStorage), not in a cookie. We do not set non-essential cookies. Stripe may set its own cookies on stripe.com during checkout.",
          ],
        },
        {
          heading: "How long and with whom",
          paragraphs: [
            "Orders stay in our database so the download link keeps working. We share data with Stripe (payments) and Amazon Web Services in the EU (hosting, email). We do not sell it.",
            "You can ask for access, rectification, erasure or objection at the contact email, and complain to the Spanish AEPD (aepd.es).",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of sale",
      sections: [
        {
          paragraphs: [
            `These terms apply to purchases of digital escape-room PDFs on ${LEGAL.siteUrl}. By paying you agree to them.`,
          ],
        },
        {
          heading: "The product",
          paragraphs: [
            "You buy a non-exclusive, non-transferable licence to download two PDFs (player dossier and solution) in the language chosen at checkout, print them and play them privately. We do not ship physical goods.",
            "Prices are in euros and include VAT where it applies. The amount shown at checkout is the amount you pay.",
          ],
        },
        {
          heading: "Payment and delivery",
          paragraphs: [
            "Payment is taken by Stripe. After the payment is confirmed we email a lasting download link to the address used at checkout. Opening that page and downloading the files is delivery of the digital content.",
          ],
        },
        {
          heading: "Withdrawal",
          paragraphs: [
            "EU/UK consumer law usually gives 14 days to withdraw. That right does not apply to digital content once performance has begun, if you consented and acknowledged you would lose the right. Starting the download is that consent. If a file is defective, email us and we will replace it or refund.",
          ],
        },
        {
          heading: "Support",
          paragraphs: [`Questions and claims: ${LEGAL.email}.`],
        },
      ],
    },
  },
  es: {
    notice: {
      title: "Aviso legal",
      sections: [
        {
          paragraphs: [
            `${LEGAL.brand} (${LEGAL.siteUrl}) es una tienda en línea de escape rooms en PDF para imprimir. Este aviso se publica conforme a la LSSI.`,
            ...operatorBlock("es"),
          ],
        },
        {
          heading: "Objeto",
          paragraphs: [
            "El sitio permite ver las salas, pagar con Stripe Checkout y descargar los PDF comprados. No hay cuentas de usuario. El correo que indiques al pagar identifica el pedido.",
          ],
        },
        {
          heading: "Propiedad intelectual",
          paragraphs: [
            `La web, la marca y los archivos de producto pertenecen a ${LEGAL.operatorName}. La compra te da una licencia personal para descargar, imprimir y jugar. No puedes revender, republicar ni compartir los PDF.`,
          ],
        },
      ],
    },
    privacy: {
      title: "Privacidad",
      sections: [
        {
          paragraphs: [
            `${LEGAL.operatorName} es el responsable del tratamiento de los datos personales cuando compras en ${LEGAL.brand}. Contacto: ${LEGAL.email}.`,
          ],
        },
        {
          heading: "Qué tratamos",
          paragraphs: [
            "Correo, la sala comprada, el idioma del PDF, el id de sesión de Stripe Checkout, el estado del pago y un hash del token de descarga. Stripe procesa la tarjeta; nosotros no vemos el número completo.",
            "Finalidad: cobrar, enviar el enlace de descarga, reenviarlo si lo pides y conservar el justificante de compra. Base jurídica: ejecución del contrato y obligaciones legales de facturación.",
            "No hay analítica, píxeles publicitarios ni cuentas. El idioma de la web va en la URL, no en una cookie. El tema de color se guarda en el navegador (localStorage), no en una cookie. No usamos cookies no necesarias. Stripe puede poner las suyas en stripe.com durante el pago.",
          ],
        },
        {
          heading: "Conservación y cesiones",
          paragraphs: [
            "Los pedidos se quedan en nuestra base de datos para que el enlace de descarga siga funcionando. Compartimos datos con Stripe (pagos) y Amazon Web Services en la UE (alojamiento, correo). No los vendemos.",
            "Puedes pedir acceso, rectificación, supresión u oposición al correo de contacto, y reclamar ante la AEPD (aepd.es).",
          ],
        },
      ],
    },
    terms: {
      title: "Condiciones de compra",
      sections: [
        {
          paragraphs: [
            `Estas condiciones rigen la compra de PDF de escape rooms en ${LEGAL.siteUrl}. Al pagar las aceptas.`,
          ],
        },
        {
          heading: "El producto",
          paragraphs: [
            "Compras una licencia no exclusiva e intransferible para descargar dos PDF (dossier del jugador y solución) en el idioma elegido al pagar, imprimirlos y jugar en privado. No enviamos producto físico.",
            "Los precios están en euros e incluyen IVA cuando corresponde. El importe de Stripe es el que pagas.",
          ],
        },
        {
          heading: "Pago y entrega",
          paragraphs: [
            "El cobro lo hace Stripe. Cuando el pago está confirmado enviamos un enlace de descarga permanente al correo del checkout. Abrir esa página y bajar los archivos es la entrega del contenido digital.",
          ],
        },
        {
          heading: "Desistimiento",
          paragraphs: [
            "La normativa de consumo suele dar 14 días para desistir. Ese derecho no aplica al contenido digital una vez empezada la ejecución, si consentiste y reconociste que lo perderías. Iniciar la descarga es ese consentimiento. Si un archivo está defectuoso, escríbenos y lo repondremos o devolveremos el importe.",
          ],
        },
        {
          heading: "Atención",
          paragraphs: [`Consultas y reclamaciones: ${LEGAL.email}.`],
        },
      ],
    },
  },
  ca: {
    notice: {
      title: "Avís legal",
      sections: [
        {
          paragraphs: [
            `${LEGAL.brand} (${LEGAL.siteUrl}) és una botiga en línia d’escape rooms en PDF per imprimir. Aquest avís es publica d’acord amb la LSSI.`,
            ...operatorBlock("ca"),
          ],
        },
        {
          heading: "Objecte",
          paragraphs: [
            "El lloc permet veure les sales, pagar amb Stripe Checkout i descarregar els PDF comprats. No hi ha comptes d’usuari. El correu que indiquis en pagar identifica la comanda.",
          ],
        },
        {
          heading: "Propietat intel·lectual",
          paragraphs: [
            `La web, la marca i els fitxers de producte pertanyen a ${LEGAL.operatorName}. La compra et dóna una llicència personal per descarregar, imprimir i jugar. No pots revendre, republicar ni compartir els PDF.`,
          ],
        },
      ],
    },
    privacy: {
      title: "Privadesa",
      sections: [
        {
          paragraphs: [
            `${LEGAL.operatorName} és el responsable del tractament de les dades personals quan compres a ${LEGAL.brand}. Contacte: ${LEGAL.email}.`,
          ],
        },
        {
          heading: "Què tractem",
          paragraphs: [
            "Correu, la sala comprada, l’idioma del PDF, l’id de sessió de Stripe Checkout, l’estat del pagament i un hash del token de descàrrega. Stripe processa la targeta; nosaltres no veiem el número complet.",
            "Finalitat: cobrar, enviar l’enllaç de descàrrega, reenviar-lo si ho demanes i conservar el justificant de compra. Base jurídica: execució del contracte i deures legals de facturació.",
            "No hi ha analítica, píxels publicitaris ni comptes. L’idioma de la web va a l’URL, no en una galeta. El tema de color es desa al navegador (localStorage), no en una galeta. No fem servir galetes no necessàries. Stripe pot posar les seves a stripe.com durant el pagament.",
          ],
        },
        {
          heading: "Conservació i cessions",
          paragraphs: [
            "Les comandes queden a la nostra base de dades perquè l’enllaç de descàrrega segueixi funcionant. Compartim dades amb Stripe (pagaments) i Amazon Web Services a la UE (allotjament, correu). No les venem.",
            "Pots demanar accés, rectificació, supressió o oposició al correu de contacte, i reclamar davant l’AEPD (aepd.es).",
          ],
        },
      ],
    },
    terms: {
      title: "Condicions de compra",
      sections: [
        {
          paragraphs: [
            `Aquestes condicions regeixen la compra de PDF d’escape rooms a ${LEGAL.siteUrl}. En pagar les acceptes.`,
          ],
        },
        {
          heading: "El producte",
          paragraphs: [
            "Compres una llicència no exclusiva i intransferible per descarregar dos PDF (dossier del jugador i solució) en l’idioma triat al pagament, imprimir-los i jugar en privat. No enviem producte físic.",
            "Els preus són en euros i inclouen IVA quan correspon. L’import de Stripe és el que pagues.",
          ],
        },
        {
          heading: "Pagament i lliurament",
          paragraphs: [
            "El cobrament el fa Stripe. Quan el pagament està confirmat enviem un enllaç de descàrrega permanent al correu del checkout. Obrir aquesta pàgina i baixar els fitxers és el lliurament del contingut digital.",
          ],
        },
        {
          heading: "Desistiment",
          paragraphs: [
            "La normativa de consum sol donar 14 dies per desistir. Aquest dret no s’aplica al contingut digital un cop començada l’execució, si has consentit i reconegut que el perds. Iniciar la descàrrega és aquest consentiment. Si un fitxer és defectuós, escriu-nos i el repondrem o tornarem l’import.",
          ],
        },
        {
          heading: "Atenció",
          paragraphs: [`Consultes i reclamacions: ${LEGAL.email}.`],
        },
      ],
    },
  },
};

export function legalDoc(locale: Locale, doc: LegalDoc) {
  return copy[locale][doc];
}
