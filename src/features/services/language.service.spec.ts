import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageService } from './language.service';

vi.mock('@capacitor/device', () => ({
  Device: {
    getLanguageCode: vi.fn(),
  },
}));

import { Device } from '@capacitor/device';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('возвращает явно переданный язык без обращения к Device', async () => {
    const result = await service.getLanguage('fr');
    expect(result).toBe('fr');
    expect(Device.getLanguageCode).not.toHaveBeenCalled();
  });

  it('возвращает язык устройства если он в allowedLanguages', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: 'ru' });
    expect(await service.getLanguage()).toBe('ru');
  });

  it('возвращает en если язык устройства не в allowedLanguages', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: 'de' });
    expect(await service.getLanguage()).toBe('en');
  });

  it('применяет langMap для pt -> pt-br', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: 'pt' });
    expect(await service.getLanguage()).toBe('pt-br');
  });

  it('применяет langMap для zh -> zh-hans', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: 'zh' });
    expect(await service.getLanguage()).toBe('zh-hans');
  });

  it('передаёт язык как есть для остальных allowedLanguages', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: 'ja' });
    expect(await service.getLanguage()).toBe('ja');
  });

  it('возвращает en для пустой строки от Device', async () => {
    vi.mocked(Device.getLanguageCode).mockResolvedValue({ value: '' });
    expect(await service.getLanguage()).toBe('en');
  });
});
