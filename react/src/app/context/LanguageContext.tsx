import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
  greetings: {
    morning: string;
    afternoon: string;
    evening: string;
  };
}

export const languages: Language[] = [
  {
    code: 'es-MX',
    name: 'Español (México)',
    flag: '🇲🇽',
    greetings: {
      morning: 'Buenos días',
      afternoon: 'Buenas tardes',
      evening: 'Buenas noches',
    },
  },
  {
    code: 'es-CO',
    name: 'Español (Colombia)',
    flag: '🇨🇴',
    greetings: {
      morning: 'Buenos días',
      afternoon: 'Buenas tardes',
      evening: 'Buenas noches',
    },
  },
  {
    code: 'en-US',
    name: 'English (USA)',
    flag: '🇺🇸',
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
  },
  {
    code: 'en-CA',
    name: 'English (Canada)',
    flag: '🇨🇦',
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
    },
  },
  {
    code: 'fr-CA',
    name: 'Français (Québec)',
    flag: '🇨🇦',
    greetings: {
      morning: 'Bonjour',
      afternoon: 'Bon après-midi',
      evening: 'Bonsoir',
    },
  },
  {
    code: 'pt-BR',
    name: 'Português (Brasil)',
    flag: '🇧🇷',
    greetings: {
      morning: 'Bom dia',
      afternoon: 'Boa tarde',
      evening: 'Boa noite',
    },
  },
  {
    code: 'ko-CA',
    name: '한국어 (캐나다)',
    flag: '🇨🇦',
    greetings: {
      morning: '좋은 아침',
      afternoon: '좋은 오후',
      evening: '좋은 저녁',
    },
  },
  {
    code: 'zh-CA',
    name: '中文 (加拿大)',
    flag: '🇨🇦',
    greetings: {
      morning: '早上好',
      afternoon: '下午好',
      evening: '晚上好',
    },
  },
];

type TranslationDictionary = {
    header: {
      notifications: string;
      profile: string;
      settings: string;
      logout: string;
      learningMode: string;
    };
    sections: {
      kpis: string;
      favorites: string;
      quickAccess: string;
      basicModules: string;
      main: string;
      complementaryModules: string;
      additional: string;
      aiModules: string;
      aiLabel: string;
      configureKpis: string;
    };
    kpis: {
      weeklyRevenue: string;
      netProfit: string;
      activeClients: string;
      activeEmployees: string;
      pendingTasks: string;
      monthlyExpenses: string;
      vsWeekBefore: string;
      thisMonth: string;
      newOnes: string;
      dueToday: string;
      vsMonthBefore: string;
    };
    modules: {
      panelInicial: string;
      recursosHumanos: string;
      procesosTareas: string;
      gastos: string;
      cajaChica: string;
      puntoVenta: string;
      ventas: string;
      kpis: string;
      mantenimiento: string;
      inventarios: string;
      controlMinutas: string;
      limpieza: string;
      lavanderia: string;
      transportacion: string;
      vehiculosMaquinaria: string;
      inmuebles: string;
      formularios: string;
      facturacion: string;
      correoElectronico: string;
      climaLaboral: string;
      indiceAgenteVentas: string;
      indiceAnalitica: string;
      capacitacion: string;
      indiceCoach: string;
    };
    notifications: {
      newTask: string;
      expensePending: string;
      newClient: string;
      timeAgo: {
        minutes: string;
        hour: string;
        hours: string;
      };
    };
    loginPage: {
      workspaceBadge: string;
      accessBadge: string;
      title: string;
      subtitle: string;
      modulePills: string[];
      featureCards: Array<{
        title: string;
        description: string;
      }>;
      welcomeTitle: string;
      welcomeText: string;
      emailLabel: string;
      emailPlaceholder: string;
      emailError: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      hidePassword: string;
      showPassword: string;
      signIn: string;
      signingIn: string;
      errorFallback: string;
      insideTitle: string;
      insideText: string;
    };
    learningMode: {
      welcome: string;
      hide: string;
      show: string;
      businessBase: string;
      clearBusinessStable: string;
      functions: string;
      businessContext: string;
      indiceMethodology: string;
      addModule: string;
      viewBasicModules: string;
      previous: string;
      next: string;
      stepOf: string;
      modules: {
        panelInicial: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        recursosHumanos: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        procesosTareas: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        gastos: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        cajaChica: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        puntoVenta: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        ventas: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
        kpis: {
          title: string;
          subtitle: string;
          description: string;
          functions: string[];
          context: string;
          quote: string;
        };
      };
    };
    panelInicial: {
      title: string;
      back: string;
      tabs: {
        profile: string;
        businessStructure: string;
        businessProfile: string;
        billing: string;
        plan: string;
        users: string;
      };
      structure: {
        title: string;
        subtitle: string;
        mode: {
          simple: string;
          multi: string;
          simpleTitle: string;
          simpleDescription: string;
          multiTitle: string;
          multiDescription: string;
          switchPrompt: string;
          switchAction: string;
          multiNote: string;
        };
        identity: {
          simple: string;
          holding: string;
          simpleDesc: string;
          holdingDesc: string;
        };
        fields: {
          companyName: string;
          holdingName: string;
          industry: string;
          selectIndustry: string;
          country: string;
          selectCountry: string;
          logo: string;
          logoHolding: string;
          uploadImage: string;
          description: string;
          optional: string;
        };
        units: {
          title: string;
          description: string;
          addUnit: string;
          addBusiness: string;
          unitName: string;
          unitCountry: string;
          businessName: string;
        };
        modal: {
          newUnit: string;
          editUnit: string;
          newBusiness: string;
          editBusiness: string;
          save: string;
          cancel: string;
          delete: string;
        };
      };
      profile: {
        title: string;
        subtitle: string;
        fields: {
          fullName: string;
          email: string;
          phone: string;
          position: string;
          department: string;
          profilePhoto: string;
          uploadPhoto: string;
        };
        save: string;
      };
      users: {
        title: string;
        subtitle: string;
        invite: string;
        search: string;
        filters: {
          all: string;
          active: string;
          pending: string;
          inactive: string;
        };
        roles: {
          superAdmin: string;
          admin: string;
          user: string;
        };
        status: {
          active: string;
          pending: string;
          inactive: string;
        };
        table: {
          name: string;
          email: string;
          role: string;
          status: string;
          modules: string;
          actions: string;
        };
        actions: {
          edit: string;
          resend: string;
          delete: string;
        };
        modal: {
          newUser: string;
          editUser: string;
          name: string;
          email: string;
          role: string;
          selectRole: string;
          modules: string;
          selectModules: string;
          inviteLink: string;
          copyLink: string;
          copied: string;
          save: string;
          cancel: string;
          send: string;
        };
      };
      plan: {
        title: string;
        subtitle: string;
        mostPopular?: string;
        plans?: {
          inicio: {
            name: string;
            description: string;
            button: string;
          };
          controla: {
            name: string;
            description: string;
            button: string;
          };
          escala: {
            name: string;
            description: string;
            button: string;
          };
          corporativiza: {
            name: string;
            description: string;
            button: string;
          };
        };
        features?: {
          humanResources: string;
          processes: string;
          products: string;
          finance: string;
          kpisBasic: string;
          kpisComplete: string;
          kpisAdvanced: string;
          kpisCorporate: string;
          users5: string;
          users10: string;
          users20: string;
          users25: string;
          complementaryModules: string;
          modules2: string;
          modules4: string;
          allModules: string;
          aiAnalytics: string;
          integrations: string;
          sessions1: string;
          sessions2: string;
          sessions4: string;
        };
        additionalInfo?: {
          title: string;
          extraUser: string;
          extraUserPrice: string;
          learningMode: string;
          learningModeDesc: string;
          updates: string;
          updatesDesc: string;
        };
      };
      billing: {
        title: string;
        subtitle: string;
        fiscalData: {
          title: string;
          subtitle: string;
          country: string;
          selectCountry: string;
          // México
          rfc: string;
          razonSocial: string;
          regimenFiscal: string;
          usoCFDI: string;
          codigoPostalFiscal: string;
          // Colombia
          nit: string;
          responsabilidadFiscal: string;
          // Brasil
          cnpjCpf: string;
          razaoSocial: string;
          inscricaoEstadual: string;
          // USA
          ein: string;
          legalName: string;
          state: string;
          // Canadá
          businessNumber: string;
          province: string;
          // Genéricos
          taxId: string;
          companyName: string;
          taxRegime: string;
          postalCode: string;
        };
        paymentMethod: {
          title: string;
          subtitle: string;
          type: string;
          selectMethod: string;
          cardNumber: string;
          cvv: string;
          expirationDate: string;
          cardholderName: string;
          addCard: string;
          cancel: string;
          savedCards: string;
          defaultCard: string;
          saveCard: string;
          placeholder: {
            cardNumber: string;
            cvv: string;
            expirationDate: string;
            cardholderName: string;
          };
        };
        automaticBilling: {
          title: string;
          subtitle: string;
          enable: string;
          description: string;
          billingDay: string;
          selectDay: string;
          emailForInvoices: string;
          reminderNote: string;
        };
        currentBilling: {
          title: string;
          plan: string;
          notConfigured: string;
          amount: string;
          nextPayment: string;
        };
        invoices: {
          title: string;
          subtitle: string;
          month: string;
          year: string;
          status: string;
          downloadPdf: string;
          date: string;
          concept: string;
          amount: string;
          paid: string;
          pending: string;
        };
        billingFrequency: {
          title: string;
          note: string;
          monthly: string;
          quarterly: string;
          semiannual: string;
          annual: string;
        };
      };
      diagnosis: {
        title: string;
        description: string;
        centerTitle: string;
        centerDescription: string;
        questionCount: string;
        progress: string;
        progressOf: string;
        printDiagnosis: string;
        start: string;
        continue: string;
        doAgain: string;
        close: string;
        question: string;
        of: string;
        completed: string;
        previous: string;
        next: string;
        finish: string;
        restart: string;
        pillars: {
          people: {
            title: string;
            description: string;
          };
          processes: {
            title: string;
            description: string;
          };
          products: {
            title: string;
            description: string;
          };
          finance: {
            title: string;
            description: string;
          };
        };
        questions: {
          people: Array<{
            question: string;
            options: string[];
          }>;
          processes: Array<{
            question: string;
            options: string[];
          }>;
          products: Array<{
            question: string;
            options: string[];
          }>;
          finance: Array<{
            question: string;
            options: string[];
          }>;
        };
      };
    };
};

interface Translations {
  [key: string]: TranslationDictionary;
}

