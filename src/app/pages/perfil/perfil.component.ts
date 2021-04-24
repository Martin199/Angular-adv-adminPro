import { FileUploadService } from './../../services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.models';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  perfilForm: FormGroup;
  usuario: Usuario;
  imagenSubir: File;
  imgTemp: any

  constructor(private fb: FormBuilder, private usuarioServices: UsuarioService, private fileUploadService: FileUploadService) {

    this.usuario = usuarioServices.usuario
   }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre , Validators.required],
      email: [this.usuario.email , Validators.required]
    })
  }

  actualizarPerfil(){
    this.usuarioServices.actualizarPerfil(this.perfilForm.value).subscribe( resp => {
      console.log(resp)
      // TODO: como actualizar data y que cambio en el front (utilizando una clase)
      const {nombre, email } = this.perfilForm.value
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('guardado', 'cambios fueron guardados', 'success')
    }, (err) => {
      console.log(err.error.msg)
      Swal.fire('error', err.error.msg, 'error')
    })
  }

  cambiarImagen(file){
   this.imagenSubir = file.target.files[0]
   console.log(this.imagenSubir)

   if (!file) {
     return this.imgTemp = null;
   }

   const reader = new FileReader();
   const p = reader.readAsDataURL(file.target.files[0]);
   console.log(p)

   reader.onloadend = () => {
     this.imgTemp = reader.result
   }
  }

  subirImagen(){
    this.fileUploadService.actualizarUsuario(this.imagenSubir, 'usuarios', this.usuario.uid)
    .subscribe( resp => {
      console.log(resp);
      this.usuario.img = resp
      Swal.fire('guardado', 'imagen cambiada', 'success')
      
    }, (err) => {
      console.log(err);
      Swal.fire('error', 'no se pudo subir la imagen ', 'error')
    })
  }

}
