import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { allowedLanguages, langMap } from '../../shared/translate/const/const';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  async getLanguage(language: string): Promise<string> {
    if (language) {
      return language;
    }

    let deviceLanguage = (await Device.getLanguageCode()).value;

    if (!allowedLanguages.includes(deviceLanguage)) {
      return 'en';
    }

    if (Object.keys(langMap).includes(deviceLanguage)) {
      deviceLanguage = langMap[deviceLanguage];
    }

    return deviceLanguage;
  }
}
