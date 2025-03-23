import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-test.component.html',
  styleUrl: './team-test.component.scss'
})
export class TeamTestComponent {
  loading = false;
  results: any[] = [];
  error: string | null = null;
  
  // Données pour les tests
  newTeam = {
    name: 'Test Team'
  };
  
  createdTeamId?: number;
  championshipIds: number[] = [];
  selectedChampionshipId?: number;
  
  constructor(private apiService: ApiTestService) {
    this.loadChampionships();
  }
  
  async loadChampionships() {
    try {
      const data: any = await this.apiService.getAllChampionships();
      if (Array.isArray(data) && data.length > 0) {
        this.championshipIds = data.map((c: any) => c.id);
        this.selectedChampionshipId = this.championshipIds[0];
      }
    } catch (error) {
      console.error('Error loading championships:', error);
    }
  }
  
  async testGetAllTeams() {
    this.addResult('GET All Teams', 'Récupération de toutes les équipes...');
    this.loading = true;
    try {
      const data = await this.apiService.getAllTeams();
      this.addResult('GET All Teams', 'Succès', data);
    } catch (error) {
      this.addResult('GET All Teams', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetTeamById() {
    if (!this.createdTeamId) {
      this.addResult('GET Team by ID', 'Échec - Aucune équipe créée');
      return;
    }
    
    this.addResult('GET Team by ID', `Récupération de l'équipe avec l'ID ${this.createdTeamId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getTeamById(this.createdTeamId);
      this.addResult('GET Team by ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Team by ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetTeamsByChampionshipId() {
    if (!this.selectedChampionshipId) {
      this.addResult('GET Teams by Championship ID', 'Échec - Aucun championnat sélectionné');
      return;
    }
    
    this.addResult('GET Teams by Championship ID', `Récupération des équipes du championnat avec l'ID ${this.selectedChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getTeamsByChampionshipId(this.selectedChampionshipId);
      this.addResult('GET Teams by Championship ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Teams by Championship ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testCreateTeam() {
    this.addResult('CREATE Team', 'Création d\'une nouvelle équipe...');
    this.loading = true;
    try {
      const data: any = await this.apiService.createTeam(this.newTeam);
      this.createdTeamId = data.id;
      this.addResult('CREATE Team', 'Succès', data);
    } catch (error) {
      this.addResult('CREATE Team', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAddTeamToChampionship() {
    if (!this.createdTeamId) {
      this.addResult('ADD Team to Championship', 'Échec - Aucune équipe créée');
      return;
    }
    
    if (!this.selectedChampionshipId) {
      this.addResult('ADD Team to Championship', 'Échec - Aucun championnat sélectionné');
      return;
    }
    
    this.addResult('ADD Team to Championship', `Ajout de l'équipe avec l'ID ${this.createdTeamId} au championnat avec l'ID ${this.selectedChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.addTeamToChampionship(this.createdTeamId, this.selectedChampionshipId);
      this.addResult('ADD Team to Championship', 'Succès', data);
    } catch (error) {
      this.addResult('ADD Team to Championship', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testUpdateTeam() {
    if (!this.createdTeamId) {
      this.addResult('UPDATE Team', 'Échec - Aucune équipe créée');
      return;
    }
    
    const updatedTeam = { ...this.newTeam, name: 'Updated Team' };
    this.addResult('UPDATE Team', `Mise à jour de l'équipe avec l'ID ${this.createdTeamId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.updateTeam(this.createdTeamId, updatedTeam);
      this.addResult('UPDATE Team', 'Succès', data);
    } catch (error) {
      this.addResult('UPDATE Team', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testDeleteTeam() {
    if (!this.createdTeamId) {
      this.addResult('DELETE Team', 'Échec - Aucune équipe créée');
      return;
    }
    
    this.addResult('DELETE Team', `Suppression de l'équipe avec l'ID ${this.createdTeamId}...`);
    this.loading = true;
    try {
      await this.apiService.deleteTeam(this.createdTeamId);
      this.addResult('DELETE Team', 'Succès');
      this.createdTeamId = undefined;
    } catch (error) {
      this.addResult('DELETE Team', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAllTeamRoutes() {
    this.results = [];
    this.error = null;
    
    try {
      await this.testCreateTeam();
      await this.testGetAllTeams();
      await this.testGetTeamById();
      if (this.selectedChampionshipId) {
        await this.testAddTeamToChampionship();
        await this.testGetTeamsByChampionshipId();
      }
      await this.testUpdateTeam();
      await this.testDeleteTeam();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Une erreur inconnue est survenue';
      console.error('Error running team tests:', e);
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