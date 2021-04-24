import { Usuario } from './../../models/usuario.models';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuario : Usuario

  constructor(private usuarioServices : UsuarioService) {

    this.usuario = usuarioServices.usuario;
    console.log(this.usuario)
  }

  ngOnInit(): void {
  }

  logout(){
    this.usuarioServices.logout()
  }

}
