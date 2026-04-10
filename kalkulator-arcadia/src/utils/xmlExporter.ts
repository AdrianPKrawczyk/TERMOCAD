import type { Category } from '../store/useAppStore';
import JSZip from 'jszip';

/**
 * Generuje plik XML kompatybilny z ArCADia-TERMO na podstawie stanu kategorii.
 */
export const generateXML = (categories: Category[]): string => {
  let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
  xml += '<root>\n';
  xml += '  <o n="Data" t="JobBrandLibraryType">\n';
  xml += '    <o n="JobBrandList" t="$ObjectArray">\n';

  let globalIndex = 0;

  // 1. Element Dummy (wymagany przez ArCADia na indeksie 0)
  xml += `      <o n="${globalIndex++}" t="JobBrand">\n`;
  xml += '        <s n="Path"></s>\n';
  xml += '        <s n="Unit"></s>\n';
  xml += '        <s n="Name">$Dummy</s>\n';
  xml += '        <s n="Costs"></s>\n';
  xml += '        <f n="UnitCost">-1</f>\n';
  xml += '      </o>\n';

  // 2. Mapowanie wariantów
  categories.forEach((category) => {
    category.technologies.forEach((tech) => {
      tech.variants.forEach((variant) => {
        const path = `${category.name}/${tech.name}`;
        const unit = variant.unit || 'zł/m2';
        const cost = variant.totalCost.toFixed(2); // Zawsze kropka jako separator

        xml += `      <o n="${globalIndex++}" t="JobBrand">\n`;
        xml += `        <s n="Path">${escapeXml(path)}</s>\n`;
        xml += `        <s n="Unit">${escapeXml(unit)}</s>\n`;
        xml += `        <s n="Name">${escapeXml(variant.name)}</s>\n`;
        xml += '        <s n="Costs"> </s>\n'; // Zgodnie z PRD: spacja w Costs
        xml += `        <f n="UnitCost">${cost}</f>\n`;
        xml += '      </o>\n';
      });
    });
  });

  xml += '    </o>\n';
  xml += '  </o>\n';
  xml += '</root>';

  return xml;
};

/**
 * Proste zabezpieczenie znaków specjalnych dla XML
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&"']/g, (m) => {
    switch (m) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return m;
    }
  });
}

/**
 * Wyzwala pobieranie pliku w przeglądarce
 */
export const downloadXML = (xmlString: string, filename: string = 'cennik_arcadia.xml') => {
  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Wyzwala pobieranie pliku .xlibrary (spakowany data.xml jako zip)
 */
export const downloadXLibrary = async (xmlString: string, filename: string = 'cennik_arcadia.xlibrary') => {
  const zip = new JSZip();
  zip.file('data.xml', xmlString);
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
