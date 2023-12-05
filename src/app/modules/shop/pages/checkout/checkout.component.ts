import { Component, TemplateRef, inject } from '@angular/core';
import { GamesService } from '../../../../game.service';
import { Game, User } from '../../../../../types';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private modalService = inject(NgbModal);
  closeResult = ""

  game?: Game = undefined
  users: User[] = []
  userPrestado?: User = undefined;

  id = this.activatedRoute.snapshot.params['id']

  constructor(private gameService: GamesService, private userService: UsersService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameService.getGame(this.id).subscribe((res) => {
      this.game = res;
    });

    this.userService.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  prestarJuego(content: TemplateRef<any>) {
    this.openModalSucess(content)
  }

  seleccionarUsuario(userId: string) {
    this.userService.getUser(userId).subscribe((res) => {
      this.userPrestado = res;
    });
  }

  openModalSucess(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-sucess' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
  }

  sucessOk() {
    window.location.href = "/"
  }
}
