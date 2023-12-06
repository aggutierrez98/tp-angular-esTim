import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Genre } from '../../../../../types';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenresService } from '../../../../genres.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.css'
})
export class GenreComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult = ""

  genre?: Genre = undefined
  id = this.activatedRoute.snapshot.params['id']

  genreData = this.fb.group({
    name: this.fb.control("", { nonNullable: true }),
    fields: this.fb.array<FormGroup<{
      id: FormControl<number>;
      name: FormControl<string>;
      type: FormControl<"text" | "number">;
    }>>([], [Validators.required]),
  });

  constructor(private activatedRoute: ActivatedRoute, private genresService: GenresService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    if (this.id && this.id !== "create") {
      this.genresService.getGenre(this.id).subscribe((res) => {
        this.genre = res;
        this.genreData.controls.name.setValue(res.name)

        for (const field of res.fields) {
          this.genreData.controls.fields.push(this.fb.group({
            id: this.fb.control(field.id, { nonNullable: true },),
            name: this.fb.control(field.name, { nonNullable: true }),
            type: this.fb.control(field.type, { nonNullable: true }),
          }))
        }
      });
    }
  }

  private addFieldGroup(): FormGroup {
    const nuevo = this.fb.group({
      id: this.fb.control(this.newId, { nonNullable: true },),
      name: this.fb.control("", { nonNullable: true }),
      type: this.fb.control("", { nonNullable: true }),
    })
    return nuevo
  }

  get fieldsArray(): FormArray {
    return <FormArray>this.genreData.get('fields');
  }

  get newId(): number {
    return this.genreData?.get('fields')?.value.length ?? 0
  }

  addField() {
    this.fieldsArray?.push(this.addFieldGroup())
  }

  deleteField(index: number) {
    this.fieldsArray?.removeAt(index)
  }

  handleSubmit(e: Event, content: TemplateRef<any>) {
    e.preventDefault()

    const dataToSend = {
      name: this.genreData.controls.name.value,
      fields: this.fieldsArray.value,
    }

    if (this.id !== "create") {
      this.genresService.updateGenre(this.id, dataToSend).subscribe((res) => {
        this.openModalSucess(content)
      })
    } else {
      this.genresService.createGenre(dataToSend).subscribe((res) => {
        this.openModalSucess(content)
      })
    }
  }

  deleteGenre(content: TemplateRef<any>) {
    this.genresService.deleteGenre(this.id).subscribe((res) => {
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
    this.router.navigate(["/genres"])
  }
}

