import { BRAND } from "@/lib/brand";
import type { Locale } from "@/lib/locale";

export type Messages = {
  meta: { titleDefault: string; description: string };
  nav: {
    resend: string;
    language: string;
    legal: string;
    privacy: string;
    terms: string;
    tagline: string;
    theme: string;
    themeLight: string;
    themeDark: string;
  };
  home: { h1: string; lead: string; rooms: string; kicker: string; caseFile: (n: string) => string };
  room: {
    players: string;
    duration: string;
    difficulty: string;
    buy: (price: string) => string;
    checkoutHint: string;
    pdfLanguage: string;
    pending: string;
    errorMissingLocale: string;
    errorPay: string;
    errorExist: string;
  };
  resend: {
    title: string;
    lead: string;
    emailLabel: string;
    submit: string;
    sending: string;
    done: string;
    invalid: string;
  };
  success: { title: string; body: string; spam: string; resendLink: string };
  download: {
    checking: string;
    badTitle: string;
    badBody: string;
    wait: string;
    resend: string;
    ready: string;
    ctaDossier: string;
    ctaSolution: string;
    solutionHint: string;
    keep: string;
  };
  mail: {
    purchaseSubject: (name: string) => string;
    purchaseIntro: string;
    resendSubject: string;
    resendIntro: string;
    keep: string;
    signoff: string;
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    meta: {
      titleDefault: `${BRAND} — printable escape rooms`,
      description: "Escape rooms you print and solve at home. Buy, download the PDF, open the first envelope.",
    },
    nav: {
      resend: "Resend my downloads",
      language: "Language",
      legal: "Legal notice",
      privacy: "Privacy",
      terms: "Terms",
      tagline: "Printable dossiers",
      theme: "Color theme",
      themeLight: "Light",
      themeDark: "Dark",
    },
    home: {
      h1: "Escape rooms you open at home.",
      lead: "Buy a room, download the PDF, print it and open the first envelope. No app, no account, no timer ticking on a screen.",
      rooms: "The case files",
      kicker: "Tabletop mystery",
      caseFile: (n) => `Case ${n}`,
    },
    room: {
      players: "Players",
      duration: "Duration",
      difficulty: "Difficulty",
      buy: (price) => `Buy for ${price}`,
      checkoutHint: "You'll get a download link by email right after paying. Choose the PDF language independently of the website language.",
      pdfLanguage: "PDF language",
      pending: "Opening secure checkout…",
      errorMissingLocale: "Choose a language for the PDF.",
      errorPay: "We couldn't start the payment. Please try again in a moment.",
      errorExist: "This room doesn't exist.",
    },
    resend: {
      title: "Resend my downloads",
      lead: "Lost the email? Enter the address you used to pay and we'll send your download links to it again.",
      emailLabel: "Email used at checkout",
      submit: "Resend my downloads",
      sending: "Sending…",
      done: "If that address has any purchases, we've just emailed it the download links. It can take a few minutes — check your spam folder too.",
      invalid: "That doesn't look like an email address.",
    },
    success: {
      title: "Thanks! Check your inbox.",
      body: "As soon as the payment is confirmed we'll email you the download link. It usually takes less than a minute.",
      spam: "Nothing after a few minutes? Check your spam folder or",
      resendLink: "ask us to resend your downloads",
    },
    download: {
      checking: "Checking your link…",
      badTitle: "This link doesn't work",
      badBody: "Check that you copied the whole link from the email. If you just paid, wait a minute and reload.",
      wait: "You can also",
      resend: "ask us to resend your downloads",
      ready: "Your room is ready. Print the dossier single-sided and don't open the envelopes until it tells you to.",
      ctaDossier: "Download dossier",
      ctaSolution: "Download solution",
      solutionHint: "Don't open the solution until you've finished the room.",
      keep: "This page works whenever you need it. Bookmark it or keep the email.",
    },
    mail: {
      purchaseSubject: (name) => `Your escape room: ${name}`,
      purchaseIntro: "Thanks for your purchase! Open this page for the dossier and the solution. Don't open the solution until you've finished.",
      resendSubject: `Your ${BRAND} downloads`,
      resendIntro: "You asked us to resend your downloads. Here they are:",
      keep: "These links don't expire. Keep this email so you can download your rooms again.",
      signoff: `— ${BRAND}`,
    },
  },
  es: {
    meta: {
      titleDefault: `${BRAND} — escape rooms para imprimir`,
      description: "Escape rooms que imprimes y resuelves en casa. Compra, descarga el PDF y abre el primer sobre.",
    },
    nav: {
      resend: "Reenviar descargas",
      language: "Idioma",
      legal: "Aviso legal",
      privacy: "Privacidad",
      terms: "Condiciones",
      tagline: "Dossiers para imprimir",
      theme: "Tema de color",
      themeLight: "Claro",
      themeDark: "Oscuro",
    },
    home: {
      h1: "Escape rooms que abres en casa.",
      lead: "Compra una sala, descarga el PDF, imprímelo y abre el primer sobre. Sin app, sin cuenta, sin temporizador en una pantalla.",
      rooms: "Los expedientes",
      kicker: "Misterio de mesa",
      caseFile: (n) => `Caso ${n}`,
    },
    room: {
      players: "Jugadores",
      duration: "Duración",
      difficulty: "Dificultad",
      buy: (price) => `Comprar por ${price}`,
      checkoutHint: "Recibirás el enlace de descarga por correo justo después de pagar. El idioma del PDF es independiente del de la web.",
      pdfLanguage: "Idioma del PDF",
      pending: "Abriendo el pago seguro…",
      errorMissingLocale: "Elige un idioma para el PDF.",
      errorPay: "No hemos podido iniciar el pago. Inténtalo de nuevo en un momento.",
      errorExist: "Esta sala no existe.",
    },
    resend: {
      title: "Reenviar descargas",
      lead: "¿Has perdido el correo? Escribe la dirección con la que pagaste y te reenviaremos los enlaces.",
      emailLabel: "Correo usado en el pago",
      submit: "Reenviar descargas",
      sending: "Enviando…",
      done: "Si esa dirección tiene compras, acabamos de enviarle los enlaces. Puede tardar unos minutos; mira también el spam.",
      invalid: "Eso no parece una dirección de correo.",
    },
    success: {
      title: "Gracias. Revisa tu bandeja de entrada.",
      body: "En cuanto se confirme el pago te enviaremos el enlace de descarga. Suele tardar menos de un minuto.",
      spam: "¿Nada al cabo de unos minutos? Mira el spam o",
      resendLink: "pídenos que reenviemos las descargas",
    },
    download: {
      checking: "Comprobando el enlace…",
      badTitle: "Este enlace no funciona",
      badBody: "Comprueba que has copiado el enlace entero del correo. Si acabas de pagar, espera un minuto y recarga.",
      wait: "También puedes",
      resend: "pedir que reenviemos las descargas",
      ready: "Tu sala está lista. Imprime el dossier a una cara y no abras los sobres hasta que lo indique.",
      ctaDossier: "Descargar dossier",
      ctaSolution: "Descargar solución",
      solutionHint: "No abras la solución hasta haber terminado la sala.",
      keep: "Esta página funciona siempre que la necesites. Guárdala o conserva el correo.",
    },
    mail: {
      purchaseSubject: (name) => `Tu escape room: ${name}`,
      purchaseIntro: "Gracias por tu compra. En esta página tienes el dossier y la solución. No abras la solución hasta haber terminado.",
      resendSubject: `Tus descargas de ${BRAND}`,
      resendIntro: "Has pedido que reenviemos tus descargas. Aquí están:",
      keep: "Estos enlaces no caducan. Conserva este correo para volver a descargar las salas.",
      signoff: `— ${BRAND}`,
    },
  },
  ca: {
    meta: {
      titleDefault: `${BRAND} — escape rooms per imprimir`,
      description: "Escape rooms que imprimeixes i resols a casa. Compra, descarrega el PDF i obre el primer sobre.",
    },
    nav: {
      resend: "Reenviar descàrregues",
      language: "Idioma",
      legal: "Avís legal",
      privacy: "Privadesa",
      terms: "Condicions",
      tagline: "Dossiers per imprimir",
      theme: "Tema de color",
      themeLight: "Clar",
      themeDark: "Fosc",
    },
    home: {
      h1: "Escape rooms que obres a casa.",
      lead: "Compra una sala, descarrega el PDF, imprimeix-lo i obre el primer sobre. Sense app, sense compte, sense temporitzador a una pantalla.",
      rooms: "Els expedients",
      kicker: "Misteri de taula",
      caseFile: (n) => `Cas ${n}`,
    },
    room: {
      players: "Jugadors",
      duration: "Durada",
      difficulty: "Dificultat",
      buy: (price) => `Comprar per ${price}`,
      checkoutHint: "Rebràs l’enllaç de descàrrega per correu just després de pagar. L’idioma del PDF és independent del de la web.",
      pdfLanguage: "Idioma del PDF",
      pending: "Obrint el pagament segur…",
      errorMissingLocale: "Tria un idioma per al PDF.",
      errorPay: "No hem pogut iniciar el pagament. Torna-ho a provar d’aquí un moment.",
      errorExist: "Aquesta sala no existeix.",
    },
    resend: {
      title: "Reenviar descàrregues",
      lead: "Has perdut el correu? Escriu l’adreça amb què vas pagar i t’enviarem els enllaços una altra vegada.",
      emailLabel: "Correu fet servir al pagament",
      submit: "Reenviar descàrregues",
      sending: "Enviant…",
      done: "Si aquesta adreça té compres, acabem d’enviar-hi els enllaços. Pot tardar uns minuts; mira també el correu brossa.",
      invalid: "Això no sembla una adreça de correu.",
    },
    success: {
      title: "Gràcies. Mira la bústia.",
      body: "Així que es confirmi el pagament t’enviarem l’enllaç de descàrrega. Sol tardar menys d’un minut.",
      spam: "Res al cap d’uns minuts? Mira el correu brossa o",
      resendLink: "demana’ns que reenviem les descàrregues",
    },
    download: {
      checking: "Comprovant l’enllaç…",
      badTitle: "Aquest enllaç no funciona",
      badBody: "Comprova que has copiat tot l’enllaç del correu. Si acabes de pagar, espera un minut i recarrega.",
      wait: "També pots",
      resend: "demanar que reenviem les descàrregues",
      ready: "La sala és a punt. Imprimeix el dossier a una cara i no obris els sobres fins que t’ho digui.",
      ctaDossier: "Descarregar dossier",
      ctaSolution: "Descarregar solució",
      solutionHint: "No obris la solució fins que hàgiu acabat la sala.",
      keep: "Aquesta pàgina funciona sempre que la necessitis. Desa-la o conserva el correu.",
    },
    mail: {
      purchaseSubject: (name) => `La teva escape room: ${name}`,
      purchaseIntro: "Gràcies per la compra. En aquesta pàgina tens el dossier i la solució. No obris la solució fins que hàgiu acabat.",
      resendSubject: `Les teves descàrregues de ${BRAND}`,
      resendIntro: "Has demanat que reenviem les descàrregues. Aquí les tens:",
      keep: "Aquests enllaços no caduquen. Conserva aquest correu per tornar a descarregar les sales.",
      signoff: `— ${BRAND}`,
    },
  },
};

export function t(locale: Locale): Messages {
  return messages[locale];
}
