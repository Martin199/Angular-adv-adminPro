import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  formSubmitted: boolean = false;

  registerForm = this.fb.group({
    nombre: [ 'fernando', [Validators.required, Validators.minLength(3)]],
    email: ['martin@gmail.com', Validators.required],
    password: ['123456', Validators.required],
    password2: ['123456', Validators.required],
    terminos: [ true, Validators.required]
  }, {
    validators: this.passwordIguales('password', 'password2')
  })

  constructor(private fb: FormBuilder, private usuarioServices: UsuarioService) { }

  ngOnInit(): void {
  }

  crearUsuario(){
   this.formSubmitted = true;
   console.log(this.registerForm.value)

    this.usuarioServices.crearUsuario(this.registerForm.value).subscribe(resp => {
      console.log(resp)
    }, (err) => {
      Swal.fire('error', err.error.msg, 'error')
    })

  }

  campoNoValido( campo: string ): boolean {
    
   if(this.registerForm.get(campo).invalid && this.formSubmitted ){
      return true
   } else {
     return false
   }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted
  }

  contrasenasNoValidars(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if((pass1 !== pass2) && this.formSubmitted){
      return true
    }else{
      return false

    }

  }

  passwordIguales(pass1Name: string, pass2Name: string){
    return (formGroup : FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null)
      }else{
        pass2Control.setErrors({noEsIgual: true})
      }
    }
  }

}
