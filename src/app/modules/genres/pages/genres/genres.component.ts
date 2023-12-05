import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Genre } from '../../../../../types';
import { GenresService } from '../../../../genres.service';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './genres.component.html',
  styleUrl: './genres.component.css'
})
export class GenresComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = ""

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

  eliminarGenero(content: TemplateRef<any>) {
    this.genreService.deleteGenre(String(this.genreToDelete)).subscribe((res) => {
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


