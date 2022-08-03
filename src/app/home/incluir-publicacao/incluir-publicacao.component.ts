import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { interval, Subject, takeUntil } from 'rxjs';

import { DbService } from './../../shared/services/db.service';
import { ProgressoService } from './../../shared/services/progresso.service';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css']
})
export class IncluirPublicacaoComponent implements OnInit {

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null, [ Validators.required ])
  })

  public email: string = '';
  private imagem: FileList | null = null;

  public estadoPublicacao: string = '';
  public progressoUpload: number = 0;
  public downloadURL: string = '';
  public erro: string = '';

  constructor(private dbService: DbService, private progressoService: ProgressoService) { }

  ngOnInit(): void {
    const auth: Auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.email = user.email !== null ? user.email : '';
      }
    });
  }

  public publicar(): void {
    this.dbService.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem?.item(0)
    });

    const continua = new Subject<boolean>();
    continua.next(true);

    const intervalo = interval(500);
    const acompanhamentoUpload = intervalo.pipe(takeUntil(continua));

    acompanhamentoUpload.subscribe(() => {
      this.estadoPublicacao = this.progressoService.estado;
      this.progressoUpload = this.progressoService.progresso;

      if (this.estadoPublicacao === 'concluido') {
        this.downloadURL = this.progressoService.downloadURL;
        continua.next(false);
        
      } else if (this.estadoPublicacao === 'erro') {
        this.erro = this.progressoService.erro;
        continua.next(false);
      }
    });
  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files;
  }

}
