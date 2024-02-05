import { booleanAttribute, Injectable, numberAttribute } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { forkJoin, from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { initialSettingsState } from '../../store/state/settings.state';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  initSettings$() {
    return from(Preferences.keys()).pipe(
      switchMap(({ keys }) => forkJoin([...keys.map(key => this.getPreference(key))])),
      map(settings => this.mergeSettings(settings)),
    );
  }

  private mergeSettings(settings: { key: string; value: string }[]) {
    let localSettings = { ...initialSettingsState };

    settings.forEach(({ key, value }) => {
      const normalizedValue = this.coerceSettingsProperty(key, value);
      localSettings = normalizedValue ? { ...localSettings, [key]: normalizedValue } : localSettings;
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
