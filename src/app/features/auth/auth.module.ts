import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './login.component';
import { LucideAngularModule, Lock, ArrowRight } from 'lucide-angular';

const routes: Routes = [
    { path: 'login', component: AdminLoginComponent }
];

@NgModule({
    declarations: [AdminLoginComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(routes),
        LucideAngularModule.pick({ Lock, ArrowRight })
    ]
})
export class AuthModule { }
