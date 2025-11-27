import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header" [class]="data.type">
        <mat-icon>{{ getIcon() }}</mat-icon>
        <h2>{{ data.title }}</h2>
      </div>
      
      <div class="dialog-content">
        <p>{{ data.message }}</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText }}
        </button>
        <button mat-raised-button 
                [class]="'btn-' + data.type + '-vibrant'"
                (click)="onConfirm()">
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      .dialog-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        border-bottom: 1px solid hsl(var(--border));
        background: white;

        mat-icon {
          font-size: 40px;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        &.danger {
          mat-icon {
            background: hsl(var(--icon-danger-bg));
            color: hsl(var(--icon-danger));
          }
        }

        &.warning {
          mat-icon {
            background: hsl(var(--icon-warning-bg));
            color: hsl(var(--icon-warning));
          }
        }

        &.info {
          mat-icon {
            background: hsl(var(--icon-info-bg));
            color: hsl(var(--icon-info));
          }
        }
      }

      .dialog-content {
        padding: 24px;
        background: white;
        
        p {
          margin: 0;
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
          font-size: 15px;
        }
      }

      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px;
        border-top: 1px solid hsl(var(--border));
        background: hsl(var(--background-secondary));

        button {
          min-width: 100px;
          height: 40px;
          font-weight: 500;
        }
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  getIcon(): string {
    const icons = {
      danger: 'warning',
      warning: 'info',
      info: 'help_outline'
    };
    return icons[this.data.type] || 'help_outline';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
