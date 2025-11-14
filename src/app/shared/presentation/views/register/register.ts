import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  constructor(private router: Router) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const name = this.registerForm.value.name;
      if (name) {
        // Guardar el nombre en localStorage
        localStorage.setItem('userName', name);
        // Redirigir al primer recurso
        this.router.navigate(['/resource-1']);
      }
    }
  }
}
