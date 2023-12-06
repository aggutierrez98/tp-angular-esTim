import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GamesService } from '../../../../game.service';
import { GenresService } from '../../../../genres.service';
import { Game, SafeUser } from '../../../../../types';
import { UsersService } from '../../../../users.service';

@Component({
  selector: 'app-buygame',
  standalone: true,
  imports: [],
  templateUrl: './buygame.component.html',
  styleUrl: './buygame.component.css'
})
export class BuygameComponent implements OnInit {
  game?: Game = undefined
  genre = ""
  currentUser?: SafeUser | null = undefined;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private gameService: GamesService, private genresService: GenresService, private usersService: UsersService) { }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id']
    this.gameService.getGame(id).subscribe((res) => {
      this.game = res;

      this.genresService.getGenre(id).subscribe((res) => {
        this.genre = res.name;
      });
    });

    this.currentUser = this.usersService.getCurrentUser();
  }

  buyGame(gameId: number) {
    this.usersService.buyGame(gameId).subscribe(() => {
      this.router.navigate(['/checkout'])
    })
  }
}


