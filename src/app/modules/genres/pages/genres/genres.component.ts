import { Component, OnInit } from '@angular/core';
import { Genre } from '../../../../../types';
import { GenresService } from '../../../../services/genres.service';
import { RouterLink } from '@angular/router';
import { SpinnerService } from '../../../../services/spinner.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent implements OnInit {
  closeResult = ""
  genres: Genre[] = []
  genreToDelete?: number = undefined

  constructor(
    private genreService: GenresService,
    private spinnerService: SpinnerService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.genreService.getGenres().subscribe((res) => {
      this.genres = res;
    });
  }

  openModal(id: number) {
    this.genreToDelete = id;
  }

  eliminarGenero() {
    this.spinnerService.setLoading(true);
    this.genreService.deleteGenre(String(this.genreToDelete)).subscribe(() => {
      this.spinnerService.setLoading(false);
      this.toastService.showSuccess("Genero eliminado exitosamente")
      this.ngOnInit()
    })
  }
}


