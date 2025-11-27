import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { ConfirmationService } from '../../services/confirmation.service';

interface CompanyData {
  name: string;
  tradeName: string;
  documentType: 'CPF' | 'CNPJ';
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  logo?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  companyForm!: FormGroup;
  userForm!: FormGroup;
  users: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'role', 'active', 'actions'];
  selectedLogo: File | null = null;
  logoPreview: string | null = null;

  roles = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'MANAGER', label: 'Gerente' },
    { value: 'SELLER', label: 'Vendedor' },
    { value: 'CASHIER', label: 'Caixa' }
  ];

  states = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadCompanyData();
    this.loadUsers();
  }

  initForms(): void {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      tradeName: ['', Validators.required],
      documentType: ['CNPJ', Validators.required],
      document: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]]
    });

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['SELLER', Validators.required],
      active: [true]
    });
  }

  loadCompanyData(): void {
    const stored = localStorage.getItem('company_data');
    if (stored) {
      const data = JSON.parse(stored);
      this.companyForm.patchValue(data);
      if (data.logo) {
        this.logoPreview = data.logo;
      }
    }
  }

  loadUsers(): void {
    const stored = localStorage.getItem('users');
    if (stored) {
      this.users = JSON.parse(stored);
    } else {
      // Usuário admin padrão
      this.users = [
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@vendamax.com',
          role: 'ADMIN',
          active: true,
          createdAt: new Date()
        }
      ];
      this.saveUsers();
    }
  }

  saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  onLogoSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogo = file;
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveCompanyData(): void {
    if (this.companyForm.valid) {
      const companyData: CompanyData = {
        ...this.companyForm.value,
        logo: this.logoPreview || undefined
      };

      localStorage.setItem('company_data', JSON.stringify(companyData));
      this.showSnackBar('Dados da empresa salvos com sucesso!');
    } else {
      this.showSnackBar('Preencha todos os campos obrigatórios!', 'error');
    }
  }

  addUser(): void {
    if (this.userForm.valid) {
      const newUser: User = {
        id: Date.now(),
        ...this.userForm.value,
        createdAt: new Date()
      };

      // Verificar se email já existe
      if (this.users.some(u => u.email === newUser.email)) {
        this.showSnackBar('Email já cadastrado!', 'error');
        return;
      }

      this.users.push(newUser);
      this.saveUsers();
      this.userForm.reset({
        role: 'SELLER',
        active: true
      });
      this.showSnackBar('Usuário adicionado com sucesso!');
    } else {
      this.showSnackBar('Preencha todos os campos obrigatórios!', 'error');
    }
  }

  toggleUserStatus(user: User): void {
    user.active = !user.active;
    this.saveUsers();
    this.showSnackBar(`Usuário ${user.active ? 'ativado' : 'desativado'}!`);
  }

  deleteUser(user: User): void {
    if (user.role === 'ADMIN' && this.users.filter(u => u.role === 'ADMIN').length === 1) {
      this.showSnackBar('Não é possível excluir o único administrador!', 'error');
      return;
    }

    this.confirmationService.confirmDelete(user.name, 'usuário').subscribe(confirmed => {
      if (confirmed) {
        this.users = this.users.filter(u => u.id !== user.id);
        this.saveUsers();
        this.showSnackBar('Usuário excluído com sucesso!');
      }
    });
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  formatDocument(event: any): void {
    const docType = this.companyForm.get('documentType')?.value;
    let value = event.target.value.replace(/\D/g, '');
    
    if (docType === 'CPF' && value.length <= 11) {
      // Formato CPF: 000.000.000-00
      value = value.replace(/^(\d{3})(\d)/, '$1.$2');
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');
      this.companyForm.patchValue({ document: value }, { emitEvent: false });
    } else if (docType === 'CNPJ' && value.length <= 14) {
      // Formato CNPJ: 00.000.000/0000-00
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      this.companyForm.patchValue({ document: value }, { emitEvent: false });
    }
  }

  onDocumentTypeChange(): void {
    // Limpar o campo ao trocar o tipo
    this.companyForm.patchValue({ document: '' });
  }

  formatZipCode(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      this.companyForm.patchValue({ zipCode: value }, { emitEvent: false });
    }
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
      this.companyForm.patchValue({ phone: value }, { emitEvent: false });
    }
  }

  showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
