import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2'

declare const gapi: any 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  
  formSubmitted: boolean = false;
  auth2: any

  loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , Validators.required],
    password: ['123456', Validators.required],
    remember: [false]
  })

  constructor( private router: Router, private fb : FormBuilder, private usuarioServices: UsuarioService, private ngZone: NgZone ) { }

  ngOnInit(): void {
    this.renderButton()
  }

  login() {

    console.log(this.loginForm.value)
    //this.router.navigateByUrl('/');

    this.usuarioServices.login(this.loginForm.value).subscribe( resp => {
      console.log(resp)

      if(this.loginForm.get('remember').value){
        localStorage.setItem('email', this.loginForm.get('email').value );
      }else {
        localStorage.removeItem('email')
      }
      this.router.navigateByUrl('/')

    }, (err) => {
      Swal.fire('error', err.error.msg, 'error')
    })
  }



  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

   startApp(){
    gapi.load('auth2', () => {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      this.auth2 = gapi.auth2.init({
        client_id: '884873872654-ka8npbsr83rl4am49o07f0in3f1oi0k7.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };


  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
         const id_token = googleUser.getAuthResponse().id_token;
         console.log(id_token)
         this.usuarioServices.loginGoogle(id_token).subscribe( resp => {
           this.ngZone.run(()=> {
            this.router.navigateByUrl('/')
           })
         });
   
        }, function(error) {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}
