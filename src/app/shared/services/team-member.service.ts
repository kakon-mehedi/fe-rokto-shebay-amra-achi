import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface TeamMember {
  _id?: string;
  name: string;
  position: string;
  qualification?: string;
  description: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: any;
  updatedBy?: any;
}

export interface TeamMemberResponse {
  statusCode: number;
  data: TeamMember[] | TeamMember | any;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TeamMemberService {
  private baseUrl = `${environment.apiUrl}/team-members`;
  private teamMembersCache$: Observable<TeamMemberResponse> | null = null;
  private cacheTime = 5 * 60 * 1000; // 5 minutes cache
  private lastCacheTime = 0;

  constructor(private http: HttpClient) { }

  // Public - Get all active team members
  getAllTeamMembers(): Observable<TeamMemberResponse> {
    const now = Date.now();
    
    // Check if cache is still valid
    if (this.teamMembersCache$ && (now - this.lastCacheTime) < this.cacheTime) {
      return this.teamMembersCache$;
    }

    // Clear old cache and create new one
    this.teamMembersCache$ = this.http.get<TeamMemberResponse>(`${this.baseUrl}`).pipe(
      tap(() => {
        this.lastCacheTime = now;
      }),
      shareReplay(1) // Cache the result
    );

    return this.teamMembersCache$;
  }

  // Clear cache when data is modified
  private clearCache(): void {
    this.teamMembersCache$ = null;
    this.lastCacheTime = 0;
  }

  // Admin - Get all team members with pagination
  getAllTeamMembersForAdmin(page: number = 1, limit: number = 10, search: string = ''): Observable<TeamMemberResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<TeamMemberResponse>(`${this.baseUrl}/admin`, { params });
  }

  // Get single team member
  getTeamMemberById(id: string): Observable<TeamMemberResponse> {
    return this.http.get<TeamMemberResponse>(`${this.baseUrl}/admin/${id}`);
  }

  // Create team member
  createTeamMember(formData: FormData): Observable<TeamMemberResponse> {
    return this.http.post<TeamMemberResponse>(`${this.baseUrl}/admin/create`, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  // Update team member
  updateTeamMember(id: string, formData: FormData): Observable<TeamMemberResponse> {
    return this.http.put<TeamMemberResponse>(`${this.baseUrl}/admin/${id}`, formData).pipe(
      tap(() => this.clearCache())
    );
  }

  // Delete team member
  deleteTeamMember(id: string): Observable<TeamMemberResponse> {
    return this.http.delete<TeamMemberResponse>(`${this.baseUrl}/admin/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  // Update display order
  updateDisplayOrder(teamMembers: { id: string, displayOrder: number }[]): Observable<TeamMemberResponse> {
    return this.http.patch<TeamMemberResponse>(`${this.baseUrl}/admin/update-order`, { teamMembers });
  }
}
