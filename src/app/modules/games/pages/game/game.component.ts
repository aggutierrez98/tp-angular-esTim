import { Component, OnInit } from '@angular/core';
import { Game, Genre } from '../../../../../types';
import { GamesService } from '../../../../game.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  id = this.activatedRoute.snapshot.params['id']

  gameData = new FormGroup({
    title: new FormControl("", { nonNullable: true }),
    genre: new FormControl("", { nonNullable: true }),
    requirements: new FormGroup({
      cpu: new FormControl(""),
      mem: new FormControl(""),
      disk: new FormControl("")
    }),
    price: new FormControl("", { nonNullable: true }),
    fields: this.fb.array<FormGroup<{
      id: FormControl<number>;
      name: FormControl<string>;
      type: FormControl<"text" | "number">;
      value: FormControl<string>;
    }>>([]),
  });

  constructor(private activatedRoute: ActivatedRoute, private gameService: GamesService, private genresService: GenresService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.genresService.getGenres().subscribe((res) => {
      this.genres = res;
    })

    if (this.id && this.id !== "create") {
      this.gameService.getGame(this.id).subscribe((res) => {
        this.game = res;
        this.gameData.controls.title.setValue(res.title)
        this.gameData.controls.price.setValue(String(res.price))
        this.gameData.controls.genre.setValue(String(res.genre))
        this.gameData.controls.requirements.setValue(res.requirements)

        if (res.fields) {
          for (const field of res.fields) {
            this.gameData.controls.fields.push(this.fb.group({
              id: this.fb.control(field.id, { nonNullable: true },),
              name: this.fb.control(field.name, { nonNullable: true }),
              type: this.fb.control(field.type, { nonNullable: true }),
              value: this.fb.control(field.value, { nonNullable: true }),
            }))
          }
        }
      });
    }
  }

  changeGenre(value: string) {
    if (this.genres) {
      this.gameData.controls.fields.clear()
      const genre = this.genres.find(genre => genre.id === Number(value))

      if (genre) {
        for (const field of genre.fields) {
          this.gameData.controls.fields.push(this.fb.group({
            id: this.fb.control(field.id, { nonNullable: true },),
            name: this.fb.control(field.name, { nonNullable: true }),
            type: this.fb.control(field.type, { nonNullable: true }),
            value: this.fb.control("", { nonNullable: true }),
          }))
        }
      }
    }
  }

  handleSubmit(e: Event) {
    e.preventDefault()

    const dataToSend = {
      genre: Number(this.gameData.controls.genre.value),
      title: this.gameData.controls.title.value,
      price: Number(this.gameData.controls.price.value),
      requirements: {
        cpu: this.gameData.controls.requirements.value.cpu || "",
        disk: this.gameData.controls.requirements.value.disk || "",
        mem: this.gameData.controls.requirements.value.mem || "",
      },
      fields: this.gameData.get("fields")?.value ?? []
    }

    if (this.id !== "create") {
      this.gameService.updateGame(this.id, dataToSend).subscribe((res) => {
        // TODO mostrar modal exito
        window.location.href = "/games"
      })
    } else {

      this.gameService.createGame(dataToSend).subscribe((res) => {
        // TODO mostrar modal exito
        window.location.href = "/games"
      })
    }
  }

  deleteGame() {
    this.gameService.deleteGame(this.id).subscribe((res) => {
      // TODO mostrar modal exito
      window.location.href = "/games"
    })
  }
}