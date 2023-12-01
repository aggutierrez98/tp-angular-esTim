import { Component, OnInit } from '@angular/core';
import { Game, Genre } from '../../../../../types';
import { GamesService } from '../../../../game.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenresService } from '../../../../genres.service';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  game?: Game = undefined
  genres?: Genre[] = []

  gameData = new FormGroup({
    title: new FormControl("", { nonNullable: true }),
    genre: new FormControl("", { nonNullable: true }),
    requirements: new FormGroup({
      cpu: new FormControl(""),
      mem: new FormControl(""),
      disk: new FormControl("")
    }),
    price: new FormControl("", { nonNullable: true }),
  });

  constructor(private activatedRoute: ActivatedRoute, private gameService: GamesService, private genresService: GenresService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id']

    if (id) {
      this.gameService.getGame(id).subscribe((res) => {
        this.game = res;
        this.gameData.controls.title.setValue(res.title)
        this.gameData.controls.price.setValue(String(res.price))
        this.gameData.controls.genre.setValue(String(res.genre))
        this.gameData.controls.requirements.setValue(res.requirements)
      });
    }

    this.genresService.getGenres().subscribe((res) => {
      this.genres = res;
    })
  }

  handleSubmit(e: Event) {
    e.preventDefault()
    //TODO editar o crear juego segun el
  }
}