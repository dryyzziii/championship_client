import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-test.component.html',
  styleUrl: './game-test.component.scss'
})
export class GameTestComponent {
  loading = false;
  results: any[] = [];
  error: string | null = null;
  
  // Données pour les tests
  newGame = {
    team1Point: 2,
    team2Point: 1
  };
  
  createdGameId?: number;
  
  dayIds: number[] = [];
  selectedDayId?: number;
  
  teamIds: number[] = [];
  selectedTeam1Id?: number;
  selectedTeam2Id?: number;
  
  championshipIds: number[] = [];
  selectedChampionshipId?: number;
  
  constructor(private apiService: ApiTestService) {
    this.loadInitialData();
  }
  
  async loadInitialData() {
    try {
      // Chargement des championnats
      const championships: any = await this.apiService.getAllChampionships();
      if (Array.isArray(championships) && championships.length > 0) {
        this.championshipIds = championships.map((c: any) => c.id);
        this.selectedChampionshipId = this.championshipIds[0];
        
        // Chargement des journées pour le premier championnat
        await this.loadDays(this.selectedChampionshipId);
      }
      
      // Chargement des équipes
      const teams: any = await this.apiService.getAllTeams();
      if (Array.isArray(teams) && teams.length > 1) {
        this.teamIds = teams.map((t: any) => t.id);
        this.selectedTeam1Id = this.teamIds[0];
        this.selectedTeam2Id = this.teamIds.length > 1 ? this.teamIds[1] : this.teamIds[0];
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }
  
  async loadDays(championshipId: number) {
    try {
      const days: any = await this.apiService.getDaysByChampionshipId(championshipId);
      if (Array.isArray(days) && days.length > 0) {
        this.dayIds = days.map((d: any) => d.id);
        this.selectedDayId = this.dayIds[0];
      } else {
        this.dayIds = [];
        this.selectedDayId = undefined;
      }
    } catch (error) {
      console.error('Error loading days:', error);
    }
  }
  
  onChampionshipChange() {
    if (this.selectedChampionshipId) {
      this.loadDays(this.selectedChampionshipId);
    }
  }
  
  async testGetAllGames() {
    this.addResult('GET All Games', 'Récupération de tous les résultats de matchs...');
    this.loading = true;
    try {
      const data = await this.apiService.getAllGames();
      this.addResult('GET All Games', 'Succès', data);
    } catch (error) {
      this.addResult('GET All Games', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetGameById() {
    if (!this.createdGameId) {
      this.addResult('GET Game by ID', 'Échec - Aucun résultat de match créé');
      return;
    }
    
    this.addResult('GET Game by ID', `Récupération du résultat de match avec l'ID ${this.createdGameId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getGameById(this.createdGameId);
      this.addResult('GET Game by ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Game by ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetGamesByChampionshipId() {
    if (!this.selectedChampionshipId) {
      this.addResult('GET Games by Championship ID', 'Échec - Aucun championnat sélectionné');
      return;
    }
    
    this.addResult('GET Games by Championship ID', `Récupération des résultats de matchs du championnat avec l'ID ${this.selectedChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getGamesByChampionshipId(this.selectedChampionshipId);
      this.addResult('GET Games by Championship ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Games by Championship ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetGamesByDayId() {
    if (!this.selectedDayId) {
      this.addResult('GET Games by Day ID', 'Échec - Aucune journée sélectionnée');
      return;
    }
    
    this.addResult('GET Games by Day ID', `Récupération des résultats de matchs de la journée avec l'ID ${this.selectedDayId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getGamesByDayId(this.selectedDayId);
      this.addResult('GET Games by Day ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Games by Day ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testCreateGame() {
    if (!this.selectedDayId || !this.selectedTeam1Id || !this.selectedTeam2Id) {
      this.addResult('CREATE Game', 'Échec - Veuillez sélectionner une journée et deux équipes');
      return;
    }
    
    if (this.selectedTeam1Id === this.selectedTeam2Id) {
      this.addResult('CREATE Game', 'Échec - Les deux équipes doivent être différentes');
      return;
    }
    
    this.addResult('CREATE Game', 'Création d\'un nouveau résultat de match...');
    this.loading = true;
    try {
      const data: any = await this.apiService.createGame(
        this.newGame, 
        this.selectedDayId, 
        this.selectedTeam1Id, 
        this.selectedTeam2Id
      );
      this.createdGameId = data.id;
      this.addResult('CREATE Game', 'Succès', data);
    } catch (error) {
      this.addResult('CREATE Game', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testUpdateGame() {
    if (!this.createdGameId) {
      this.addResult('UPDATE Game', 'Échec - Aucun résultat de match créé');
      return;
    }
    
    const updatedGame = { 
      team1Point: this.newGame.team1Point + 1, 
      team2Point: this.newGame.team2Point - 1 
    };
    
    this.addResult('UPDATE Game', `Mise à jour du résultat de match avec l'ID ${this.createdGameId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.updateGame(this.createdGameId, updatedGame);
      this.addResult('UPDATE Game', 'Succès', data);
    } catch (error) {
      this.addResult('UPDATE Game', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testDeleteGame() {
    if (!this.createdGameId) {
      this.addResult('DELETE Game', 'Échec - Aucun résultat de match créé');
      return;
    }
    
    this.addResult('DELETE Game', `Suppression du résultat de match avec l'ID ${this.createdGameId}...`);
    this.loading = true;
    try {
      await this.apiService.deleteGame(this.createdGameId);
      this.addResult('DELETE Game', 'Succès');
      this.createdGameId = undefined;
    } catch (error) {
      this.addResult('DELETE Game', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAllGameRoutes() {
    this.results = [];
    this.error = null;
    
    if (!this.selectedDayId || !this.selectedTeam1Id || !this.selectedTeam2Id) {
      this.error = 'Veuillez sélectionner une journée et deux équipes différentes pour exécuter les tests';
      return;
    }
    
    if (this.selectedTeam1Id === this.selectedTeam2Id) {
      this.error = 'Les deux équipes doivent être différentes';
      return;
    }
    
    try {
      await this.testCreateGame();
      await this.testGetAllGames();
      await this.testGetGameById();
      if (this.selectedChampionshipId) {
        await this.testGetGamesByChampionshipId();
      }
      if (this.selectedDayId) {
        await this.testGetGamesByDayId();
      }
      await this.testUpdateGame();
      await this.testDeleteGame();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Une erreur inconnue est survenue';
      console.error('Error running game tests:', e);
    }
  }
  
  addResult(operation: string, status: string, data?: any) {
    const timestamp = new Date().toLocaleTimeString();
    this.results.unshift({
      operation,
      status,
      data,
      timestamp
    });
  }
  
  clearResults() {
    this.results = [];
    this.error = null;
  }
}