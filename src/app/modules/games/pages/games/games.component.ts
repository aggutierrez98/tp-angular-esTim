import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { GamesService } from '../../../../game.service';
import { Game } from '../../../../../types';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare var window: any

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})

export class GamesComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = ""

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

  eliminarJuego(content: TemplateRef<any>) {
    this.gameService.deleteGame(String(this.gameToDelete)).subscribe((res) => {
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
}

