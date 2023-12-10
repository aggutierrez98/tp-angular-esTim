import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { take } from 'rxjs';
// import { AuthService } from 'src/app/services/auth.service';
import { Game } from '../../../types';
import { GamesService } from '../../services/game.service';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  games: Game[] = []
  constructor(private gameService: GamesService) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((res) => {
      this.games = res;
    });

  }
}

