import { inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ArticlesStore } from '../../store/articles.store';

@Injectable({ providedIn: 'root' })
export class PlaygroundService {
  private readonly modalCtrl = inject(ModalController);
  private readonly articlesStore = inject(ArticlesStore);

  async open(exampleId: string): Promise<void> {
    const example = this.articlesStore.getExample(exampleId);
    if (!example) {
      console.warn('[playground] example not found:', exampleId);
      return;
    }

    // Lazy-load the modal component so Babel/React UMD aren't
    // parsed until the user actually taps a placeholder.
    const { PlaygroundModalComponent } = await import('../../pages/playground/playground-modal.component');

    const modal = await this.modalCtrl.create({
      component: PlaygroundModalComponent,
      componentProps: { exampleId, example },
      cssClass: 'playground-modal',
    });
    await modal.present();
  }
}
