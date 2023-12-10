import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../services/spinner.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private modalService = inject(NgbModal);
  closeResult = ""

  registerForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(8)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    });
  }

  handleSubmit(content: TemplateRef<HTMLDivElement>) {
    this.spinnerService.setLoading(true);
    if (this.registerForm.valid) {
      this.usersService.register(this.registerForm.value).subscribe({
        complete: () => {
          this.spinnerService.setLoading(false);
          this.router.navigate(['/']);
        },
        error: () => {
          this.spinnerService.setLoading(false);
          this.openModalFailed(content)
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  openModalFailed(content: TemplateRef<HTMLDivElement>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-fail' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
  }
}
