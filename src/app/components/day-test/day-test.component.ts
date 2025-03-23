import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-day-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './day-test.component.html',
  styleUrl: './day-test.component.scss'
})
export class DayTestComponent {
  loading = false;
  results: any[] = [];
  error: string | null = null;
  
  // Données pour les tests
  newDay = {
    number: 'Test Day'
  };
  
  createdDayId?: number;
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
  
  async testGetAllDays() {
    this.addResult('GET All Days', 'Récupération de toutes les journées...');
    this.loading = true;
    try {
      const data = await this.apiService.getAllDays();
      this.addResult('GET All Days', 'Succès', data);
    } catch (error) {
      this.addResult('GET All Days', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetDayById() {
    if (!this.createdDayId) {
      this.addResult('GET Day by ID', 'Échec - Aucune journée créée');
      return;
    }
    
    this.addResult('GET Day by ID', `Récupération de la journée avec l'ID ${this.createdDayId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getDayById(this.createdDayId);
      this.addResult('GET Day by ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Day by ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetDaysByChampionshipId() {
    if (!this.selectedChampionshipId) {
      this.addResult('GET Days by Championship ID', 'Échec - Aucun championnat sélectionné');
      return;
    }
    
    this.addResult('GET Days by Championship ID', `Récupération des journées du championnat avec l'ID ${this.selectedChampionshipId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getDaysByChampionshipId(this.selectedChampionshipId);
      this.addResult('GET Days by Championship ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET Days by Championship ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testCreateDay() {
    if (!this.selectedChampionshipId) {
      this.addResult('CREATE Day', 'Échec - Aucun championnat sélectionné');
      return;
    }
    
    this.addResult('CREATE Day', 'Création d\'une nouvelle journée...');
    this.loading = true;
    try {
      const data: any = await this.apiService.createDay(this.newDay, this.selectedChampionshipId);
      this.createdDayId = data.id;
      this.addResult('CREATE Day', 'Succès', data);
    } catch (error) {
      this.addResult('CREATE Day', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testUpdateDay() {
    if (!this.createdDayId) {
      this.addResult('UPDATE Day', 'Échec - Aucune journée créée');
      return;
    }
    
    const updatedDay = { ...this.newDay, number: 'Updated Day' };
    this.addResult('UPDATE Day', `Mise à jour de la journée avec l'ID ${this.createdDayId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.updateDay(this.createdDayId, updatedDay);
      this.addResult('UPDATE Day', 'Succès', data);
    } catch (error) {
      this.addResult('UPDATE Day', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testDeleteDay() {
    if (!this.createdDayId) {
      this.addResult('DELETE Day', 'Échec - Aucune journée créée');
      return;
    }
    
    this.addResult('DELETE Day', `Suppression de la journée avec l'ID ${this.createdDayId}...`);
    this.loading = true;
    try {
      await this.apiService.deleteDay(this.createdDayId);
      this.addResult('DELETE Day', 'Succès');
      this.createdDayId = undefined;
    } catch (error) {
      this.addResult('DELETE Day', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAllDayRoutes() {
    this.results = [];
    this.error = null;
    
    if (!this.selectedChampionshipId) {
      this.error = 'Un championnat doit être sélectionné pour exécuter les tests';
      return;
    }
    
    try {
      await this.testCreateDay();
      await this.testGetAllDays();
      await this.testGetDayById();
      await this.testGetDaysByChampionshipId();
      await this.testUpdateDay();
      await this.testDeleteDay();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Une erreur inconnue est survenue';
      console.error('Error running day tests:', e);
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