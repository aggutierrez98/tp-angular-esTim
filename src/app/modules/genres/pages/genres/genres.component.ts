import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Genre } from '../../../../../types';
import { GenresService } from '../../../../genres.service';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerService } from '../../../../spinner.service';
import { ToastService } from '../../../../toast.service';

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
    this.genreService.deleteGenre(String(this.genreToDelete)).subscribe((res) => {
      this.spinnerService.setLoading(false);
      this.toastService.showSuccess("Genero eliminado exitosamente")
      this.ngOnInit()
    })
  }
}


