import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-championship-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './championship-test.component.html',
  styleUrl: './championship-test.component.scss'
})
export class ChampionshipTestComponent {
  loading = false;
  results: any[] = [];
  error: string | null = null;
  
  // Données pour les tests
  newChampionship = {
    name: 'Test Championship',
    startDate: '2024-09-01',
    endDate: '2025-05-30',
    winPoint: 3,
    drawPoint: 1,
    lostPoint: 0
  };
  
  createdChampionshipId?: number;
  
  constructor(private apiService: ApiTestService) {}
  
  async testGetAllChampionships() {
    this.addResult('GET All Championships', 'Récupération de tous les championnats...');
    this.loading = true;
    try {
      const data = await this.apiService.getAllChampionships();
      this.addResult('GET All Championships', 'Succès', data);
    } catch (error) {
      this.addResult('GET All Championships', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetChampionshipById() {
    if (!this.createdChampionshipId) {
      this.addResult('GET Championship by ID', 'Échec - Aucun championnat créé');
      return;
    }
    
    this.addResult('GET Championship by ID', `Récupération du championnat avec l'ID ${this.createdChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getChampionshipById(this.createdChampionshipId);
      this.addResult('GET Championship by ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Championship by ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testCreateChampionship() {
    this.addResult('CREATE Championship', 'Création d\'un nouveau championnat...');
    this.loading = true;
    try {
      const data: any = await this.apiService.createChampionship(this.newChampionship);
      this.createdChampionshipId = data.id;
      this.addResult('CREATE Championship', 'Succès', data);
    } catch (error) {
      this.addResult('CREATE Championship', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testUpdateChampionship() {
    if (!this.createdChampionshipId) {
      this.addResult('UPDATE Championship', 'Échec - Aucun championnat créé');
      return;
    }
    
    const updatedChampionship = { ...this.newChampionship, name: 'Updated Championship' };
    this.addResult('UPDATE Championship', `Mise à jour du championnat avec l'ID ${this.createdChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.updateChampionship(this.createdChampionshipId, updatedChampionship);
      this.addResult('UPDATE Championship', 'Succès', data);
    } catch (error) {
      this.addResult('UPDATE Championship', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testDeleteChampionship() {
    if (!this.createdChampionshipId) {
      this.addResult('DELETE Championship', 'Échec - Aucun championnat créé');
      return;
    }
    
    this.addResult('DELETE Championship', `Suppression du championnat avec l'ID ${this.createdChampionshipId}...`);
    this.loading = true;
    try {
      await this.apiService.deleteChampionship(this.createdChampionshipId);
      this.addResult('DELETE Championship', 'Succès');
      this.createdChampionshipId = undefined;
    } catch (error) {
      this.addResult('DELETE Championship', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAllChampionshipRoutes() {
    this.results = [];
    this.error = null;
    
    try {
      await this.testCreateChampionship();
      await this.testGetAllChampionships();
      await this.testGetChampionshipById();
      await this.testUpdateChampionship();
      await this.testDeleteChampionship();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Une erreur inconnue est survenue';
      console.error('Error running championship tests:', e);
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