import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private static translateService: TranslateService;

  constructor(translateService: TranslateService) {
    TranslationService.translateService = translateService;
    translateService.setDefaultLang('fr');
  }

  static getTranslation(key: string): string {
    return TranslationService.translateService.instant(key);
  }

  static useLanguage(lang: string): void {
    TranslationService.translateService.use(lang);
  }
}
