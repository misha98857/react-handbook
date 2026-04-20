import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SanitizeHtmlPipe } from './sanitaze.pipe';

describe('SanitizeHtmlPipe', () => {
  function setup() {
    TestBed.configureTestingModule({ providers: [SanitizeHtmlPipe] });
    const pipe = TestBed.inject(SanitizeHtmlPipe);
    const sanitizer = TestBed.inject(DomSanitizer);
    return { pipe, sanitizer };
  }

  it('возвращает SafeHtml для произвольной строки', () => {
    const { pipe } = setup();
    const result = pipe.transform('<p>hello</p>') as SafeHtml;
    expect(result).toBeTruthy();
  });

  it('делегирует вызов в DomSanitizer.bypassSecurityTrustHtml', () => {
    const { pipe, sanitizer } = setup();
    const spy = vi.spyOn(sanitizer, 'bypassSecurityTrustHtml');
    pipe.transform('<script>alert(1)</script>');
    expect(spy).toHaveBeenCalledWith('<script>alert(1)</script>');
  });

  it('обрабатывает пустую строку', () => {
    const { pipe } = setup();
    expect(pipe.transform('')).toBeTruthy();
  });
});
