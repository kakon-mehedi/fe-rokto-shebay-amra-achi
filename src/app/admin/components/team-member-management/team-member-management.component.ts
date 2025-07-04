import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TeamMemberService, TeamMember } from '../../../shared/services/team-member.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-team-member-management',
  templateUrl: './team-member-management.component.html',
  styleUrls: ['./team-member-management.component.scss']
})
export class TeamMemberManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('addEditDialog') addEditDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  teamMembers: TeamMember[] = [];
  filteredTeamMembers: TeamMember[] = [];
  
  teamMemberForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  isLoading = false;
  isEditing = false;
  editingId: string | null = null;
  
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  displayedColumns: string[] = ['image', 'name', 'position', 'phone', 'qualification', 'displayOrder', 'isActive', 'actions'];

  constructor(
    private fb: FormBuilder,
    private teamMemberService: TeamMemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.teamMemberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      qualification: [''],
      description: ['', [Validators.required, Validators.minLength(10)]],
      phone: ['', [Validators.pattern(/^(\+88)?01[3-9]\d{8}$/)]],
      displayOrder: [0, [Validators.min(0)]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTeamMembers(): void {
    if (this.isLoading) {
      return; // Prevent multiple concurrent requests
    }
    
    this.isLoading = true;
    this.teamMemberService.getAllTeamMembersForAdmin(this.currentPage, this.pageSize, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.teamMembers = response.data.teamMembers;
          this.filteredTeamMembers = [...this.teamMembers];
          this.totalItems = response.data.total;
          this.totalPages = response.data.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading team members:', error);
          this.showSnackBar('দল সদস্য লোড করতে সমস্যা হয়েছে', 'error');
          this.isLoading = false;
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadTeamMembers();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTeamMembers();
  }

  openAddDialog(): void {
    this.isEditing = false;
    this.editingId = null;
    this.teamMemberForm.reset();
    this.teamMemberForm.patchValue({ isActive: true, displayOrder: 0 });
    this.selectedFile = null;
    this.imagePreview = null;
    this.dialog.open(this.addEditDialog, {
      width: '600px',
      disableClose: true
    });
  }

  openEditDialog(teamMember: TeamMember): void {
    this.isEditing = true;
    this.editingId = teamMember._id!;
    this.teamMemberForm.patchValue({
      name: teamMember.name,
      position: teamMember.position,
      qualification: teamMember.qualification || '',
      description: teamMember.description,
      phone: teamMember.phone || '',
      displayOrder: teamMember.displayOrder || 0,
      isActive: teamMember.isActive
    });
    this.selectedFile = null;
    this.imagePreview = teamMember.image || null;
    this.dialog.open(this.addEditDialog, {
      width: '600px',
      disableClose: true
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.showSnackBar('শুধুমাত্র JPG, PNG, WEBP ফরম্যাটের ছবি আপলোড করুন', 'error');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showSnackBar('ছবির সাইজ ৫ MB এর কম হতে হবে', 'error');
        return;
      }

      this.selectedFile = file;

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.teamMemberForm.invalid) {
      this.teamMemberForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const formValue = this.teamMemberForm.value;

    formData.append('name', formValue.name);
    formData.append('position', formValue.position);
    formData.append('qualification', formValue.qualification || '');
    formData.append('description', formValue.description);
    formData.append('phone', formValue.phone || '');
    formData.append('displayOrder', formValue.displayOrder.toString());
    formData.append('isActive', formValue.isActive.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.isLoading = true;

    const request = this.isEditing 
      ? this.teamMemberService.updateTeamMember(this.editingId!, formData)
      : this.teamMemberService.createTeamMember(formData);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.showSnackBar(
          this.isEditing ? 'দল সদস্য সফলভাবে আপডেট হয়েছে' : 'দল সদস্য সফলভাবে যোগ করা হয়েছে',
          'success'
        );
        this.dialog.closeAll();
        this.loadTeamMembers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving team member:', error);
        this.showSnackBar('দল সদস্য সেভ করতে সমস্যা হয়েছে', 'error');
        this.isLoading = false;
      }
    });
  }

  deleteTeamMember(id: string, name: string): void {
    if (confirm(`আপনি কি নিশ্চিত যে "${name}" কে মুছে দিতে চান?`)) {
      this.isLoading = true;
      this.teamMemberService.deleteTeamMember(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.showSnackBar('দল সদস্য সফলভাবে মুছে দেওয়া হয়েছে', 'success');
            this.loadTeamMembers();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error deleting team member:', error);
            this.showSnackBar('দল সদস্য মুছতে সমস্যা হয়েছে', 'error');
            this.isLoading = false;
          }
        });
    }
  }

  toggleStatus(teamMember: TeamMember): void {
    const formData = new FormData();
    formData.append('isActive', (!teamMember.isActive).toString());

    this.teamMemberService.updateTeamMember(teamMember._id!, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          teamMember.isActive = !teamMember.isActive;
          this.showSnackBar('স্ট্যাটাস আপডেট হয়েছে', 'success');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.showSnackBar('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে', 'error');
        }
      });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onImageError(event: any): void {
    if (event.target && event.target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSA5NUw5NSA5NUw4NSA3NUwyNSA3NVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+') {
      // Use inline SVG as fallback to prevent infinite loop
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yNSA5NUw5NSA5NUw4NSA3NUwyNSA3NVoiIGZpbGw9IiNDQ0MiLz4KPC9zdmc+';
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'বন্ধ করুন', {
      duration: 3000,
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  getErrorMessage(field: string): string {
    const control = this.teamMemberForm.get(field);
    if (control?.hasError('required')) {
      return 'এই ফিল্ডটি প্রয়োজনীয়';
    }
    if (control?.hasError('minlength')) {
      return `কমপক্ষে ${control.errors?.['minlength']?.requiredLength} অক্ষর লিখুন`;
    }
    if (control?.hasError('min')) {
      return 'মান ০ বা তার বেশি হতে হবে';
    }
    if (control?.hasError('pattern') && field === 'phone') {
      return 'বৈধ বাংলাদেশী ফোন নম্বর লিখুন (যেমন: 01712345678)';
    }
    return '';
  }
}
