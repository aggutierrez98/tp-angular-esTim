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
  games?: Game[] = []
  gamesBorrowed?: Game[] = []
  users: User[] = []
  closeResult = ""
  gameToLend?: Game = undefined
  gameToReturn?: Game = undefined
  userPrestado?: User = undefined;
  currentUser?: SafeUser | null = undefined;

  constructor(private gameService: GamesService, private userService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();

    this.gameService.getGames().subscribe((res) => {
      this.games = res?.filter((game) => this.currentUser?.games?.includes(game.id))
      this.gamesBorrowed = res?.filter((game) => (this.currentUser?.borrowedGames ?? []).findIndex(bg => bg.gameId === game.id) !== -1)
    });

    this.userService.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  prestarOpen(game: Game) {
    this.gameToLend = game;
  }

  devolverOpen(game: Game) {
    this.gameToReturn = game;
  }

  prestarJuego(content: TemplateRef<any>) {
    if (this.gameToLend && this.userPrestado)
      this.userService.lendGame(this.gameToLend.id, this.userPrestado.id).subscribe({
        complete: () => {
          this.openModalSucess(content)
        },
        error: () => {
          //TODO MOSTRAR MODAL ERROR
          // this.openModalError(content)
        }
      })
  }

  devolverJuego(content: TemplateRef<any>) {
    if (this.gameToReturn) {
      this.userService.returnGame(Number(this.gameToReturn.id)).subscribe({
        complete: () => {
          this.openModalSucess(content)
        },
        error: () => {
          //TODO MOSTRAR MODAL ERROR
          // this.openModalError(content)
        }
      })
    }
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
