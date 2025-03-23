import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTestComponent } from '../user-test/user-test.component';
import { ChampionshipTestComponent } from '../championship-test/championship-test.component';
import { TeamTestComponent } from '../team-test/team-test.component';
import { DayTestComponent } from '../day-test/day-test.component';
import { GameTestComponent } from '../game-test/game-test.component';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [
    CommonModule,
    UserTestComponent,
    ChampionshipTestComponent,
    TeamTestComponent,
    DayTestComponent,
    GameTestComponent
  ],
  templateUrl: './api-test.component.html',
  styleUrl: './api-test.component.scss'
})
export class ApiTestComponent {
  activeTab: 'users' | 'championships' | 'teams' | 'days' | 'games' = 'users';

  setActiveTab(tab: 'users' | 'championships' | 'teams' | 'days' | 'games'): void {
    this.activeTab = tab;
  }
}