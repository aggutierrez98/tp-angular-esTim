import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Game, Genre } from '../../../../../types';
import { GamesService } from '../../../../game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GenresService } from '../../../../genres.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent implements OnInit {
  private modalService = inject(NgbModal);
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

  constructor(private activatedRoute: ActivatedRoute, private gameService: GamesService, private genresService: GenresService, private fb: FormBuilder, private router: Router) { }

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

  handleSubmit(e: Event, content: TemplateRef<any>) {
    e.preventDefault()

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
        this.openModalSucess(content)
      })
    } else {
      this.gameService.createGame(dataToSend).subscribe(() => {
        this.openModalSucess(content)
      })
    }
  }

  deleteGame(content: TemplateRef<any>) {
    this.gameService.deleteGame(this.id).subscribe((res) => {
      this.openModalSucess(content)
    })
  }

  openModalSucess(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-sucess' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }
    );
  }
  sucessOk() {
    this.modalService.dismissAll()
    this.router.navigate(["/games"])
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