import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LobbyComponent } from './pages/lobby/lobby.component';
import { RoomComponent } from './pages/room/room.component';
import { WaitingComponent } from './pages/waiting/waiting.component';
import { GameplayComponent } from './pages/gameplay/gameplay.component';
import { JudgingComponent } from './pages/judging/judging.component';

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
        path: 'room/:roomname',
        component: RoomComponent,
        children: [
            { path: 'waiting', component: WaitingComponent },
            { path: 'play', component: GameplayComponent },
            { path: 'judging', component: JudgingComponent },
            { path: '', pathMatch: 'full', redirectTo: 'waiting' }
        ]
    }
];
