import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-test.component.html',
  styleUrl: './user-test.component.scss'
})
export class UserTestComponent {
  loading = false;
  results: any[] = [];
  error: string | null = null;
  
  // Données pour les tests
  newUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test.user@example.com',
    password: 'password123'
  };
  
  createdUserId?: number;
  
  constructor(private apiService: ApiTestService) {}
  
  async testGetAllUsers() {
    this.addResult('GET All Users', 'Récupération de tous les utilisateurs...');
    this.loading = true;
    try {
      const data = await this.apiService.getAllUsers();
      this.addResult('GET All Users', 'Succès', data);
    } catch (error) {
      this.addResult('GET All Users', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetUserById() {
    if (!this.createdUserId) {
      this.addResult('GET User by ID', 'Échec - Aucun utilisateur créé');
      return;
    }
    
    this.addResult('GET User by ID', `Récupération de l'utilisateur avec l'ID ${this.createdUserId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getUserById(this.createdUserId);
      this.addResult('GET User by ID', 'Succès', data);
    } catch (error) {
      this.addResult('GET User by ID', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testGetUserByEmail() {
    this.addResult('GET User by Email', `Récupération de l'utilisateur avec l'email ${this.newUser.email}...`);
    this.loading = true;
    try {
      const data = await this.apiService.getUserByEmail(this.newUser.email);
      this.addResult('GET User by Email', 'Succès', data);
    } catch (error) {
      this.addResult('GET User by Email', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testCreateUser() {
    this.addResult('CREATE User', 'Création d\'un nouvel utilisateur...');
    this.loading = true;
    try {
      const data: any = await this.apiService.createUser(this.newUser);
      this.createdUserId = data.id;
      this.addResult('CREATE User', 'Succès', data);
    } catch (error) {
      this.addResult('CREATE User', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testUpdateUser() {
    if (!this.createdUserId) {
      this.addResult('UPDATE User', 'Échec - Aucun utilisateur créé');
      return;
    }
    
    const updatedUser = { ...this.newUser, firstName: 'Updated' };
    this.addResult('UPDATE User', `Mise à jour de l'utilisateur avec l'ID ${this.createdUserId}...`);
    this.loading = true;
    try {
      const data = await this.apiService.updateUser(this.createdUserId, updatedUser);
      this.addResult('UPDATE User', 'Succès', data);
    } catch (error) {
      this.addResult('UPDATE User', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testDeleteUser() {
    if (!this.createdUserId) {
      this.addResult('DELETE User', 'Échec - Aucun utilisateur créé');
      return;
    }
    
    this.addResult('DELETE User', `Suppression de l'utilisateur avec l'ID ${this.createdUserId}...`);
    this.loading = true;
    try {
      await this.apiService.deleteUser(this.createdUserId);
      this.addResult('DELETE User', 'Succès');
      this.createdUserId = undefined;
    } catch (error) {
      this.addResult('DELETE User', 'Échec', error);
    }
    this.loading = false;
  }
  
  async testAllUserRoutes() {
    this.results = [];
    this.error = null;
    
    try {
      await this.testCreateUser();
      await this.testGetAllUsers();
      await this.testGetUserById();
      await this.testGetUserByEmail();
      await this.testUpdateUser();
      await this.testDeleteUser();
    } catch (e) {
      this.error = e instanceof Error ? e.message : 'Une erreur inconnue est survenue';
      console.error('Error running user tests:', e);
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