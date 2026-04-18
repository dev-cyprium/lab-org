import { Pipe, PipeTransform } from '@angular/core';

// 'pozitivna' -> 'Gram +', 'negativna' -> 'Gram −'.
@Pipe({ name: 'gram' })
export class GramPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    switch (value) {
      case 'pozitivna':
        return 'Gram +';
      case 'negativna':
        return 'Gram −';
      default:
        return 'n/p';
    }
  }
}
