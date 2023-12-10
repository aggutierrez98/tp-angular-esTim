import { Component, inject } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgTemplateOutlet],
  template: `
    @for (toast of toastService.toasts; track toast) {
      <ngb-toast
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        <div class="toast-header p-2 {{ toast.headerClassName }}">
          <strong class="me-auto ">{{ toast.header }}</strong>
          <small>11 mins ago</small>
          <button
            type="button"
            class="btn-close ms-1 "
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div class="toast-body p-3 rounded-bottom {{ toast.bodyClassName }}">
          {{ toast.body }}
        </div>
      </ngb-toast>
    }
  `,
  host: {
    class: 'toast-container position-fixed bottom-0 end-0 p-3',
    style: 'z-index: 1200',
  },
  styles: ['.toast { --bs-toast-padding-x: 0px !important;}']
})
export class ToastsContainer {
  toastService = inject(ToastService);
}
