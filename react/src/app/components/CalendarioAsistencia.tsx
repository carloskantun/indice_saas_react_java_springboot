import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Camera } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useHRLanguage } from '../BasicModules/HumanResources/HRLanguage';

interface DiaAsistencia {
  dia: number;
  entradaRegistrada: boolean;
  salidaRegistrada: boolean;
  estatus: 'asistencia' | 'falta' | 'retardo' | 'descanso' | null;
  estatusSistema?: 'asistencia' | 'falta' | 'retardo' | 'descanso' | null; // Registro original del sistema
  horaEntrada?: string;
  horaSalida?: string;
  fotoEntrada?: string; // URL de la foto de entrada
  fotoSalida?: string; // URL de la foto de salida
  ubicacionEntrada?: { lat: number; lng: number; nombre: string }; // Ubicación de entrada
  ubicacionSalida?: { lat: number; lng: number; nombre: string }; // Ubicación de salida
}

interface CalendarioAsistenciaProps {
  colaboradorNombre: string;
}

export function CalendarioAsistencia({ colaboradorNombre }: CalendarioAsistenciaProps) {
  const t = useHRLanguage().attendanceCalendar;
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 16)); // Marzo 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [diasAsistencia, setDiasAsistencia] = useState<DiaAsistencia[]>([
    { dia: 1, entradaRegistrada: true, salidaRegistrada: false, estatus: null, estatusSistema: null, horaEntrada: '08:45 AM' },
    { 
      dia: 2, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:30 AM', 
      horaSalida: '05:15 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { dia: 3, entradaRegistrada: true, salidaRegistrada: false, estatus: null, estatusSistema: null, horaEntrada: '09:00 AM' },
    { dia: 7, entradaRegistrada: true, salidaRegistrada: false, estatus: 'descanso', estatusSistema: 'descanso', horaEntrada: '08:00 AM' },
    { 
      dia: 8, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:20 AM', 
      horaSalida: '05:30 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { 
      dia: 9, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:15 AM', 
      horaSalida: '05:00 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { 
      dia: 12, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:25 AM', 
      horaSalida: '05:20 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { 
      dia: 13, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'retardo', 
      horaEntrada: '09:15 AM', 
      horaSalida: '05:10 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { dia: 14, entradaRegistrada: true, salidaRegistrada: false, estatus: 'descanso', estatusSistema: 'descanso', horaEntrada: '08:00 AM' },
    { 
      dia: 15, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:10 AM', 
      horaSalida: '05:05 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { 
      dia: 16, 
      entradaRegistrada: true, 
      salidaRegistrada: true, 
      estatus: 'asistencia', 
      estatusSistema: 'asistencia', 
      horaEntrada: '08:30 AM', 
      horaSalida: '05:15 PM',
      fotoEntrada: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      fotoSalida: 'https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MzYwNjQ3MXww&ixlib=rb-4.1.0&q=80&w=400',
      ubicacionEntrada: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' },
      ubicacionSalida: { lat: 25.6866, lng: -100.3161, nombre: 'Oficina Central - Monterrey' }
    },
    { dia: 17, entradaRegistrada: true, salidaRegistrada: true, estatus: 'retardo', estatusSistema: 'retardo', horaEntrada: '09:25 AM', horaSalida: '05:00 PM' },
    { dia: 18, entradaRegistrada: true, salidaRegistrada: true, estatus: 'asistencia', estatusSistema: 'asistencia', horaEntrada: '08:05 AM', horaSalida: '05:10 PM' },
    { dia: 20, entradaRegistrada: true, salidaRegistrada: false, estatus: null, estatusSistema: 'falta', horaEntrada: '08:50 AM' },
    { dia: 21, entradaRegistrada: true, salidaRegistrada: true, estatus: 'asistencia', estatusSistema: 'asistencia', horaEntrada: '08:20 AM', horaSalida: '05:25 PM' },
    { dia: 22, entradaRegistrada: true, salidaRegistrada: true, estatus: 'asistencia', estatusSistema: 'asistencia', horaEntrada: '08:15 AM', horaSalida: '05:00 PM' },
    { dia: 26, entradaRegistrada: true, salidaRegistrada: true, estatus: 'asistencia', estatusSistema: 'asistencia', horaEntrada: '08:35 AM', horaSalida: '05:30 PM' },
    { dia: 27, entradaRegistrada: true, salidaRegistrada: true, estatus: 'asistencia', estatusSistema: 'asistencia', horaEntrada: '08:10 AM', horaSalida: '05:05 PM' },
    { dia: 28, entradaRegistrada: true, salidaRegistrada: false, estatus: 'descanso', estatusSistema: 'descanso', horaEntrada: '08:00 AM' },
    { dia: 29, entradaRegistrada: true, salidaRegistrada: false, estatus: null, estatusSistema: null, horaEntrada: '08:40 AM' },
    { dia: 31, entradaRegistrada: true, salidaRegistrada: true, estatus: 'retardo', estatusSistema: 'retardo', horaEntrada: '09:30 AM', horaSalida: '05:15 PM' },
  ]);

  const meses = t.months;

  const diasSemana = t.weekdays;

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getDiaAsistenciaData = (dia: number): DiaAsistencia | undefined => {
    return diasAsistencia.find(d => d.dia === dia);
  };

  const isToday = (dia: number) => {
    const today = new Date();
    return dia === 16 && 
           currentDate.getMonth() === 2 && 
           currentDate.getFullYear() === 2026;
  };

  const handleDayClick = (dia: number | null) => {
    if (dia) {
      setSelectedDay(dia);
    }
  };

  const updateEstatus = (dia: number, estatus: 'asistencia' | 'falta' | 'retardo' | 'descanso') => {
    setDiasAsistencia(prev => {
      const exists = prev.find(d => d.dia === dia);
      if (exists) {
        return prev.map(d => d.dia === dia ? { ...d, estatus } : d);
      } else {
        return [...prev, { dia, entradaRegistrada: false, salidaRegistrada: false, estatus }];
      }
    });
    setSelectedDay(null);
  };

  const getEstatusColor = (estatus: string | null) => {
    switch (estatus) {
      case 'asistencia': return 'bg-green-500';
      case 'falta': return 'bg-red-500';
      case 'retardo': return 'bg-yellow-500';
      case 'descanso': return 'bg-gray-400';
      default: return '';
    }
  };

  const getEstatusLabel = (estatus: string | null) => {
    switch (estatus) {
      case 'asistencia': return `✓ ${t.statuses.attendance}`;
      case 'falta': return `✕ ${t.statuses.absence}`;
      case 'retardo': return `⚠ ${t.statuses.tardy}`;
      case 'descanso': return `☾ ${t.statuses.rest}`;
      default: return t.statuses.none;
    }
  };

  const calcularTiempoTotal = (horaEntrada: string, horaSalida: string): string => {
    // Convertir formato "08:30 AM" a minutos desde medianoche
    const parseHora = (hora: string): number => {
      const [time, periodo] = hora.split(' ');
      const [horas, minutos] = time.split(':').map(Number);
      let horaEn24 = horas;
      
      if (periodo === 'PM' && horas !== 12) {
        horaEn24 += 12;
      } else if (periodo === 'AM' && horas === 12) {
        horaEn24 = 0;
      }
      
      return horaEn24 * 60 + minutos;
    };

    const minutosEntrada = parseHora(horaEntrada);
    const minutosSalida = parseHora(horaSalida);
    const totalMinutos = minutosSalida - minutosEntrada;

    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    return `${horas}h ${minutos}m`;
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {t.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {colaboradorNombre}
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevMonth}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h4 className="font-medium text-gray-900 dark:text-white">
          {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {diasSemana.map(dia => (
            <div key={dia} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dia, index) => {
            const diaData = dia ? getDiaAsistenciaData(dia) : null;
            const isTodayDay = dia ? isToday(dia) : false;

            return (
              <div
                key={index}
                onClick={() => handleDayClick(dia)}
                className={`
                  min-h-[80px] border rounded-lg p-2 transition-all
                  ${dia ? 'cursor-pointer hover:border-blue-300 hover:shadow-sm' : 'bg-gray-50 dark:bg-gray-700/30'}
                  ${isTodayDay ? 'border-2 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
                  ${selectedDay === dia ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {dia && (
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {dia}
                    </div>
                    
                    {/* Indicadores de entrada/salida */}
                    {diaData && (
                      <div className="flex gap-1 mb-2">
                        {diaData.entradaRegistrada && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" title={t.legend.entryRegistered} />
                        )}
                        {diaData.salidaRegistrada && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" title={t.legend.exitRegistered} />
                        )}
                      </div>
                    )}

                    {/* Badge de estatus */}
                    {diaData?.estatus && (
                      <div className={`text-[10px] px-1.5 py-0.5 rounded text-white font-medium ${getEstatusColor(diaData.estatus)} w-fit`}>
                        {diaData.estatus === 'asistencia' ? '✓' : 
                         diaData.estatus === 'falta' ? '✕' : 
                         diaData.estatus === 'retardo' ? '⚠' : '☾'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>{t.legend.entryRegistered}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>{t.legend.exitRegistered}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-4 border-2 border-blue-500 rounded" />
          <span>{t.legend.currentDay}</span>
        </div>
      </div>

      {/* Modal de cambio de estatus */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDay(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.statusModalTitle(selectedDay)}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {colaboradorNombre} - {meses[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()}
            </p>

            {/* Registro del Sistema - Inmutable */}
            {(() => {
              const diaData = getDiaAsistenciaData(selectedDay);
              if (diaData?.estatusSistema) {
                return (
                  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        🤖 {t.systemRecord}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {t.notEditable}
                      </span>
                    </div>
                    
                    {/* Estatus y horarios */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${getEstatusColor(diaData.estatusSistema)}`}>
                          {getEstatusLabel(diaData.estatusSistema)}
                        </span>
                      </div>
                      {diaData.horaEntrada && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t.entry}: <span className="font-medium">{diaData.horaEntrada}</span>
                        </p>
                      )}
                      {diaData.horaSalida && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {t.exit}: <span className="font-medium">{diaData.horaSalida}</span>
                        </p>
                      )}
                      {diaData.horaEntrada && diaData.horaSalida && (
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            ⏱ {t.totalTime}: {calcularTiempoTotal(diaData.horaEntrada, diaData.horaSalida)}
                          </p>
                          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                      )}
                    </div>

                    {/* Fotos de entrada y salida */}
                    {(diaData.fotoEntrada || diaData.fotoSalida) && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {diaData.fotoEntrada && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Camera className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.entry}</span>
                            </div>
                            <img 
                              src={diaData.fotoEntrada} 
                              alt="Foto de entrada"
                              className="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        )}
                        {diaData.fotoSalida && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Camera className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{t.exit}</span>
                            </div>
                            <img 
                              src={diaData.fotoSalida} 
                              alt="Foto de salida"
                              className="w-full h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Ubicaciones */}
                    {(diaData.ubicacionEntrada || diaData.ubicacionSalida) && (
                      <div className="space-y-2">
                        {diaData.ubicacionEntrada && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                {diaData.ubicacionEntrada.nombre}
                              </p>
                              <a
                                href={`https://www.google.com/maps?q=${diaData.ubicacionEntrada.lat},${diaData.ubicacionEntrada.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {t.viewGoogleMaps}
                              </a>
                            </div>
                          </div>
                        )}
                        {diaData.ubicacionSalida && (
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                {diaData.ubicacionSalida.nombre}
                              </p>
                              <a
                                href={`https://www.google.com/maps?q=${diaData.ubicacionSalida.lat},${diaData.ubicacionSalida.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {t.viewGoogleMaps}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t.manualUpdate}
            </h4>

            <div className="space-y-2">
              <Button
                onClick={() => updateEstatus(selectedDay, 'asistencia')}
                className="w-full bg-green-600 hover:bg-green-700 text-white justify-start gap-3"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
                ✓ {t.buttons.attendance}
              </Button>
              
              <Button
                onClick={() => updateEstatus(selectedDay, 'falta')}
                className="w-full bg-red-600 hover:bg-red-700 text-white justify-start gap-3"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
                ✕ {t.buttons.absence}
              </Button>
              
              <Button
                onClick={() => updateEstatus(selectedDay, 'retardo')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white justify-start gap-3"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
                ⚠ {t.buttons.tardy}
              </Button>
              
              <Button
                onClick={() => updateEstatus(selectedDay, 'descanso')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white justify-start gap-3"
              >
                <div className="w-4 h-4 bg-white rounded-full" />
                ☾ {t.buttons.rest}
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(() => {
                  const diaData = getDiaAsistenciaData(selectedDay);
                  return diaData?.estatus 
                    ? t.currentStatus(getEstatusLabel(diaData.estatus))
                    : t.noStatusAssigned;
                })()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
