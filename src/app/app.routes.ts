import { Routes } from '@angular/router';
import { Home } from './home/home';
import { About } from './about/about';
import { Details } from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { Cart } from './cart/cart';
import { User } from './user/user';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'details/:id', component: Details },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'cart', component: Cart },
    { path: 'user', component: User }
];