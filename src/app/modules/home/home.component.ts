import { Component, OnInit } from '@angular/core';
import { Game } from '../../../types';
import { GamesService } from '../../services/game.service';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  games: Game[] = []
  constructor(
    private gameService: GamesService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerService.setLoading(true);
    this.gameService.getGames().subscribe((res) => {
      this.spinnerService.setLoading(false);
      this.games = res;
    });

  }
}

