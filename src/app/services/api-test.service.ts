import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiTestService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // ======= API UTILISATEURS =======
  async getAllUsers() {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users`));
  }

  async getUserById(id: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users/${id}`));
  }

  async getUserByEmail(email: string) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/users/email/${email}`));
  }

  async createUser(user: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/users`, user));
  }

  async updateUser(id: number, user: any) {
    return firstValueFrom(this.http.put(`${this.baseUrl}/users/${id}`, user));
  }

  async deleteUser(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/users/${id}`));
  }

  // ======= API CHAMPIONNATS =======
  async getAllChampionships() {
    return firstValueFrom(this.http.get(`${this.baseUrl}/championships`));
  }

  async getChampionshipById(id: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/championships/${id}`));
  }

  async createChampionship(championship: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/championships`, championship));
  }

  async updateChampionship(id: number, championship: any) {
    return firstValueFrom(this.http.put(`${this.baseUrl}/championships/${id}`, championship));
  }

  async deleteChampionship(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/championships/${id}`));
  }

  // ======= API ÉQUIPES =======
  async getAllTeams() {
    return firstValueFrom(this.http.get(`${this.baseUrl}/teams`));
  }

  async getTeamById(id: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/teams/${id}`));
  }

  async getTeamsByChampionshipId(championshipId: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/teams/championship/${championshipId}`));
  }

  async createTeam(team: any) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/teams`, team));
  }

  async addTeamToChampionship(teamId: number, championshipId: number) {
    return firstValueFrom(this.http.post(`${this.baseUrl}/teams/${teamId}/championships/${championshipId}`, {}));
  }

  async updateTeam(id: number, team: any) {
    return firstValueFrom(this.http.put(`${this.baseUrl}/teams/${id}`, team));
  }

  async deleteTeam(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/teams/${id}`));
  }

  // ======= API JOURNÉES =======
  async getAllDays() {
    return firstValueFrom(this.http.get(`${this.baseUrl}/days`));
  }

  async getDayById(id: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/days/${id}`));
  }

  async getDaysByChampionshipId(championshipId: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/days/championship/${championshipId}`));
  }

  async createDay(day: any, championshipId: number) {
    // Ajouter la référence au championnat dans le corps de la requête
    const completeDay = {
      ...day,
      championship: { id: championshipId }
    };
    
    return firstValueFrom(this.http.post(`${this.baseUrl}/days/championship/${championshipId}`, completeDay));
  }

  async updateDay(id: number, day: any) {
    // D'abord récupérer la journée existante pour obtenir la référence au championnat
    const existingDay = await this.getDayById(id);
    
    // Créer un objet complet avec la référence au championnat
    const completeDay = {
      ...existingDay,
      number: day.number
    };
    
    return firstValueFrom(this.http.put(`${this.baseUrl}/days/${id}`, completeDay));
  }

  async deleteDay(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/days/${id}`));
  }

  // ======= API MATCHS =======
  async getAllGames() {
    return firstValueFrom(this.http.get(`${this.baseUrl}/games`));
  }

  async getGameById(id: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/games/${id}`));
  }

  async getGamesByChampionshipId(championshipId: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/games/championship/${championshipId}`));
  }

  async getGamesByDayId(dayId: number) {
    return firstValueFrom(this.http.get(`${this.baseUrl}/games/day/${dayId}`));
  }

  async createGame(game: any, dayId: number, team1Id: number, team2Id: number) {
    // Créer un objet complet avec les références aux entités
    const completeGame = {
      ...game,
      day: { id: dayId },
      team1: { id: team1Id },
      team2: { id: team2Id }
    };
    
    return firstValueFrom(this.http.post(`${this.baseUrl}/games/day/${dayId}/team1/${team1Id}/team2/${team2Id}`, completeGame));
  }

  async updateGame(id: number, game: any) {
    // D'abord récupérer le jeu existant pour obtenir les références team1, team2 et day
    const existingGame = await this.getGameById(id);
    
    // Créer un objet complet avec les références aux entités
    const completeGame = {
      ...existingGame,
      team1Point: game.team1Point,
      team2Point: game.team2Point
    };
    
    return firstValueFrom(this.http.put(`${this.baseUrl}/games/${id}`, completeGame));
  }

  async deleteGame(id: number) {
    return firstValueFrom(this.http.delete(`${this.baseUrl}/games/${id}`));
  }
}