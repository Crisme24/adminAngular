import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  HttpClientModule } from '@angular/common/http';

import { LoginGuardGuard } from './guards/login-guard.guard';
import { UsuarioService } from './usuario/usuario.service';
import { SettingsService } from './settings/settings.service';
import { SharedService } from './shared/shared.service';
import { SidebarService } from './shared/sidebar.service';
import { UploadFilesService } from './upload/upload-files.service';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { HospitalService } from './hospital/hospital.service';
import { MedicoService } from './medico/medico.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    HospitalService,
    LoginGuardGuard,
    MedicoService,
    ModalUploadService,
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    UploadFilesService
  ]
})
export class ServiceModule { }
