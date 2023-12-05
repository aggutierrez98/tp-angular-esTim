import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../users.service';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = ""

  logInForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.logInForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
    });
  }

  handleSubmit(content: TemplateRef<any>) {
    if (this.logInForm.valid) {
      this.usersService.logIn(this.logInForm.value).subscribe({
        complete: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.openModalFailed(content)
        }
      });
    } else {
      this.logInForm.markAllAsTouched();
    }
  }

  openModalFailed(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-sucess' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
  }

}
