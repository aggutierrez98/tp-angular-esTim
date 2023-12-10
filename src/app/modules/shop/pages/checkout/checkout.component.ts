import { Component, TemplateRef, inject } from '@angular/core';
import { GamesService } from '../../../../services/game.service';
import { Game, SafeUser } from '../../../../../types';
import { Router } from '@angular/router';
import { UsersService } from '../../../../services/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastService } from '../../../../services/toast.service';

interface GameWithUser extends Game {
  user: SafeUser
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  toastService = inject(ToastService);
  games?: Game[] = []
  gamesBorrowed?: GameWithUser[] = []
  users: SafeUser[] = []
  closeResult = ""
  gameToLend?: Game = undefined
  gameToReturn?: GameWithUser = undefined
  userPrestado?: SafeUser = undefined;
  currentUser?: SafeUser | null = undefined;

  constructor(
    private gameService: GamesService,
    private userService: UsersService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.userService.getUsers().subscribe((res) => {
      this.users = res.filter(u => u.id !== this.currentUser?.id);;
    });

    this.gameService.getGames().subscribe((res) => {
      this.games = res?.filter((game) => this.currentUser?.games?.includes(game.id))
      this.gamesBorrowed = this.currentUser?.borrowedGames?.map(bg => {
        const index = res.findIndex(g => g.id === bg.gameId)
        return { ...res[index], user: this.users.find(u => u.id === bg.userId) } as GameWithUser;
      })
    });
  }

  prestarOpen(game: Game) {
    this.gameToLend = game;
  }

  devolverOpen(game: GameWithUser) {
    this.gameToReturn = game;
  }

  prestarJuego() {
    if (this.gameToLend && this.userPrestado) {
      this.spinnerService.setLoading(true);
      this.userService.lendGame(this.gameToLend.id, this.userPrestado.id).subscribe({
        complete: () => {
          this.toastService.showSuccess("Juego prestado exitosamente")
          this.spinnerService.setLoading(false);
          this.ngOnInit()
        },
        error: (e) => {
          this.toastService.showFailed(e)
          this.spinnerService.setLoading(false);
        }
      })
    }
  }

  devolverJuego() {
    if (this.gameToReturn) {
      this.spinnerService.setLoading(true);
      this.userService.returnGame(Number(this.gameToReturn.id)).subscribe({
        complete: () => {
          this.spinnerService.setLoading(false);
          this.toastService.showSuccess("Juego devuelto exitosamente")
          this.ngOnInit()
        },
        error: () => {
          this.spinnerService.setLoading(false);
          this.toastService.showFailed("Error al devolver juego")
        }
      })
    }
  }

  seleccionarUsuario(userId: string) {
    this.userService.getUser(userId).subscribe((res) => {
      this.userPrestado = res;
    });
  }
}
