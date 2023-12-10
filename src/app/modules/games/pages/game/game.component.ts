import { Component, OnInit } from '@angular/core';
import { Game, Genre } from '../../../../../types';
import { GamesService } from '../../../../services/game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenresService } from '../../../../services/genres.service';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastService } from '../../../../services/toast.service';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit {
  closeResult = ""

  game?: Game = undefined
  genres?: Genre[] = []
  games?: Game[] = []
  id = this.activatedRoute.snapshot.params['id']

  gameData = this.fb.group({
    title: this.fb.control("", { nonNullable: true }),
    description: this.fb.control("", { nonNullable: true }),
    genre: this.fb.control("", { nonNullable: true }),
    isDlc: this.fb.control(false, { nonNullable: true }),
    originalGame: this.fb.control(""),
    imageUrl: this.fb.control(""),
    requirements: this.fb.group({
      cpu: this.fb.control(""),
      mem: this.fb.control(""),
      disk: this.fb.control("")
    }),
    price: this.fb.control("", { nonNullable: true }),
    fields: this.fb.array<FormGroup<{
      id: FormControl<number>;
      name: FormControl<string>;
      type: FormControl<"text" | "number">;
      value: FormControl<string>;
    }>>([]),
  });

  constructor(private activatedRoute: ActivatedRoute,
    private gameService: GamesService,
    private genresService: GenresService,
    private fb: FormBuilder,
    private router: Router,
    private spinnerService: SpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.gameService.getGames().subscribe((res) => {
      this.games = res;
    });

    this.genresService.getGenres().subscribe((res) => {
      this.genres = res;
    })

    if (this.id && this.id !== "create") {
      this.gameService.getGame(this.id).subscribe((res) => {
        this.game = res;
        this.gameData.controls.title.setValue(res.title)
        this.gameData.controls.description.setValue(res.description)
        this.gameData.controls.price.setValue(String(res.price))
        this.gameData.controls.genre.setValue(String(res.genre))
        this.gameData.controls.requirements.setValue(res.requirements)
        this.gameData.controls.isDlc.setValue(res.isDlc)
        this.gameData.controls.imageUrl.setValue(res.imageUrl ?? null)
        this.gameData.controls.originalGame.setValue(res.originalGame ?? null)

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
    this.spinnerService.setLoading(true);

    const dataToSend = {
      genre: Number(this.gameData.controls.genre.value),
      title: this.gameData.controls.title.value,
      description: this.gameData.controls.description.value,
      price: Number(this.gameData.controls.price.value),
      requirements: {
        cpu: this.gameData.controls.requirements.value.cpu || "",
        disk: this.gameData.controls.requirements.value.disk || "",
        mem: this.gameData.controls.requirements.value.mem || "",
      },
      fields: this.gameData.get("fields")?.value ?? [],
      isDlc: this.gameData.controls.isDlc.value,
      originalGame: this.gameData.controls.originalGame.value ?? null,
      imageUrl: this.gameData.controls.imageUrl.value ?? null,
    }

    if (this.id !== "create") {
      this.gameService.updateGame(this.id, dataToSend).subscribe(() => {
        this.spinnerService.setLoading(false);
        this.router.navigate(["/games"])
        this.toastService.showSuccess("Juego editado exitosamente")
      })
    } else {
      this.gameService.createGame(dataToSend).subscribe(() => {
        this.spinnerService.setLoading(false);
        this.router.navigate(["/games"])
        this.toastService.showSuccess("Juego creado exitosamente")
      })
    }
  }

  deleteGame() {
    this.spinnerService.setLoading(true);
    this.gameService.deleteGame(this.id).subscribe(() => {
      this.spinnerService.setLoading(false);
      this.toastService.showSuccess("Juego elimado exitosamente")
      this.router.navigate(["/games"])
    })
  }

  changeDlc(value: string) {
    if (this.games) {
      this.gameData.controls.originalGame.setValue(value)
      this.gameData.controls.fields.clear()

      this.gameService.getGame(value).subscribe((res) => {
        const genre = this.genres?.find(genre => genre.id === res.genre)

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
      })
    }
  }
}