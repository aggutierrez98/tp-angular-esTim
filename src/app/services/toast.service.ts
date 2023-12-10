import { Injectable } from '@angular/core';

export interface ToastInfo {
	header: string;
	body: string;
	headerClassName?: string,
	bodyClassName?: string,
	// classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	toasts: ToastInfo[] = [];

	show({ header, body, headerClassName, bodyClassName, delay }: ToastInfo) {
		this.toasts.push({ header, body, headerClassName, bodyClassName, delay });
	}

	remove(toast: ToastInfo) {
		this.toasts = this.toasts.filter(t => t != toast);
	}

	showSuccess(text: string) {
		this.show({
			header: "Operacion satisfactoria",
			body: text,
			headerClassName: "border border-success text-success",
			bodyClassName: "",
			delay: 5000
		})
	}
	showFailed(text: string) {
		this.show({
			header: "Operacion erronea",
			body: text,
			headerClassName: "border border-danger text-danger",
			bodyClassName: "",
			delay: 5000
		})
	}
}
