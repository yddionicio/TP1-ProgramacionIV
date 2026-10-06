import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Injectable({ providedIn: 'root' })
export class EntradaPdfService {
  async generar(datos: {
    pelicula: string; sala: string; fechaHora: string; butacas: string[]; qrToken: string; total: number;
  }) {
    const qrDataUrl = await QRCode.toDataURL(datos.qrToken, { width: 200 });

    const docDefinition = {
      content: [
        { text: 'CINEAPP', style: 'logo' },
        { text: datos.pelicula, style: 'titulo' },
        { text: `${datos.sala} — ${new Date(datos.fechaHora).toLocaleString('es-AR')}` },
        { text: `Butacas: ${datos.butacas.join(', ')}` },
        { text: `Total: $${datos.total}`, margin: [0, 10, 0, 10] },
        { image: qrDataUrl, width: 160 },
        { text: 'Presentá este código QR en la entrada de la sala.', style: 'nota' },
      ],
      styles: {
        logo: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
        titulo: { fontSize: 16, bold: true },
        nota: { fontSize: 9, italics: true, margin: [0, 10, 0, 0] },
      },
    };

    pdfMake.createPdf(docDefinition as any).download(`entrada-${datos.pelicula}.pdf`);
  }
}