import { booleanAttribute, Injectable, numberAttribute } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { initialSettingsState } from '../../store/signal-store/settings.store';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  initSettings$() {
    return forkJoin([...Object.keys(initialSettingsState).map(key => this.getPreference(key))]).pipe(
      map(settings => this.mergeSettings(settings)),
    );
  }

  private mergeSettings(settings: { key: string; value: string }[]) {
    let localSettings = { ...initialSettingsState };

    settings.forEach(({ key, value }) => {
      if (value !== undefined && value !== null) {
        const normalizedValue = this.coerceSettingsProperty(key, value);
        localSettings = { ...localSettings, [key]: normalizedValue };
      }
    });

    return localSettings;
  }

  private getPreference(key: string) {
    return from(Preferences.get({ key })).pipe(map(({ value }) => ({ key, value })));
  }

  private coerceSettingsProperty(settingKey: string, value: string) {
    if (typeof initialSettingsState?.[settingKey] === 'boolean') {
      return booleanAttribute(value);
    }

    if (typeof initialSettingsState?.[settingKey] === 'number') {
      return numberAttribute(value, 1);
    }

    return value;
  }
}
