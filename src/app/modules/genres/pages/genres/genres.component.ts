import { Component, OnInit } from '@angular/core';
import { Genre } from '../../../../../types';
import { GenresService } from '../../../../genres.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent implements OnInit {

  genres: Genre[] = []
  genreToDelete?: number = undefined

  constructor(private genreService: GenresService) { }

  ngOnInit(): void {
    this.genreService.getGenres().subscribe((res) => {
      this.genres = res;
    });
  }

  openModal(id: number) {
    this.genreToDelete = id;
  }

  eliminarGenero() {
    this.genreService.deleteGenre(String(this.genreToDelete)).subscribe((res) => {
      // TODO mostrar modal exito
    })
  }

}