const translations: Translations = {
  'es-MX': {
    header: {
      notifications: 'Notificaciones',
      profile: 'Mi perfil',
      settings: 'Configuración',
      logout: 'Cerrar sesión',
      learningMode: 'Modo aprendiz',
    },
    sections: {
      kpis: 'Tus KPIs',
      favorites: 'Tus favoritos',
      quickAccess: 'Accesos rápidos',
      basicModules: 'Módulos básicos',
      main: 'Principales',
      complementaryModules: 'Módulos complementarios',
      additional: 'Adicionales',
      aiModules: 'Inteligencia artificial',
      aiLabel: 'Módulos de IA',
      configureKpis: 'Configurar KPIs',
    },
    kpis: {
      weeklyRevenue: 'Ventas Semanales',
      netProfit: 'Utilidad Neta',
      activeClients: 'Clientes Activos',
      activeEmployees: 'Empleados Activos',
      pendingTasks: 'Tareas Pendientes',
      monthlyExpenses: 'Gastos del Mes',
      vsWeekBefore: 'vs semana anterior',
      thisMonth: 'este mes',
      newOnes: 'nuevos',
      dueToday: 'vencen hoy',
      vsMonthBefore: 'vs mes anterior',
    },
    modules: {
      panelInicial: 'Panel Inicial',
      recursosHumanos: 'Recursos Humanos',
      procesosTareas: 'Procesos y tareas',
      gastos: 'Gastos',
      cajaChica: 'Caja chica',
      puntoVenta: 'Punto de venta',
      ventas: 'Ventas',
      kpis: 'KPIs',
      mantenimiento: 'Mantenimiento',
      inventarios: 'Inventarios',
      controlMinutas: 'Control de minutas',
      limpieza: 'Limpieza',
      lavanderia: 'Lavandería',
      transportacion: 'Transportación',
      vehiculosMaquinaria: 'Vehículos y maquinaria',
      inmuebles: 'Inmuebles',
      formularios: 'Formularios',
      facturacion: 'Facturación',
      correoElectronico: 'Correo electrónico',
      climaLaboral: 'Clima laboral',
      indiceAgenteVentas: 'Índice Agente de Ventas',
      indiceAnalitica: 'Índice Analítica',
      capacitacion: 'Capacitación',
      indiceCoach: 'Índice Coach',
    },
    notifications: {
      newTask: 'Nueva tarea asignada',
      expensePending: 'Gasto pendiente de aprobar',
      newClient: 'Nuevo cliente registrado',
      timeAgo: {
        minutes: 'Hace 5 minutos',
        hour: 'Hace 1 hora',
        hours: 'Hace 2 horas',
      },
    },
    loginPage: {
      workspaceBadge: 'Espacio de trabajo Indice',
      accessBadge: 'Acceso Indice',
      title: 'Inicia sesión en tu espacio de trabajo Indice',
      subtitle:
        'Indice conecta la estructura de tu negocio, tu equipo, tus gastos, tus controles y la ejecución diaria en una sola plataforma para equipos operativos reales.',
      modulePills: ['Dashboard', 'Recursos Humanos', 'Gastos', 'Analítica'],
      featureCards: [
        {
          title: 'Un espacio para todo el equipo',
          description: 'Muévete de finanzas a operaciones, personal, ventas y analítica sin perder contexto.',
        },
        {
          title: 'Claridad desde la primera pantalla',
          description: 'Abre Indice y ve de inmediato los módulos, métricas y flujos que importan para tu negocio.',
        },
      ],
      welcomeTitle: 'Bienvenido de nuevo',
      welcomeText:
        'Inicia sesión para entrar al dashboard de Indice, donde tus módulos, flujos de trabajo y la visibilidad operativa viven en un solo lugar.',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@empresa.com',
      emailError: 'Ingresa un correo electrónico válido.',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Escribe tu contraseña',
      hidePassword: 'Ocultar contraseña',
      showPassword: 'Mostrar contraseña',
      signIn: 'Iniciar sesión',
      signingIn: 'Ingresando...',
      errorFallback: 'No fue posible iniciar sesión.',
      insideTitle: 'Lo que te espera dentro',
      insideText:
        'Después de iniciar sesión, Indice te lleva directo al dashboard principal para moverte entre módulos, monitorear actividad y mantener alineada cada parte del negocio.',
    },
    learningMode: {
      welcome: '¡Bienvenido al modo de aprendizaje!',
      hide: 'Ocultar',
      show: 'Mostrar',
      businessBase: 'Base de negocios',
      clearBusinessStable: 'Limpiar base de negocios estable',
      functions: 'Funciones',
      businessContext: 'Contexto de negocio',
      indiceMethodology: 'Metodología Índice',
      addModule: 'Abrir',
      viewBasicModules: 'Ver módulos básicos',
      previous: 'Anterior',
      next: 'Siguiente',
      stepOf: 'Paso de',
      modules: {
        panelInicial: {
          title: 'Panel Inicial',
          subtitle: '🎯 Tu punto de partida',
          description: 'El Panel Inicial es el punto de partida para organizar tu empresa dentro del sistema Índice. 🏢 Aquí defines la información básica de tu negocio y configuras la estructura que permitirá que todos los demás módulos funcionen correctamente. ✨ Cuando esta base está bien configurada, el sistema puede ayudarte a gestionar personas, procesos, productos y finanzas con mayor claridad.',
          functions: [
            '📊 Actualizar los datos de tu empresa y mantener tu información siempre al día.',
            '⚙️ Configurar las preferencias del sistema, como idioma, moneda y ajustes operativos.',
            '📋 Definir la información básica del negocio que utilizarán los demás módulos.',
            '🏗️ Establecer la estructura de tu empresa y cómo está organizada su operación.',
            '👥 Invitar usuarios y administrar sus accesos, asignando roles y permisos a cada colaborador.',
            '🎓 Realizar evaluaciones iniciales del negocio que te ayudarán a entender en qué etapa se encuentra tu empresa.',
            '📈 Calcular el IME — Índice de Madurez Empresarial, una herramienta que analiza el estado actual de tu negocio y te orienta sobre cómo mejorar su gestión.',
          ],
          context: '💡 Este módulo te permite tener una visión general de tu empresa y comenzar a estructurar cómo funciona tu negocio. Cuando esta base está bien definida, todos los demás procesos del sistema se vuelven más claros y fáciles de administrar.',
          quote: '🏆 La organización es el primer paso para construir un negocio sólido.',
        },
        recursosHumanos: {
          title: 'Recursos Humanos',
          subtitle: 'Administra tu equipo',
          description: 'Gestiona la información de tus empleados y recursos humanos.',
          functions: ['Ver empleados', 'Administrar contratos'],
          context: 'Este módulo te permite administrar eficazmente a tu equipo.',
          quote: 'El talento es la clave para el éxito.',
        },
        procesosTareas: {
          title: 'Procesos y tareas',
          subtitle: 'Organiza tu trabajo',
          description: 'Administra y realiza tareas y procesos importantes para tu negocio.',
          functions: ['Crear tareas', 'Ver procesos'],
          context: 'Este módulo te ayuda a mantener tu negocio organizado.',
          quote: 'La organización es la clave para la eficiencia.',
        },
        gastos: {
          title: 'Gastos',
          subtitle: 'Controla tus gastos',
          description: 'Administra y controla tus gastos para mantener tu negocio en buen estado.',
          functions: ['Ver gastos', 'Aprobar gastos'],
          context: 'Este módulo te permite controlar tus gastos de manera efectiva.',
          quote: 'El control de gastos es fundamental para el éxito.',
        },
        cajaChica: {
          title: 'Caja chica',
          subtitle: 'Gastos menores',
          description: 'Administra gastos menores para tu negocio.',
          functions: ['Ver caja chica', 'Aprobar gastos'],
          context: 'Este módulo te permite gestionar gastos menores de manera eficiente.',
          quote: 'La caja chica es esencial para gastos menores.',
        },
        puntoVenta: {
          title: 'Punto de venta',
          subtitle: 'Vende tus productos',
          description: 'Administra y realiza ventas para tu negocio.',
          functions: ['Realizar ventas', 'Ver ventas'],
          context: 'Este módulo te permite vender tus productos de manera eficiente.',
          quote: 'La venta es la clave para el éxito.',
        },
        ventas: {
          title: 'Ventas',
          subtitle: 'Administra tus ventas',
          description: 'Gestiona y analiza tus ventas para mejorar tu negocio.',
          functions: ['Ver ventas', 'Analizar ventas'],
          context: 'Este módulo te permite administrar y analizar tus ventas.',
          quote: 'Las ventas son la base de tu negocio.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Métricas clave',
          description: 'Administra y analiza tus KPIs para mejorar tu negocio.',
          functions: ['Ver KPIs', 'Configurar KPIs'],
          context: 'Este módulo te permite administrar y analizar tus KPIs.',
          quote: 'Los KPIs son esenciales para el seguimiento del rendimiento.',
        },
      },
    },
    panelInicial: {
      title: 'Panel Inicial',
      back: 'Regresar',
      tabs: {
        profile: 'Perfil',
        businessStructure: 'Estructura Empresarial',
        businessProfile: 'Perfil empresarial',
        billing: 'Facturación',
        plan: 'Plan',
        users: 'Usuarios',
      },
      diagnosis: {
        title: 'Diagnóstico empresarial',
        description: 'Ayúdanos a conocer mejor tu empresa y la etapa de gestión para personalizar Índice.',
        centerTitle: 'Centro de diagnóstico empresarial',
        centerDescription: 'Descubre el estado de gestión de tu empresa a través de 4 pilares: Personas, Procesos, Productos y Finanzas. Con las respuestas utilizaremos los índices de Madurez Empresarial (IME), que nos ayudará a personalizar recomendaciones, módulos y mejores compañeros detrás de Índice.',
        questionCount: '10 preguntas cada uno',
        progress: 'Progreso del diagnóstico empresarial',
        progressOf: 'completado',
        printDiagnosis: 'Imprimir diagnóstico',
        start: 'Comenzar',
        continue: 'Continuar',
        doAgain: 'Hacer de nuevo',
        close: 'Cerrar',
        question: 'Pregunta',
        of: 'de',
        completed: 'completadas',
        previous: 'Anterior',
        next: 'Siguiente',
        finish: 'Finalizar',
        restart: 'Reiniciar diagnóstico',
        pillars: {
          people: {
            title: 'Personas',
            description: 'Analiza talentos, estructura de equipo y comunicación.',
          },
          processes: {
            title: 'Procesos',
            description: 'Evalúa flujos, tareas, escalabilidad y eficiencia.',
          },
          products: {
            title: 'Productos',
            description: 'Analiza oferta, mercado, comercial y propuesta de valor.',
          },
          finance: {
            title: 'Finanzas',
            description: 'Evalúa control financiero, gestión y toma de decisiones.',
          },
        },
        questions: {
          people: [
            { question: '¿Cuál es tu rol principal?', options: ['Fundador/CEO', 'Operaciones', 'Finanzas', 'Comercial/Otro'] },
            { question: '¿Cuántas personas trabajan?', options: ['Solo yo', '2 a 5', '6 a 20', '21 o más'] },
            { question: '¿Cómo está organizado tu equipo?', options: ['Sin estructura', 'Roles básicos', 'Áreas definidas', 'Organigrama formal'] },
            { question: '¿Cómo asignan tareas?', options: ['Improvisado', 'Listas', 'Asignación estructurada', 'Sistema de gestión'] },
            { question: '¿Revisión de desempeño?', options: ['Nunca', 'Por problemas', 'Semanal', 'Con KPIs'] },
            { question: '¿Delegación?', options: ['Hago todo', 'Delego y superviso', 'Delego con control', 'Equipo autónomo'] },
            { question: '¿Comunicación interna?', options: ['Informal', 'Chat', 'Reuniones', 'Herramientas formales'] },
            { question: '¿Frecuencia de reuniones?', options: ['Nunca', 'Esporádico', 'Semanal', 'Frecuente'] },
            { question: '¿Claridad de responsabilidades?', options: ['Nada clara', 'Algo clara', 'Bastante clara', 'Totalmente clara'] },
            { question: '¿Facilidad de integración?', options: ['Muy difícil', 'Difícil', 'Moderado', 'Fácil'] },
          ],
          processes: [
            { question: '¿Procesos documentados?', options: ['Nada', 'Algunos', 'Mayoría', 'Totalmente'] },
            { question: '¿Gestión de tareas?', options: ['Improvisado', 'Listas', 'Herramientas', 'Sistema formal'] },
            { question: '¿Monitoreo de avance?', options: ['No se monitorea', 'Ocasional', 'Reportes', 'KPIs'] },
            { question: '¿Automatización?', options: ['Manual', 'Herramientas aisladas', 'Automatización parcial', 'Alta automatización'] },
            { question: '¿Replicabilidad?', options: ['Muy difícil', 'Con esfuerzo', 'Posible', 'Fácil'] },
            { question: '¿Dónde se pierde tiempo?', options: ['Manual', 'Coordinación', 'Información', 'Seguimiento'] },
            { question: '¿Dependencia de personas?', options: ['Total', 'Bastante', 'Algo', 'Poco'] },
            { question: '¿Claridad de procesos?', options: ['Nada claros', 'Algo claros', 'Bastante claros', 'Totalmente claros'] },
            { question: '¿Gestión de errores?', options: ['Reacción', 'Informal', 'Revisión', 'Mejora continua'] },
            { question: '¿Escalabilidad?', options: ['Nula', 'Baja', 'Media', 'Alta'] },
          ],
          products: [
            { question: '¿Qué vendes?', options: ['Servicios', 'Productos', 'Digital', 'Mixto'] },
            { question: '¿Tipo de cliente?', options: ['B2C', 'B2B', 'Gobierno', 'Mixto'] },
            { question: '¿Ingresos principales?', options: ['Venta directa', 'Servicios', 'Suscripción', 'Contratos'] },
            { question: '¿Diversificación?', options: ['Uno', 'Algunos', 'Varias líneas', 'Amplio'] },
            { question: '¿Definición de precios?', options: ['Intuición', 'Competencia', 'Costos', 'Estrategia'] },
            { question: '¿Seguimiento desempeño?', options: ['No se mide', 'Solo ventas', 'Ventas+rentabilidad', 'Indicadores'] },
            { question: '¿Propuesta de valor?', options: ['No clara', 'Algo clara', 'Bastante clara', 'Muy clara'] },
            { question: '¿Feedback cliente?', options: ['No hay', 'Informal', 'Encuestas', 'Análisis'] },
            { question: '¿Evolución producto?', options: ['Sobre la marcha', 'Cambios ocasionales', 'Planes', 'Roadmap'] },
            { question: '¿Prioridad comercial?', options: ['Clientes', 'Ventas actuales', 'Rentabilidad', 'Escalar'] },
          ],
          finance: [
            { question: '¿Control financiero?', options: ['No estructurado', 'Excel', 'Software', 'Sistema integrado'] },
            { question: '¿Revisión de números?', options: ['Nunca', 'Mensual', 'Semanal', 'Diario'] },
            { question: '¿Flujo de efectivo?', options: ['No controlado', 'Reacción', 'Revisión', 'Proyección'] },
            { question: '¿Costos claros?', options: ['No claros', 'Aproximados', 'Bastante claros', 'Control total'] },
            { question: '¿Margen?', options: ['No sé', 'Estimado', 'Claro', 'Totalmente medido'] },
            { question: '¿Decisiones financieras?', options: ['Intuición', 'Experiencia', 'Datos', 'Modelos'] },
            { question: '¿Ingresos predecibles?', options: ['Muy variables', 'Variables', 'Estables', 'Muy estables'] },
            { question: '¿Gestión de deuda?', options: ['Sin control', 'Básico', 'Estrategia', 'Optimizado'] },
            { question: '¿Preparación ante crisis?', options: ['Nula', 'Baja', 'Media', 'Alta'] },
            { question: '¿Cumplimiento fiscal?', options: ['Sin control', 'Retrasos', 'Al día', 'Estrategia fiscal'] },
          ],
        },
      },
      structure: {
        title: 'Estructura Empresarial',
        subtitle: 'Organización y unidades de negocio',
        mode: {
          simple: 'Simple',
          multi: 'Multi-unidad',
          simpleTitle: 'Un solo negocio',
          simpleDescription: 'Tienes una sola sucursal o empresa',
          multiTitle: 'Varias empresas o unidades',
          multiDescription: 'Múltiples sucursales, filiales o empresas relacionadas',
          switchPrompt: '¿Tienes más de un negocio o sucursal?',
          switchAction: 'Cambia a multi-unidad',
          multiNote: 'Gestiona múltiples unidades desde una única administración.',
        },
        identity: {
          simple: 'Identidad empresarial',
          holding: 'Identidad del holding',
          simpleDesc: 'Nombre, logo, industria y configuración base de tu empresa.',
          holdingDesc: 'Marca y configuración general (nivel holding).',
        },
        fields: {
          companyName: 'Nombre de la',
          holdingName: 'Nombre de la',
          industry: 'Industria',
          selectIndustry: 'Selecciona una industria',
          country: 'País',
          selectCountry: 'Selecciona un país',
          logo: 'Logo de la',
          logoHolding: 'Logo de la',
          uploadImage: 'Subir imagen',
          description: 'Descripción',
          optional: '(opcional)',
        },
        units: {
          title: 'Unidades de negocio',
          description: 'Administra sucursales, filiales o empresas del grupo',
          addUnit: '+ Nueva unidad',
          addBusiness: '+ Agregar negocio',
          unitName: 'Nombre de la unidad',
          unitCountry: 'País de operación',
          businessName: 'Nombre del negocio',
        },
        modal: {
          newUnit: 'Nueva unidad de negocio',
          editUnit: 'Editar unidad de negocio',
          newBusiness: 'Nuevo negocio',
          editBusiness: 'Editar negocio',
          save: 'Guardar cambios',
          cancel: 'Cancelar',
          delete: 'Eliminar',
        },
      },
      profile: {
        title: 'Mi perfil',
        subtitle: 'Información personal y configuración de cuenta',
        fields: {
          fullName: 'Nombre completo',
          email: 'Correo electrónico',
          phone: 'Teléfono',
          position: 'Puesto',
          department: 'Departamento',
          profilePhoto: 'Foto de perfil',
          uploadPhoto: 'Subir foto',
        },
        save: 'Guardar cambios',
      },
      users: {
        title: 'Usuarios',
        subtitle: 'Gestiona usuarios y permisos del sistema',
        invite: 'Invitar usuario',
        search: 'Buscar usuario...',
        filters: {
          all: 'Todos',
          active: 'Activos',
          pending: 'Pendientes',
          inactive: 'Inactivos',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'Usuario',
        },
        status: {
          active: 'Activo',
          pending: 'Pendiente',
          inactive: 'Inactivo',
        },
        table: {
          name: 'Nombre',
          email: 'Email',
          role: 'Rol',
          status: 'Estatus',
          modules: 'Módulos',
          actions: 'Acciones',
        },
        actions: {
          edit: 'Editar',
          resend: 'Reenviar invitación',
          delete: 'Eliminar',
        },
        modal: {
          newUser: 'Nuevo usuario',
          editUser: 'Editar usuario',
          name: 'Nombre',
          email: 'Correo electrónico',
          role: 'Rol',
          selectRole: 'Selecciona un rol',
          modules: 'Módulos',
          selectModules: 'Selecciona módulos...',
          inviteLink: 'Link de invitación',
          copyLink: 'Copiar link',
          copied: '✓ Copiado',
          save: 'Guardar',
          cancel: 'Cancelar',
          send: 'Enviar invitación',
        },
      },
      plan: {
        title: 'Elige el plan que más se ajuste a tu empresa',
        subtitle: 'Todos los planes incluyen Modo Aprendiz y actualizaciones continuas',
        mostPopular: 'Más popular',
        plans: {
          inicio: {
            name: 'Inicio',
            description: 'Comienza a organizar tu negocio',
            button: 'Elegir Inicio',
          },
          controla: {
            name: 'Controla',
            description: 'Bases sólidas para ordenar y controlar',
            button: 'Elegir Controla',
          },
          escala: {
            name: 'Escala',
            description: 'Optimiza áreas, estandariza procesos',
            button: 'Elegir Escala',
          },
          corporativiza: {
            name: 'Corporativiza',
            description: 'Automatiza con IA corporativa y visión integral',
            button: 'Elegir Corporativiza',
          },
        },
        features: {
          humanResources: 'Recursos Humanos',
          processes: 'Procesos y Tareas',
          products: 'Productos (POS / CRM)',
          finance: 'Finanzas (Gastos / Caja)',
          kpisBasic: 'KPIs Básicos',
          kpisComplete: 'KPIs Completos',
          kpisAdvanced: 'KPIs Avanzados',
          kpisCorporate: 'KPIs Corporativos',
          users5: 'Hasta 5 usuarios',
          users10: 'Hasta 10 usuarios',
          users20: 'Hasta 20 usuarios',
          users25: 'Hasta 25 usuarios',
          complementaryModules: 'Módulos complementarios',
          modules2: '2 módulos complementarios',
          modules4: '4 módulos complementarios',
          allModules: 'Todos los módulos',
          aiAnalytics: 'IA Analítica y Ventas',
          integrations: 'Integraciones',
          sessions1: '1 sesión/mes',
          sessions2: '2 sesiones/mes',
          sessions4: '4 sesiones/mes',
        },
        additionalInfo: {
          title: 'Información adicional',
          extraUser: 'Usuario adicional',
          extraUserPrice: '+$10 USD por usuario extra en cualquier plan',
          learningMode: 'Modo Aprendiz',
          learningModeDesc: 'Incluido en todos los planes sin costo adicional',
          updates: 'Actualizaciones',
          updatesDesc: 'Todas las mejoras incluidas automáticamente',
        },
      },
      billing: {
        title: 'Facturación',
        subtitle: 'Datos fiscales, método de pago y facturas del servicio',
        fiscalData: {
          title: 'Datos fiscales',
          subtitle: 'Configura tus datos fiscales según el país',
          country: 'País',
          selectCountry: 'Selecciona un país...',
          rfc: 'RFC',
          razonSocial: 'Razón social',
          regimenFiscal: 'Régimen fiscal',
          usoCFDI: 'Uso CFDI (default)',
          codigoPostalFiscal: 'Código Postal (Fiscal)',
          nit: 'NIT',
          responsabilidadFiscal: 'Responsabilidad fiscal',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Razão social',
          inscricaoEstadual: 'Inscrição estadual',
          ein: 'EIN (Tax ID)',
          legalName: 'Legal name',
          state: 'State',
          businessNumber: 'Business Number (BN)',
          province: 'Province',
          taxId: 'ID Fiscal',
          companyName: 'Nombre de la empresa',
          taxRegime: 'Régimen fiscal',
          postalCode: 'Código Postal',
        },
        paymentMethod: {
          title: 'Método de pago',
          subtitle: 'Configura tu método y frecuencia de pago',
          type: 'Tipo de pago preferido',
          selectMethod: 'Selecciona un método...',
          cardNumber: 'Número de tarjeta',
          cvv: 'CVV',
          expirationDate: 'Fecha de expiración',
          cardholderName: 'Nombre en la tarjeta',
          addCard: 'Agregar tarjeta',
          cancel: 'Cancelar',
          savedCards: 'Tarjetas guardadas',
          defaultCard: 'Predeterminada',
          saveCard: 'Guardar tarjeta',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/AA',
            cardholderName: 'Como aparece en la tarjeta',
          },
        },
        automaticBilling: {
          title: 'Facturación automática',
          subtitle: 'Configura renovación, día de cobro y correo de facturas',
          enable: 'Activar renovación automática',
          description: 'Tu suscripción se renovará automáticamente al final del período',
          billingDay: 'Día de facturación',
          selectDay: 'Día 1 de cada mes',
          emailForInvoices: 'Email para facturas',
          reminderNote: 'Recibirás tus facturas en este correo',
        },
        currentBilling: {
          title: 'Resumen de cobro actual',
          plan: 'Plan:',
          notConfigured: 'No configurado',
          amount: 'Monto:',
          nextPayment: 'Próximo cobro:',
        },
        invoices: {
          title: 'Facturas del servicio',
          subtitle: 'Historial de facturas de tu suscripción',
          month: 'Mes',
          year: 'Monto',
          status: 'Estatus',
          downloadPdf: 'Descargar PDF',
          date: 'Fecha',
          concept: 'Concepto',
          amount: 'Monto',
          paid: 'Pagada',
          pending: 'Pendiente',
        },
        billingFrequency: {
          title: 'Frecuencia de facturación',
          note: 'Los pagos pueden tener 100-30 descuento',
          monthly: 'Mensual',
          quarterly: 'Trimestral',
          semiannual: 'Semestral',
          annual: 'Anual',
        },
      },
    },
  },
  'es-CO': {
    header: {
      notifications: 'Notificaciones',
      profile: 'Mi perfil',
      settings: 'Configuración',
      logout: 'Cerrar sesión',
      learningMode: 'Modo aprendiz',
    },
    sections: {
      kpis: 'Tus KPIs',
      favorites: 'Tus favoritos',
      quickAccess: 'Accesos rápidos',
      basicModules: 'Módulos básicos',
      main: 'Principales',
      complementaryModules: 'Módulos complementarios',
      additional: 'Adicionales',
      aiModules: 'Inteligencia artificial',
      aiLabel: 'Módulos de IA',
      configureKpis: 'Configurar KPIs',
    },
    kpis: {
      weeklyRevenue: 'Ventas Semanales',
      netProfit: 'Utilidad Neta',
      activeClients: 'Clientes Activos',
      activeEmployees: 'Empleados Activos',
      pendingTasks: 'Tareas Pendientes',
      monthlyExpenses: 'Gastos del Mes',
      vsWeekBefore: 'vs semana anterior',
      thisMonth: 'este mes',
      newOnes: 'nuevos',
      dueToday: 'vencen hoy',
      vsMonthBefore: 'vs mes anterior',
    },
    modules: {
      panelInicial: 'Panel Inicial',
      recursosHumanos: 'Recursos Humanos',
      procesosTareas: 'Procesos y tareas',
      gastos: 'Gastos',
      cajaChica: 'Caja chica',
      puntoVenta: 'Punto de venta',
      ventas: 'Ventas',
      kpis: 'KPIs',
      mantenimiento: 'Mantenimiento',
      inventarios: 'Inventarios',
      controlMinutas: 'Control de minutas',
      limpieza: 'Limpieza',
      lavanderia: 'Lavandería',
      transportacion: 'Transportación',
      vehiculosMaquinaria: 'Vehículos y maquinaria',
      inmuebles: 'Inmuebles',
      formularios: 'Formularios',
      facturacion: 'Facturación',
      correoElectronico: 'Correo electrónico',
      climaLaboral: 'Clima laboral',
      indiceAgenteVentas: 'Índice Agente de Ventas',
      indiceAnalitica: 'Índice Analítica',
      capacitacion: 'Capacitación',
      indiceCoach: 'Índice Coach',
    },
    notifications: {
      newTask: 'Nueva tarea asignada',
      expensePending: 'Gasto pendiente de aprobar',
      newClient: 'Nuevo cliente registrado',
      timeAgo: {
        minutes: 'Hace 5 minutos',
        hour: 'Hace 1 hora',
        hours: 'Hace 2 horas',
      },
    },
    loginPage: {
      workspaceBadge: 'Espacio de trabajo Indice',
      accessBadge: 'Acceso Indice',
      title: 'Inicia sesión en tu espacio de trabajo Indice',
      subtitle:
        'Indice conecta la estructura de tu negocio, tu equipo, tus gastos, tus controles y la ejecución diaria en una sola plataforma para equipos operativos reales.',
      modulePills: ['Dashboard', 'Recursos Humanos', 'Gastos', 'Analítica'],
      featureCards: [
        {
          title: 'Un espacio para todo el equipo',
          description: 'Muévete de finanzas a operaciones, personal, ventas y analítica sin perder contexto.',
        },
        {
          title: 'Claridad desde la primera pantalla',
          description: 'Abre Indice y ve de inmediato los módulos, métricas y flujos que importan para tu negocio.',
        },
      ],
      welcomeTitle: 'Bienvenido de nuevo',
      welcomeText:
        'Inicia sesión para entrar al dashboard de Indice, donde tus módulos, flujos de trabajo y la visibilidad operativa viven en un solo lugar.',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'tu@empresa.com',
      emailError: 'Ingresa un correo electrónico válido.',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: 'Escribe tu contraseña',
      hidePassword: 'Ocultar contraseña',
      showPassword: 'Mostrar contraseña',
      signIn: 'Iniciar sesión',
      signingIn: 'Ingresando...',
      errorFallback: 'No fue posible iniciar sesión.',
      insideTitle: 'Lo que te espera dentro',
      insideText:
        'Después de iniciar sesión, Indice te lleva directo al dashboard principal para moverte entre módulos, monitorear actividad y mantener alineada cada parte del negocio.',
    },
    learningMode: {
      welcome: '¡Bienvenido al modo de aprendizaje!',
      hide: 'Ocultar',
      show: 'Mostrar',
      businessBase: 'Base de negocios',
      clearBusinessStable: 'Limpiar base de negocios estable',
      functions: 'Funciones',
      businessContext: 'Contexto de negocio',
      indiceMethodology: 'Metodología Índice',
      addModule: 'Abrir',
      viewBasicModules: 'Ver módulos básicos',
      previous: 'Anterior',
      next: 'Siguiente',
      stepOf: 'Paso de',
      modules: {
        panelInicial: {
          title: 'Panel Inicial',
          subtitle: '🎯 Tu punto de partida',
          description: 'El Panel Inicial es el punto de partida para organizar tu empresa dentro del sistema Índice. 🏢 Aquí defines la información básica de tu negocio y configuras la estructura que permitirá que todos los demás módulos funcionen correctamente. ✨ Cuando esta base está bien configurada, el sistema puede ayudarte a gestionar personas, procesos, productos y finanzas con mayor claridad.',
          functions: [
            '📊 Actualizar los datos de tu empresa y mantener tu información siempre al día.',
            '⚙️ Configurar las preferencias del sistema, como idioma, moneda y ajustes operativos.',
            '📋 Definir la información básica del negocio que utilizarán los demás módulos.',
            '🏗️ Establecer la estructura de tu empresa y cómo está organizada su operación.',
            '👥 Invitar usuarios y administrar sus accesos, asignando roles y permisos a cada colaborador.',
            '🎓 Realizar evaluaciones iniciales del negocio que te ayudarán a entender en qué etapa se encuentra tu empresa.',
            '📈 Calcular el IME ��� Índice de Madurez Empresarial, una herramienta que analiza el estado actual de tu negocio y te orienta sobre cómo mejorar su gestión.',
          ],
          context: '💡 Este módulo te permite tener una visión general de tu empresa y comenzar a estructurar cómo funciona tu negocio. Cuando esta base está bien definida, todos los demás procesos del sistema se vuelven más claros y fáciles de administrar.',
          quote: '🏆 La organización es el primer paso para construir un negocio sólido.',
        },
        recursosHumanos: {
          title: 'Recursos Humanos',
          subtitle: 'Administra tu equipo',
          description: 'Gestiona la información de tus empleados y recursos humanos.',
          functions: ['Ver empleados', 'Administrar contratos'],
          context: 'Este módulo te permite administrar eficazmente a tu equipo.',
          quote: 'El talento es la clave para el éxito.',
        },
        procesosTareas: {
          title: 'Procesos y tareas',
          subtitle: 'Organiza tu trabajo',
          description: 'Administra y realiza tareas y procesos importantes para tu negocio.',
          functions: ['Crear tareas', 'Ver procesos'],
          context: 'Este módulo te ayuda a mantener tu negocio organizado.',
          quote: 'La organización es la clave para la eficiencia.',
        },
        gastos: {
          title: 'Gastos',
          subtitle: 'Controla tus gastos',
          description: 'Administra y controla tus gastos para mantener tu negocio en buen estado.',
          functions: ['Ver gastos', 'Aprobar gastos'],
          context: 'Este módulo te permite controlar tus gastos de manera efectiva.',
          quote: 'El control de gastos es fundamental para el éxito.',
        },
        cajaChica: {
          title: 'Caja chica',
          subtitle: 'Gastos menores',
          description: 'Administra gastos menores para tu negocio.',
          functions: ['Ver caja chica', 'Aprobar gastos'],
          context: 'Este módulo te permite gestionar gastos menores de manera eficiente.',
          quote: 'La caja chica es esencial para gastos menores.',
        },
        puntoVenta: {
          title: 'Punto de venta',
          subtitle: 'Vende tus productos',
          description: 'Administra y realiza ventas para tu negocio.',
          functions: ['Realizar ventas', 'Ver ventas'],
          context: 'Este módulo te permite vender tus productos de manera eficiente.',
          quote: 'La venta es la clave para el éxito.',
        },
        ventas: {
          title: 'Ventas',
          subtitle: 'Administra tus ventas',
          description: 'Gestiona y analiza tus ventas para mejorar tu negocio.',
          functions: ['Ver ventas', 'Analizar ventas'],
          context: 'Este módulo te permite administrar y analizar tus ventas.',
          quote: 'Las ventas son la base de tu negocio.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Métricas clave',
          description: 'Administra y analiza tus KPIs para mejorar tu negocio.',
          functions: ['Ver KPIs', 'Configurar KPIs'],
          context: 'Este módulo te permite administrar y analizar tus KPIs.',
          quote: 'Los KPIs son esenciales para el seguimiento del rendimiento.',
        },
      },
    },
    panelInicial: {
      title: 'Panel Inicial',
      back: 'Regresar',
      tabs: {
        profile: 'Perfil',
        businessStructure: 'Estructura Empresarial',
        businessProfile: 'Perfil empresarial',
        billing: 'Facturación',
        plan: 'Plan',
        users: 'Usuarios',
      },
      diagnosis: {
        title: 'Diagnóstico empresarial',
        description: 'Ayúdanos a conocer mejor tu empresa y la etapa de gestión para personalizar Índice.',
        centerTitle: 'Centro de diagnóstico empresarial',
        centerDescription: 'Descubre el estado de gestión de tu empresa a través de 4 pilares: Personas, Procesos, Productos y Finanzas. Con las respuestas utilizaremos los índices de Madurez Empresarial (IME), que nos ayudará a personalizar recomendaciones, módulos y mejores compañeros detrás de Índice.',
        questionCount: '10 preguntas cada uno',
        progress: 'Progreso del diagnóstico empresarial',
        progressOf: 'completado',
        printDiagnosis: 'Imprimir diagnóstico',
        start: 'Comenzar',
        continue: 'Continuar',
        doAgain: 'Hacer de nuevo',
        close: 'Cerrar',
        question: 'Pregunta',
        of: 'de',
        completed: 'completadas',
        previous: 'Anterior',
        next: 'Siguiente',
        finish: 'Finalizar',
        restart: 'Reiniciar diagnóstico',
        pillars: {
          people: {
            title: 'Personas',
            description: 'Analiza talentos, estructura de equipo y comunicación.',
          },
          processes: {
            title: 'Procesos',
            description: 'Evalúa flujos, tareas, escalabilidad y eficiencia.',
          },
          products: {
            title: 'Productos',
            description: 'Analiza oferta, mercado, comercial y propuesta de valor.',
          },
          finance: {
            title: 'Finanzas',
            description: 'Evalúa control financiero, gestión y toma de decisiones.',
          },
        },
        questions: {
          people: [
            { question: '¿Cuál es tu rol principal?', options: ['Fundador/CEO', 'Operaciones', 'Finanzas', 'Comercial/Otro'] },
            { question: '¿Cuántas personas trabajan?', options: ['Solo yo', '2 a 5', '6 a 20', '21 o más'] },
            { question: '¿Cómo está organizado tu equipo?', options: ['Sin estructura', 'Roles básicos', 'Áreas definidas', 'Organigrama formal'] },
            { question: '¿Cómo asignan tareas?', options: ['Improvisado', 'Listas', 'Asignación estructurada', 'Sistema de gestión'] },
            { question: '¿Revisión de desempeño?', options: ['Nunca', 'Por problemas', 'Semanal', 'Con KPIs'] },
            { question: '¿Delegación?', options: ['Hago todo', 'Delego y superviso', 'Delego con control', 'Equipo autónomo'] },
            { question: '¿Comunicación interna?', options: ['Informal', 'Chat', 'Reuniones', 'Herramientas formales'] },
            { question: '¿Frecuencia de reuniones?', options: ['Nunca', 'Esporádico', 'Semanal', 'Frecuente'] },
            { question: '¿Claridad de responsabilidades?', options: ['Nada clara', 'Algo clara', 'Bastante clara', 'Totalmente clara'] },
            { question: '¿Facilidad de integración?', options: ['Muy difícil', 'Difícil', 'Moderado', 'Fácil'] },
          ],
          processes: [
            { question: '¿Procesos documentados?', options: ['Nada', 'Algunos', 'Mayoría', 'Totalmente'] },
            { question: '¿Gestión de tareas?', options: ['Improvisado', 'Listas', 'Herramientas', 'Sistema formal'] },
            { question: '¿Monitoreo de avance?', options: ['No se monitorea', 'Ocasional', 'Reportes', 'KPIs'] },
            { question: '¿Automatización?', options: ['Manual', 'Herramientas aisladas', 'Automatización parcial', 'Alta automatización'] },
            { question: '¿Replicabilidad?', options: ['Muy difícil', 'Con esfuerzo', 'Posible', 'Fácil'] },
            { question: '¿Dónde se pierde tiempo?', options: ['Manual', 'Coordinación', 'Información', 'Seguimiento'] },
            { question: '¿Dependencia de personas?', options: ['Total', 'Bastante', 'Algo', 'Poco'] },
            { question: '¿Claridad de procesos?', options: ['Nada claros', 'Algo claros', 'Bastante claros', 'Totalmente claros'] },
            { question: '¿Gestión de errores?', options: ['Reacción', 'Informal', 'Revisión', 'Mejora continua'] },
            { question: '¿Escalabilidad?', options: ['Nula', 'Baja', 'Media', 'Alta'] },
          ],
          products: [
            { question: '¿Qué vendes?', options: ['Servicios', 'Productos', 'Digital', 'Mixto'] },
            { question: '¿Tipo de cliente?', options: ['B2C', 'B2B', 'Gobierno', 'Mixto'] },
            { question: '¿Ingresos principales?', options: ['Venta directa', 'Servicios', 'Suscripción', 'Contratos'] },
            { question: '¿Diversificación?', options: ['Uno', 'Algunos', 'Varias líneas', 'Amplio'] },
            { question: '¿Definición de precios?', options: ['Intuición', 'Competencia', 'Costos', 'Estrategia'] },
            { question: '¿Seguimiento desempeño?', options: ['No se mide', 'Solo ventas', 'Ventas+rentabilidad', 'Indicadores'] },
            { question: '¿Propuesta de valor?', options: ['No clara', 'Algo clara', 'Bastante clara', 'Muy clara'] },
            { question: '¿Feedback cliente?', options: ['No hay', 'Informal', 'Encuestas', 'Análisis'] },
            { question: '¿Evolución producto?', options: ['Sobre la marcha', 'Cambios ocasionales', 'Planes', 'Roadmap'] },
            { question: '¿Prioridad comercial?', options: ['Clientes', 'Ventas actuales', 'Rentabilidad', 'Escalar'] },
          ],
          finance: [
            { question: '¿Control financiero?', options: ['No estructurado', 'Excel', 'Software', 'Sistema integrado'] },
            { question: '¿Revisión de números?', options: ['Nunca', 'Mensual', 'Semanal', 'Diario'] },
            { question: '¿Flujo de efectivo?', options: ['No controlado', 'Reacción', 'Revisión', 'Proyección'] },
            { question: '¿Costos claros?', options: ['No claros', 'Aproximados', 'Bastante claros', 'Control total'] },
            { question: '¿Margen?', options: ['No sé', 'Estimado', 'Claro', 'Totalmente medido'] },
            { question: '¿Decisiones financieras?', options: ['Intuición', 'Experiencia', 'Datos', 'Modelos'] },
            { question: '¿Ingresos predecibles?', options: ['Muy variables', 'Variables', 'Estables', 'Muy estables'] },
            { question: '¿Gestión de deuda?', options: ['Sin control', 'Básico', 'Estrategia', 'Optimizado'] },
            { question: '¿Preparación ante crisis?', options: ['Nula', 'Baja', 'Media', 'Alta'] },
            { question: '¿Cumplimiento fiscal?', options: ['Sin control', 'Retrasos', 'Al día', 'Estrategia fiscal'] },
          ],
        },
      },
      billing: {
        title: 'Facturación',
        subtitle: 'Datos fiscales, método de pago y facturas del servicio',
        fiscalData: {
          title: 'Datos fiscales',
          subtitle: 'Configura tus datos fiscales según el país',
          country: 'País',
          selectCountry: 'Selecciona un país...',
          rfc: 'RFC',
          razonSocial: 'Razón social',
          regimenFiscal: 'Régimen fiscal',
          usoCFDI: 'Uso CFDI (default)',
          codigoPostalFiscal: 'Código Postal (Fiscal)',
          nit: 'NIT',
          responsabilidadFiscal: 'Responsabilidad fiscal',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Razão social',
          inscricaoEstadual: 'Inscrição estadual',
          ein: 'EIN (Tax ID)',
          legalName: 'Legal name',
          state: 'State',
          businessNumber: 'Business Number (BN)',
          province: 'Province',
          taxId: 'ID Fiscal',
          companyName: 'Nombre de la empresa',
          taxRegime: 'Régimen fiscal',
          postalCode: 'Código Postal',
        },
        paymentMethod: {
          title: 'Método de pago',
          subtitle: 'Configura tu método y frecuencia de pago',
          type: 'Tipo de pago preferido',
          selectMethod: 'Selecciona un método...',
          cardNumber: 'Número de tarjeta',
          cvv: 'CVV',
          expirationDate: 'Fecha de expiración',
          cardholderName: 'Nombre en la tarjeta',
          addCard: 'Agregar tarjeta',
          cancel: 'Cancelar',
          savedCards: 'Tarjetas guardadas',
          defaultCard: 'Predeterminada',
          saveCard: 'Guardar tarjeta',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/AA',
            cardholderName: 'Como aparece en la tarjeta',
          },
        },
        automaticBilling: {
          title: 'Facturación automática',
          subtitle: 'Configura renovación, día de cobro y correo de facturas',
          enable: 'Activar renovación automática',
          description: 'Tu suscripción se renovará automáticamente al final del período',
          billingDay: 'Día de facturación',
          selectDay: 'Día 1 de cada mes',
          emailForInvoices: 'Email para facturas',
          reminderNote: 'Recibirás tus facturas en este correo',
        },
        currentBilling: {
          title: 'Resumen de cobro actual',
          plan: 'Plan:',
          notConfigured: 'No configurado',
          amount: 'Monto:',
          nextPayment: 'Próximo cobro:',
        },
        invoices: {
          title: 'Facturas del servicio',
          subtitle: 'Historial de facturas de tu suscripción',
          month: 'Mes',
          year: 'Monto',
          status: 'Estatus',
          downloadPdf: 'Descargar PDF',
          date: 'Fecha',
          concept: 'Concepto',
          amount: 'Monto',
          paid: 'Pagada',
          pending: 'Pendiente',
        },
        billingFrequency: {
          title: 'Frecuencia de facturación',
          note: 'Los pagos pueden tener 100-30 descuento',
          monthly: 'Mensual',
          quarterly: 'Trimestral',
          semiannual: 'Semestral',
          annual: 'Anual',
        },
      },
      structure: {
        title: 'Estructura Empresarial',
        subtitle: 'Organización y unidades de negocio',
        mode: {
          simple: 'Simple',
          multi: 'Multi-unidad',
          simpleTitle: 'Un solo negocio',
          simpleDescription: 'Tienes una sola sucursal o empresa',
          multiTitle: 'Varias empresas o unidades',
          multiDescription: 'Múltiples sucursales, filiales o empresas relacionadas',
          switchPrompt: '¿Tienes más de un negocio o sucursal?',
          switchAction: 'Cambia a multi-unidad',
          multiNote: 'Gestiona múltiples unidades desde una única administración.',
        },
        identity: {
          simple: 'Identidad empresarial',
          holding: 'Identidad del holding',
          simpleDesc: 'Nombre, logo, industria y configuración base de tu empresa.',
          holdingDesc: 'Marca y configuración general (nivel holding).',
        },
        fields: {
          companyName: 'Nombre de la',
          holdingName: 'Nombre de la',
          industry: 'Industria',
          selectIndustry: 'Selecciona una industria',
          country: 'País',
          selectCountry: 'Selecciona un país',
          logo: 'Logo de la',
          logoHolding: 'Logo de la',
          uploadImage: 'Subir imagen',
          description: 'Descripción',
          optional: '(opcional)',
        },
        units: {
          title: 'Unidades de negocio',
          description: 'Administra sucursales, filiales o empresas del grupo',
          addUnit: '+ Nueva unidad',
          addBusiness: '+ Agregar negocio',
          unitName: 'Nombre de la unidad',
          unitCountry: 'País de operación',
          businessName: 'Nombre del negocio',
        },
        modal: {
          newUnit: 'Nueva unidad de negocio',
          editUnit: 'Editar unidad de negocio',
          newBusiness: 'Nuevo negocio',
          editBusiness: 'Editar negocio',
          save: 'Guardar cambios',
          cancel: 'Cancelar',
          delete: 'Eliminar',
        },
      },
      profile: {
        title: 'Mi perfil',
        subtitle: 'Información personal y configuración de cuenta',
        fields: {
          fullName: 'Nombre completo',
          email: 'Correo electrónico',
          phone: 'Teléfono',
          position: 'Puesto',
          department: 'Departamento',
          profilePhoto: 'Foto de perfil',
          uploadPhoto: 'Subir foto',
        },
        save: 'Guardar cambios',
      },
      users: {
        title: 'Usuarios',
        subtitle: 'Gestiona usuarios y permisos del sistema',
        invite: 'Invitar usuario',
        search: 'Buscar usuario...',
        filters: {
          all: 'Todos',
          active: 'Activos',
          pending: 'Pendientes',
          inactive: 'Inactivos',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'Usuario',
        },
        status: {
          active: 'Activo',
          pending: 'Pendiente',
          inactive: 'Inactivo',
        },
        table: {
          name: 'Nombre',
          email: 'Email',
          role: 'Rol',
          status: 'Estatus',
          modules: 'Módulos',
          actions: 'Acciones',
        },
        actions: {
          edit: 'Editar',
          resend: 'Reenviar invitación',
          delete: 'Eliminar',
        },
        modal: {
          newUser: 'Nuevo usuario',
          editUser: 'Editar usuario',
          name: 'Nombre',
          email: 'Correo electrónico',
          role: 'Rol',
          selectRole: 'Selecciona un rol',
          modules: 'Módulos',
          selectModules: 'Selecciona módulos...',
          inviteLink: 'Link de invitación',
          copyLink: 'Copiar link',
          copied: '✓ Copiado',
          save: 'Guardar',
          cancel: 'Cancelar',
          send: 'Enviar invitación',
        },
      },
      plan: {
        title: 'Elige el plan que más se ajuste a tu empresa',
        subtitle: 'Todos los planes incluyen Modo Aprendiz y actualizaciones continuas',
        mostPopular: 'Más popular',
        plans: {
          inicio: {
            name: 'Inicio',
            description: 'Comienza a organizar tu negocio',
            button: 'Elegir Inicio',
          },
          controla: {
            name: 'Controla',
            description: 'Bases sólidas para ordenar y controlar',
            button: 'Elegir Controla',
          },
          escala: {
            name: 'Escala',
            description: 'Optimiza áreas, estandariza procesos',
            button: 'Elegir Escala',
          },
          corporativiza: {
            name: 'Corporativiza',
            description: 'Automatiza con IA corporativa y visión integral',
            button: 'Elegir Corporativiza',
          },
        },
        features: {
          humanResources: 'Recursos Humanos',
          processes: 'Procesos y Tareas',
          products: 'Productos (POS / CRM)',
          finance: 'Finanzas (Gastos / Caja)',
          kpisBasic: 'KPIs Básicos',
          kpisComplete: 'KPIs Completos',
          kpisAdvanced: 'KPIs Avanzados',
          kpisCorporate: 'KPIs Corporativos',
          users5: 'Hasta 5 usuarios',
          users10: 'Hasta 10 usuarios',
          users20: 'Hasta 20 usuarios',
          users25: 'Hasta 25 usuarios',
          complementaryModules: 'Módulos complementarios',
          modules2: '2 módulos complementarios',
          modules4: '4 módulos complementarios',
          allModules: 'Todos los módulos',
          aiAnalytics: 'IA Analítica y Ventas',
          integrations: 'Integraciones',
          sessions1: '1 sesión/mes',
          sessions2: '2 sesiones/mes',
          sessions4: '4 sesiones/mes',
        },
        additionalInfo: {
          title: 'Información adicional',
          extraUser: 'Usuario adicional',
          extraUserPrice: '+$10 USD por usuario extra en cualquier plan',
          learningMode: 'Modo Aprendiz',
          learningModeDesc: 'Incluido en todos los planes sin costo adicional',
          updates: 'Actualizaciones',
          updatesDesc: 'Todas las mejoras incluidas automáticamente',
        },
      },
    },
  },
  'en-US': {
    header: {
      notifications: 'Notifications',
      profile: 'My profile',
      settings: 'Settings',
      logout: 'Log out',
      learningMode: 'Learning mode',
    },
    sections: {
      kpis: 'Your KPIs',
      favorites: 'Your favorites',
      quickAccess: 'Quick access',
      basicModules: 'Basic modules',
      main: 'Main',
      complementaryModules: 'Complementary modules',
      additional: 'Additional',
      aiModules: 'Artificial intelligence',
      aiLabel: 'AI Modules',
      configureKpis: 'Configure KPIs',
    },
    kpis: {
      weeklyRevenue: 'Weekly Revenue',
      netProfit: 'Net Profit',
      activeClients: 'Active Clients',
      activeEmployees: 'Active Employees',
      pendingTasks: 'Pending Tasks',
      monthlyExpenses: 'Monthly Expenses',
      vsWeekBefore: 'vs last week',
      thisMonth: 'this month',
      newOnes: 'new',
      dueToday: 'due today',
      vsMonthBefore: 'vs last month',
    },
    modules: {
      panelInicial: 'Home Panel',
      recursosHumanos: 'Human Resources',
      procesosTareas: 'Processes and tasks',
      gastos: 'Expenses',
      cajaChica: 'Petty cash',
      puntoVenta: 'Point of sale',
      ventas: 'Sales',
      kpis: 'KPIs',
      mantenimiento: 'Maintenance',
      inventarios: 'Inventory',
      controlMinutas: 'Minutes control',
      limpieza: 'Cleaning',
      lavanderia: 'Laundry',
      transportacion: 'Transportation',
      vehiculosMaquinaria: 'Vehicles and machinery',
      inmuebles: 'Real estate',
      formularios: 'Forms',
      facturacion: 'Billing',
      correoElectronico: 'Email',
      climaLaboral: 'Work climate',
      indiceAgenteVentas: 'Sales Agent Index',
      indiceAnalitica: 'Analytics Index',
      capacitacion: 'Training',
      indiceCoach: 'Coach Index',
    },
    notifications: {
      newTask: 'New task assigned',
      expensePending: 'Expense pending approval',
      newClient: 'New client registered',
      timeAgo: {
        minutes: '5 minutes ago',
        hour: '1 hour ago',
        hours: '2 hours ago',
      },
    },
    loginPage: {
      workspaceBadge: 'Indice Workspace',
      accessBadge: 'Indice access',
      title: 'Sign in to your Indice workspace',
      subtitle:
        'Indice brings your business structure, people, expenses, controls, and daily execution into one connected platform built for real operating teams.',
      modulePills: ['Dashboard', 'Human Resources', 'Expenses', 'Analytics'],
      featureCards: [
        {
          title: 'One workspace for every team',
          description: 'Move from finance to operations, people, sales, and analytics without losing context.',
        },
        {
          title: 'Clarity from the first screen',
          description: 'Open Indice and immediately see the modules, metrics, and workflows that matter to your business.',
        },
      ],
      welcomeTitle: 'Welcome back',
      welcomeText:
        'Sign in to continue into the Indice dashboard, where your modules, team workflows, and operational visibility are all in one place.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      emailError: 'Enter a valid email address.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      errorFallback: 'Unable to sign in.',
      insideTitle: 'What waits inside',
      insideText:
        'After login, Indice takes you straight into the main dashboard so you can move across modules, monitor activity, and keep every part of the business aligned.',
    },
    learningMode: {
      welcome: 'Welcome to Learning Mode!',
      hide: 'Hide',
      show: 'Show',
      businessBase: 'Business Base',
      clearBusinessStable: 'Clear Business Stable',
      functions: 'Functions',
      businessContext: 'Business Context',
      indiceMethodology: 'Indice Methodology',
      addModule: 'Open',
      viewBasicModules: 'View Basic Modules',
      previous: 'Previous',
      next: 'Next',
      stepOf: 'Step of',
      modules: {
        panelInicial: {
          title: 'Home Panel',
          subtitle: '🎯 Your starting point',
          description: 'The Home Panel is the starting point for organizing your company within the Indice system. 🏢 Here you define the basic information of your business and configure the structure that will allow all other modules to function properly. ✨ When this foundation is well configured, the system can help you manage people, processes, products, and finances with greater clarity.',
          functions: [
            '📊 Update your company data and keep your information always up to date.',
            '⚙️ Configure system preferences, such as language, currency, and operational settings.',
            '📋 Define the basic business information that other modules will use.',
            '🏗️ Establish your company structure and how its operation is organized.',
            '👥 Invite users and manage their access, assigning roles and permissions to each collaborator.',
            '🎓 Conduct initial business assessments that will help you understand what stage your company is in.',
            '📈 Calculate the BMI — Business Maturity Index, a tool that analyzes your business\'s current state and guides you on how to improve its management.',
          ],
          context: '💡 This module allows you to have an overview of your company and begin to structure how your business operates. When this foundation is well defined, all other system processes become clearer and easier to manage.',
          quote: '🏆 Organization is the first step to building a solid business.',
        },
        recursosHumanos: {
          title: 'Human Resources',
          subtitle: 'Manage your team',
          description: 'Manage employee and human resource information.',
          functions: ['View employees', 'Manage contracts'],
          context: 'This module allows you to effectively manage your team.',
          quote: 'Talent is the key to success.',
        },
        procesosTareas: {
          title: 'Processes and tasks',
          subtitle: 'Organize your work',
          description: 'Manage and perform important tasks and processes for your business.',
          functions: ['Create tasks', 'View processes'],
          context: 'This module helps you keep your business organized.',
          quote: 'Organization is the key to efficiency.',
        },
        gastos: {
          title: 'Expenses',
          subtitle: 'Control your expenses',
          description: 'Manage and control your expenses to keep your business in good condition.',
          functions: ['View expenses', 'Approve expenses'],
          context: 'This module allows you to effectively control your expenses.',
          quote: 'Expense control is fundamental for success.',
        },
        cajaChica: {
          title: 'Petty cash',
          subtitle: 'Minor expenses',
          description: 'Manage minor expenses for your business.',
          functions: ['View petty cash', 'Approve expenses'],
          context: 'This module allows you to efficiently manage minor expenses.',
          quote: 'Petty cash is essential for minor expenses.',
        },
        puntoVenta: {
          title: 'Point of sale',
          subtitle: 'Sell your products',
          description: 'Manage and perform sales for your business.',
          functions: ['Make sales', 'View sales'],
          context: 'This module allows you to efficiently sell your products.',
          quote: 'Sales are the key to success.',
        },
        ventas: {
          title: 'Sales',
          subtitle: 'Manage your sales',
          description: 'Manage and analyze your sales to improve your business.',
          functions: ['View sales', 'Analyze sales'],
          context: 'This module allows you to manage and analyze your sales.',
          quote: 'Sales are the foundation of your business.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Key metrics',
          description: 'Manage and analyze your KPIs to improve your business.',
          functions: ['View KPIs', 'Configure KPIs'],
          context: 'This module allows you to manage and analyze your KPIs.',
          quote: 'KPIs are essential for performance tracking.',
        },
      },
    },
    panelInicial: {
      title: 'Home Panel',
      back: 'Back',
      tabs: {
        profile: 'Profile',
        businessStructure: 'Business Structure',
        businessProfile: 'Business Profile',
        billing: 'Billing',
        plan: 'Plan',
        users: 'Users',
      },
      diagnosis: {
        title: 'Business Diagnosis',
        description: 'Help us better understand your company and management stage to personalize Indice.',
        centerTitle: 'Business Diagnosis Center',
        centerDescription: 'Discover your company\'s management status through 4 pillars: People, Processes, Products, and Finance. With your answers, we\'ll use the Business Maturity Index (BMI), which will help us personalize recommendations, modules, and best partners behind Indice.',
        questionCount: '10 questions each',
        progress: 'Business diagnosis progress',
        progressOf: 'completed',
        printDiagnosis: 'Print diagnosis',
        start: 'Start',
        continue: 'Continue',
        doAgain: 'Do again',
        close: 'Close',
        question: 'Question',
        of: 'of',
        completed: 'completed',
        previous: 'Previous',
        next: 'Next',
        finish: 'Finish',
        restart: 'Restart diagnosis',
        pillars: {
          people: {
            title: 'People',
            description: 'Analyze talent, team structure, and communication.',
          },
          processes: {
            title: 'Processes',
            description: 'Evaluate flows, tasks, scalability, and efficiency.',
          },
          products: {
            title: 'Products',
            description: 'Analyze offering, market, sales, and value proposition.',
          },
          finance: {
            title: 'Finance',
            description: 'Evaluate financial control, management, and decision-making.',
          },
        },
        questions: {
          people: [
            { question: 'What is your main role?', options: ['Founder/CEO', 'Operations', 'Finance', 'Sales/Other'] },
            { question: 'How many people work?', options: ['Just me', '2 to 5', '6 to 20', '21 or more'] },
            { question: 'How is your team organized?', options: ['No structure', 'Basic roles', 'Defined areas', 'Formal org chart'] },
            { question: 'How do you assign tasks?', options: ['Improvised', 'Lists', 'Structured assignment', 'Management system'] },
            { question: 'Performance review?', options: ['Never', 'For problems', 'Weekly', 'With KPIs'] },
            { question: 'Delegation?', options: ['I do everything', 'Delegate and supervise', 'Delegate with control', 'Autonomous team'] },
            { question: 'Internal communication?', options: ['Informal', 'Chat', 'Meetings', 'Formal tools'] },
            { question: 'Meeting frequency?', options: ['Never', 'Sporadic', 'Weekly', 'Frequent'] },
            { question: 'Clarity of responsibilities?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Totally clear'] },
            { question: 'Ease of integration?', options: ['Very difficult', 'Difficult', 'Moderate', 'Easy'] },
          ],
          processes: [
            { question: 'Documented processes?', options: ['Nothing', 'Some', 'Most', 'Completely'] },
            { question: 'Task management?', options: ['Improvised', 'Lists', 'Tools', 'Formal system'] },
            { question: 'Progress monitoring?', options: ['Not monitored', 'Occasional', 'Reports', 'KPIs'] },
            { question: 'Automation?', options: ['Manual', 'Isolated tools', 'Partial automation', 'High automation'] },
            { question: 'Replicability?', options: ['Very difficult', 'With effort', 'Possible', 'Easy'] },
            { question: 'Where is time lost?', options: ['Manual work', 'Coordination', 'Information', 'Follow-up'] },
            { question: 'Dependence on people?', options: ['Total', 'Quite a bit', 'Some', 'Little'] },
            { question: 'Process clarity?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Totally clear'] },
            { question: 'Error management?', options: ['Reaction', 'Informal', 'Review', 'Continuous improvement'] },
            { question: 'Scalability?', options: ['None', 'Low', 'Medium', 'High'] },
          ],
          products: [
            { question: 'What do you sell?', options: ['Services', 'Products', 'Digital', 'Mixed'] },
            { question: 'Type of client?', options: ['B2C', 'B2B', 'Government', 'Mixed'] },
            { question: 'Main revenue?', options: ['Direct sale', 'Services', 'Subscription', 'Contracts'] },
            { question: 'Diversification?', options: ['One', 'Some', 'Several lines', 'Broad'] },
            { question: 'Price definition?', options: ['Intuition', 'Competition', 'Costs', 'Strategy'] },
            { question: 'Performance tracking?', options: ['Not measured', 'Sales only', 'Sales+profitability', 'Indicators'] },
            { question: 'Value proposition?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Very clear'] },
            { question: 'Customer feedback?', options: ['None', 'Informal', 'Surveys', 'Analysis'] },
            { question: 'Product evolution?', options: ['On the go', 'Occasional changes', 'Plans', 'Roadmap'] },
            { question: 'Commercial priority?', options: ['Clients', 'Current sales', 'Profitability', 'Scale'] },
          ],
          finance: [
            { question: 'Financial control?', options: ['Unstructured', 'Excel', 'Software', 'Integrated system'] },
            { question: 'Number review?', options: ['Never', 'Monthly', 'Weekly', 'Daily'] },
            { question: 'Cash flow?', options: ['Not controlled', 'Reaction', 'Review', 'Projection'] },
            { question: 'Clear costs?', options: ['Not clear', 'Approximate', 'Quite clear', 'Total control'] },
            { question: 'Margin?', options: ['Don\'t know', 'Estimated', 'Clear', 'Fully measured'] },
            { question: 'Financial decisions?', options: ['Intuition', 'Experience', 'Data', 'Models'] },
            { question: 'Predictable income?', options: ['Very variable', 'Variable', 'Stable', 'Very stable'] },
            { question: 'Debt management?', options: ['No control', 'Basic', 'Strategy', 'Optimized'] },
            { question: 'Crisis preparedness?', options: ['None', 'Low', 'Medium', 'High'] },
            { question: 'Tax compliance?', options: ['No control', 'Delays', 'Up to date', 'Tax strategy'] },
          ],
        },
      },
      billing: {
        title: 'Billing',
        subtitle: 'Tax data, payment method and service invoices',
        fiscalData: {
          title: 'Tax Data',
          subtitle: 'Configure your tax data according to country',
          country: 'Country',
          selectCountry: 'Select a country...',
          rfc: 'RFC',
          razonSocial: 'Legal name',
          regimenFiscal: 'Tax regime',
          usoCFDI: 'CFDI use (default)',
          codigoPostalFiscal: 'Postal Code (Tax)',
          nit: 'NIT',
          responsabilidadFiscal: 'Tax responsibility',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Legal name',
          inscricaoEstadual: 'State registration',
          ein: 'EIN (Tax ID)',
          legalName: 'Legal name',
          state: 'State',
          businessNumber: 'Business Number (BN)',
          province: 'Province',
          taxId: 'Tax ID',
          companyName: 'Company name',
          taxRegime: 'Tax regime',
          postalCode: 'Postal Code',
        },
        paymentMethod: {
          title: 'Payment Method',
          subtitle: 'Configure your method and payment frequency',
          type: 'Preferred payment type',
          selectMethod: 'Select a method...',
          cardNumber: 'Card number',
          cvv: 'CVV',
          expirationDate: 'Expiration date',
          cardholderName: 'Name on card',
          addCard: 'Add card',
          cancel: 'Cancel',
          savedCards: 'Saved cards',
          defaultCard: 'Default card',
          saveCard: 'Save card',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/YY',
            cardholderName: 'As it appears on card',
          },
        },
        automaticBilling: {
          title: 'Automatic Billing',
          subtitle: 'Configure renewal, billing day and invoice email',
          enable: 'Enable automatic renewal',
          description: 'Your subscription will renew automatically at the end of the period',
          billingDay: 'Billing day',
          selectDay: 'Day 1 of each month',
          emailForInvoices: 'Email for invoices',
          reminderNote: 'You will receive your invoices at this email',
        },
        currentBilling: {
          title: 'Current Billing Summary',
          plan: 'Plan:',
          notConfigured: 'Not configured',
          amount: 'Amount:',
          nextPayment: 'Next payment:',
        },
        invoices: {
          title: 'Service Invoices',
          subtitle: 'History of your subscription invoices',
          month: 'Month',
          year: 'Amount',
          status: 'Status',
          downloadPdf: 'Download PDF',
          date: 'Date',
          concept: 'Concept',
          amount: 'Amount',
          paid: 'Paid',
          pending: 'Pending',
        },
        billingFrequency: {
          title: 'Billing Frequency',
          note: 'Payments may have 100-30 discount',
          monthly: 'Monthly',
          quarterly: 'Quarterly',
          semiannual: 'Semiannual',
          annual: 'Annual',
        },
      },
      structure: {
        title: 'Business Structure',
        subtitle: 'Organization and business units',
        mode: {
          simple: 'Simple',
          multi: 'Multi-unit',
          simpleTitle: 'Single business',
          simpleDescription: 'You have one branch or company',
          multiTitle: 'Multiple companies or units',
          multiDescription: 'Multiple branches, subsidiaries or related companies',
          switchPrompt: 'Do you have more than one business or branch?',
          switchAction: 'Switch to multi-unit',
          multiNote: 'Manage multiple units from a single administration.',
        },
        identity: {
          simple: 'Business identity',
          holding: 'Holding identity',
          simpleDesc: 'Name, logo, industry and basic configuration of your company.',
          holdingDesc: 'Brand and general configuration (holding level).',
        },
        fields: {
          companyName: 'Name of the',
          holdingName: 'Name of the',
          industry: 'Industry',
          selectIndustry: 'Select an industry',
          country: 'Country',
          selectCountry: 'Select a country',
          logo: 'Logo of the',
          logoHolding: 'Logo of the',
          uploadImage: 'Upload image',
          description: 'Description',
          optional: '(optional)',
        },
        units: {
          title: 'Business units',
          description: 'Manage branches, subsidiaries or group companies',
          addUnit: '+ New unit',
          addBusiness: '+ Add business',
          unitName: 'Unit name',
          unitCountry: 'Operating country',
          businessName: 'Business name',
        },
        modal: {
          newUnit: 'New business unit',
          editUnit: 'Edit business unit',
          newBusiness: 'New business',
          editBusiness: 'Edit business',
          save: 'Save changes',
          cancel: 'Cancel',
          delete: 'Delete',
        },
      },
      profile: {
        title: 'My profile',
        subtitle: 'Personal information and account settings',
        fields: {
          fullName: 'Full name',
          email: 'Email',
          phone: 'Phone',
          position: 'Position',
          department: 'Department',
          profilePhoto: 'Profile photo',
          uploadPhoto: 'Upload photo',
        },
        save: 'Save changes',
      },
      users: {
        title: 'Users',
        subtitle: 'Manage system users and permissions',
        invite: 'Invite user',
        search: 'Search user...',
        filters: {
          all: 'All',
          active: 'Active',
          pending: 'Pending',
          inactive: 'Inactive',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'User',
        },
        status: {
          active: 'Active',
          pending: 'Pending',
          inactive: 'Inactive',
        },
        table: {
          name: 'Name',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          modules: 'Modules',
          actions: 'Actions',
        },
        actions: {
          edit: 'Edit',
          resend: 'Resend invitation',
          delete: 'Delete',
        },
        modal: {
          newUser: 'New user',
          editUser: 'Edit user',
          name: 'Name',
          email: 'Email',
          role: 'Role',
          selectRole: 'Select a role',
          modules: 'Modules',
          selectModules: 'Select modules...',
          inviteLink: 'Invitation link',
          copyLink: 'Copy link',
          copied: '✓ Copied',
          save: 'Save',
          cancel: 'Cancel',
          send: 'Send invitation',
        },
      },
      plan: {
        title: 'Choose the plan that best fits your business',
        subtitle: 'All plans include Learning Mode and continuous updates',
        mostPopular: 'Most popular',
        plans: {
          inicio: {
            name: 'Start',
            description: 'Begin organizing your business',
            button: 'Choose Start',
          },
          controla: {
            name: 'Control',
            description: 'Solid foundations to organize and control',
            button: 'Choose Control',
          },
          escala: {
            name: 'Scale',
            description: 'Optimize areas, standardize processes',
            button: 'Choose Scale',
          },
          corporativiza: {
            name: 'Enterprise',
            description: 'Automate with corporate AI and comprehensive vision',
            button: 'Choose Enterprise',
          },
        },
        features: {
          humanResources: 'Human Resources',
          processes: 'Processes and Tasks',
          products: 'Products (POS / CRM)',
          finance: 'Finance (Expenses / Petty Cash)',
          kpisBasic: 'Basic KPIs',
          kpisComplete: 'Complete KPIs',
          kpisAdvanced: 'Advanced KPIs',
          kpisCorporate: 'Corporate KPIs',
          users5: 'Up to 5 users',
          users10: 'Up to 10 users',
          users20: 'Up to 20 users',
          users25: 'Up to 25 users',
          complementaryModules: 'Complementary modules',
          modules2: '2 complementary modules',
          modules4: '4 complementary modules',
          allModules: 'All modules',
          aiAnalytics: 'Analytics & Sales AI',
          integrations: 'Integrations',
          sessions1: '1 session/month',
          sessions2: '2 sessions/month',
          sessions4: '4 sessions/month',
        },
        additionalInfo: {
          title: 'Additional information',
          extraUser: 'Additional user',
          extraUserPrice: '+$10 USD per extra user on any plan',
          learningMode: 'Learning Mode',
          learningModeDesc: 'Included in all plans at no additional cost',
          updates: 'Updates',
          updatesDesc: 'All improvements included automatically',
        },
      },
    },
  },
  'en-CA': {
    header: {
      notifications: 'Notifications',
      profile: 'My profile',
      settings: 'Settings',
      logout: 'Log out',
      learningMode: 'Learning mode',
    },
    sections: {
      kpis: 'Your KPIs',
      favorites: 'Your favourites',
      quickAccess: 'Quick access',
      basicModules: 'Basic modules',
      main: 'Main',
      complementaryModules: 'Complementary modules',
      additional: 'Additional',
      aiModules: 'Artificial intelligence',
      aiLabel: 'AI Modules',
      configureKpis: 'Configure KPIs',
    },
    kpis: {
      weeklyRevenue: 'Weekly Revenue',
      netProfit: 'Net Profit',
      activeClients: 'Active Clients',
      activeEmployees: 'Active Employees',
      pendingTasks: 'Pending Tasks',
      monthlyExpenses: 'Monthly Expenses',
      vsWeekBefore: 'vs last week',
      thisMonth: 'this month',
      newOnes: 'new',
      dueToday: 'due today',
      vsMonthBefore: 'vs last month',
    },
    modules: {
      panelInicial: 'Home Panel',
      recursosHumanos: 'Human Resources',
      procesosTareas: 'Processes and tasks',
      gastos: 'Expenses',
      cajaChica: 'Petty cash',
      puntoVenta: 'Point of sale',
      ventas: 'Sales',
      kpis: 'KPIs',
      mantenimiento: 'Maintenance',
      inventarios: 'Inventory',
      controlMinutas: 'Minutes control',
      limpieza: 'Cleaning',
      lavanderia: 'Laundry',
      transportacion: 'Transportation',
      vehiculosMaquinaria: 'Vehicles and machinery',
      inmuebles: 'Real estate',
      formularios: 'Forms',
      facturacion: 'Billing',
      correoElectronico: 'Email',
      climaLaboral: 'Work climate',
      indiceAgenteVentas: 'Sales Agent Index',
      indiceAnalitica: 'Analytics Index',
      capacitacion: 'Training',
      indiceCoach: 'Coach Index',
    },
    notifications: {
      newTask: 'New task assigned',
      expensePending: 'Expense pending approval',
      newClient: 'New client registered',
      timeAgo: {
        minutes: '5 minutes ago',
        hour: '1 hour ago',
        hours: '2 hours ago',
      },
    },
    loginPage: {
      workspaceBadge: 'Indice Workspace',
      accessBadge: 'Indice access',
      title: 'Sign in to your Indice workspace',
      subtitle:
        'Indice brings your business structure, people, expenses, controls, and daily execution into one connected platform built for real operating teams.',
      modulePills: ['Dashboard', 'Human Resources', 'Expenses', 'Analytics'],
      featureCards: [
        {
          title: 'One workspace for every team',
          description: 'Move from finance to operations, people, sales, and analytics without losing context.',
        },
        {
          title: 'Clarity from the first screen',
          description: 'Open Indice and immediately see the modules, metrics, and workflows that matter to your business.',
        },
      ],
      welcomeTitle: 'Welcome back',
      welcomeText:
        'Sign in to continue into the Indice dashboard, where your modules, team workflows, and operational visibility are all in one place.',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
      emailError: 'Enter a valid email address.',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      hidePassword: 'Hide password',
      showPassword: 'Show password',
      signIn: 'Sign in',
      signingIn: 'Signing in...',
      errorFallback: 'Unable to sign in.',
      insideTitle: 'What waits inside',
      insideText:
        'After login, Indice takes you straight into the main dashboard so you can move across modules, monitor activity, and keep every part of the business aligned.',
    },
    learningMode: {
      welcome: 'Welcome to Learning Mode!',
      hide: 'Hide',
      show: 'Show',
      businessBase: 'Business Base',
      clearBusinessStable: 'Clear Business Stable',
      functions: 'Functions',
      businessContext: 'Business Context',
      indiceMethodology: 'Indice Methodology',
      addModule: 'Open',
      viewBasicModules: 'View Basic Modules',
      previous: 'Previous',
      next: 'Next',
      stepOf: 'Step of',
      modules: {
        panelInicial: {
          title: 'Home Panel',
          subtitle: '🎯 Your starting point',
          description: 'The Home Panel is the starting point for organizing your company within the Indice system. 🏢 Here you define the basic information of your business and configure the structure that will allow all other modules to function properly. ✨ When this foundation is well configured, the system can help you manage people, processes, products, and finances with greater clarity.',
          functions: [
            '📊 Update your company data and keep your information always up to date.',
            '⚙️ Configure system preferences, such as language, currency, and operational settings.',
            '📋 Define the basic business information that other modules will use.',
            '🏗️ Establish your company structure and how its operation is organized.',
            '👥 Invite users and manage their access, assigning roles and permissions to each collaborator.',
            '🎓 Conduct initial business assessments that will help you understand what stage your company is in.',
            '📈 Calculate the BMI — Business Maturity Index, a tool that analyzes your business\'s current state and guides you on how to improve its management.',
          ],
          context: '💡 This module allows you to have an overview of your company and begin to structure how your business operates. When this foundation is well defined, all other system processes become clearer and easier to manage.',
          quote: '🏆 Organization is the first step to building a solid business.',
        },
        recursosHumanos: {
          title: 'Human Resources',
          subtitle: 'Manage your team',
          description: 'Manage employee and human resource information.',
          functions: ['View employees', 'Manage contracts'],
          context: 'This module allows you to effectively manage your team.',
          quote: 'Talent is the key to success.',
        },
        procesosTareas: {
          title: 'Processes and tasks',
          subtitle: 'Organize your work',
          description: 'Manage and perform important tasks and processes for your business.',
          functions: ['Create tasks', 'View processes'],
          context: 'This module helps you keep your business organized.',
          quote: 'Organization is the key to efficiency.',
        },
        gastos: {
          title: 'Expenses',
          subtitle: 'Control your expenses',
          description: 'Manage and control your expenses to keep your business in good condition.',
          functions: ['View expenses', 'Approve expenses'],
          context: 'This module allows you to effectively control your expenses.',
          quote: 'Expense control is fundamental for success.',
        },
        cajaChica: {
          title: 'Petty cash',
          subtitle: 'Minor expenses',
          description: 'Manage minor expenses for your business.',
          functions: ['View petty cash', 'Approve expenses'],
          context: 'This module allows you to efficiently manage minor expenses.',
          quote: 'Petty cash is essential for minor expenses.',
        },
        puntoVenta: {
          title: 'Point of sale',
          subtitle: 'Sell your products',
          description: 'Manage and perform sales for your business.',
          functions: ['Make sales', 'View sales'],
          context: 'This module allows you to efficiently sell your products.',
          quote: 'Sales are the key to success.',
        },
        ventas: {
          title: 'Sales',
          subtitle: 'Manage your sales',
          description: 'Manage and analyze your sales to improve your business.',
          functions: ['View sales', 'Analyze sales'],
          context: 'This module allows you to manage and analyze your sales.',
          quote: 'Sales are the foundation of your business.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Key metrics',
          description: 'Manage and analyze your KPIs to improve your business.',
          functions: ['View KPIs', 'Configure KPIs'],
          context: 'This module allows you to manage and analyze your KPIs.',
          quote: 'KPIs are essential for performance tracking.',
        },
      },
    },
    panelInicial: {
      title: 'Home Panel',
      back: 'Back',
      tabs: {
        profile: 'Profile',
        businessStructure: 'Business Structure',
        businessProfile: 'Business Profile',
        billing: 'Billing',
        plan: 'Plan',
        users: 'Users',
      },
      diagnosis: {
        title: 'Business Diagnosis',
        description: 'Help us better understand your company and management stage to personalize Indice.',
        centerTitle: 'Business Diagnosis Center',
        centerDescription: 'Discover your company\'s management status through 4 pillars: People, Processes, Products, and Finance. With your answers, we\'ll use the Business Maturity Index (BMI), which will help us personalize recommendations, modules, and best partners behind Indice.',
        questionCount: '10 questions each',
        progress: 'Business diagnosis progress',
        progressOf: 'completed',
        printDiagnosis: 'Print diagnosis',
        start: 'Start',
        continue: 'Continue',
        doAgain: 'Do again',
        close: 'Close',
        question: 'Question',
        of: 'of',
        completed: 'completed',
        previous: 'Previous',
        next: 'Next',
        finish: 'Finish',
        restart: 'Restart diagnosis',
        pillars: {
          people: {
            title: 'People',
            description: 'Analyze talent, team structure, and communication.',
          },
          processes: {
            title: 'Processes',
            description: 'Evaluate flows, tasks, scalability, and efficiency.',
          },
          products: {
            title: 'Products',
            description: 'Analyze offering, market, sales, and value proposition.',
          },
          finance: {
            title: 'Finance',
            description: 'Evaluate financial control, management, and decision-making.',
          },
        },
        questions: {
          people: [
            { question: 'What is your main role?', options: ['Founder/CEO', 'Operations', 'Finance', 'Sales/Other'] },
            { question: 'How many people work?', options: ['Just me', '2 to 5', '6 to 20', '21 or more'] },
            { question: 'How is your team organized?', options: ['No structure', 'Basic roles', 'Defined areas', 'Formal org chart'] },
            { question: 'How do you assign tasks?', options: ['Improvised', 'Lists', 'Structured assignment', 'Management system'] },
            { question: 'Performance review?', options: ['Never', 'For problems', 'Weekly', 'With KPIs'] },
            { question: 'Delegation?', options: ['I do everything', 'Delegate and supervise', 'Delegate with control', 'Autonomous team'] },
            { question: 'Internal communication?', options: ['Informal', 'Chat', 'Meetings', 'Formal tools'] },
            { question: 'Meeting frequency?', options: ['Never', 'Sporadic', 'Weekly', 'Frequent'] },
            { question: 'Clarity of responsibilities?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Totally clear'] },
            { question: 'Ease of integration?', options: ['Very difficult', 'Difficult', 'Moderate', 'Easy'] },
          ],
          processes: [
            { question: 'Documented processes?', options: ['Nothing', 'Some', 'Most', 'Completely'] },
            { question: 'Task management?', options: ['Improvised', 'Lists', 'Tools', 'Formal system'] },
            { question: 'Progress monitoring?', options: ['Not monitored', 'Occasional', 'Reports', 'KPIs'] },
            { question: 'Automation?', options: ['Manual', 'Isolated tools', 'Partial automation', 'High automation'] },
            { question: 'Replicability?', options: ['Very difficult', 'With effort', 'Possible', 'Easy'] },
            { question: 'Where is time lost?', options: ['Manual work', 'Coordination', 'Information', 'Follow-up'] },
            { question: 'Dependence on people?', options: ['Total', 'Quite a bit', 'Some', 'Little'] },
            { question: 'Process clarity?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Totally clear'] },
            { question: 'Error management?', options: ['Reaction', 'Informal', 'Review', 'Continuous improvement'] },
            { question: 'Scalability?', options: ['None', 'Low', 'Medium', 'High'] },
          ],
          products: [
            { question: 'What do you sell?', options: ['Services', 'Products', 'Digital', 'Mixed'] },
            { question: 'Type of client?', options: ['B2C', 'B2B', 'Government', 'Mixed'] },
            { question: 'Main revenue?', options: ['Direct sale', 'Services', 'Subscription', 'Contracts'] },
            { question: 'Diversification?', options: ['One', 'Some', 'Several lines', 'Broad'] },
            { question: 'Price definition?', options: ['Intuition', 'Competition', 'Costs', 'Strategy'] },
            { question: 'Performance tracking?', options: ['Not measured', 'Sales only', 'Sales+profitability', 'Indicators'] },
            { question: 'Value proposition?', options: ['Not clear', 'Somewhat clear', 'Quite clear', 'Very clear'] },
            { question: 'Customer feedback?', options: ['None', 'Informal', 'Surveys', 'Analysis'] },
            { question: 'Product evolution?', options: ['On the go', 'Occasional changes', 'Plans', 'Roadmap'] },
            { question: 'Commercial priority?', options: ['Clients', 'Current sales', 'Profitability', 'Scale'] },
          ],
          finance: [
            { question: 'Financial control?', options: ['Unstructured', 'Excel', 'Software', 'Integrated system'] },
            { question: 'Number review?', options: ['Never', 'Monthly', 'Weekly', 'Daily'] },
            { question: 'Cash flow?', options: ['Not controlled', 'Reaction', 'Review', 'Projection'] },
            { question: 'Clear costs?', options: ['Not clear', 'Approximate', 'Quite clear', 'Total control'] },
            { question: 'Margin?', options: ['Don\'t know', 'Estimated', 'Clear', 'Fully measured'] },
            { question: 'Financial decisions?', options: ['Intuition', 'Experience', 'Data', 'Models'] },
            { question: 'Predictable income?', options: ['Very variable', 'Variable', 'Stable', 'Very stable'] },
            { question: 'Debt management?', options: ['No control', 'Basic', 'Strategy', 'Optimized'] },
            { question: 'Crisis preparedness?', options: ['None', 'Low', 'Medium', 'High'] },
            { question: 'Tax compliance?', options: ['No control', 'Delays', 'Up to date', 'Tax strategy'] },
          ],
        },
      },
      billing: {
        title: 'Billing',
        subtitle: 'Tax data, payment method and service invoices',
        fiscalData: {
          title: 'Tax Data',
          subtitle: 'Configure your tax data according to country',
          country: 'Country',
          selectCountry: 'Select a country...',
          rfc: 'RFC',
          razonSocial: 'Legal name',
          regimenFiscal: 'Tax regime',
          usoCFDI: 'CFDI use (default)',
          codigoPostalFiscal: 'Postal Code (Tax)',
          nit: 'NIT',
          responsabilidadFiscal: 'Tax responsibility',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Legal name',
          inscricaoEstadual: 'State registration',
          ein: 'EIN (Tax ID)',
          legalName: 'Legal name',
          state: 'State',
          businessNumber: 'Business Number (BN)',
          province: 'Province',
          taxId: 'Tax ID',
          companyName: 'Company name',
          taxRegime: 'Tax regime',
          postalCode: 'Postal Code',
        },
        paymentMethod: {
          title: 'Payment Method',
          subtitle: 'Configure your method and payment frequency',
          type: 'Preferred payment type',
          selectMethod: 'Select a method...',
          cardNumber: 'Card number',
          cvv: 'CVV',
          expirationDate: 'Expiration date',
          cardholderName: 'Name on card',
          addCard: 'Add card',
          cancel: 'Cancel',
          savedCards: 'Saved cards',
          defaultCard: 'Default card',
          saveCard: 'Save card',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/YY',
            cardholderName: 'As it appears on card',
          },
        },
        automaticBilling: {
          title: 'Automatic Billing',
          subtitle: 'Configure renewal, billing day and invoice email',
          enable: 'Enable automatic renewal',
          description: 'Your subscription will renew automatically at the end of the period',
          billingDay: 'Billing day',
          selectDay: 'Day 1 of each month',
          emailForInvoices: 'Email for invoices',
          reminderNote: 'You will receive your invoices at this email',
        },
        currentBilling: {
          title: 'Current Billing Summary',
          plan: 'Plan:',
          notConfigured: 'Not configured',
          amount: 'Amount:',
          nextPayment: 'Next payment:',
        },
        invoices: {
          title: 'Service Invoices',
          subtitle: 'History of your subscription invoices',
          month: 'Month',
          year: 'Amount',
          status: 'Status',
          downloadPdf: 'Download PDF',
          date: 'Date',
          concept: 'Concept',
          amount: 'Amount',
          paid: 'Paid',
          pending: 'Pending',
        },
        billingFrequency: {
          title: 'Billing Frequency',
          note: 'Payments may have 100-30 discount',
          monthly: 'Monthly',
          quarterly: 'Quarterly',
          semiannual: 'Semiannual',
          annual: 'Annual',
        },
      },
      structure: {
        title: 'Business Structure',
        subtitle: 'Organization and business units',
        mode: {
          simple: 'Simple',
          multi: 'Multi-unit',
          simpleTitle: 'Single business',
          simpleDescription: 'You have one branch or company',
          multiTitle: 'Multiple companies or units',
          multiDescription: 'Multiple branches, subsidiaries or related companies',
          switchPrompt: 'Do you have more than one business or branch?',
          switchAction: 'Switch to multi-unit',
          multiNote: 'Manage multiple units from a single administration.',
        },
        identity: {
          simple: 'Business identity',
          holding: 'Holding identity',
          simpleDesc: 'Name, logo, industry and basic configuration of your company.',
          holdingDesc: 'Brand and general configuration (holding level).',
        },
        fields: {
          companyName: 'Name of the',
          holdingName: 'Name of the',
          industry: 'Industry',
          selectIndustry: 'Select an industry',
          country: 'Country',
          selectCountry: 'Select a country',
          logo: 'Logo of the',
          logoHolding: 'Logo of the',
          uploadImage: 'Upload image',
          description: 'Description',
          optional: '(optional)',
        },
        units: {
          title: 'Business units',
          description: 'Manage branches, subsidiaries or group companies',
          addUnit: '+ New unit',
          addBusiness: '+ Add business',
          unitName: 'Unit name',
          unitCountry: 'Operating country',
          businessName: 'Business name',
        },
        modal: {
          newUnit: 'New business unit',
          editUnit: 'Edit business unit',
          newBusiness: 'New business',
          editBusiness: 'Edit business',
          save: 'Save changes',
          cancel: 'Cancel',
          delete: 'Delete',
        },
      },
      profile: {
        title: 'My profile',
        subtitle: 'Personal information and account settings',
        fields: {
          fullName: 'Full name',
          email: 'Email',
          phone: 'Phone',
          position: 'Position',
          department: 'Department',
          profilePhoto: 'Profile photo',
          uploadPhoto: 'Upload photo',
        },
        save: 'Save changes',
      },
      users: {
        title: 'Users',
        subtitle: 'Manage system users and permissions',
        invite: 'Invite user',
        search: 'Search user...',
        filters: {
          all: 'All',
          active: 'Active',
          pending: 'Pending',
          inactive: 'Inactive',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'User',
        },
        status: {
          active: 'Active',
          pending: 'Pending',
          inactive: 'Inactive',
        },
        table: {
          name: 'Name',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          modules: 'Modules',
          actions: 'Actions',
        },
        actions: {
          edit: 'Edit',
          resend: 'Resend invitation',
          delete: 'Delete',
        },
        modal: {
          newUser: 'New user',
          editUser: 'Edit user',
          name: 'Name',
          email: 'Email',
          role: 'Role',
          selectRole: 'Select a role',
          modules: 'Modules',
          selectModules: 'Select modules...',
          inviteLink: 'Invitation link',
          copyLink: 'Copy link',
          copied: '✓ Copied',
          save: 'Save',
          cancel: 'Cancel',
          send: 'Send invitation',
        },
      },
      plan: {
        title: 'Choose the plan that best fits your business',
        subtitle: 'All plans include Learning Mode and continuous updates',
        mostPopular: 'Most popular',
        plans: {
          inicio: {
            name: 'Start',
            description: 'Begin organizing your business',
            button: 'Choose Start',
          },
          controla: {
            name: 'Control',
            description: 'Solid foundations to organise and control',
            button: 'Choose Control',
          },
          escala: {
            name: 'Scale',
            description: 'Optimise areas, standardise processes',
            button: 'Choose Scale',
          },
          corporativiza: {
            name: 'Enterprise',
            description: 'Automate with corporate AI and comprehensive vision',
            button: 'Choose Enterprise',
          },
        },
        features: {
          humanResources: 'Human Resources',
          processes: 'Processes and Tasks',
          products: 'Products (POS / CRM)',
          finance: 'Finance (Expenses / Petty Cash)',
          kpisBasic: 'Basic KPIs',
          kpisComplete: 'Complete KPIs',
          kpisAdvanced: 'Advanced KPIs',
          kpisCorporate: 'Corporate KPIs',
          users5: 'Up to 5 users',
          users10: 'Up to 10 users',
          users20: 'Up to 20 users',
          users25: 'Up to 25 users',
          complementaryModules: 'Complementary modules',
          modules2: '2 complementary modules',
          modules4: '4 complementary modules',
          allModules: 'All modules',
          aiAnalytics: 'Analytics & Sales AI',
          integrations: 'Integrations',
          sessions1: '1 session/month',
          sessions2: '2 sessions/month',
          sessions4: '4 sessions/month',
        },
        additionalInfo: {
          title: 'Additional information',
          extraUser: 'Additional user',
          extraUserPrice: '+$10 USD per extra user on any plan',
          learningMode: 'Learning Mode',
          learningModeDesc: 'Included in all plans at no additional cost',
          updates: 'Updates',
          updatesDesc: 'All improvements included automatically',
        },
      },
    },
  },
  'fr-CA': {
    header: {
      notifications: 'Notifications',
      profile: 'Mon profil',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      learningMode: 'Mode apprentissage',
    },
    sections: {
      kpis: 'Vos KPIs',
      favorites: 'Vos favoris',
      quickAccess: 'Accès rapide',
      basicModules: 'Modules de base',
      main: 'Principaux',
      complementaryModules: 'Modules complémentaires',
      additional: 'Additionnels',
      aiModules: 'Intelligence artificielle',
      aiLabel: 'Modules IA',
      configureKpis: 'Configurer KPIs',
    },
    kpis: {
      weeklyRevenue: 'Revenus Hebdomadaires',
      netProfit: 'Profit Net',
      activeClients: 'Clients Actifs',
      activeEmployees: 'Employés Actifs',
      pendingTasks: 'Tâches en Attente',
      monthlyExpenses: 'Dépenses du Mois',
      vsWeekBefore: 'vs semaine précédente',
      thisMonth: 'ce mois',
      newOnes: 'nouveaux',
      dueToday: 'dues aujourd\'hui',
      vsMonthBefore: 'vs mois précédent',
    },
    modules: {
      panelInicial: 'Panneau initial',
      recursosHumanos: 'Ressources humaines',
      procesosTareas: 'Processus et tâches',
      gastos: 'Dépenses',
      cajaChica: 'Petite caisse',
      puntoVenta: 'Point de vente',
      ventas: 'Ventes',
      kpis: 'KPIs',
      mantenimiento: 'Maintenance',
      inventarios: 'Inventaire',
      controlMinutas: 'Contrôle des procès-verbaux',
      limpieza: 'Nettoyage',
      lavanderia: 'Buanderie',
      transportacion: 'Transport',
      vehiculosMaquinaria: 'Véhicules et machines',
      inmuebles: 'Immobilier',
      formularios: 'Formulaires',
      facturacion: 'Facturation',
      correoElectronico: 'Courriel',
      climaLaboral: 'Climat de travail',
      indiceAgenteVentas: 'Index Agent de Ventes',
      indiceAnalitica: 'Index Analytique',
      capacitacion: 'Formation',
      indiceCoach: 'Index Coach',
    },
    notifications: {
      newTask: 'Nouvelle tâche assignée',
      expensePending: 'Dépense en attente d\'approbation',
      newClient: 'Nouveau client enregistré',
      timeAgo: {
        minutes: 'Il y a 5 minutes',
        hour: 'Il y a 1 heure',
        hours: 'Il y a 2 heures',
      },
    },
    loginPage: {
      workspaceBadge: 'Espace de travail Indice',
      accessBadge: 'Accès Indice',
      title: 'Connectez-vous à votre espace de travail Indice',
      subtitle:
        'Indice réunit la structure de votre entreprise, vos équipes, vos dépenses, vos contrôles et votre exécution quotidienne dans une seule plateforme connectée.',
      modulePills: ['Tableau de bord', 'Ressources humaines', 'Dépenses', 'Analytique'],
      featureCards: [
        {
          title: 'Un espace pour toute l’équipe',
          description: 'Passez de la finance aux opérations, aux équipes, aux ventes et à l’analytique sans perdre le contexte.',
        },
        {
          title: 'De la clarté dès le premier écran',
          description: 'Ouvrez Indice et voyez immédiatement les modules, les indicateurs et les flux qui comptent pour votre entreprise.',
        },
      ],
      welcomeTitle: 'Bon retour',
      welcomeText:
        'Connectez-vous pour accéder au tableau de bord Indice, où vos modules, flux de travail et votre visibilité opérationnelle se trouvent au même endroit.',
      emailLabel: 'Courriel',
      emailPlaceholder: 'vous@entreprise.com',
      emailError: 'Entrez une adresse courriel valide.',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      hidePassword: 'Masquer le mot de passe',
      showPassword: 'Afficher le mot de passe',
      signIn: 'Se connecter',
      signingIn: 'Connexion en cours...',
      errorFallback: 'Impossible de se connecter.',
      insideTitle: 'Ce qui vous attend',
      insideText:
        'Après la connexion, Indice vous amène directement au tableau de bord principal pour naviguer entre les modules, suivre l’activité et garder l’entreprise alignée.',
    },
    learningMode: {
      welcome: 'Bienvenue en mode d\'apprentissage !',
      hide: 'Masquer',
      show: 'Afficher',
      businessBase: 'Base d\'affaires',
      clearBusinessStable: 'Effacer la base d\'affaires stable',
      functions: 'Fonctions',
      businessContext: 'Contexte d\'affaires',
      indiceMethodology: 'Méthodologie Indice',
      addModule: 'Ouvrir',
      viewBasicModules: 'Voir les modules de base',
      previous: 'Précédent',
      next: 'Suivant',
      stepOf: 'Étape de',
      modules: {
        panelInicial: {
          title: 'Panneau initial',
          subtitle: '🎯 Votre point de départ',
          description: 'Le Panneau initial est le point de départ pour organiser votre entreprise dans le système Indice. 🏢 Ici, vous définissez les informations de base de votre entreprise et configurez la structure qui permettra à tous les autres modules de fonctionner correctement. ✨ Lorsque cette base est bien configurée, le système peut vous aider à gérer les personnes, les processus, les produits et les finances avec plus de clarté.',
          functions: [
            '📊 Mettre à jour les données de votre entreprise et maintenir vos informations toujours à jour.',
            '⚙️ Configurer les préférences du système, telles que la langue, la monnaie et les paramètres opérationnels.',
            '📋 Définir les informations de base de l\'entreprise que les autres modules utiliseront.',
            '🏗️ Établir la structure de votre entreprise et comment son fonctionnement est organisé.',
            '👥 Inviter des utilisateurs et gérer leurs accès, en attribuant des rôles et des permissions à chaque collaborateur.',
            '🎓 Effectuer des évaluations initiales de l\'entreprise qui vous aideront à comprendre à quel stade se trouve votre entreprise.',
            '📈 Calculer l\'IME — Indice de Maturité d\'Entreprise, un outil qui analyse l\'état actuel de votre entreprise et vous guide sur la façon d\'améliorer sa gestion.',
          ],
          context: '💡 Ce module vous permet d\'avoir une vue d\'ensemble de votre entreprise et de commencer à structurer le fonctionnement de votre affaire. Lorsque cette base est bien définie, tous les autres processus du système deviennent plus clairs et plus faciles à gérer.',
          quote: '🏆 L\'organisation est la première étape pour construire une entreprise solide.',
        },
        recursosHumanos: {
          title: 'Ressources humaines',
          subtitle: 'Gérer votre équipe',
          description: 'Gérer les informations des employés et des ressources humaines.',
          functions: ['Voir les employés', 'Gérer les contrats'],
          context: 'Ce module vous permet de gérer efficacement votre équipe.',
          quote: 'Le talent est la clé du succès.',
        },
        procesosTareas: {
          title: 'Processus et tâches',
          subtitle: 'Organiser votre travail',
          description: 'Gérer et effectuer des tâches et des processus importants pour votre affaire.',
          functions: ['Créer des tâches', 'Voir les processus'],
          context: 'Ce module vous aide à garder votre affaire organisée.',
          quote: 'L\'organisation est la clé de l\'efficacité.',
        },
        gastos: {
          title: 'Dépenses',
          subtitle: 'Contrôler vos dépenses',
          description: 'Gérer et contrôler vos dépenses pour maintenir votre affaire en bon état.',
          functions: ['Voir les dépenses', 'Approuver les dépenses'],
          context: 'Ce module vous permet de contrôler efficacement vos dépenses.',
          quote: 'Le contrôle des dépenses est fondamental pour le succès.',
        },
        cajaChica: {
          title: 'Petite caisse',
          subtitle: 'Dépenses mineures',
          description: 'Gérer les dépenses mineures pour votre affaire.',
          functions: ['Voir la petite caisse', 'Approuver les dépenses'],
          context: 'Ce module vous permet de gérer efficacement les dépenses mineures.',
          quote: 'La petite caisse est essentielle pour les dépenses mineures.',
        },
        puntoVenta: {
          title: 'Point de vente',
          subtitle: 'Vendre vos produits',
          description: 'Gérer et effectuer des ventes pour votre affaire.',
          functions: ['Faire des ventes', 'Voir les ventes'],
          context: 'Ce module vous permet de vendre efficacement vos produits.',
          quote: 'Les ventes sont la clé du succès.',
        },
        ventas: {
          title: 'Ventes',
          subtitle: 'Gérer vos ventes',
          description: 'Gérer et analyser vos ventes pour améliorer votre affaire.',
          functions: ['Voir les ventes', 'Analyser les ventes'],
          context: 'Ce module vous permet de gérer et analyser vos ventes.',
          quote: 'Les ventes sont la base de votre affaire.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Métriques clés',
          description: 'Gérer et analyser vos KPIs pour améliorer votre affaire.',
          functions: ['Voir les KPIs', 'Configurer les KPIs'],
          context: 'Ce module vous permet de gérer et analyser vos KPIs.',
          quote: 'Les KPIs sont essentiels pour le suivi des performances.',
        },
      },
    },
    panelInicial: {
      title: 'Panneau initial',
      back: 'Retour',
      tabs: {
        profile: 'Profil',
        businessStructure: 'Structure d\'entreprise',
        businessProfile: 'Profil d\'entreprise',
        billing: 'Facturation',
        plan: 'Plan',
        users: 'Utilisateurs',
      },
      diagnosis: {
        title: 'Diagnostic d\'entreprise',
        description: 'Aidez-nous à mieux connaître votre entreprise et son stade de gestion pour personnaliser Indice.',
        centerTitle: 'Centre de diagnostic d\'entreprise',
        centerDescription: 'Découvrez l\'état de gestion de votre entreprise à travers 4 piliers : Personnes, Processus, Produits et Finances. Avec vos réponses, nous utiliserons l\'Indice de Maturité Entrepreneuriale (IME), qui nous aidera à personnaliser les recommandations, modules et meilleurs partenaires derrière Indice.',
        questionCount: '10 questions chacun',
        progress: 'Progrès du diagnostic d\'entreprise',
        progressOf: 'complété',
        printDiagnosis: 'Imprimer le diagnostic',
        start: 'Commencer',
        continue: 'Continuer',
        doAgain: 'Recommencer',
        close: 'Fermer',
        question: 'Question',
        of: 'de',
        completed: 'complétées',
        previous: 'Précédent',
        next: 'Suivant',
        finish: 'Terminer',
        restart: 'Redémarrer le diagnostic',
        pillars: {
          people: {
            title: 'Personnes',
            description: 'Analyser les talents, la structure d\'équipe et la communication.',
          },
          processes: {
            title: 'Processus',
            description: 'Évaluer les flux, tâches, évolutivité et efficacité.',
          },
          products: {
            title: 'Produits',
            description: 'Analyser l\'offre, le marché, commercial et proposition de valeur.',
          },
          finance: {
            title: 'Finances',
            description: 'Évaluer le contrôle financier, la gestion et la prise de décision.',
          },
        },
        questions: {
          people: [
            { question: 'Quel est votre rôle principal?', options: ['Fondateur/PDG', 'Opérations', 'Finance', 'Commercial/Autre'] },
            { question: 'Combien de personnes travaillent?', options: ['Moi seul', '2 à 5', '6 à 20', '21 ou plus'] },
            { question: 'Comment votre équipe est-elle organisée?', options: ['Sans structure', 'Rôles de base', 'Domaines définis', 'Organigramme formel'] },
            { question: 'Comment attribuez-vous les tâches?', options: ['Improvisé', 'Listes', 'Attribution structurée', 'Système de gestion'] },
            { question: 'Évaluation des performances?', options: ['Jamais', 'Pour problèmes', 'Hebdomadaire', 'Avec KPIs'] },
            { question: 'Délégation?', options: ['Je fais tout', 'Délègue et supervise', 'Délègue avec contrôle', 'Équipe autonome'] },
            { question: 'Communication interne?', options: ['Informelle', 'Chat', 'Réunions', 'Outils formels'] },
            { question: 'Fréquence des réunions?', options: ['Jamais', 'Sporadique', 'Hebdomadaire', 'Fréquent'] },
            { question: 'Clarté des responsabilités?', options: ['Pas claire', 'Un peu claire', 'Assez claire', 'Totalement claire'] },
            { question: 'Facilité d\'intégration?', options: ['Très difficile', 'Difficile', 'Modéré', 'Facile'] },
          ],
          processes: [
            { question: 'Processus documentés?', options: ['Rien', 'Quelques-uns', 'Majorité', 'Complètement'] },
            { question: 'Gestion des tâches?', options: ['Improvisé', 'Listes', 'Outils', 'Système formel'] },
            { question: 'Suivi des progrès?', options: ['Pas surveillé', 'Occasionnel', 'Rapports', 'KPIs'] },
            { question: 'Automatisation?', options: ['Manuel', 'Outils isolés', 'Automatisation partielle', 'Haute automatisation'] },
            { question: 'Réplicabilité?', options: ['Très difficile', 'Avec effort', 'Possible', 'Facile'] },
            { question: 'Où perd-on du temps?', options: ['Manuel', 'Coordination', 'Information', 'Suivi'] },
            { question: 'Dépendance aux personnes?', options: ['Totale', 'Beaucoup', 'Un peu', 'Peu'] },
            { question: 'Clarté des processus?', options: ['Pas clairs', 'Un peu clairs', 'Assez clairs', 'Totalement clairs'] },
            { question: 'Gestion des erreurs?', options: ['Réaction', 'Informelle', 'Révision', 'Amélioration continue'] },
            { question: 'Évolutivité?', options: ['Nulle', 'Basse', 'Moyenne', 'Haute'] },
          ],
          products: [
            { question: 'Que vendez-vous?', options: ['Services', 'Produits', 'Numérique', 'Mixte'] },
            { question: 'Type de client?', options: ['B2C', 'B2B', 'Gouvernement', 'Mixte'] },
            { question: 'Revenu principal?', options: ['Vente directe', 'Services', 'Abonnement', 'Contrats'] },
            { question: 'Diversification?', options: ['Un', 'Quelques-uns', 'Plusieurs lignes', 'Large'] },
            { question: 'Définition des prix?', options: ['Intuition', 'Concurrence', 'Coûts', 'Stratégie'] },
            { question: 'Suivi des performances?', options: ['Pas mesuré', 'Ventes seulement', 'Ventes+rentabilité', 'Indicateurs'] },
            { question: 'Proposition de valeur?', options: ['Pas claire', 'Un peu claire', 'Assez claire', 'Très claire'] },
            { question: 'Retour client?', options: ['Aucun', 'Informel', 'Enquêtes', 'Analyse'] },
            { question: 'Évolution du produit?', options: ['En cours', 'Changements occasionnels', 'Plans', 'Feuille de route'] },
            { question: 'Priorité commerciale?', options: ['Clients', 'Ventes actuelles', 'Rentabilité', 'Échelle'] },
          ],
          finance: [
            { question: 'Contrôle financier?', options: ['Non structuré', 'Excel', 'Logiciel', 'Système intégré'] },
            { question: 'Révision des chiffres?', options: ['Jamais', 'Mensuelle', 'Hebdomadaire', 'Quotidienne'] },
            { question: 'Flux de trésorerie?', options: ['Pas contrôlé', 'Réaction', 'Révision', 'Projection'] },
            { question: 'Coûts clairs?', options: ['Pas clairs', 'Approximatifs', 'Assez clairs', 'Contrôle total'] },
            { question: 'Marge?', options: ['Je ne sais pas', 'Estimé', 'Clair', 'Totalement mesuré'] },
            { question: 'Décisions financières?', options: ['Intuition', 'Expérience', 'Données', 'Modèles'] },
            { question: 'Revenu prévisible?', options: ['Très variable', 'Variable', 'Stable', 'Très stable'] },
            { question: 'Gestion de la dette?', options: ['Sans contrôle', 'Basique', 'Stratégie', 'Optimisé'] },
            { question: 'Préparation aux crises?', options: ['Nulle', 'Basse', 'Moyenne', 'Haute'] },
            { question: 'Conformité fiscale?', options: ['Sans contrôle', 'Retards', 'À jour', 'Stratégie fiscale'] },
          ],
        },
      },
      billing: {
        title: 'Facturation',
        subtitle: 'Données fiscales, méthode de paiement et factures de service',
        fiscalData: {
          title: 'Données fiscales',
          subtitle: 'Configurez vos données fiscales selon le pays',
          country: 'Pays',
          selectCountry: 'Sélectionnez un pays...',
          rfc: 'RFC',
          razonSocial: 'Raison sociale',
          regimenFiscal: 'Régime fiscal',
          usoCFDI: 'Utilisation CFDI (par défaut)',
          codigoPostalFiscal: 'Code postal (fiscal)',
          nit: 'NIT',
          responsabilidadFiscal: 'Responsabilité fiscale',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Raison sociale',
          inscricaoEstadual: 'Inscription d\'État',
          ein: 'EIN (Tax ID)',
          legalName: 'Nom légal',
          state: 'État',
          businessNumber: 'Numéro d\'entreprise (NE)',
          province: 'Province',
          taxId: 'ID fiscal',
          companyName: 'Nom de l\'entreprise',
          taxRegime: 'Régime fiscal',
          postalCode: 'Code postal',
        },
        paymentMethod: {
          title: 'Méthode de paiement',
          subtitle: 'Configurez votre méthode et fréquence de paiement',
          type: 'Type de paiement préféré',
          selectMethod: 'Sélectionnez une méthode...',
          cardNumber: 'Numéro de carte',
          cvv: 'CVV',
          expirationDate: 'Date d\'expiration',
          cardholderName: 'Nom sur la carte',
          addCard: 'Ajouter une carte',
          cancel: 'Annuler',
          savedCards: 'Cartes enregistrées',
          defaultCard: 'Carte par défaut',
          saveCard: 'Enregistrer la carte',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/AA',
            cardholderName: 'Tel qu\'il apparaît sur la carte',
          },
        },
        automaticBilling: {
          title: 'Facturation automatique',
          subtitle: 'Configurez le renouvellement, le jour de facturation et l\'email de factures',
          enable: 'Activer le renouvellement automatique',
          description: 'Votre abonnement sera renouvelé automatiquement à la fin de la période',
          billingDay: 'Jour de facturation',
          selectDay: 'Jour 1 de chaque mois',
          emailForInvoices: 'Email pour les factures',
          reminderNote: 'Vous recevrez vos factures à cet email',
        },
        currentBilling: {
          title: 'Résumé de facturation actuel',
          plan: 'Plan:',
          notConfigured: 'Non configuré',
          amount: 'Montant:',
          nextPayment: 'Prochain paiement:',
        },
        invoices: {
          title: 'Factures de service',
          subtitle: 'Historique des factures de votre abonnement',
          month: 'Mois',
          year: 'Montant',
          status: 'Statut',
          downloadPdf: 'Télécharger PDF',
          date: 'Date',
          concept: 'Concept',
          amount: 'Montant',
          paid: 'Payée',
          pending: 'En attente',
        },
        billingFrequency: {
          title: 'Fréquence de facturation',
          note: 'Les paiements peuvent avoir 100-30 remise',
          monthly: 'Mensuel',
          quarterly: 'Trimestriel',
          semiannual: 'Semestriel',
          annual: 'Annuel',
        },
      },
      structure: {
        title: 'Structure d\'entreprise',
        subtitle: 'Organisation et unités commerciales',
        mode: {
          simple: 'Simple',
          multi: 'Multi-unité',
          simpleTitle: 'Une seule entreprise',
          simpleDescription: 'Vous avez une seule succursale ou entreprise',
          multiTitle: 'Plusieurs entreprises ou unités',
          multiDescription: 'Plusieurs succursales, filiales ou entreprises liées',
          switchPrompt: 'Avez-vous plus d\'une entreprise ou succursale?',
          switchAction: 'Passer au multi-unité',
          multiNote: 'Gérez plusieurs unités depuis une seule administration.',
        },
        identity: {
          simple: 'Identité d\'entreprise',
          holding: 'Identité du holding',
          simpleDesc: 'Nom, logo, industrie et configuration de base de votre entreprise.',
          holdingDesc: 'Marque et configuration générale (niveau holding).',
        },
        fields: {
          companyName: 'Nom de la',
          holdingName: 'Nom de la',
          industry: 'Industrie',
          selectIndustry: 'Sélectionnez une industrie',
          country: 'Pays',
          selectCountry: 'Sélectionnez un pays',
          logo: 'Logo de la',
          logoHolding: 'Logo de la',
          uploadImage: 'Télécharger l\'image',
          description: 'Description',
          optional: '(optionnel)',
        },
        units: {
          title: 'Unités commerciales',
          description: 'Gérez les succursales, filiales ou entreprises du groupe',
          addUnit: '+ Nouvelle unité',
          addBusiness: '+ Ajouter une entreprise',
          unitName: 'Nom de l\'unité',
          unitCountry: 'Pays d\'opération',
          businessName: 'Nom de l\'entreprise',
        },
        modal: {
          newUnit: 'Nouvelle unité commerciale',
          editUnit: 'Modifier l\'unité commerciale',
          newBusiness: 'Nouvelle entreprise',
          editBusiness: 'Modifier l\'entreprise',
          save: 'Enregistrer les modifications',
          cancel: 'Annuler',
          delete: 'Supprimer',
        },
      },
      profile: {
        title: 'Mon profil',
        subtitle: 'Informations personnelles et paramètres du compte',
        fields: {
          fullName: 'Nom complet',
          email: 'Courriel',
          phone: 'Téléphone',
          position: 'Poste',
          department: 'Département',
          profilePhoto: 'Photo de profil',
          uploadPhoto: 'Télécharger photo',
        },
        save: 'Enregistrer les modifications',
      },
      users: {
        title: 'Utilisateurs',
        subtitle: 'Gérer les utilisateurs et les autorisations du système',
        invite: 'Inviter un utilisateur',
        search: 'Rechercher un utilisateur...',
        filters: {
          all: 'Tous',
          active: 'Actifs',
          pending: 'En attente',
          inactive: 'Inactifs',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'Utilisateur',
        },
        status: {
          active: 'Actif',
          pending: 'En attente',
          inactive: 'Inactif',
        },
        table: {
          name: 'Nom',
          email: 'Courriel',
          role: 'Rôle',
          status: 'Statut',
          modules: 'Modules',
          actions: 'Actions',
        },
        actions: {
          edit: 'Modifier',
          resend: 'Renvoyer l\'invitation',
          delete: 'Supprimer',
        },
        modal: {
          newUser: 'Nouvel utilisateur',
          editUser: 'Modifier l\'utilisateur',
          name: 'Nom',
          email: 'Courriel',
          role: 'Rôle',
          selectRole: 'Sélectionnez un rôle',
          modules: 'Modules',
          selectModules: 'Sélectionnez des modules...',
          inviteLink: 'Lien d\'invitation',
          copyLink: 'Copier le lien',
          copied: '✓ Copié',
          save: 'Enregistrer',
          cancel: 'Annuler',
          send: 'Envoyer l\'invitation',
        },
      },
      plan: {
        title: 'Choisissez le plan qui convient le mieux à votre entreprise',
        subtitle: 'Tous les plans incluent le Mode Apprentissage et les mises à jour continues',
        mostPopular: 'Le plus populaire',
        plans: {
          inicio: {
            name: 'Démarrage',
            description: 'Commencez à organiser votre entreprise',
            button: 'Choisir Démarrage',
          },
          controla: {
            name: 'Contrôle',
            description: 'Bases solides pour organiser et contrôler',
            button: 'Choisir Contrôle',
          },
          escala: {
            name: 'Échelle',
            description: 'Optimisez les zones, standardisez les processus',
            button: 'Choisir Échelle',
          },
          corporativiza: {
            name: 'Entreprise',
            description: 'Automatisez avec l\'IA d\'entreprise et une vision globale',
            button: 'Choisir Entreprise',
          },
        },
        features: {
          humanResources: 'Ressources Humaines',
          processes: 'Processus et Tâches',
          products: 'Produits (POS / CRM)',
          finance: 'Finances (Dépenses / Petite Caisse)',
          kpisBasic: 'KPIs de Base',
          kpisComplete: 'KPIs Complets',
          kpisAdvanced: 'KPIs Avancés',
          kpisCorporate: 'KPIs d\'Entreprise',
          users5: 'Jusqu\'à 5 utilisateurs',
          users10: 'Jusqu\'à 10 utilisateurs',
          users20: 'Jusqu\'à 20 utilisateurs',
          users25: 'Jusqu\'à 25 utilisateurs',
          complementaryModules: 'Modules complémentaires',
          modules2: '2 modules complémentaires',
          modules4: '4 modules complémentaires',
          allModules: 'Tous les modules',
          aiAnalytics: 'IA Analytique et Ventes',
          integrations: 'Intégrations',
          sessions1: '1 session/mois',
          sessions2: '2 sessions/mois',
          sessions4: '4 sessions/mois',
        },
        additionalInfo: {
          title: 'Informations supplémentaires',
          extraUser: 'Utilisateur supplémentaire',
          extraUserPrice: '+10 $ USD par utilisateur supplémentaire sur n\'importe quel plan',
          learningMode: 'Mode Apprentissage',
          learningModeDesc: 'Inclus dans tous les plans sans frais supplémentaires',
          updates: 'Mises à jour',
          updatesDesc: 'Toutes les améliorations incluses automatiquement',
        },
      },
    },
  },
  'pt-BR': {
    header: {
      notifications: 'Notificações',
      profile: 'Meu perfil',
      settings: 'Configurações',
      logout: 'Sair',
      learningMode: 'Modo aprendiz',
    },
    sections: {
      kpis: 'Seus KPIs',
      favorites: 'Seus favoritos',
      quickAccess: 'Acesso rápido',
      basicModules: 'Módulos básicos',
      main: 'Principais',
      complementaryModules: 'Módulos complementares',
      additional: 'Adicionais',
      aiModules: 'Inteligência artificial',
      aiLabel: 'Módulos de IA',
      configureKpis: 'Configurar KPIs',
    },
    kpis: {
      weeklyRevenue: 'Receitas Semanais',
      netProfit: 'Lucro Líquido',
      activeClients: 'Clientes Ativos',
      activeEmployees: 'Funcionários Ativos',
      pendingTasks: 'Tarefas Pendentes',
      monthlyExpenses: 'Despesas do Mês',
      vsWeekBefore: 'vs semana anterior',
      thisMonth: 'este mês',
      newOnes: 'novos',
      dueToday: 'vencem hoje',
      vsMonthBefore: 'vs mês anterior',
    },
    modules: {
      panelInicial: 'Painel Inicial',
      recursosHumanos: 'Recursos Humanos',
      procesosTareas: 'Processos e tarefas',
      gastos: 'Despesas',
      cajaChica: 'Caixa pequeno',
      puntoVenta: 'Ponto de venda',
      ventas: 'Vendas',
      kpis: 'KPIs',
      mantenimiento: 'Manutenção',
      inventarios: 'Inventário',
      controlMinutas: 'Controle de atas',
      limpieza: 'Limpeza',
      lavanderia: 'Lavanderia',
      transportacion: 'Transporte',
      vehiculosMaquinaria: 'Veículos e maquinário',
      inmuebles: 'Imóveis',
      formularios: 'Formulários',
      facturacion: 'Faturamento',
      correoElectronico: 'E-mail',
      climaLaboral: 'Clima de trabalho',
      indiceAgenteVentas: 'Índice Agente de Vendas',
      indiceAnalitica: 'Índice Analítica',
      capacitacion: 'Treinamento',
      indiceCoach: 'Índice Coach',
    },
    notifications: {
      newTask: 'Nova tarefa atribuída',
      expensePending: 'Despesa pendente de aprovação',
      newClient: 'Novo cliente registrado',
      timeAgo: {
        minutes: 'Há 5 minutos',
        hour: 'Há 1 hora',
        hours: 'Há 2 horas',
      },
    },
    loginPage: {
      workspaceBadge: 'Espaço de trabalho Indice',
      accessBadge: 'Acesso Indice',
      title: 'Entre no seu espaço de trabalho Indice',
      subtitle:
        'Indice conecta a estrutura do seu negócio, sua equipe, despesas, controles e execução diária em uma única plataforma para equipes operacionais reais.',
      modulePills: ['Dashboard', 'Recursos Humanos', 'Despesas', 'Análises'],
      featureCards: [
        {
          title: 'Um espaço para toda a equipe',
          description: 'Vá de finanças para operações, pessoas, vendas e análises sem perder o contexto.',
        },
        {
          title: 'Clareza desde a primeira tela',
          description: 'Abra o Indice e veja imediatamente os módulos, métricas e fluxos que importam para o seu negócio.',
        },
      ],
      welcomeTitle: 'Bem-vindo de volta',
      welcomeText:
        'Entre para continuar no dashboard do Indice, onde seus módulos, fluxos de trabalho e visibilidade operacional ficam no mesmo lugar.',
      emailLabel: 'E-mail',
      emailPlaceholder: 'voce@empresa.com',
      emailError: 'Digite um endereço de e-mail válido.',
      passwordLabel: 'Senha',
      passwordPlaceholder: 'Digite sua senha',
      hidePassword: 'Ocultar senha',
      showPassword: 'Mostrar senha',
      signIn: 'Entrar',
      signingIn: 'Entrando...',
      errorFallback: 'Não foi possível entrar.',
      insideTitle: 'O que espera por você',
      insideText:
        'Depois do login, o Indice leva você direto ao dashboard principal para navegar entre módulos, acompanhar a atividade e manter todas as áreas do negócio alinhadas.',
    },
    learningMode: {
      welcome: 'Bem-vindo ao Modo de Aprendizado!',
      hide: 'Ocultar',
      show: 'Mostrar',
      businessBase: 'Base de Negócios',
      clearBusinessStable: 'Limpar Base de Negócios Estável',
      functions: 'Funções',
      businessContext: 'Contexto de Negócios',
      indiceMethodology: 'Metodologia Índice',
      addModule: 'Abrir',
      viewBasicModules: 'Ver Módulos Básicos',
      previous: 'Anterior',
      next: 'Próximo',
      stepOf: 'Passo de',
      modules: {
        panelInicial: {
          title: 'Painel Inicial',
          subtitle: '🎯 Seu ponto de partida',
          description: 'O Painel Inicial é o ponto de partida para organizar sua empresa dentro do sistema Índice. 🏢 Aqui você define as informações básicas do seu negócio e configura a estrutura que permitirá que todos os outros módulos funcionem corretamente. ✨ Quando essa base está bem configurada, o sistema pode ajudá-lo a gerenciar pessoas, processos, produtos e finanças com maior clareza.',
          functions: [
            '📊 Atualizar os dados da sua empresa e manter suas informações sempre atualizadas.',
            '⚙️ Configurar as preferências do sistema, como idioma, moeda e configurações operacionais.',
            '📋 Definir as informações básicas do negócio que os outros módulos utilizarão.',
            '🏗️ Estabelecer a estrutura da sua empresa e como sua operação está organizada.',
            '👥 Convidar usuários e gerenciar seus acessos, atribuindo funções e permissões a cada colaborador.',
            '🎓 Realizar avaliações iniciais do negócio que ajudarão você a entender em que estágio sua empresa se encontra.',
            '📈 Calcular o IME — Índice de Maturidade Empresarial, uma ferramenta que analisa o estado atual do seu negócio e orienta sobre como melhorar sua gestão.',
          ],
          context: '💡 Este módulo permite que você tenha uma visão geral da sua empresa e comece a estruturar como seu negócio opera. Quando essa base está bem definida, todos os outros processos do sistema se tornam mais claros e fáceis de gerenciar.',
          quote: '🏆 A organização é o primeiro passo para construir um negócio sólido.',
        },
        recursosHumanos: {
          title: 'Recursos Humanos',
          subtitle: 'Gerencie sua equipe',
          description: 'Gerencie informações de funcionários e recursos humanos.',
          functions: ['Ver funcionários', 'Gerenciar contratos'],
          context: 'Este módulo permite gerenciar eficazmente sua equipe.',
          quote: 'O talento é a chave para o sucesso.',
        },
        procesosTareas: {
          title: 'Processos e tarefas',
          subtitle: 'Organize seu trabalho',
          description: 'Gerencie e execute tarefas e processos importantes para seu negócio.',
          functions: ['Criar tarefas', 'Ver processos'],
          context: 'Este módulo ajuda a manter seu negócio organizado.',
          quote: 'A organização é a chave para a eficiência.',
        },
        gastos: {
          title: 'Despesas',
          subtitle: 'Controle suas despesas',
          description: 'Gerencie e controle suas despesas para manter seu negócio em bom estado.',
          functions: ['Ver despesas', 'Aprovar despesas'],
          context: 'Este módulo permite controlar suas despesas de forma eficaz.',
          quote: 'O controle de despesas é fundamental para o sucesso.',
        },
        cajaChica: {
          title: 'Caixa pequeno',
          subtitle: 'Despesas menores',
          description: 'Gerencie despesas menores para seu negócio.',
          functions: ['Ver caixa pequeno', 'Aprovar despesas'],
          context: 'Este módulo permite gerenciar despesas menores de forma eficiente.',
          quote: 'O caixa pequeno é essencial para despesas menores.',
        },
        puntoVenta: {
          title: 'Ponto de venda',
          subtitle: 'Venda seus produtos',
          description: 'Gerencie e execute vendas para seu negócio.',
          functions: ['Realizar vendas', 'Ver vendas'],
          context: 'Este módulo permite vender seus produtos de forma eficiente.',
          quote: 'A venda é a chave para o sucesso.',
        },
        ventas: {
          title: 'Vendas',
          subtitle: 'Gerencie suas vendas',
          description: 'Gerencie e analise suas vendas para melhorar seu negócio.',
          functions: ['Ver vendas', 'Analisar vendas'],
          context: 'Este módulo permite gerenciar e analisar suas vendas.',
          quote: 'As vendas são a base do seu negócio.',
        },
        kpis: {
          title: 'KPIs',
          subtitle: 'Métricas-chave',
          description: 'Gerencie e analise seus KPIs para melhorar seu negócio.',
          functions: ['Ver KPIs', 'Configurar KPIs'],
          context: 'Este módulo permite gerenciar e analisar seus KPIs.',
          quote: 'Os KPIs são essenciais para o acompanhamento do desempenho.',
        },
      },
    },
    panelInicial: {
      title: 'Painel Inicial',
      back: 'Voltar',
      tabs: {
        profile: 'Perfil',
        businessStructure: 'Estrutura Empresarial',
        businessProfile: 'Perfil empresarial',
        billing: 'Faturamento',
        plan: 'Plano',
        users: 'Usuários',
      },
      diagnosis: {
        title: 'Diagnóstico empresarial',
        description: 'Ajude-nos a conhecer melhor sua empresa e o estágio de gestão para personalizar o Índice.',
        centerTitle: 'Centro de diagnóstico empresarial',
        centerDescription: 'Descubra o estado de gestão da sua empresa através de 4 pilares: Pessoas, Processos, Produtos e Finanças. Com as respostas, usaremos o Índice de Maturidade Empresarial (IME), que nos ajudará a personalizar recomendações, módulos e melhores parceiros por trás do Índice.',
        questionCount: '10 perguntas cada',
        progress: 'Progresso do diagnóstico empresarial',
        progressOf: 'concluído',
        printDiagnosis: 'Imprimir diagnóstico',
        start: 'Começar',
        continue: 'Continuar',
        doAgain: 'Fazer novamente',
        close: 'Fechar',
        question: 'Pergunta',
        of: 'de',
        completed: 'concluídas',
        previous: 'Anterior',
        next: 'Próximo',
        finish: 'Finalizar',
        restart: 'Reiniciar diagnóstico',
        pillars: {
          people: {
            title: 'Pessoas',
            description: 'Analisa talentos, estrutura de equipe e comunicação.',
          },
          processes: {
            title: 'Processos',
            description: 'Avalia fluxos, tarefas, escalabilidade e eficiência.',
          },
          products: {
            title: 'Produtos',
            description: 'Analisa oferta, mercado, comercial e proposta de valor.',
          },
          finance: {
            title: 'Finanças',
            description: 'Avalia controle financeiro, gestão e tomada de decisões.',
          },
        },
        questions: {
          people: [
            { question: 'Qual é o seu papel principal?', options: ['Fundador/CEO', 'Operações', 'Finanças', 'Comercial/Outro'] },
            { question: 'Quantas pessoas trabalham?', options: ['Só eu', '2 a 5', '6 a 20', '21 ou mais'] },
            { question: 'Como sua equipe está organizada?', options: ['Sem estrutura', 'Papéis básicos', 'Áreas definidas', 'Organograma formal'] },
            { question: 'Como atribuem tarefas?', options: ['Improvisado', 'Listas', 'Atribuição estruturada', 'Sistema de gestão'] },
            { question: 'Revisão de desempenho?', options: ['Nunca', 'Por problemas', 'Semanal', 'Com KPIs'] },
            { question: 'Delegação?', options: ['Faço tudo', 'Delego e supervisiono', 'Delego com controle', 'Equipe autônoma'] },
            { question: 'Comunicação interna?', options: ['Informal', 'Chat', 'Reuniões', 'Ferramentas formais'] },
            { question: 'Frequência de reuniões?', options: ['Nunca', 'Esporádico', 'Semanal', 'Frequente'] },
            { question: 'Clareza de responsabilidades?', options: ['Nada clara', 'Um pouco clara', 'Bastante clara', 'Totalmente clara'] },
            { question: 'Facilidade de integração?', options: ['Muito difícil', 'Difícil', 'Moderado', 'Fácil'] },
          ],
          processes: [
            { question: 'Processos documentados?', options: ['Nada', 'Alguns', 'Maioria', 'Totalmente'] },
            { question: 'Gestão de tarefas?', options: ['Improvisado', 'Listas', 'Ferramentas', 'Sistema formal'] },
            { question: 'Monitoramento de progresso?', options: ['Não monitorado', 'Ocasional', 'Relatórios', 'KPIs'] },
            { question: 'Automação?', options: ['Manual', 'Ferramentas isoladas', 'Automação parcial', 'Alta automação'] },
            { question: 'Replicabilidade?', options: ['Muito difícil', 'Com esforço', 'Possível', 'Fácil'] },
            { question: 'Onde se perde tempo?', options: ['Manual', 'Coordenação', 'Informação', 'Acompanhamento'] },
            { question: 'Dependência de pessoas?', options: ['Total', 'Bastante', 'Alguma', 'Pouca'] },
            { question: 'Clareza de processos?', options: ['Nada claros', 'Um pouco claros', 'Bastante claros', 'Totalmente claros'] },
            { question: 'Gestão de erros?', options: ['Reação', 'Informal', 'Revisão', 'Melhoria contínua'] },
            { question: 'Escalabilidade?', options: ['Nula', 'Baixa', 'Média', 'Alta'] },
          ],
          products: [
            { question: 'O que você vende?', options: ['Serviços', 'Produtos', 'Digital', 'Misto'] },
            { question: 'Tipo de cliente?', options: ['B2C', 'B2B', 'Governo', 'Misto'] },
            { question: 'Receita principal?', options: ['Venda direta', 'Serviços', 'Assinatura', 'Contratos'] },
            { question: 'Diversificação?', options: ['Um', 'Alguns', 'Várias linhas', 'Amplo'] },
            { question: 'Definição de preços?', options: ['Intuição', 'Concorrência', 'Custos', 'Estratégia'] },
            { question: 'Acompanhamento de desempenho?', options: ['Não medido', 'Só vendas', 'Vendas+rentabilidade', 'Indicadores'] },
            { question: 'Proposta de valor?', options: ['Não clara', 'Um pouco clara', 'Bastante clara', 'Muito clara'] },
            { question: 'Feedback do cliente?', options: ['Nenhum', 'Informal', 'Pesquisas', 'Análise'] },
            { question: 'Evolução do produto?', options: ['Na hora', 'Mudanças ocasionais', 'Planos', 'Roteiro'] },
            { question: 'Prioridade comercial?', options: ['Clientes', 'Vendas atuais', 'Rentabilidade', 'Escalar'] },
          ],
          finance: [
            { question: 'Controle financeiro?', options: ['Não estruturado', 'Excel', 'Software', 'Sistema integrado'] },
            { question: 'Revisão de números?', options: ['Nunca', 'Mensal', 'Semanal', 'Diário'] },
            { question: 'Fluxo de caixa?', options: ['Não controlado', 'Reação', 'Revisão', 'Projeção'] },
            { question: 'Custos claros?', options: ['Não claros', 'Aproximados', 'Bastante claros', 'Controle total'] },
            { question: 'Margem?', options: ['Não sei', 'Estimado', 'Claro', 'Totalmente medido'] },
            { question: 'Decisões financeiras?', options: ['Intuição', 'Experiência', 'Dados', 'Modelos'] },
            { question: 'Renda previsível?', options: ['Muito variável', 'Variável', 'Estável', 'Muito estável'] },
            { question: 'Gestão de dívidas?', options: ['Sem controle', 'Básico', 'Estratégia', 'Otimizado'] },
            { question: 'Preparação para crises?', options: ['Nula', 'Baixa', 'Média', 'Alta'] },
            { question: 'Conformidade fiscal?', options: ['Sem controle', 'Atrasos', 'Em dia', 'Estratégia fiscal'] },
          ],
        },
      },
      billing: {
        title: 'Faturamento',
        subtitle: 'Dados fiscais, método de pagamento e faturas do serviço',
        fiscalData: {
          title: 'Dados fiscais',
          subtitle: 'Configure seus dados fiscais de acordo com o país',
          country: 'País',
          selectCountry: 'Selecione um país...',
          rfc: 'RFC',
          razonSocial: 'Razão social',
          regimenFiscal: 'Regime fiscal',
          usoCFDI: 'Uso de CFDI (padrão)',
          codigoPostalFiscal: 'Código Postal (Fiscal)',
          nit: 'NIT',
          responsabilidadFiscal: 'Responsabilidade fiscal',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: 'Razão social',
          inscricaoEstadual: 'Inscrição estadual',
          ein: 'EIN (Tax ID)',
          legalName: 'Nome legal',
          state: 'Estado',
          businessNumber: 'Número de negócio (BN)',
          province: 'Província',
          taxId: 'ID fiscal',
          companyName: 'Nome da empresa',
          taxRegime: 'Regime fiscal',
          postalCode: 'Código Postal',
        },
        paymentMethod: {
          title: 'Método de pagamento',
          subtitle: 'Configure seu método e frequência de pagamento',
          type: 'Tipo de pagamento preferido',
          selectMethod: 'Selecione um método...',
          cardNumber: 'Número do cartão',
          cvv: 'CVV',
          expirationDate: 'Data de expiração',
          cardholderName: 'Nome no cartão',
          addCard: 'Adicionar cartão',
          cancel: 'Cancelar',
          savedCards: 'Cartões salvos',
          defaultCard: 'Cartão padrão',
          saveCard: 'Salvar cartão',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/AA',
            cardholderName: 'Como aparece no cartão',
          },
        },
        automaticBilling: {
          title: 'Faturamento automático',
          subtitle: 'Configure renovação, dia de cobrança e e-mail de faturas',
          enable: 'Ativar renovação automática',
          description: 'Sua assinatura será renovada automaticamente ao final do período',
          billingDay: 'Dia de faturamento',
          selectDay: 'Dia 1 de cada mês',
          emailForInvoices: 'E-mail para faturas',
          reminderNote: 'Você receberá suas faturas neste e-mail',
        },
        currentBilling: {
          title: 'Resumo de cobrança atual',
          plan: 'Plano:',
          notConfigured: 'Não configurado',
          amount: 'Valor:',
          nextPayment: 'Próximo pagamento:',
        },
        invoices: {
          title: 'Faturas do serviço',
          subtitle: 'Histórico de faturas da sua assinatura',
          month: 'Mês',
          year: 'Valor',
          status: 'Status',
          downloadPdf: 'Baixar PDF',
          date: 'Data',
          concept: 'Conceito',
          amount: 'Valor',
          paid: 'Paga',
          pending: 'Pendente',
        },
        billingFrequency: {
          title: 'Frequência de faturamento',
          note: 'Os pagamentos podem ter desconto de 100-30',
          monthly: 'Mensal',
          quarterly: 'Trimestral',
          semiannual: 'Semestral',
          annual: 'Anual',
        },
      },
      structure: {
        title: 'Estrutura Empresarial',
        subtitle: 'Organização e unidades de negócio',
        mode: {
          simple: 'Simples',
          multi: 'Multi-unidade',
          simpleTitle: 'Um único negócio',
          simpleDescription: 'Você tem uma única filial ou empresa',
          multiTitle: 'Várias empresas ou unidades',
          multiDescription: 'Múltiplas filiais, subsidiárias ou empresas relacionadas',
          switchPrompt: 'Você tem mais de um negócio ou filial?',
          switchAction: 'Mudar para multi-unidade',
          multiNote: 'Gerencie várias unidades a partir de uma única administração.',
        },
        identity: {
          simple: 'Identidade empresarial',
          holding: 'Identidade da holding',
          simpleDesc: 'Nome, logo, indústria e configuração básica da sua empresa.',
          holdingDesc: 'Marca e configuração geral (nível holding).',
        },
        fields: {
          companyName: 'Nome da',
          holdingName: 'Nome da',
          industry: 'Indústria',
          selectIndustry: 'Selecione uma indústria',
          country: 'País',
          selectCountry: 'Selecione um país',
          logo: 'Logo da',
          logoHolding: 'Logo da',
          uploadImage: 'Carregar imagem',
          description: 'Descrição',
          optional: '(opcional)',
        },
        units: {
          title: 'Unidades de negócio',
          description: 'Gerencie filiais, subsidiárias ou empresas do grupo',
          addUnit: '+ Nova unidade',
          addBusiness: '+ Adicionar negócio',
          unitName: 'Nome da unidade',
          unitCountry: 'País de operação',
          businessName: 'Nome do negócio',
        },
        modal: {
          newUnit: 'Nova unidade de negócio',
          editUnit: 'Editar unidade de negócio',
          newBusiness: 'Novo negócio',
          editBusiness: 'Editar negócio',
          save: 'Salvar alterações',
          cancel: 'Cancelar',
          delete: 'Excluir',
        },
      },
      profile: {
        title: 'Meu perfil',
        subtitle: 'Informações pessoais e configurações da conta',
        fields: {
          fullName: 'Nome completo',
          email: 'E-mail',
          phone: 'Telefone',
          position: 'Cargo',
          department: 'Departamento',
          profilePhoto: 'Foto de perfil',
          uploadPhoto: 'Carregar foto',
        },
        save: 'Salvar alterações',
      },
      users: {
        title: 'Usuários',
        subtitle: 'Gerenciar usuários e permissões do sistema',
        invite: 'Convidar usuário',
        search: 'Pesquisar usuário...',
        filters: {
          all: 'Todos',
          active: 'Ativos',
          pending: 'Pendentes',
          inactive: 'Inativos',
        },
        roles: {
          superAdmin: 'Super Admin',
          admin: 'Admin',
          user: 'Usuário',
        },
        status: {
          active: 'Ativo',
          pending: 'Pendente',
          inactive: 'Inativo',
        },
        table: {
          name: 'Nome',
          email: 'E-mail',
          role: 'Função',
          status: 'Status',
          modules: 'Módulos',
          actions: 'Ações',
        },
        actions: {
          edit: 'Editar',
          resend: 'Reenviar convite',
          delete: 'Excluir',
        },
        modal: {
          newUser: 'Novo usuário',
          editUser: 'Editar usuário',
          name: 'Nome',
          email: 'E-mail',
          role: 'Função',
          selectRole: 'Selecione uma função',
          modules: 'Módulos',
          selectModules: 'Selecione módulos...',
          inviteLink: 'Link de convite',
          copyLink: 'Copiar link',
          copied: '✓ Copiado',
          save: 'Salvar',
          cancel: 'Cancelar',
          send: 'Enviar convite',
        },
      },
      plan: {
        title: 'Escolha o plano que melhor se adapta à sua empresa',
        subtitle: 'Todos os planos incluem Modo Aprendiz e atualizações contínuas',
        mostPopular: 'Mais popular',
        plans: {
          inicio: {
            name: 'Início',
            description: 'Comece a organizar seu negócio',
            button: 'Escolher Início',
          },
          controla: {
            name: 'Controla',
            description: 'Bases sólidas para organizar e controlar',
            button: 'Escolher Controla',
          },
          escala: {
            name: 'Escala',
            description: 'Otimize áreas, padronize processos',
            button: 'Escolher Escala',
          },
          corporativiza: {
            name: 'Corporativiza',
            description: 'Automatize com IA corporativa e visão integral',
            button: 'Escolher Corporativiza',
          },
        },
        features: {
          humanResources: 'Recursos Humanos',
          processes: 'Processos e Tarefas',
          products: 'Produtos (POS / CRM)',
          finance: 'Finanças (Despesas / Caixa)',
          kpisBasic: 'KPIs Básicos',
          kpisComplete: 'KPIs Completos',
          kpisAdvanced: 'KPIs Avançados',
          kpisCorporate: 'KPIs Corporativos',
          users5: 'Até 5 usuários',
          users10: 'Até 10 usuários',
          users20: 'Até 20 usuários',
          users25: 'Até 25 usuários',
          complementaryModules: 'Módulos complementares',
          modules2: '2 módulos complementares',
          modules4: '4 módulos complementares',
          allModules: 'Todos os módulos',
          aiAnalytics: 'IA Analítica e Vendas',
          integrations: 'Integrações',
          sessions1: '1 sessão/mês',
          sessions2: '2 sessões/mês',
          sessions4: '4 sessões/mês',
        },
        additionalInfo: {
          title: 'Informações adicionais',
          extraUser: 'Usuário adicional',
          extraUserPrice: '+$10 USD por usuário extra em qualquer plano',
          learningMode: 'Modo Aprendiz',
          learningModeDesc: 'Incluído em todos os planos sem custo adicional',
          updates: 'Atualizações',
          updatesDesc: 'Todas as melhorias incluídas automaticamente',
        },
      },
    },
  },
  'ko-CA': {
    header: {
      notifications: '알림',
      profile: '내 프로필',
      settings: '설정',
      logout: '로그아웃',
      learningMode: '학습 모드',
    },
    sections: {
      kpis: '귀하의 KPI',
      favorites: '즐겨찾기',
      quickAccess: '빠른 액세스',
      basicModules: '기본 모듈',
      main: '주요',
      complementaryModules: '보완 모듈',
      additional: '추가',
      aiModules: '인공지능',
      aiLabel: 'AI 모듈',
      configureKpis: 'KPI 구성',
    },
    kpis: {
      weeklyRevenue: '주간 매출',
      netProfit: '순이익',
      activeClients: '활성 고객',
      activeEmployees: '활성 직원',
      pendingTasks: '대기 중인 작업',
      monthlyExpenses: '월간 비용',
      vsWeekBefore: '지난 주 대비',
      thisMonth: '이번 달',
      newOnes: '신규',
      dueToday: '오늘 마감',
      vsMonthBefore: '지난 달 대비',
    },
    modules: {
      panelInicial: '초기 패널',
      recursosHumanos: '인적 자원',
      procesosTareas: '프로세스 및 작업',
      gastos: '비용',
      cajaChica: '소액 현금',
      puntoVenta: '판매 지점',
      ventas: '판매',
      kpis: 'KPI',
      mantenimiento: '유지 보수',
      inventarios: '재고',
      controlMinutas: '회의록 관리',
      limpieza: '청소',
      lavanderia: '세탁',
      transportacion: '운송',
      vehiculosMaquinaria: '차량 및 기계',
      inmuebles: '부동산',
      formularios: '양식',
      facturacion: '청구',
      correoElectronico: '이메일',
      climaLaboral: '근무 환경',
      indiceAgenteVentas: '판매 에이전트 지수',
      indiceAnalitica: '분석 지수',
      capacitacion: '교육',
      indiceCoach: '코치 지수',
    },
    notifications: {
      newTask: '새 작업 할당됨',
      expensePending: '승인 대기 중인 비용',
      newClient: '새 고객 등록됨',
      timeAgo: {
        minutes: '5분 전',
        hour: '1시간 전',
        hours: '2시간 전',
      },
    },
    loginPage: {
      workspaceBadge: 'Indice 워크스페이스',
      accessBadge: 'Indice 접속',
      title: 'Indice 워크스페이스에 로그인하세요',
      subtitle:
        'Indice는 비즈니스 구조, 인력, 지출, 통제, 일상 실행을 하나의 연결된 플랫폼으로 모아 운영 팀이 더 잘 움직일 수 있도록 돕습니다.',
      modulePills: ['대시보드', '인사', '지출', '분석'],
      featureCards: [
        {
          title: '모든 팀을 위한 하나의 공간',
          description: '재무, 운영, 인력, 영업, 분석 사이를 맥락 손실 없이 이동할 수 있습니다.',
        },
        {
          title: '첫 화면부터 명확하게',
          description: 'Indice를 열면 비즈니스에 중요한 모듈, 지표, 워크플로를 바로 확인할 수 있습니다.',
        },
      ],
      welcomeTitle: '다시 오신 것을 환영합니다',
      welcomeText:
        '로그인하면 모듈, 팀 워크플로, 운영 가시성을 한곳에서 볼 수 있는 Indice 대시보드로 이동합니다.',
      emailLabel: '이메일',
      emailPlaceholder: 'you@company.com',
      emailError: '올바른 이메일 주소를 입력하세요.',
      passwordLabel: '비밀번호',
      passwordPlaceholder: '비밀번호를 입력하세요',
      hidePassword: '비밀번호 숨기기',
      showPassword: '비밀번호 보기',
      signIn: '로그인',
      signingIn: '로그인 중...',
      errorFallback: '로그인할 수 없습니다.',
      insideTitle: '로그인 후 할 수 있는 일',
      insideText:
        '로그인 후 Indice는 메인 대시보드로 바로 이동하여 모듈을 오가고 활동을 모니터링하며 비즈니스 전반을 정렬할 수 있게 합니다.',
    },
    learningMode: {
      welcome: '학습 모드에 오신 것을 환영합니다!',
      hide: '숨기기',
      show: '보이기',
      businessBase: '비즈니스 기반',
      clearBusinessStable: '안정적인 비즈니스 기반 지우기',
      functions: '기능',
      businessContext: '비즈니스 컨텍스트',
      indiceMethodology: '인덱스 방법론',
      addModule: '열기',
      viewBasicModules: '기본 모듈 보기',
      previous: '이전',
      next: '다음',
      stepOf: '단계',
      modules: {
        panelInicial: {
          title: '초기 패널',
          subtitle: '🎯 시작점',
          description: '초기 패널은 인덱스 시스템 내에서 회사를 조직하기 위한 시작점입니다. 🏢 여��에서 비즈니스의 기본 정보를 정의하고 다른 모든 모듈이 올바르게 작동할 수 있도록 하는 구조를 구성합니다. ✨ 이 기반이 잘 구성되면 시스템이 사람, 프로세스, 제품 및 재무를 더 명확하게 관리하는 데 도움이 될 수 있습니다.',
          functions: [
            '📊 회사 데이터를 업데이트하고 정보를 항상 최신 상태로 유지합니다.',
            '⚙️ 언어, 통화 및 운영 설정과 같은 시스템 기본 설정을 구성합니다.',
            '📋 다른 모듈이 사용할 기본 비즈니스 정보를 정의합니다.',
            '🏗️ 회사 구조와 운영 방식을 설정합니다.',
            '👥 사용자를 초대하고 각 협력자에게 역할과 권한을 할당하여 액세스를 관리합니다.',
            '🎓 회사가 어떤 단계에 있는지 이해하는 데 도움이 되는 초기 비즈니스 평가를 수행합니다.',
            '📈 BMI(비즈니스 성숙도 지수)를 계산합니다. 이는 비즈니스의 현��� 상태를 분석하고 관리를 개선하는 방법을 안내하는 도구입니다.',
          ],
          context: '💡 이 모듈을 사용하면 회사의 개요를 파악하고 비즈니스 운영 방식을 구조화하기 시작할 수 있습니다. 이 기반이 잘 정의되면 시스템의 다른 모든 프로세스가 더 명확하고 관리하기 쉬워집니다.',
          quote: '🏆 조직은 견고한 비즈니스를 구축하는 첫 번째 단계입니다.',
        },
        recursosHumanos: {
          title: '인적 자원',
          subtitle: '팀 관리',
          description: '직원 및 인적 자원 정보를 관리합니다.',
          functions: ['직원 보기', '계약 관리'],
          context: '이 모듈을 사용하면 팀을 효과적으로 관리할 수 있습니다.',
          quote: '인재는 성공의 열쇠입니다.',
        },
        procesosTareas: {
          title: '프로세스 및 작업',
          subtitle: '작업 정리',
          description: '비즈니스에 중요한 작업 및 프로세스를 관리하고 수행합니다.',
          functions: ['작업 생성', '프로세스 보기'],
          context: '이 모듈은 비즈니스를 체계적으로 유지하는 데 도움이 됩니다.',
          quote: '조직은 효율성의 열쇠입니다.',
        },
        gastos: {
          title: '비용',
          subtitle: '비용 관리',
          description: '비즈니스를 양호한 상태로 유지하기 위해 비용을 관리하고 통제합니다.',
          functions: ['비용 보기', '비용 승인'],
          context: '이 모듈을 사용하면 비용을 효과적으로 관리할 수 있습니다.',
          quote: '비용 관리는 성공의 기본입니다.',
        },
        cajaChica: {
          title: '소액 현금',
          subtitle: '소액 비용',
          description: '비즈니스의 소액 비용을 관리합니다.',
          functions: ['소액 현금 보기', '비용 승인'],
          context: '이 모듈을 사용하면 소액 비용을 효율적으로 관리할 수 있습니다.',
          quote: '소액 현금은 소액 비용에 필수적입니다.',
        },
        puntoVenta: {
          title: '판매 지점',
          subtitle: '제품 판매',
          description: '비즈니스를 위한 판매를 관리하고 수행합니다.',
          functions: ['판매하기', '판매 보기'],
          context: '이 모듈을 사용하면 제품을 효율적으로 판매할 수 있습니다.',
          quote: '판매는 성공의 열쇠입니다.',
        },
        ventas: {
          title: '판매',
          subtitle: '판매 관리',
          description: '비즈니스를 개선하기 위해 판매를 관리하고 분석합니다.',
          functions: ['판매 보기', '판매 분석'],
          context: '이 모듈을 사용하면 판매를 관리하고 분석할 수 있습니다.',
          quote: '판매는 비즈니스의 기반입니다.',
        },
        kpis: {
          title: 'KPI',
          subtitle: '주요 지표',
          description: '비즈니스를 개선하기 위해 KPI를 관리하고 분석합니다.',
          functions: ['KPI 보기', 'KPI 구성'],
          context: '이 모듈을 사용하면 KPI를 관리하고 분석할 수 있습니다.',
          quote: 'KPI는 성과 추적에 필수적입니다.',
        },
      },
    },
    panelInicial: {
      title: '초기 패널',
      back: '뒤로',
      tabs: {
        profile: '프로필',
        businessStructure: '기업 구조',
        businessProfile: '기업 프로필',
        billing: '청구',
        plan: '계획',
        users: '사용자',
      },
      diagnosis: {
        title: '비즈니스 진단',
        description: '귀사와 관리 단계를 더 잘 이해하여 Indice를 개인화할 수 있도록 도와주세요.',
        centerTitle: '비즈니스 진단 센터',
        centerDescription: '사람, 프로세스, 제품 및 재무의 4가지 기둥을 통해 귀사의 관리 상태를 발견하십시오. 귀하의 답변을 통해 비즈니스 성숙도 지수(BMI)를 사용하여 Indice 뒤에 있는 권장 사항, 모듈 및 최고의 파트너를 개인화하는 데 도움이 됩니다.',
        questionCount: '각 10개 질문',
        progress: '비즈니스 진단 진행',
        progressOf: '완료',
        printDiagnosis: '진단 인쇄',
        start: '시작',
        continue: '계속',
        doAgain: '다시 하기',
        close: '닫기',
        question: '질문',
        of: '의',
        completed: '완료됨',
        previous: '이전',
        next: '다음',
        finish: '완료',
        restart: '진단 재시작',
        pillars: {
          people: {
            title: '사람',
            description: '인재, 팀 구조 및 커뮤니케이션을 분석합니다.',
          },
          processes: {
            title: '프로세스',
            description: '흐름, 작업, 확장성 및 효율성을 평가합니다.',
          },
          products: {
            title: '제품',
            description: '제공, 시장, 판매 및 가치 제안을 분석합니다.',
          },
          finance: {
            title: '재무',
            description: '재무 통제, 관리 및 의사 결정을 평가합니다.',
          },
        },
        questions: {
          people: [
            { question: '주요 역할은 무엇입니까?', options: ['창립자/CEO', '운영', '재무', '영업/기타'] },
            { question: '몇 명이 일하나요?', options: ['나만', '2~5명', '6~20명', '21명 이상'] },
            { question: '팀은 어떻게 구성되어 있습니까?', options: ['구조 없음', '기본 역할', '정의된 영역', '공식 조직도'] },
            { question: '작업을 어떻게 할당합니까?', options: ['즉흥적', '목록', '구조화된 할당', '관리 시스템'] },
            { question: '성과 검토?', options: ['없음', '문제 발생 시', '주간', 'KPI 사용'] },
            { question: '위임?', options: ['모두 직접', '위임하고 감독', '통제하며 위임', '자율 팀'] },
            { question: '내부 커뮤니케이션?', options: ['비공식', '채팅', '회의', '공식 도구'] },
            { question: '회의 빈도?', options: ['없음', '산발적', '주간', '빈번'] },
            { question: '책임의 명확성?', options: ['불명확', '다소 명확', '상당히 명확', '완전히 명확'] },
            { question: '통합의 용이성?', options: ['매우 어려움', '어려움', '보통', '쉬움'] },
          ],
          processes: [
            { question: '문서화된 프로세스?', options: ['없음', '일부', '대부분', '완전히'] },
            { question: '작업 관리?', options: ['즉흥적', '목록', '도구', '공식 시스템'] },
            { question: '진행 모니터링?', options: ['모니터링 안 됨', '가끔', '보고서', 'KPI'] },
            { question: '자동화?', options: ['수동', '고립된 도구', '부분 자동화', '높은 자동화'] },
            { question: '복제 가능성?', options: ['매우 어려움', '노력 필요', '가능', '쉬움'] },
            { question: '시간이 낭비되는 곳?', options: ['수작업', '조정', '정보', '후속 조치'] },
            { question: '사람에 대한 의존도?', options: ['전적으로', '상당히', '다소', '적게'] },
            { question: '프로세스 명확성?', options: ['불명확', '다소 명확', '상당히 명확', '완전히 명확'] },
            { question: '오류 관리?', options: ['반응', '비공식', '검토', '지속적 개선'] },
            { question: '확장성?', options: ['없음', '낮음', '중간', '높음'] },
          ],
          products: [
            { question: '무엇을 판매합니까?', options: ['서비스', '제품', '디지털', '혼합'] },
            { question: '고객 유형?', options: ['B2C', 'B2B', '정부', '혼합'] },
            { question: '주요 수익?', options: ['직접 판매', '서비스', '구독', '계약'] },
            { question: '다각화?', options: ['하나', '일부', '여러 라인', '광범위'] },
            { question: '가격 정의?', options: ['직관', '경쟁', '비용', '전략'] },
            { question: '성과 추적?', options: ['측정 안 됨', '판매만', '판매+수익성', '지표'] },
            { question: '가치 제안?', options: ['불명확', '다소 명확', '상당히 명확', '매우 명확'] },
            { question: '고객 피드백?', options: ['없음', '비공식', '설문조사', '분석'] },
            { question: '제품 진화?', options: ['즉석', '가끔 변경', '계획', '로드맵'] },
            { question: '상업적 우선순위?', options: ['고객', '현재 판매', '수익성', '확장'] },
          ],
          finance: [
            { question: '재무 통제?', options: ['비구조화', 'Excel', '소프트웨어', '통합 시스템'] },
            { question: '숫자 검토?', options: ['없음', '월간', '주간', '매일'] },
            { question: '현금 흐름?', options: ['통제 안 됨', '반응', '검토', '예측'] },
            { question: '명확한 비용?', options: ['불명확', '대략', '상당히 명확', '완전한 통제'] },
            { question: '마진?', options: ['모름', '추정', '명확', '완전히 측정'] },
            { question: '재무 결정?', options: ['직관', '경험', '데이터', '모델'] },
            { question: '예측 가능한 수입?', options: ['매우 가변적', '가변적', '안정적', '매우 안정적'] },
            { question: '부채 관리?', options: ['통제 없음', '기본', '전략', '최적화'] },
            { question: '위기 대비?', options: ['없음', '낮음', '중간', '높음'] },
            { question: '세금 준수?', options: ['통제 없음', '지연', '최신', '세금 전략'] },
          ],
        },
      },
      billing: {
        title: '청구',
        subtitle: '세금 데이터, 결제 방법 및 서비스 송장',
        fiscalData: {
          title: '세금 데이터',
          subtitle: '국가에 따라 세금 데이터 구성',
          country: '국가',
          selectCountry: '국가 선택...',
          rfc: 'RFC',
          razonSocial: '법적 명칭',
          regimenFiscal: '세금 제도',
          usoCFDI: 'CFDI 사용 (기본)',
          codigoPostalFiscal: '우편번호 (세금)',
          nit: 'NIT',
          responsabilidadFiscal: '세금 책임',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: '법적 명칭',
          inscricaoEstadual: '주 등록',
          ein: 'EIN (세금 ID)',
          legalName: '법적 명칭',
          state: '주',
          businessNumber: '사업자 번호 (BN)',
          province: '지방',
          taxId: '세금 ID',
          companyName: '회사명',
          taxRegime: '세금 제도',
          postalCode: '우편번호',
        },
        paymentMethod: {
          title: '결제 방법',
          subtitle: '결제 방법 및 빈도 구성',
          type: '선호하는 결제 유형',
          selectMethod: '방법 선택...',
          cardNumber: '카드 번호',
          cvv: 'CVV',
          expirationDate: '만료일',
          cardholderName: '카드 소유자 이름',
          addCard: '카드 추가',
          cancel: '취소',
          savedCards: '저장된 카드',
          defaultCard: '기본 카드',
          saveCard: '카드 저장',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/YY',
            cardholderName: '카드에 표시된 대로',
          },
        },
        automaticBilling: {
          title: '자동 청구',
          subtitle: '갱신, 청구일 및 송장 이메일 구성',
          enable: '자동 갱신 활성화',
          description: '기간 종료 시 구독이 자동으로 갱신됩니다',
          billingDay: '청구일',
          selectDay: '매월 1일',
          emailForInvoices: '송장용 이메일',
          reminderNote: '이 이메일로 송장을 받습니다',
        },
        currentBilling: {
          title: '현재 청구 요약',
          plan: '계획:',
          notConfigured: '구성되지 않음',
          amount: '금액:',
          nextPayment: '다음 결제:',
        },
        invoices: {
          title: '서비스 송장',
          subtitle: '구독 송장 내역',
          month: '월',
          year: '금액',
          status: '상태',
          downloadPdf: 'PDF 다운로드',
          date: '날짜',
          concept: '항목',
          amount: '금액',
          paid: '결제됨',
          pending: '대기 중',
        },
        billingFrequency: {
          title: '청구 빈도',
          note: '결제에 100-30 할인이 있을 수 있습니다',
          monthly: '월간',
          quarterly: '분기별',
          semiannual: '반기별',
          annual: '연간',
        },
      },
      structure: {
        title: '비즈니스 구조',
        subtitle: '조직 및 사업 단위',
        mode: {
          simple: '단순',
          multi: '다중 단위',
          simpleTitle: '단일 비즈니스',
          simpleDescription: '하나의 지점 또는 회사',
          multiTitle: '여러 회사 또는 단위',
          multiDescription: '여러 지점, 자회사 또는 관련 회사',
          switchPrompt: '둘 이상의 비즈니스 또는 지점이 있습니까?',
          switchAction: '다중 단위로 전환',
          multiNote: '단일 관리에서 여러 단위를 관리합니다.',
        },
        identity: {
          simple: '비즈니스 정체성',
          holding: '지주회사 정체성',
          simpleDesc: '회사의 이름, 로고, 산업 및 기본 구성.',
          holdingDesc: '브랜드 및 일반 구성(지주회사 수준).',
        },
        fields: {
          companyName: '이름',
          holdingName: '이름',
          industry: '산업',
          selectIndustry: '산업 선택',
          country: '국가',
          selectCountry: '국가 선택',
          logo: '로고',
          logoHolding: '로고',
          uploadImage: '이미지 업로드',
          description: '설명',
          optional: '(선택사항)',
        },
        units: {
          title: '사업 단위',
          description: '지점, 자회사 또는 그룹 회사 관리',
          addUnit: '+ 새 단위',
          addBusiness: '+ 비즈니스 추가',
          unitName: '단위 이름',
          unitCountry: '운영 국가',
          businessName: '비즈니스 이름',
        },
        modal: {
          newUnit: '새로운 사업 단위',
          editUnit: '사업 단위 편집',
          newBusiness: '새 비즈니스',
          editBusiness: '비즈니스 편집',
          save: '변경 사항 저장',
          cancel: '취소',
          delete: '삭제',
        },
      },
      profile: {
        title: '내 프로필',
        subtitle: '개인 정보 및 계정 설정',
        fields: {
          fullName: '전체 이름',
          email: '이메일',
          phone: '전화',
          position: '직위',
          department: '부서',
          profilePhoto: '프로필 사진',
          uploadPhoto: '사진 업로드',
        },
        save: '변경 사항 저장',
      },
      users: {
        title: '사용자',
        subtitle: '시스템 사용자 및 권한 관리',
        invite: '사용자 초대',
        search: '사용자 검색...',
        filters: {
          all: '모두',
          active: '활성',
          pending: '대기 중',
          inactive: '비활성',
        },
        roles: {
          superAdmin: '슈퍼 관리자',
          admin: '관리자',
          user: '사용자',
        },
        status: {
          active: '활성',
          pending: '대기 중',
          inactive: '비활성',
        },
        table: {
          name: '이름',
          email: '이메일',
          role: '역할',
          status: '상태',
          modules: '모듈',
          actions: '작업',
        },
        actions: {
          edit: '편집',
          resend: '초대 재전송',
          delete: '삭제',
        },
        modal: {
          newUser: '새 사용자',
          editUser: '사용자 편집',
          name: '이름',
          email: '이메일',
          role: '역할',
          selectRole: '역할 선택',
          modules: '모듈',
          selectModules: '모듈 선택...',
          inviteLink: '초대 링크',
          copyLink: '링크 복사',
          copied: '✓ 복사됨',
          save: '저장',
          cancel: '취소',
          send: '초대 보내기',
        },
      },
      plan: {
        title: '귀하의 비즈니스에 가장 적합한 플랜을 선택하세요',
        subtitle: '모든 플랜에는 학습 모드 및 지속적인 업데이트가 포함됩니다',
        mostPopular: '가장 인기 있는',
        plans: {
          inicio: {
            name: '시작',
            description: '비즈니스 정리 시작하기',
            button: '시작 선택',
          },
          controla: {
            name: '통제',
            description: '정리하고 통제하기 위한 견고한 기반',
            button: '통제 선택',
          },
          escala: {
            name: '확장',
            description: '영역 최적화, 프로세스 표준화',
            button: '확장 선택',
          },
          corporativiza: {
            name: '기업화',
            description: '기업 AI 및 통합 비전으로 자동화',
            button: '기업화 선택',
          },
        },
        features: {
          humanResources: '인적 자원',
          processes: '프로세스 및 작업',
          products: '제품 (POS / CRM)',
          finance: '재무 (비용 / 현금)',
          kpisBasic: '기본 KPI',
          kpisComplete: '완전한 KPI',
          kpisAdvanced: '고급 KPI',
          kpisCorporate: '기업 KPI',
          users5: '최대 5명의 사용자',
          users10: '최대 10명의 사용자',
          users20: '최대 20명의 사용자',
          users25: '최대 25명의 사용자',
          complementaryModules: '보완 모듈',
          modules2: '2개의 보완 모듈',
          modules4: '4개의 보완 모듈',
          allModules: '모든 모듈',
          aiAnalytics: 'AI 분석 및 판매',
          integrations: '통합',
          sessions1: '월 1회 세션',
          sessions2: '월 2회 세션',
          sessions4: '월 4회 세션',
        },
        additionalInfo: {
          title: '추가 정보',
          extraUser: '추가 사용자',
          extraUserPrice: '모든 플랜에서 추가 사용자당 +$10 USD',
          learningMode: '학습 모드',
          learningModeDesc: '모든 플랜에 추가 비용 없이 포함',
          updates: '업데이트',
          updatesDesc: '모든 개선 사항이 자동으로 포함됩니다',
        },
      },
    },
  },
  'zh-CA': {
    header: {
      notifications: '通知',
      profile: '我的个人资料',
      settings: '设置',
      logout: '退出',
      learningMode: '学习模式',
    },
    sections: {
      kpis: '您的 KPI',
      favorites: '您的收藏',
      quickAccess: '快速访问',
      basicModules: '基本模块',
      main: '主要',
      complementaryModules: '补充模块',
      additional: '附加',
      aiModules: '人工智能',
      aiLabel: 'AI 模块',
      configureKpis: '配置 KPI',
    },
    kpis: {
      weeklyRevenue: '周收入',
      netProfit: '净利润',
      activeClients: '活跃客户',
      activeEmployees: '活跃员工',
      pendingTasks: '待处理任务',
      monthlyExpenses: '月度开支',
      vsWeekBefore: '与上周相比',
      thisMonth: '本月',
      newOnes: '新的',
      dueToday: '今天到期',
      vsMonthBefore: '与上月相比',
    },
    modules: {
      panelInicial: '初始面板',
      recursosHumanos: '人力资源',
      procesosTareas: '流程和任务',
      gastos: '开支',
      cajaChica: '零用现金',
      puntoVenta: '销售点',
      ventas: '销售',
      kpis: 'KPI',
      mantenimiento: '维护',
      inventarios: '库存',
      controlMinutas: '会议记录控制',
      limpieza: '清洁',
      lavanderia: '洗衣',
      transportacion: '运输',
      vehiculosMaquinaria: '车辆和机械',
      inmuebles: '房地产',
      formularios: '表格',
      facturacion: '计费',
      correoElectronico: '电子邮件',
      climaLaboral: '工作环境',
      indiceAgenteVentas: '销售代理指数',
      indiceAnalitica: '分析指数',
      capacitacion: '培训',
      indiceCoach: '教练指数',
    },
    notifications: {
      newTask: '分配新任务',
      expensePending: '待批准的费用',
      newClient: '新客户已注册',
      timeAgo: {
        minutes: '5分钟前',
        hour: '1小时前',
        hours: '2小时前',
      },
    },
    loginPage: {
      workspaceBadge: 'Indice 工作区',
      accessBadge: 'Indice 访问',
      title: '登录到你的 Indice 工作区',
      subtitle:
        'Indice 将企业结构、团队、费用、控制和日常执行整合到一个互联平台中，帮助运营团队更高效地工作。',
      modulePills: ['仪表板', '人力资源', '费用', '分析'],
      featureCards: [
        {
          title: '一个面向所有团队的工作区',
          description: '在财务、运营、人力、销售和分析之间切换时无需丢失上下文。',
        },
        {
          title: '从第一屏开始就更清晰',
          description: '打开 Indice，即可立即看到对业务最重要的模块、指标和工作流。',
        },
      ],
      welcomeTitle: '欢迎回来',
      welcomeText:
        '登录后即可进入 Indice 仪表板，在同一个地方查看模块、团队流程和运营可见性。',
      emailLabel: '邮箱',
      emailPlaceholder: 'you@company.com',
      emailError: '请输入有效的邮箱地址。',
      passwordLabel: '密码',
      passwordPlaceholder: '输入你的密码',
      hidePassword: '隐藏密码',
      showPassword: '显示密码',
      signIn: '登录',
      signingIn: '登录中...',
      errorFallback: '无法登录。',
      insideTitle: '登录后可查看',
      insideText:
        '登录后，Indice 会直接带你进入主仪表板，方便你在各模块之间切换、监控活动并保持业务各部分协同。',
    },
    learningMode: {
      welcome: '欢迎来到学习模式！',
      hide: '隐藏',
      show: '显示',
      businessBase: '业务基础',
      clearBusinessStable: '清除稳定的业务基础',
      functions: '功能',
      businessContext: '业务背景',
      indiceMethodology: '索引方法论',
      addModule: '打开',
      viewBasicModules: '查看基本模块',
      previous: '上一步',
      next: '下一步',
      stepOf: '步骤',
      modules: {
        panelInicial: {
          title: '初始面板',
          subtitle: '🎯 您的起点',
          description: '初始面板是在索引系统中组织您的公司的起点。 🏢 在这里，您定义业务的基本信息并配置允许所有其他模块正常运行的结构。 ✨ 当这个基础配置良好时，系统可以帮助您更清楚地管理人员、流程、产品和财务。',
          functions: [
            '📊 更新您的公司数据并保持您的信息始终最新。',
            '⚙️ 配置系统首选项，例如语言、货币和操作设置。',
            '📋 定义其他模块将使用的基本业务信息。',
            '🏗️ 建立您的公司结构及其运营方式。',
            '👥 邀请用户并管理他们的访问权限，为每个协作者分配角色和权限。',
            '🎓 进行初步业务评估，帮助您了解您的公司处于什么阶段。',
            '📈 计算 BMI（业务成熟度指数），这是一个分析您业务当前状态并指导您如何改进管理的工具。',
          ],
          context: '💡 此模块允许您概览您的公司并开始构建业务的运营方式。 当这个基础定义良好时，系统的所有其他流程都会变得更清晰和更易于管理。',
          quote: '🏆 组织是建立稳固业务的第一步。',
        },
        recursosHumanos: {
          title: '人力资源',
          subtitle: '管理您的团队',
          description: '管理员工和人力资源信息。',
          functions: ['查看员工', '管理合同'],
          context: '此模块允许您有效地管理您的团��。',
          quote: '人才是成功的关键。',
        },
        procesosTareas: {
          title: '流程和任务',
          subtitle: '组织您的工作',
          description: '管理和执行对您的业务重要的任务和流程。',
          functions: ['创建任务', '查看流程'],
          context: '此模块帮助您保持业务有序。',
          quote: '组织是效率的关键。',
        },
        gastos: {
          title: '开支',
          subtitle: '控制您的开支',
          description: '管理和控制您的开支以保持业务良好状态。',
          functions: ['查看开支', '批准开支'],
          context: '此模块允许您有效地控制您的开支。',
          quote: '开支控制是成功的基础。',
        },
        cajaChica: {
          title: '零用现金',
          subtitle: '小额开支',
          description: '管理您业务的小额开支。',
          functions: ['查看零用现金', '批准开支'],
          context: '此模块允许您有效地管理小额开支。',
          quote: '零用现金对于小额开支至关重要。',
        },
        puntoVenta: {
          title: '销售点',
          subtitle: '销售您的产品',
          description: '管理和执行您业务的销售。',
          functions: ['进行销售', '查看销售'],
          context: '此模块允许您有效地销售产品。',
          quote: '销售是成功的关键。',
        },
        ventas: {
          title: '销售',
          subtitle: '管理您的销售',
          description: '管理和分析您的销售以改善您的业务。',
          functions: ['查看销售', '分析销售'],
          context: '此模块允许您管理和分析您的销售。',
          quote: '销售是您业务的基础。',
        },
        kpis: {
          title: 'KPI',
          subtitle: '关键指标',
          description: '管理和分析您的 KPI 以改善您的业务。',
          functions: ['查看 KPI', '配置 KPI'],
          context: '此模块允许您管理和分析您的 KPI。',
          quote: 'KPI 对于性能跟踪至关重要。',
        },
      },
    },
    panelInicial: {
      title: '初始面板',
      back: '返回',
      tabs: {
        profile: '简介',
        businessStructure: '企业结构',
        businessProfile: '企业简介',
        billing: '计费',
        plan: '计划',
        users: '用户',
      },
      diagnosis: {
        title: '企业诊断',
        description: '帮助我们更好地了解您的公司和管理阶段以个性化 Indice。',
        centerTitle: '企业诊断中心',
        centerDescription: '通过 4 个支柱发现您公司的管理状况：人员、流程、产品和财务。通过您的回答，我们将使用企业成熟度指数（BMI），这将帮助我们个性化 Indice 背后的建议、模块和最佳合作伙伴。',
        questionCount: '每个 10 个问题',
        progress: '企业诊断进度',
        progressOf: '已完成',
        printDiagnosis: '打印诊断',
        start: '开始',
        continue: '继续',
        doAgain: '重新做',
        close: '关闭',
        question: '问题',
        of: '的',
        completed: '已完成',
        previous: '上一个',
        next: '下一个',
        finish: '完成',
        restart: '重新开始诊断',
        pillars: {
          people: {
            title: '人员',
            description: '分析人才、团队结构和沟通。',
          },
          processes: {
            title: '流程',
            description: '评估流程、任务、可扩展性和效率。',
          },
          products: {
            title: '产品',
            description: '分析产品、市场、销售和价值主张。',
          },
          finance: {
            title: '财务',
            description: '评估财务控制、管理和决策。',
          },
        },
        questions: {
          people: [
            { question: '您的主要角色是什么？', options: ['创始人/CEO', '运营', '财务', '销售/其他'] },
            { question: '有多少人工作？', options: ['只有我', '2 到 5', '6 到 20', '21 或更多'] },
            { question: '您的团队如何组织？', options: ['无结构', '基本角色', '定义区域', '正式组织图'] },
            { question: '如何分配任务？', options: ['即兴', '列表', '结构化分配', '管理系统'] },
            { question: '绩效评估？', options: ['从不', '出问题时', '每周', '使用 KPI'] },
            { question: '委派？', options: ['全部自己做', '委派并监督', '有控制地委派', '自主团队'] },
            { question: '内部沟通？', options: ['非正式', '聊天', '会议', '正式工具'] },
            { question: '会议频率？', options: ['从不', '零星', '每周', '频繁'] },
            { question: '职责明确���？', options: ['不清楚', '有点清楚', '相当清楚', '完全清楚'] },
            { question: '整合的容易程度？', options: ['非常困难', '困难', '中等', '容易'] },
          ],
          processes: [
            { question: '记录的流程？', options: ['无', '一些', '大多数', '完全'] },
            { question: '任务管理？', options: ['即兴', '列表', '工具', '正式系统'] },
            { question: '进度监控？', options: ['未监控', '偶尔', '报告', 'KPI'] },
            { question: '自动化？', options: ['手动', '孤立工具', '部分自动化', '高度自动化'] },
            { question: '可复制性？', options: ['非常困难', '需要努力', '可能', '容易'] },
            { question: '时间浪费在哪里？', options: ['手工', '协调', '信息', '跟进'] },
            { question: '对人的依赖？', options: ['完全', '相当多', '一些', '很少'] },
            { question: '流程清晰度？', options: ['不清楚', '有点清楚', '相当清楚', '完全清楚'] },
            { question: '错误管理？', options: ['反应', '非正式', '审查', '持续改进'] },
            { question: '可扩展性？', options: ['无', '低', '中', '高'] },
          ],
          products: [
            { question: '您卖什么？', options: ['服务', '产品', '数字', '混合'] },
            { question: '客户类型？', options: ['B2C', 'B2B', '政府', '混合'] },
            { question: '主要收入？', options: ['直接销售', '服务', '订阅', '合同'] },
            { question: '多样化？', options: ['一个', '一些', '多条线', '广泛'] },
            { question: '价格定义？', options: ['直觉', '竞争', '成本', '策略'] },
            { question: '绩效跟踪？', options: ['未测量', '仅销售', '销售+盈利', '指标'] },
            { question: '价值主张？', options: ['不清楚', '有点清楚', '相当清楚', '非常清楚'] },
            { question: '客户反馈？', options: ['无', '非正式', '调查', '分析'] },
            { question: '产品演变？', options: ['即兴', '偶尔变化', '计划', '路线图'] },
            { question: '商业优先级？', options: ['客户', '当前销售', '盈利能力', '扩展'] },
          ],
          finance: [
            { question: '财务控制？', options: ['无结构', 'Excel', '软件', '集成系统'] },
            { question: '数字审查？', options: ['从不', '每月', '每周', '每天'] },
            { question: '现金流？', options: ['未控制', '反应', '审查', '预测'] },
            { question: '明确的成本？', options: ['不清楚', '大约', '相当清楚', '完全控制'] },
            { question: '利润率？', options: ['不知道', '估计', '清楚', '完全测量'] },
            { question: '财务决策？', options: ['直觉', '经验', '数据', '模型'] },
            { question: '可预测的收入？', options: ['非常可变', '可变', '稳定', '非常稳定'] },
            { question: '债务管理？', options: ['无控制', '基本', '策略', '优化'] },
            { question: '危机准备？', options: ['无', '低', '中', '高'] },
            { question: '税务合规？', options: ['无控制', '延迟', '最新', '税务策略'] },
          ],
        },
      },
      billing: {
        title: '计费',
        subtitle: '税务数据、付款方式和服务发票',
        fiscalData: {
          title: '税务数据',
          subtitle: '根据国家配置税务数据',
          country: '国家',
          selectCountry: '选择国家...',
          rfc: 'RFC',
          razonSocial: '法定名称',
          regimenFiscal: '税收制度',
          usoCFDI: 'CFDI用途（默认）',
          codigoPostalFiscal: '邮政编码（税务）',
          nit: 'NIT',
          responsabilidadFiscal: '税务责任',
          cnpjCpf: 'CNPJ/CPF',
          razaoSocial: '法定名称',
          inscricaoEstadual: '州注册',
          ein: 'EIN（税务ID）',
          legalName: '法定名称',
          state: '州',
          businessNumber: '企业编号（BN）',
          province: '省',
          taxId: '税务ID',
          companyName: '公司名称',
          taxRegime: '税收制度',
          postalCode: '邮政编码',
        },
        paymentMethod: {
          title: '付款方式',
          subtitle: '配置您的付款方式和频率',
          type: '首选付款类型',
          selectMethod: '选择方法...',
          cardNumber: '卡号',
          cvv: 'CVV',
          expirationDate: '到期日期',
          cardholderName: '持卡人姓名',
          addCard: '添加卡片',
          cancel: '取消',
          savedCards: '已保存的卡片',
          defaultCard: '默认卡片',
          saveCard: '保存卡片',
          placeholder: {
            cardNumber: '1234 5678 9012 3456',
            cvv: '123',
            expirationDate: 'MM/YY',
            cardholderName: '如卡上所示',
          },
        },
        automaticBilling: {
          title: '自动计费',
          subtitle: '配置续订、计费日期和发票电子邮件',
          enable: '启用自动续订',
          description: '您的订阅将在期末自动续订',
          billingDay: '计费日',
          selectDay: '每月1日',
          emailForInvoices: '发票电子邮件',
          reminderNote: '您将在此电子邮件收到发票',
        },
        currentBilling: {
          title: '当前计费摘要',
          plan: '计划：',
          notConfigured: '未配置',
          amount: '金额：',
          nextPayment: '下次付款：',
        },
        invoices: {
          title: '服务发票',
          subtitle: '订阅发票历史记录',
          month: '月',
          year: '金额',
          status: '状态',
          downloadPdf: '下载PDF',
          date: '日期',
          concept: '项目',
          amount: '金额',
          paid: '已支付',
          pending: '待处理',
        },
        billingFrequency: {
          title: '计费频率',
          note: '付款可能有100-30折扣',
          monthly: '每月',
          quarterly: '每季度',
          semiannual: '每半年',
          annual: '每年',
        },
      },
      structure: {
        title: '企业结构',
        subtitle: '组织和业务单元',
        mode: {
          simple: '简单',
          multi: '多单元',
          simpleTitle: '单一业务',
          simpleDescription: '您有一个分支机构或公司',
          multiTitle: '多个公司或单元',
          multiDescription: '多个分支机构、子公司或关联公司',
          switchPrompt: '您有不止一个业务或分支机构吗？',
          switchAction: '切换到多单元',
          multiNote: '从单一管理中管理多个单元。',
        },
        identity: {
          simple: '企业身份',
          holding: '控股公司身份',
          simpleDesc: '您公司的名称、徽标、行业和基本配置。',
          holdingDesc: '品牌和一般配置（控股级别）。',
        },
        fields: {
          companyName: '名称',
          holdingName: '名称',
          industry: '行业',
          selectIndustry: '选择行业',
          country: '国家',
          selectCountry: '选择国家',
          logo: '徽标',
          logoHolding: '徽标',
          uploadImage: '上传图像',
          description: '描述',
          optional: '（可选）',
        },
        units: {
          title: '业务单元',
          description: '管理分支机构、子公司或集团公司',
          addUnit: '+ 新单元',
          addBusiness: '+ 添加业务',
          unitName: '单元名称',
          unitCountry: '运营国家',
          businessName: '业务名称',
        },
        modal: {
          newUnit: '新业务单元',
          editUnit: '编辑业务单元',
          newBusiness: '新业务',
          editBusiness: '编辑业务',
          save: '保存更改',
          cancel: '取消',
          delete: '删除',
        },
      },
      profile: {
        title: '我的个人资料',
        subtitle: '个人信息和帐户设置',
        fields: {
          fullName: '全名',
          email: '电子邮件',
          phone: '电话',
          position: '职位',
          department: '部门',
          profilePhoto: '个人资料照片',
          uploadPhoto: '上传照片',
        },
        save: '保存更改',
      },
      users: {
        title: '用户',
        subtitle: '管理系统用户和权限',
        invite: '邀请用户',
        search: '搜索用户...',
        filters: {
          all: '全部',
          active: '活跃',
          pending: '待处理',
          inactive: '非活跃',
        },
        roles: {
          superAdmin: '超级管理员',
          admin: '管理员',
          user: '用户',
        },
        status: {
          active: '活跃',
          pending: '待处理',
          inactive: '非活跃',
        },
        table: {
          name: '姓名',
          email: '电子邮件',
          role: '角色',
          status: '状态',
          modules: '模块',
          actions: '操作',
        },
        actions: {
          edit: '编辑',
          resend: '重新发送邀请',
          delete: '删除',
        },
        modal: {
          newUser: '新用户',
          editUser: '编辑用户',
          name: '姓名',
          email: '电子邮件',
          role: '角色',
          selectRole: '选择角色',
          modules: '模块',
          selectModules: '选择模块...',
          inviteLink: '邀请链接',
          copyLink: '复制链接',
          copied: '✓ 已复制',
          save: '保存',
          cancel: '取消',
          send: '发送邀请',
        },
      },
      plan: {
        title: '选择最适合您企业的计划',
        subtitle: '所有计划均包含学习模式和持续更新',
        mostPopular: '最受欢迎',
        plans: {
          inicio: {
            name: '起步',
            description: '开始组织您的业务',
            button: '选择起步',
          },
          controla: {
            name: '控制',
            description: '组织和控制的坚实基础',
            button: '选择控制',
          },
          escala: {
            name: '扩展',
            description: '优化领域，标准化流程',
            button: '选择扩展',
          },
          corporativiza: {
            name: '企业化',
            description: '通过企业 AI 和整体视野实现自动化',
            button: '选择企业化',
          },
        },
        features: {
          humanResources: '人力资源',
          processes: '流程和任务',
          products: '产品 (POS / CRM)',
          finance: '财务（费用/现金）',
          kpisBasic: '基本 KPI',
          kpisComplete: '完整 KPI',
          kpisAdvanced: '高级 KPI',
          kpisCorporate: '企业 KPI',
          users5: '最多 5 个用户',
          users10: '最多 10 个用户',
          users20: '最多 20 个用户',
          users25: '最多 25 个用户',
          complementaryModules: '补充模块',
          modules2: '2 个补充模块',
          modules4: '4 个补充模块',
          allModules: '所有模块',
          aiAnalytics: 'AI 分析和销售',
          integrations: '集成',
          sessions1: '每月 1 次会话',
          sessions2: '每月 2 次会话',
          sessions4: '每月 4 次会话',
        },
        additionalInfo: {
          title: '附加信息',
          extraUser: '额外用户',
          extraUserPrice: '任何计划中每个额外用户 +$10 USD',
          learningMode: '学习模式',
          learningModeDesc: '所有计划均包含，无额外费用',
          updates: '更新',
          updatesDesc: '所有改进自动包含',
        },
      },
    },
  },
};

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (language: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const defaultLanguageCode = 'en-US';
const languageStorageKey = 'frontend-indice-language';

const getLanguageByCode = (code?: string) =>
  languages.find((language) => language.code === code);

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const storedLanguageCode = window.localStorage.getItem(languageStorageKey);
    const storedLanguage = getLanguageByCode(storedLanguageCode ?? undefined);

    if (storedLanguage) {
      return storedLanguage;
    }
  }

  return getLanguageByCode(defaultLanguageCode) ?? languages[0];
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(getInitialLanguage);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(languageStorageKey, currentLanguage.code);
    }
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t: translations[currentLanguage.code],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
