import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
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
import { SandpackExample } from '../../entities/articles/models/articles';
import { codeSandboxUrl, requiresExternalSandbox } from '../../features/playground/codesandbox-link';

interface ConsoleEntry {
  level: string;
  message: string;
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
    if (frame) frame.src = frame.src;
  }

  copyCode(): void {
    const src = this.activeSource();
    if (!src) return;
    try {
      navigator.clipboard?.writeText(src);
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
    const data = ev.data;
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
        next.push({ level: data.level, message: (data.args || []).join(' ') });
        this.consoleEntries.set(next);
        break;
      }
      case 'sandpack:error': {
        const entries = this.consoleEntries();
        const next = entries.slice(-49);
        next.push({ level: 'error', message: data.stack || data.message || 'Runtime error' });
        this.consoleEntries.set(next);
        break;
      }
    }
  }
}
