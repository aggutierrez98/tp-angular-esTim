import { Component, TemplateRef, inject } from '@angular/core';
import { GamesService } from '../../../../game.service';
import { Game, SafeUser, User } from '../../../../../types';
import { ActivatedRoute, Router } from '@angular/router';
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

  gameToLend?: Game = undefined
  games?: Game[] = []
  users: User[] = []
  userPrestado?: User = undefined;
  currentUser?: SafeUser | null = undefined;

  constructor(private gameService: GamesService, private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();

    this.gameService.getGames().subscribe((res) => {
      this.games = res?.filter((game) => this.currentUser?.games?.includes(game.id))
    });

    this.userService.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  prestarOpen(game: Game) {
    this.gameToLend = game;
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
    this.modalService.dismissAll()
    this.router.navigate(["/"])
  }
}
