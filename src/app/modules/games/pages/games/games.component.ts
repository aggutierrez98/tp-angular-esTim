import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../../../game.service';
import { Game } from '../../../../../types';
import { RouterLink } from '@angular/router';

declare var window: any

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})

export class GamesComponent implements OnInit {

  games: Game[] = []
  gameToDelete?: number = undefined
  modal: any

  constructor(private gameService: GamesService) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((res) => {
      this.games = res;
    });
  }

  openModal(id: number) {
    this.gameToDelete = id;
  }

  eliminarJuego() {
    this.gameService.deleteGame(String(this.gameToDelete)).subscribe((res) => {
      // TODO mostrar modal exito
    })
  }
}

