import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../../../game.service';
import { Game } from '../../../../../types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})

export class GamesComponent implements OnInit {

  games: Game[] = []

  constructor(private gameService: GamesService) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((res) => {
      this.games = res;
    });
  }
}

