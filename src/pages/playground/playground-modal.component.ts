import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  OnDestroy,
  AfterViewInit,
  computed,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser';
import { TranslateModule } from '@ngx-translate/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, copyOutline, openOutline, refreshOutline } from 'ionicons/icons';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import { SandpackExample } from '../../entities/articles/models/articles';
import { codeSandboxUrl, requiresExternalSandbox } from '../../features/playground/codesandbox-link';

interface ConsoleEntry {
  level: string;
  message: string;
}

interface RunnerMessage {
  type?: string;
  level?: string;
  args?: unknown[];
  stack?: string;
  message?: string;
}

function stringifyArg(a: unknown): string {
  if (a === null) return 'null';
  if (typeof a === 'string') return a;
  if (typeof a === 'number' || typeof a === 'boolean' || typeof a === 'undefined') return String(a);
  try {
    return JSON.stringify(a);
  } catch {
    return '[unserialisable]';
  }
}

function languageFor(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'jsx':
    case 'js':
      return 'jsx';
    case 'tsx':
      return 'tsx';
    case 'ts':
      return 'typescript';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'html':
      return 'markup';
    default:
      return 'jsx';
  }
}

@Component({
  selector: 'app-playground-modal',
  templateUrl: './playground-modal.component.html',
  styleUrls: ['./playground-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class PlaygroundModalComponent implements AfterViewInit, OnDestroy {
  // Set by Ionic ModalController via componentProps — these are plain
  // assignments, so they cannot be `input()` signals (Ionic would overwrite
  // the InputSignal function with a raw value).
  exampleId = '';
  example?: SandpackExample;

  readonly iframe = viewChild<ElementRef<HTMLIFrameElement>>('runnerIframe');
  readonly activeFile = signal<string>('');
  readonly consoleEntries = signal<ConsoleEntry[]>([]);
  readonly runtimeReady = signal<boolean>(false);
  readonly needsExternal = signal<boolean>(false);

  readonly modalCtrl = inject(ModalController);
  readonly sanitizer = inject(DomSanitizer);

  readonly activeLanguage = computed(() => languageFor(this.activeFile()));
  readonly highlightedSource = computed<SafeHtml>(() => {
    const src = this.activeSource();
    const lang = this.activeLanguage();
    const grammar = Prism.languages[lang] ?? Prism.languages.javascript;
    const html = Prism.highlight(src, grammar, lang);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  });

  private bootListener?: (ev: MessageEvent) => void;

  constructor() {
    addIcons({ closeOutline, copyOutline, openOutline, refreshOutline });
  }

  ngAfterViewInit(): void {
    const ex = this.example;
    if (!ex) return;

    this.activeFile.set(ex.entry);
    this.needsExternal.set(requiresExternalSandbox(ex));

    this.bootListener = ev => this.onMessage(ev);
    window.addEventListener('message', this.bootListener);
  }

  ngOnDestroy(): void {
    if (this.bootListener) window.removeEventListener('message', this.bootListener);
  }

  onIframeLoad(): void {
    // Wait for runner to send 'boot' then mount — see onMessage.
  }

  selectFile(path: string): void {
    this.activeFile.set(path);
  }

  fileNames(): string[] {
    const ex = this.example;
    return ex ? Object.keys(ex.files) : [];
  }

  activeSource(): string {
    const ex = this.example;
    const f = this.activeFile();
    return ex && f ? (ex.files[f] ?? '') : '';
  }

  reload(): void {
    this.consoleEntries.set([]);
    const frame = this.iframe()?.nativeElement;
    // eslint-disable-next-line no-self-assign
    if (frame) frame.src = frame.src;
  }

  copyCode(): void {
    const src = this.activeSource();
    if (!src) return;
    try {
      void navigator.clipboard?.writeText(src);
    } catch {
      /* ignore */
    }
  }

  openInCodeSandbox(): void {
    const ex = this.example;
    if (!ex) return;
    const url = codeSandboxUrl(ex, this.exampleId);
    InAppBrowser.create(url, '_system');
  }

  async dismiss(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  private onMessage(ev: MessageEvent): void {
    const frame = this.iframe()?.nativeElement;
    if (!frame || ev.source !== frame.contentWindow) return;
    const data = ev.data as RunnerMessage | null;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'sandpack:boot': {
        this.runtimeReady.set(true);
        const ex = this.example;
        if (ex) frame.contentWindow?.postMessage({ type: 'sandpack:mount', files: ex.files, entry: ex.entry }, '*');
        break;
      }
      case 'sandpack:ready':
        break;
      case 'sandpack:console': {
        const entries = this.consoleEntries();
        const next = entries.slice(-49);
        next.push({ level: data.level ?? 'log', message: (data.args ?? []).map(stringifyArg).join(' ') });
        this.consoleEntries.set(next);
        break;
      }
      case 'sandpack:error': {
        const entries = this.consoleEntries();
        const next = entries.slice(-49);
        next.push({ level: 'error', message: data.stack ?? data.message ?? 'Runtime error' });
        this.consoleEntries.set(next);
        break;
      }
    }
  }
}
