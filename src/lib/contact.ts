export const branches = [
  {
    name: "Sucursal Los Gallegos",
    address: "Shopping Los Gallegos, Rivadavia 3050, nivel subsuelo",
    gmaps: "https://share.google/1UEHTWNFcyj3E1ick",
    phone: "+54 9 223 550-5397",
    whatsapp: "5492235505397",
    hours: "Consultá horarios por WhatsApp",
  },
  {
    name: "Sucursal Carrefour",
    address: "Constitución 7598, Mar del Plata",
    gmaps: "https://share.google/3qhBnn6Uvyu3VYecS",
    phone: "+54 9 223 551-7857",
    whatsapp: "5492235517857",
    hours: "Consultá horarios por WhatsApp",
  },
];

export const mainWhatsAppNumber = branches[1].whatsapp;

export function getWhatsAppUrl(message: string, phoneNumber = mainWhatsAppNumber) {
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
