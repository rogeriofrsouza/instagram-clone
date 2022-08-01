import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Usuario } from './../../shared/models/usuario.model';
import { AutenticacaoService } from './../../shared/services/autenticacao.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {

  @Output() exibirPainel: EventEmitter<string> = new EventEmitter<string>();

  public formulario: FormGroup = new FormGroup({
    'email': new FormControl(null, [ Validators.required, Validators.minLength(6), Validators.email ]),
    'nome': new FormControl(null, [ Validators.required, Validators.minLength(6), Validators.maxLength(50) ]),
    'usuario': new FormControl(null, [ Validators.required, Validators.minLength(6), Validators.maxLength(20) ]),
    'senha': new FormControl(null, [ Validators.required, Validators.minLength(6) ])
  });

  public errorMessage: string = '';

  constructor(private autenticacaoService: AutenticacaoService) { }

  ngOnInit(): void {
  }

  public cadastrarUsuario(): void {
    if (this.formulario.status === 'INVALID') {
      this.formulario.markAllAsTouched();
      
    } else {
      let usuario: Usuario = this.formulario.value;
      this.autenticacaoService.cadastrarUsuario(usuario)
        .then((error) => error !== undefined ? this.errorMessage = error.message : this.exibirPainelLogin());
    }
  }

  public exibirPainelLogin(): void {
    this.exibirPainel.emit('login');
  }

}
