import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtmlText'
})
export class TruncateHtmlTextPipe implements PipeTransform {
  transform(html: string, maxLength: number): string {
    let plainText = this.transformHtmlToPlainText(html);

    plainText = plainText.trim().substring(0, maxLength);

    const lastSpaceIndex = plainText.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      plainText = plainText.substring(0, lastSpaceIndex);
    }

    return plainText + '...';
  }

  transformHtmlToPlainText(html:string){
    if (!html) {
      return '';
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

     return doc.body.textContent || '';
  }
    
  highlightQueriedText(html: string, query: string): string {
    let text = this.transformHtmlToPlainText(html);
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="font-size: 50px;"><strong>$1</strong></span>');
  }

}
