import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { GamesService } from '../../../../services/game.service';
import { Game } from '../../../../../types';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastService } from '../../../../services/toast.service';

declare var window: any

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})

export class GamesComponent implements OnInit {
  closeResult = ""

  games: Game[] = []
  gameToDelete?: number = undefined
  modal: any

  constructor(
    private gameService: GamesService,
    private spinnerService: SpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((res) => {
      this.games = res;
    });
  }

  openModal(id: number) {
    this.gameToDelete = id;
  }

  eliminarJuego() {
    this.spinnerService.setLoading(true);
    this.gameService.deleteGame(String(this.gameToDelete)).subscribe((res) => {
      this.spinnerService.setLoading(false);
      this.toastService.showSuccess("Juego eliminado exitosamente")
      this.ngOnInit()
    })
  }
}

