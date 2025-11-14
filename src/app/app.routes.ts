import { Routes } from '@angular/router';
import {Resource1} from './shared/presentation/views/resource-1/resource-1';

const resource2 = () => import('./shared/presentation/views/resource-2/resource-2').then(m => m.Resource2);
const register = () => import('./shared/presentation/views/register/register').then(m => m.Register);
const resource3 = () => import('./shared/presentation/views/resource-3/resource-3').then(m => m.Resource3);
const resource4 = () => import('./shared/presentation/views/resource-4/resource-4').then(m => m.Resource4);
const courseComplete = () => import('./shared/presentation/views/course-complete/course-complete').then(m => m.CourseComplete);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found')
  .then(m => m.PageNotFound);
const baseTitle = 'ACME Learning Center';
export const routes: Routes = [
  { path: 'register', loadComponent: register, title: `${baseTitle} - Register` },
  { path: 'resource-1', component: Resource1, title: `${baseTitle} - Resource 1` },
  { path: 'resource-2', loadComponent: resource2, title: `${baseTitle} - Resource 2` },
  { path: 'resource-3', loadComponent: resource3, title: `${baseTitle} - Resource 3` },
  { path: 'resource-4', loadComponent: resource4, title: `${baseTitle} - Resource 4` },
  { path: 'course-complete', loadComponent: courseComplete, title: `${baseTitle} - Course Complete` },
  { path: '', redirectTo: '/register', pathMatch:'full' },
  { path: '**', loadComponent: pageNotFound, title: `${baseTitle} - Page Not Found` },
];
