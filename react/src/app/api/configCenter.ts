import { apiClient } from '../lib/apiClient';
import { endpoints } from './endpoints';

export interface ConfigCenterCurrentUser {
  id: number;
  email: string;
  apodo?: string;
  nombres: string;
  apellidos: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  telefono?: string;
  preferred_language?: string;
  avatar_url?: string;
  role?: string | null;
}

export interface ConfigCenterUser {
  id: number;
  user_company_id: number | null;
  apodo?: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string | null;
  role: string;
  department?: string | null;
  status: string;
  created_at?: string | null;
  business_id?: number | null;
  module_slugs: string[];
  is_protected: boolean;
  source: string;
}

export interface ConfigCenterCatalogModule {
  slug: string;
  name: string;
}

export interface ConfigCenterCatalogBusiness {
  id: number;
  name: string;
}

export interface ConfigCenterEmpresaMapBusiness {
  name: string;
}

export interface ConfigCenterEmpresaMapUnit {
  name: string;
  businesses: ConfigCenterEmpresaMapBusiness[];
}

export interface ConfigCenterEmpresa {
  id: number;
  nombre_empresa: string;
  logo_url?: string;
  plan_id?: number | null;
  industria?: string;
  modelo_negocio?: string;
  descripcion?: string;
  moneda?: string;
  zona_horaria?: string;
  tamano_empresa?: string;
  colaboradores?: number;
  estructura?: 'simple' | 'multi';
  empresa_template?: Record<string, unknown>;
  map?: ConfigCenterEmpresaMapUnit[];
}

interface CurrentUserResponse {
  ok: boolean;
  user: ConfigCenterCurrentUser;
}

interface UsersResponse {
  ok: boolean;
  users: ConfigCenterUser[];
  catalog: {
    businesses: ConfigCenterCatalogBusiness[];
    modules: ConfigCenterCatalogModule[];
  };
}

interface EmpresaResponse {
  ok: boolean;
  empresa: ConfigCenterEmpresa;
}

interface ConfigResponse {
  ok: boolean;
  data: {
    estructura?: 'simple' | 'multi';
    colaboradores?: number;
    empresa_template?: Record<string, unknown>;
    map?: ConfigCenterEmpresaMapUnit[];
  } | null;
}

export interface SaveStructurePayload {
  estructura: 'simple' | 'multi';
  map: Array<{
    name: string;
    businesses: Array<{ name: string }>;
  }>;
}

export interface SaveEmpresaPayload {
  nombre_empresa: string;
  industria?: string;
  descripcion?: string;
  tamano_empresa?: string;
  modelo_negocio?: string;
  moneda?: string;
  zona_horaria?: string;
}

export const configCenterApi = {
  getCurrentUser() {
    return apiClient<ConfigCenterCurrentUser>(endpoints.configCenter.currentUser);
  },

  getUsers() {
    return apiClient<{
      users: ConfigCenterUser[];
      catalog: {
        businesses: ConfigCenterCatalogBusiness[];
        modules: ConfigCenterCatalogModule[];
      };
    }>(endpoints.configCenter.users);
  },

  getEmpresa() {
    return apiClient<ConfigCenterEmpresa>(endpoints.configCenter.empresa);
  },

  getConfig() {
    return apiClient<ConfigResponse['data']>(endpoints.configCenter.config);
  },

  saveConfig(payload: SaveStructurePayload) {
    return apiClient(endpoints.configCenter.saveConfig, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  saveEmpresa(payload: SaveEmpresaPayload) {
    return apiClient(endpoints.configCenter.saveEmpresa, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
