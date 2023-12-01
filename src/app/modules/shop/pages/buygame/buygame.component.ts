import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '../../../../game.service';
import { GenresService } from '../../../../genres.service';
import { Game } from '../../../../../types';

@Component({
  selector: 'app-buygame',
  standalone: true,
  imports: [],
  templateUrl: './buygame.component.html',
  styleUrl: './buygame.component.css'
})
export class BuygameComponent implements OnInit {
  game?: Game = undefined

  constructor(private activatedRoute: ActivatedRoute, private gameService: GamesService, private genresService: GenresService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id']
    this.gameService.getGame(id).subscribe((res) => {
      this.game = res;
    });
  }

  buyGame(e: Event) {
    e.preventDefault()

    //TODO comprar juego
  }

}


