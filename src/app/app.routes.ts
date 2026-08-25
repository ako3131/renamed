import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { WaitingComponent } from './pages/waiting/waiting.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'lobby',
        component: LobbyComponent
    },
    {
        path: 'waiting/:roomname',
        component: WaitingComponent
    }
];
