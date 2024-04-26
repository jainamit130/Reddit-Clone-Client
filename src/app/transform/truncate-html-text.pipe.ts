import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHtmlText'
})
export class TruncateHtmlTextPipe implements PipeTransform {
  transform(html: string, maxLength: number): string {
    if (!html) {
      return '';
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    let plainText = doc.body.textContent || '';

    plainText = plainText.trim().substring(0, maxLength);

    const lastSpaceIndex = plainText.lastIndexOf(' ');
    if (lastSpaceIndex !== -1) {
      plainText = plainText.substring(0, lastSpaceIndex);
    }

    return plainText + '...';
  }
}
