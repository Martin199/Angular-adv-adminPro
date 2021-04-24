import { Usuario } from './../models/usuario.models';
import { Router } from '@angular/router';
import { LoginForm } from './../interfaces/login-form.interfaces';
import { environment } from './../../environments/environment';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

const base_url = environment.base_url;
declare const gapi: any 


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  auth2: any;
  usuario : Usuario;

  constructor(private http: HttpClient, private router: Router, private ngZone: NgZone) { 
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || ''
  }

  // obtengo el id de la clase 
  get uid(){
    return this.usuario.uid || ''
  }

  googleInit(){
    gapi.load('auth2', () => {
  
      this.auth2 = gapi.auth2.init({
        client_id: '884873872654-ka8npbsr83rl4am49o07f0in3f1oi0k7.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
  
    });
  }



  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string} ){

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data , {headers: { 'x-token': this.token}})
  }

  login(loginData: LoginForm) {
    return this.http.post(`${base_url}/login`, loginData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  
  loginGoogle(token) {
    return this.http.post(`${base_url}/login/google`, {token})
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  validarToken(){

    return this.http.get(`${base_url}/login/renew`, {headers: { 'x-token': this.token}})
          .pipe(
            map( (resp: any ) => {
              console.log(resp)

              const  {email, google, nombre, role, uid, img = ''} = resp.usuario

              this.usuario = new Usuario(nombre, email, ' ', img ,google, uid, role )

              localStorage.setItem('token', resp.token);
              return true
            }),
          
            catchError( error => of(false))
          )
  }

  logout(){
    localStorage.removeItem('token');
   
    this.auth2.signOut().then(() => {

      this.ngZone.run(()=> {
        this.router.navigateByUrl('/login');

      })
    })
  }
}
